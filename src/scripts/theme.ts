/**
 * 主题系统运行时
 * - 圆形色板菜单：内置黑白 + 预设 + 自定义（新建 / 编辑 / 删除）
 * - 自定义编辑器：自绘取色器（不依赖浏览器原生弹层）、实时预览、取消自动还原
 * - 背景图片：拖放文件 / 点击选择（Base64 存储）或粘贴地址
 * - 导入 / 导出 JSON；自定义主题持久化在 localStorage
 */
import { presetThemes } from '../data/themes';
import {
  THEME_STORAGE_KEY,
  CUSTOM_THEMES_STORAGE_KEY,
  MIN_GRADIENT_STOPS,
  MAX_GRADIENT_STOPS,
  MAX_FONT_BYTES,
  FONT_PRESETS,
  type StoredTheme,
  type ThemeParams,
  type GradientConfig,
  type FontConfig,
  type FontPreset,
  type Rgb,
  resolveThemeVars,
  normalizeParams,
  draftParams,
  parseColor,
  toHex,
  toRgbString,
  mixColor,
  autoInk,
  autoMuted,
  autoCode,
  hexToHsv,
  hsvToHex,
  swatchBackground,
  sanitizeImageUrl,
  sanitizeFontName,
  sanitizeFontSrc,
} from '../lib/theme-core';

type GradientKind = keyof Pick<
  ThemeParams,
  'pageGradient' | 'headerGradient' | 'footerGradient'
>;

interface ThemeRef {
  id: string;
  params: ThemeParams;
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const root = document.documentElement;
/* 脚本于 body 末尾以模块方式加载，头部组件必已存在 */
const picker = document.querySelector<HTMLElement>('[data-theme-picker]')!;
const panel = document.querySelector<HTMLElement>('[data-theme-panel]')!;
const trigger = document.querySelector<HTMLButtonElement>('[data-theme-trigger]')!;
const editor = document.querySelector<HTMLDialogElement>('[data-theme-editor]')!;
const importDialog = document.querySelector<HTMLDialogElement>('[data-theme-import]')!;

function loadCustomThemes(): StoredTheme[] {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(list)) return [];
    return list
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => {
        const params = normalizeParams(item.params);
        return {
          id: typeof item.id === 'string' ? item.id : 'custom-unknown',
          createdAt: Number(item.createdAt) || Date.now(),
          params,
          vars: resolveThemeVars(params),
        };
      })
      .filter((theme, index, all) => all.findIndex((t) => t.id === theme.id) === index);
  } catch {
    return [];
  }
}

function savedThemeId(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

if (picker && panel && trigger && editor && importDialog) {
  const form = editor.querySelector<HTMLFormElement>('[data-theme-form]');

  let customThemes: StoredTheme[] = loadCustomThemes();
  let activeThemeId = savedThemeId();
  let editingId: string | null = null;
  let themeBeforePreview: string | null = activeThemeId;
  let draft: ThemeParams = normalizeParams(null);

  /* ---------------------------------------------------------
     存取
     --------------------------------------------------------- */

  /** 持久化自定义主题；失败（如图片超出配额）返回 false */
  function persistCustomThemes(nextThemes: StoredTheme[]): boolean {
    try {
      localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(nextThemes));
      customThemes = nextThemes;
      return true;
    } catch {
      return false;
    }
  }

  function persistActiveTheme(id: string | null): void {
    try {
      if (id === null) localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* 忽略 */
    }
  }

  /* ---------------------------------------------------------
     应用（预览做了 60ms 防抖，取色器拖动时不抖不闪）
     --------------------------------------------------------- */

  function systemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function findTheme(id: string): ThemeRef | null {
    const preset = presetThemes.find((item) => item.id === id);
    if (preset) return { id: preset.id, params: preset.params };
    const custom = customThemes.find((item) => item.id === id);
    if (custom) return { id: custom.id, params: custom.params };
    return null;
  }

  function clearInlineVars(): void {
    for (let i = root.style.length - 1; i >= 0; i -= 1) {
      const prop = root.style.item(i);
      if (prop.startsWith('--')) root.style.removeProperty(prop);
    }
  }

  function applyVars(params: ThemeParams): void {
    root.dataset.theme = params.base;
    const vars = resolveThemeVars(params);
    /* 沉浸背景（贴图 / 图片 / 场景）打标：image-mode.css 让整页结构为背景让位 */
    const scene = vars['--bg-scene'] ?? '';
    const imageActive = params.bgImage.enabled && params.bgImage.url;
    const hasImageLayer = (vars['--page-bg-image'] ?? '').includes('url(');
    root.dataset.imageBg = imageActive || hasImageLayer || scene ? 'true' : 'false';
    root.dataset.bgScene = scene;
    if (scene === 'techne') ensureTechneCast();
    ensureFontLoaded(params.font);
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }

  /* 用户导入的字体文件：以 FontFace 动态注册（family 名 = 参数里的字体名） */
  const loadedFontFaces = new Set<string>();

  function ensureFontLoaded(font: FontConfig | undefined): void {
    if (!font || font.preset !== 'custom' || !font.name || !font.src) return;
    const key = `${font.name}|${font.src.length}|${font.src.slice(-72)}`;
    if (loadedFontFaces.has(key)) return;
    loadedFontFaces.add(key);
    try {
      const face = new FontFace(font.name, `url("${font.src}")`);
      void face
        .load()
        .then((loaded) => document.fonts.add(loaded))
        .catch(() => loadedFontFaces.delete(key));
    } catch {
      loadedFontFaces.delete(key);
    }
  }

  /* 小计姬场景的角色阵容容器：注入一次常驻，显隐由 data-bg-scene 的 CSS 控制 */
  function ensureTechneCast(): void {
    if (document.querySelector('.techne-cast')) return;
    const cast = document.createElement('div');
    cast.className = 'techne-cast';
    cast.setAttribute('aria-hidden', 'true');
    for (const role of ['smile', 'bubble', 'fixed', 'badge', 'peace', 'cash', 'stand-b']) {
      const item = document.createElement('i');
      item.className = `techne-cast__item techne-cast__item--${role}`;
      cast.append(item);
    }
    document.body.append(cast);
  }

  function applyTheme(id: string | null, options: { persist?: boolean } = {}): void {
    activeThemeId = id;
    clearInlineVars();
    const theme = id && id !== 'light' && id !== 'dark' ? findTheme(id) : null;
    if (theme) {
      applyVars(theme.params);
    } else {
      root.dataset.theme = id === 'light' || id === 'dark' ? id : systemTheme();
      root.dataset.imageBg = 'false';
      root.dataset.bgScene = '';
    }
    if (options.persist !== false) persistActiveTheme(id);
    updateMetaColor();
    renderMenu();
  }

  let previewTimer = 0;
  let editorSession = 0;
  let fontReadRequest = 0;

  function cancelPreview(): void {
    window.clearTimeout(previewTimer);
    previewTimer = 0;
  }

  function preview(): void {
    if (!editor.open) return;
    clearInlineVars();
    applyVars(draft);
    updateMetaColor();
  }

  function schedulePreview(): void {
    cancelPreview();
    previewTimer = window.setTimeout(preview, 60);
  }

  function currentVar(name: string, fallback: string): string {
    const value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
  }

  function updateMetaColor(): void {
    const color = currentVar('--bg', '#ffffff');
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', color));
  }

  /* ---------------------------------------------------------
     色板菜单
     --------------------------------------------------------- */

  function iconClone(name: 'add' | 'edit' | 'del'): Node | null {
    const template = document.querySelector<HTMLTemplateElement>(`[data-theme-template-${name}]`);
    return template?.content.firstElementChild?.cloneNode(true) ?? null;
  }

  function createSwatch(ref: {
    id: string;
    name: string;
    background: string;
    accent: string | null;
    active: boolean;
    editable?: boolean;
  }): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'theme-swatch';

    const circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'theme-swatch__circle';
    if (ref.active) circle.classList.add('is-active');
    circle.style.background = ref.background;
    circle.dataset.themeSelect = ref.id;
    circle.setAttribute('aria-label', `应用主题：${ref.name}`);
    circle.setAttribute('aria-pressed', ref.active ? 'true' : 'false');
    circle.title = ref.name;

    if (ref.accent) {
      const dot = document.createElement('span');
      dot.className = 'theme-swatch__dot';
      dot.style.background = ref.accent;
      circle.append(dot);
    }
    wrap.append(circle);

    if (ref.editable) {
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'theme-swatch__badge theme-swatch__badge--edit';
      edit.dataset.themeEdit = ref.id;
      edit.title = `编辑「${ref.name}」`;
      edit.setAttribute('aria-label', `编辑主题 ${ref.name}`);
      const editIcon = iconClone('edit');
      if (editIcon) edit.append(editIcon);
      wrap.append(edit);

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'theme-swatch__badge theme-swatch__badge--del';
      del.dataset.themeDelete = ref.id;
      del.title = `删除「${ref.name}」（再点一次确认）`;
      del.setAttribute('aria-label', `删除主题 ${ref.name}`);
      const delIcon = iconClone('del');
      if (delIcon) del.append(delIcon);
      wrap.append(del);
    }

    const label = document.createElement('span');
    label.className = 'theme-swatch__name';
    label.textContent = ref.name;
    wrap.append(label);
    return wrap;
  }

  function createAddSwatch(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'theme-swatch';
    const circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'theme-swatch__circle theme-swatch__circle--add';
    circle.dataset.themeCreate = '';
    circle.setAttribute('aria-label', '新建自定义主题');
    circle.title = '新建自定义主题';
    const icon = iconClone('add');
    if (icon) circle.append(icon);
    const label = document.createElement('span');
    label.className = 'theme-swatch__name';
    label.textContent = '自定义';
    wrap.append(circle, label);
    return wrap;
  }

  function renderMenu(): void {
    const builtInHost = panel.querySelector<HTMLElement>('[data-theme-list-built-in]');
    const lightHost = panel.querySelector<HTMLElement>('[data-theme-list-preset-light]');
    const darkHost = panel.querySelector<HTMLElement>('[data-theme-list-preset-dark]');
    const featureHost = panel.querySelector<HTMLElement>('[data-theme-list-preset-feature]');
    const customHost = panel.querySelector<HTMLElement>('[data-theme-list-custom]');
    if (!builtInHost || !lightHost || !darkHost || !featureHost || !customHost) return;

    builtInHost.replaceChildren(
      createSwatch({
        id: 'light',
        name: '浅色',
        background: '#ffffff',
        accent: null,
        active: activeThemeId === 'light',
      }),
      createSwatch({
        id: 'dark',
        name: '深色',
        background: '#09090b',
        accent: null,
        active: activeThemeId === 'dark',
      }),
    );

    const presetSwatch = (preset: (typeof presetThemes)[number]) =>
      createSwatch({
        id: preset.id,
        name: preset.params.name,
        background: swatchBackground(preset.params),
        accent: preset.params.accent,
        active: activeThemeId === preset.id,
      });
    lightHost.replaceChildren(
      ...presetThemes.filter((item) => item.group === 'light').map(presetSwatch),
    );
    darkHost.replaceChildren(
      ...presetThemes.filter((item) => item.group === 'dark').map(presetSwatch),
    );
    featureHost.replaceChildren(
      ...presetThemes.filter((item) => item.group === 'feature').map(presetSwatch),
    );

    customHost.replaceChildren(
      ...customThemes.map((theme) =>
        createSwatch({
          id: theme.id,
          name: theme.params.name,
          background: swatchBackground(theme.params),
          accent: theme.params.accent,
          active: activeThemeId === theme.id,
          editable: true,
        }),
      ),
      createAddSwatch(),
    );
  }

  /* ---------------------------------------------------------
     菜单开关（悬停 + 点击，触屏走点击）
     --------------------------------------------------------- */

  let openTimer = 0;
  let closeTimer = 0;

  function openMenu(): void {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    const error = panel.querySelector<HTMLElement>('[data-theme-menu-error]');
    if (error) error.hidden = true;
  }

  function closeMenu(): void {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    picker.addEventListener('mouseenter', () => {
      window.clearTimeout(closeTimer);
      openTimer = window.setTimeout(openMenu, 130);
    });
    picker.addEventListener('mouseleave', () => {
      window.clearTimeout(openTimer);
      closeTimer = window.setTimeout(closeMenu, 260);
    });
  }

  trigger.addEventListener('click', () => {
    if (panel.hidden) openMenu();
    else closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (panel.hidden) return;
    if (!picker.contains(event.target as Node)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden && !editor.open && !importDialog.open) {
      closeMenu();
      trigger.focus();
    }
  });

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const selectButton = target.closest<HTMLElement>('[data-theme-select]');
    if (selectButton) {
      applyTheme(selectButton.dataset.themeSelect ?? null);
      return;
    }
    if (target.closest('[data-theme-create]')) {
      openEditor(null);
      return;
    }
    const editButton = target.closest<HTMLElement>('[data-theme-edit]');
    if (editButton) {
      openEditor(editButton.dataset.themeEdit ?? null);
      return;
    }
    const deleteButton = target.closest<HTMLButtonElement>('[data-theme-delete]');
    if (deleteButton) {
      handleDelete(deleteButton);
    }
  });

  function handleDelete(button: HTMLButtonElement): void {
    const id = button.dataset.themeDelete;
    if (!id) return;
    if (button.dataset.confirming !== 'true') {
      button.dataset.confirming = 'true';
      button.classList.add('is-confirming');
      button.title = '再点一次确认删除';
      window.setTimeout(() => {
        button.dataset.confirming = 'false';
        button.classList.remove('is-confirming');
        button.title = '删除（再点一次确认）';
      }, 2600);
      return;
    }
    const theme = customThemes.find((item) => item.id === id);
    if (!persistCustomThemes(customThemes.filter((item) => item.id !== id))) {
      const error = panel.querySelector<HTMLElement>('[data-theme-menu-error]');
      if (error) {
        error.textContent = '无法保存删除操作，请检查浏览器本地存储权限后重试。';
        error.hidden = false;
      }
      return;
    }
    if (activeThemeId === id) {
      applyTheme(theme ? theme.params.base : 'light');
    } else {
      renderMenu();
    }
  }

  /* ---------------------------------------------------------
     自绘取色器（替代浏览器原生弹层，可按住拖动、不会闪退）
     --------------------------------------------------------- */

  const colorPop = document.createElement('div');
  colorPop.className = 'theme-colorpop';
  colorPop.dataset.themeColorpop = '';
  colorPop.setAttribute('role', 'dialog');
  colorPop.setAttribute('aria-label', '选择颜色');
  colorPop.hidden = true;
  colorPop.innerHTML = `
    <div class="theme-colorpop__sv" data-cp-sv><span class="theme-colorpop__cursor" data-cp-cursor></span></div>
    <input class="theme-colorpop__hue" type="range" min="0" max="360" step="1" data-cp-hue aria-label="色相" />
    <div class="theme-colorpop__row">
      <span class="theme-colorpop__chip" data-cp-chip></span>
      <input class="theme-input theme-input--mono" type="text" spellcheck="false" data-cp-hex aria-label="十六进制颜色" />
    </div>
  `;
  editor.append(colorPop);

  const cpSv = colorPop.querySelector<HTMLElement>('[data-cp-sv]')!;
  const cpCursor = colorPop.querySelector<HTMLElement>('[data-cp-cursor]')!;
  const cpHue = colorPop.querySelector<HTMLInputElement>('[data-cp-hue]')!;
  const cpChip = colorPop.querySelector<HTMLElement>('[data-cp-chip]')!;
  const cpHex = colorPop.querySelector<HTMLInputElement>('[data-cp-hex]')!;

  let popState = { h: 210, s: 1, v: 1 };
  let popApply: ((hex: string) => void) | null = null;
  let popAnchor: HTMLElement | null = null;

  function popHex(): string {
    return hsvToHex(popState.h, popState.s, popState.v);
  }

  function renderColorPop(): void {
    const hex = popHex();
    cpSv.style.background = `linear-gradient(to top, #000, rgba(0, 0, 0, 0)), linear-gradient(to right, #fff, hsl(${popState.h}, 100%, 50%))`;
    cpCursor.style.left = `${popState.s * 100}%`;
    cpCursor.style.top = `${(1 - popState.v) * 100}%`;
    cpCursor.style.background = hex;
    cpHue.value = String(Math.round(popState.h));
    cpChip.style.background = hex;
    cpHex.value = hex;
  }

  function commitColorPop(): void {
    const hex = popHex();
    renderColorPop();
    popApply?.(hex);
  }

  function closeColorPop(): void {
    if (colorPop.hidden) return;
    colorPop.hidden = true;
    popAnchor = null;
    popApply = null;
  }

  function openColorPop(anchor: HTMLElement, current: string, apply: (hex: string) => void): void {
    popAnchor = anchor;
    popApply = apply;
    popState = hexToHsv(current);
    colorPop.hidden = false;
    renderColorPop();
    positionColorPop(anchor);
  }

  function positionColorPop(anchor: HTMLElement): void {
    const anchorRect = anchor.getBoundingClientRect();
    const dialogRect = editor.getBoundingClientRect();
    const popWidth = 248;
    const popHeight = colorPop.offsetHeight || 268;
    let left = anchorRect.left - dialogRect.left + editor.clientLeft;
    let top = anchorRect.bottom - dialogRect.top + editor.clientTop + 8;
    if (left + popWidth > editor.clientWidth - 8) {
      left = Math.max(8, editor.clientWidth - popWidth - 8);
    }
    if (top + popHeight > editor.clientHeight - 8) {
      const above = anchorRect.top - dialogRect.top + editor.clientTop - popHeight - 8;
      if (above >= 8) top = above;
    }
    colorPop.style.left = `${left}px`;
    colorPop.style.top = `${top}px`;
  }

  function svPointToHex(event: PointerEvent): string | null {
    const rect = cpSv.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const s = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const v = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    popState.s = s;
    popState.v = v;
    return popHex();
  }

  cpSv.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    try {
      cpSv.setPointerCapture(event.pointerId);
    } catch {
      /* 无法捕获（非真实指针）时仍按坐标更新 */
    }
    svPointToHex(event);
    commitColorPop();
    const move = (ev: PointerEvent) => {
      svPointToHex(ev);
      commitColorPop();
    };
    const end = () => {
      cpSv.removeEventListener('pointermove', move);
      cpSv.removeEventListener('pointerup', end);
      cpSv.removeEventListener('pointercancel', end);
    };
    cpSv.addEventListener('pointermove', move);
    cpSv.addEventListener('pointerup', end);
    cpSv.addEventListener('pointercancel', end);
  });

  cpHue.addEventListener('input', () => {
    popState.h = Number(cpHue.value) || 0;
    commitColorPop();
  });

  cpHex.addEventListener('input', () => {
    const parsed = parseColor(cpHex.value);
    if (parsed) {
      popState = hexToHsv(toHex(parsed));
      renderColorPop();
      popApply?.(toHex(parsed));
      schedulePreview();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (colorPop.hidden) return;
    const target = event.target as Node;
    if (colorPop.contains(target)) return;
    if (popAnchor && popAnchor.contains(target)) return;
    closeColorPop();
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !colorPop.hidden) {
      event.preventDefault();
      event.stopPropagation();
      const anchor = popAnchor;
      closeColorPop();
      anchor?.focus();
    }
  }, true);

  form?.addEventListener('scroll', () => closeColorPop(), { passive: true, capture: true });

  /* ---------------------------------------------------------
     编辑器：字段同步 / 事件
     --------------------------------------------------------- */

  function colorControls(key: string): {
    btn: HTMLButtonElement | null;
    hex: HTMLInputElement | null;
    rgb: HTMLInputElement | null;
  } {
    return {
      btn: form?.querySelector<HTMLButtonElement>(`[data-theme-color-btn="${key}"]`) ?? null,
      hex: form?.querySelector<HTMLInputElement>(`[data-theme-hex="${key}"]`) ?? null,
      rgb: form?.querySelector<HTMLInputElement>(`[data-theme-rgb="${key}"]`) ?? null,
    };
  }

  function setPath(path: string, value: unknown): void {
    const keys = path.split('.');
    let node = draft as unknown as Record<string, unknown>;
    keys.slice(0, -1).forEach((key) => {
      const next = node[key];
      if (!next || typeof next !== 'object') node[key] = {};
      node = node[key] as Record<string, unknown>;
    });
    node[keys[keys.length - 1]] = value;
  }

  function getValueByPath(path: string): unknown {
    return path
      .split('.')
      .reduce<unknown>(
        (acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
        draft,
      );
  }

  /** 同步一行颜色控件；skip 为正在输入的控件（避免打断输入 / 干扰取色） */
  function syncColorFields(key: string, value: string, skip?: HTMLElement | null): void {
    const { btn, hex, rgb } = colorControls(key);
    const parsed = parseColor(value) ?? ([0, 0, 0] as Rgb);
    const hexValue = toHex(parsed);
    if (btn && btn !== skip) btn.style.background = hexValue;
    if (hex && hex !== skip) hex.value = hexValue;
    if (rgb && rgb !== skip) rgb.value = toRgbString(parsed);
  }

  function radiusLabel(level: number): string {
    if (level <= 1) return '锐利';
    if (level <= 4) return '偏直角';
    if (level === 5) return '默认';
    if (level <= 7) return '圆润';
    return '非常圆润';
  }

  /** 停靠点行内原地更新（不重建 DOM，取色器不会被打断） */
  function syncStopRow(kind: GradientKind, index: number, value: string, skip?: HTMLElement | null): void {
    const host = form?.querySelector<HTMLElement>(`[data-theme-stops="${kind}"]`);
    if (!host) return;
    const btn = host.querySelector<HTMLButtonElement>(`[data-stop-btn="${index}"]`);
    const hexInput = host.querySelector<HTMLInputElement>(`[data-stop-hex="${index}"]`);
    if (btn && btn !== skip) btn.style.background = value;
    if (hexInput && hexInput !== skip) hexInput.value = value;
  }

  function renderStops(kind: GradientKind): void {
    const host = form?.querySelector<HTMLElement>(`[data-theme-stops="${kind}"]`);
    if (!host) return;
    const gradient = draft[kind] as GradientConfig;
    host.replaceChildren();
    gradient.stops.forEach((color, index) => {
      const row = document.createElement('div');
      row.className = 'theme-stop';

      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'theme-swatch-btn theme-swatch-btn--stop';
      swatch.style.background = color;
      swatch.dataset.stopBtn = String(index);
      swatch.setAttribute('aria-label', `渐变颜色 ${index + 1} 取色器`);

      const hex = document.createElement('input');
      hex.type = 'text';
      hex.className = 'theme-input theme-input--mono';
      hex.spellcheck = false;
      hex.value = color;
      hex.dataset.stopHex = String(index);
      hex.setAttribute('aria-label', `渐变颜色 ${index + 1} 十六进制`);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'theme-stop__remove';
      remove.dataset.stopRemove = String(index);
      remove.disabled = gradient.stops.length <= MIN_GRADIENT_STOPS;
      remove.title = '移除此颜色';
      remove.setAttribute('aria-label', `移除渐变颜色 ${index + 1}`);
      const icon = iconClone('del');
      if (icon) remove.append(icon);

      row.append(swatch, hex, remove);
      host.append(row);
    });
    const addButton = form?.querySelector<HTMLButtonElement>(`[data-theme-add-stop="${kind}"]`);
    if (addButton) addButton.disabled = gradient.stops.length >= MAX_GRADIENT_STOPS;
  }

  function fillGradientFields(kind: GradientKind): void {
    const gradient = draft[kind] as GradientConfig;
    const enabledInput = form?.querySelector<HTMLInputElement>(
      `[data-theme-gradient-enabled="${kind}"]`,
    );
    const body = form?.querySelector<HTMLElement>(
      `[data-theme-gradient="${kind}"] .theme-field__body`,
    );
    const angle = form?.querySelector<HTMLInputElement>(`[data-theme-angle="${kind}"]`);
    const angleOut = form?.querySelector<HTMLElement>(`[data-theme-angle-out="${kind}"]`);
    if (enabledInput) enabledInput.checked = gradient.enabled;
    if (body) body.hidden = !gradient.enabled;
    if (angle) angle.value = String(gradient.angle);
    if (angleOut) angleOut.textContent = `${gradient.angle}°`;
    renderStops(kind);
  }

  function fillImageFields(keepUrlInput = false): void {
    const enabledInput = form?.querySelector<HTMLInputElement>('[data-theme-image-enabled]');
    const body = form?.querySelector<HTMLElement>('[data-theme-image-body]');
    const url = form?.querySelector<HTMLInputElement>('[data-theme-image-url]');
    const thumb = form?.querySelector<HTMLElement>('[data-theme-image-thumb]');
    const overlay = form?.querySelector<HTMLInputElement>('[data-theme-image-overlay]');
    const overlayOut = form?.querySelector<HTMLElement>('[data-theme-overlay-out]');
    if (enabledInput) enabledInput.checked = draft.bgImage.enabled;
    if (body) body.hidden = !draft.bgImage.enabled;
    if (url && !keepUrlInput) url.value = draft.bgImage.url;
    if (thumb) {
      if (draft.bgImage.url.startsWith('data:image/')) {
        thumb.style.backgroundImage = `url("${draft.bgImage.url}")`;
        thumb.hidden = false;
      } else {
        thumb.style.backgroundImage = '';
        thumb.hidden = true;
      }
    }
    if (overlay) overlay.value = String(draft.bgImage.overlay);
    if (overlayOut) overlayOut.textContent = `${draft.bgImage.overlay}%`;
    syncImageSuppression();
  }

  /** 背景图片开启时自动停用整页渐变（两者冲突：渐变会盖住图片）；导航栏 / 页脚渐变保持自由 */
  function syncImageSuppression(): void {
    if (!form) return;
    const active = draft.bgImage.enabled && !!draft.bgImage.url;
    const fieldset = form.querySelector<HTMLElement>('[data-theme-gradient="pageGradient"]');
    const toggle = form.querySelector<HTMLInputElement>(
      '[data-theme-gradient-enabled="pageGradient"]',
    );
    if (active) {
      draft.pageGradient.enabled = false;
      fieldset?.classList.add('is-suppressed');
      if (toggle) toggle.disabled = true;
    } else {
      fieldset?.classList.remove('is-suppressed');
      if (toggle) toggle.disabled = false;
    }
    if (toggle) toggle.checked = draft.pageGradient.enabled;
    const gradBody = fieldset?.querySelector<HTMLElement>('.theme-field__body');
    if (gradBody) gradBody.hidden = !draft.pageGradient.enabled;
  }

  function fillRadiusField(): void {
    const range = form?.querySelector<HTMLInputElement>('[data-theme-radius]');
    const out = form?.querySelector<HTMLElement>('[data-theme-radius-out]');
    if (range) range.value = String(draft.radius);
    if (out) out.textContent = radiusLabel(draft.radius);
  }

  function fillFontFields(): void {
    if (!form) return;
    const font = draft.font ?? { preset: 'default', name: '', src: '' };
    form.querySelectorAll<HTMLButtonElement>('[data-theme-font-preset]').forEach((button) => {
      const active = button.dataset.themeFontPreset === font.preset;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const customBody = form.querySelector<HTMLElement>('[data-theme-font-custom-body]');
    if (customBody) customBody.hidden = font.preset !== 'custom';
    const nameInput = form.querySelector<HTMLInputElement>('[data-theme-font-name]');
    if (nameInput) nameInput.value = font.name;
    const urlInput = form.querySelector<HTMLInputElement>('[data-theme-font-url]');
    if (urlInput) urlInput.value = font.src.startsWith('data:') ? '' : font.src;
    const thumb = form.querySelector<HTMLElement>('[data-theme-font-thumb]');
    if (thumb) {
      if (font.src.startsWith('data:')) {
        thumb.textContent = 'Aa';
        thumb.hidden = false;
      } else {
        thumb.textContent = '';
        thumb.hidden = true;
      }
    }
    setFontError('');
  }

  function setFontError(message: string): void {
    const el = form?.querySelector<HTMLElement>('[data-theme-font-error]');
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function fillEditor(): void {
    if (!form) return;
    const nameInput = form.querySelector<HTMLInputElement>('[data-theme-field="name"]');
    if (nameInput) nameInput.value = draft.name;
    form.querySelectorAll<HTMLInputElement>('input[name="theme-base"]').forEach((radio) => {
      radio.checked = radio.value === draft.base;
    });
    syncColorFields('bg', draft.bg);
    syncColorFields('ink', draft.ink);
    syncColorFields('muted', draft.muted);
    syncColorFields('accent', draft.accent);
    syncColorFields('code.bg', draft.code.bg);
    syncColorFields('code.fg', draft.code.fg);
    syncColorFields('code.muted', draft.code.muted);
    fillGradientFields('pageGradient');
    fillGradientFields('headerGradient');
    fillGradientFields('footerGradient');
    fillImageFields();
    fillRadiusField();
    fillFontFields();
    setEditorError('');
  }

  function setEditorError(message: string): void {
    const el = form?.querySelector<HTMLElement>('[data-theme-editor-error]');
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function setImageError(message: string): void {
    const el = form?.querySelector<HTMLElement>('[data-theme-image-error]');
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  /* ---------------------------------------------------------
     编辑器打开 / 取消 / 保存
     --------------------------------------------------------- */

  function draftFromCurrentTheme(): ThemeParams {
    return draftParams(
      currentVar('--bg', '#ffffff'),
      currentVar('--brand', '#2563eb'),
      root.dataset.theme === 'dark' ? 'dark' : 'light',
    );
  }

  function openEditor(existingId: string | null): void {
    cancelPreview();
    editorSession += 1;
    editingId = existingId;
    themeBeforePreview = activeThemeId;
    const stored = existingId ? customThemes.find((item) => item.id === existingId) : null;
    draft = stored ? structuredClone(stored.params) : draftFromCurrentTheme();
    const heading = editor.querySelector<HTMLElement>('[data-theme-editor-heading]');
    if (heading) heading.textContent = existingId ? '编辑自定义主题' : '新建自定义主题';
    closeMenu();
    editorDx = 0;
    editorDy = 0;
    editor.style.transform = '';
    fillEditor();
    editor.showModal();
    preview();
  }

  function cancelEditor(): void {
    cancelPreview();
    editor.close();
    applyTheme(themeBeforePreview, { persist: false });
  }

  function saveEditor(): void {
    cancelPreview();
    const params = normalizeParams(draft);
    const vars = resolveThemeVars(params);
    const id = editingId ?? `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const previous = customThemes.find((item) => item.id === id);
    const nextTheme = { id, createdAt: previous?.createdAt ?? Date.now(), params, vars };
    const nextThemes = previous
      ? customThemes.map((item) => item.id === id ? nextTheme : item)
      : [...customThemes, nextTheme];
    if (!persistCustomThemes(nextThemes)) {
      setEditorError(
        '主题未保存：浏览器本地存储不可用或空间不足。请缩小背景图片、减少已存主题后重试，也可导出 JSON 或取消修改。',
      );
      preview();
      return;
    }
    editingId = id;
    applyTheme(id);
    editor.close();
    trigger.focus();
  }

  /* ---------------------------------------------------------
     编辑器字段事件（委托）
     --------------------------------------------------------- */

  form?.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-theme-field="name"]')) {
      draft.name = target.value;
      return;
    }
    if (target.matches('input[name="theme-base"]')) {
      draft.base = target.value === 'dark' ? 'dark' : 'light';
      preview();
      return;
    }
    const hexKey = target.dataset.themeHex;
    if (hexKey) {
      const parsed = parseColor(target.value);
      if (parsed) {
        const value = toHex(parsed);
        setPath(hexKey, value);
        syncColorFields(hexKey, value, target);
        schedulePreview();
      }
      return;
    }
    const rgbKey = target.dataset.themeRgb;
    if (rgbKey) {
      const raw = target.value.split(/[\s,]+/).filter(Boolean).map(Number);
      if (raw.length === 3 && raw.every((n) => Number.isFinite(n) && n >= 0 && n <= 255)) {
        const value = toHex(raw as Rgb);
        setPath(rgbKey, value);
        syncColorFields(rgbKey, value, target);
        schedulePreview();
      }
      return;
    }
    const gradientAngle = target.dataset.themeAngle;
    if (gradientAngle) {
      const kind = gradientAngle as GradientKind;
      (draft[kind] as GradientConfig).angle = Number(target.value) || 0;
      const out = form.querySelector<HTMLElement>(`[data-theme-angle-out="${kind}"]`);
      if (out) out.textContent = `${(draft[kind] as GradientConfig).angle}°`;
      schedulePreview();
      return;
    }
    const stopHex = target.dataset.stopHex;
    if (stopHex !== undefined) {
      const parsed = parseColor(target.value);
      const kind = stopsKindOf(target);
      if (parsed && kind) {
        const value = toHex(parsed);
        (draft[kind] as GradientConfig).stops[Number(stopHex)] = value;
        syncStopRow(kind, Number(stopHex), value, target);
        schedulePreview();
      }
      return;
    }
    if (target.matches('[data-theme-image-overlay]')) {
      draft.bgImage.overlay = Number(target.value) || 0;
      const out = form.querySelector<HTMLElement>('[data-theme-overlay-out]');
      if (out) out.textContent = `${draft.bgImage.overlay}%`;
      schedulePreview();
      return;
    }
    if (target.matches('[data-theme-image-url]')) {
      const sanitized = sanitizeImageUrl(target.value);
      draft.bgImage.url = sanitized;
      setImageError(
        target.value.trim() && !sanitized ? '图片地址无效：仅支持 https:// 、站内 / 路径' : '',
      );
      fillImageFields(true);
      schedulePreview();
      return;
    }
    if (target.matches('[data-theme-radius]')) {
      draft.radius = Number(target.value) || 0;
      const out = form.querySelector<HTMLElement>('[data-theme-radius-out]');
      if (out) out.textContent = radiusLabel(draft.radius);
      schedulePreview();
      return;
    }
    if (target.matches('[data-theme-font-name]')) {
      draft.font = {
        ...(draft.font ?? { preset: 'custom', src: '' }),
        preset: draft.font?.preset ?? 'custom',
        name: sanitizeFontName(target.value),
        src: draft.font?.src ?? '',
      };
      schedulePreview();
      return;
    }
    if (target.matches('[data-theme-font-url]')) {
      fontReadRequest += 1;
      const sanitized = sanitizeFontSrc(target.value);
      draft.font = {
        ...(draft.font ?? { preset: 'custom', name: '' }),
        preset: draft.font?.preset ?? 'custom',
        name: draft.font?.name ?? '',
        src: sanitized,
      };
      setFontError(
        target.value.trim() && !sanitized
          ? '字体地址无效：仅支持 https:// 链接或本地导入的字体文件'
          : '',
      );
      schedulePreview();
    }
  });

  function stopsKindOf(element: HTMLElement): GradientKind | null {
    const value = element.closest<HTMLElement>('[data-theme-stops]')?.dataset.themeStops;
    return value === 'pageGradient' || value === 'headerGradient' || value === 'footerGradient'
      ? value
      : null;
  }

  form?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const gradientEnabled = target.dataset.themeGradientEnabled;
    if (gradientEnabled) {
      const kind = gradientEnabled as GradientKind;
      (draft[kind] as GradientConfig).enabled = target.checked;
      fillGradientFields(kind);
      preview();
      return;
    }
    if (target.matches('[data-theme-image-enabled]')) {
      draft.bgImage.enabled = target.checked;
      fillImageFields();
      preview();
    }
  });

  form?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    /* 字体风格切换 */
    const fontPresetButton = target.closest<HTMLElement>('[data-theme-font-preset]');
    if (fontPresetButton) {
      const preset = fontPresetButton.dataset.themeFontPreset as FontPreset | undefined;
      if (preset && FONT_PRESETS.includes(preset)) {
        fontReadRequest += 1;
        draft.font = {
          preset,
          name: draft.font?.name ?? '',
          src: preset === 'custom' ? draft.font?.src ?? '' : '',
        };
        fillFontFields();
        schedulePreview();
      }
      return;
    }

    /* 取色器按钮（普通颜色字段） */
    const colorButton = target.closest<HTMLElement>('[data-theme-color-btn]');
    if (colorButton) {
      const key = colorButton.dataset.themeColorBtn ?? '';
      if (popAnchor === colorButton) {
        closeColorPop();
        return;
      }
      openColorPop(colorButton, String(getValueByPath(key) ?? '#ffffff'), (hex) => {
        setPath(key, hex);
        syncColorFields(key, hex, null);
        schedulePreview();
      });
      return;
    }

    /* 取色器按钮（渐变停靠点） */
    const stopButton = target.closest<HTMLElement>('[data-stop-btn]');
    if (stopButton) {
      const kind = stopsKindOf(stopButton);
      if (!kind) return;
      const index = Number(stopButton.dataset.stopBtn);
      const stops = (draft[kind] as GradientConfig).stops;
      if (popAnchor === stopButton) {
        closeColorPop();
        return;
      }
      openColorPop(stopButton, stops[index] ?? '#ffffff', (hex) => {
        stops[index] = hex;
        syncStopRow(kind, index, hex, null);
        schedulePreview();
      });
      return;
    }

    const addStopKind = target.closest<HTMLElement>('[data-theme-add-stop]')?.dataset.themeAddStop;
    if (addStopKind) {
      const kind = addStopKind as GradientKind;
      const gradient = draft[kind] as GradientConfig;
      if (gradient.stops.length < MAX_GRADIENT_STOPS) {
        const last = gradient.stops[gradient.stops.length - 1] ?? '#ffffff';
        gradient.stops.push(mixColor(last, '#ffffff', 0.25));
        renderStops(kind);
        preview();
      }
      return;
    }
    const removeButton = target.closest<HTMLElement>('[data-stop-remove]');
    if (removeButton) {
      const kind = stopsKindOf(removeButton);
      if (kind) {
        const gradient = draft[kind] as GradientConfig;
        if (gradient.stops.length > MIN_GRADIENT_STOPS) {
          gradient.stops.splice(Number(removeButton.dataset.stopRemove), 1);
          renderStops(kind);
          preview();
        }
      }
      return;
    }
    const auto = target.closest<HTMLElement>('[data-theme-auto]')?.dataset.themeAuto;
    if (auto === 'text') {
      draft.ink = autoInk(draft.bg);
      draft.muted = autoMuted(draft.bg);
      syncColorFields('ink', draft.ink);
      syncColorFields('muted', draft.muted);
      preview();
      return;
    }
    if (auto === 'code') {
      draft.code = autoCode(draft.code.bg);
      syncColorFields('code.bg', draft.code.bg);
      syncColorFields('code.fg', draft.code.fg);
      syncColorFields('code.muted', draft.code.muted);
      preview();
    }
  });

  /* ---------------------------------------------------------
     背景图片：拖放 / 点击选择（Base64 存入主题）
     --------------------------------------------------------- */

  const dropZone = form?.querySelector<HTMLElement>('[data-theme-image-drop]')!;
  const imageFileInput = (() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.dataset.themeImageFile = '';
    input.hidden = true;
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    form?.append(input);
    return input;
  })();

  function readImageFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      setImageError('仅支持图片文件（PNG / JPG / WebP / GIF / SVG）');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(
        `图片 ${(file.size / 1024 / 1024).toFixed(1)}MB 超出上限：Base64 存储建议小于 2MB，请压缩后再拖入`,
      );
      return;
    }
    const reader = new FileReader();
    const session = editorSession;
    reader.addEventListener('load', () => {
      if (!editor.open || session !== editorSession) return;
      const dataUrl = sanitizeImageUrl(String(reader.result ?? ''));
      if (!dataUrl) {
        setImageError('图片读取失败，请换一个文件重试');
        return;
      }
      draft.bgImage.url = dataUrl;
      draft.bgImage.enabled = true;
      setImageError('');
      fillImageFields();
      preview();
    });
    reader.addEventListener('error', () => setImageError('图片读取失败，请换一个文件重试'));
    reader.readAsDataURL(file);
  }

  dropZone.addEventListener('click', () => imageFileInput.click());
  dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      imageFileInput.click();
    }
  });
  imageFileInput.addEventListener('change', () => {
    const file = imageFileInput.files?.[0];
    if (file) readImageFile(file);
    imageFileInput.value = '';
  });

  function highlightDrop(on: boolean): void {
    dropZone.classList.toggle('is-over', on);
  }

  for (const zone of [dropZone, editor] as HTMLElement[]) {
    zone.addEventListener('dragover', (event) => {
      if (!event.dataTransfer?.types.includes('Files')) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      highlightDrop(true);
    });
    zone.addEventListener('dragleave', () => highlightDrop(false));
    zone.addEventListener('drop', (event) => {
      if (!event.dataTransfer?.types.includes('Files')) return;
      event.preventDefault();
      highlightDrop(false);
      const file = event.dataTransfer.files?.[0];
      if (file) readImageFile(file);
    });
  }

  /* ---------------------------------------------------------
     字体文件：拖放 / 点击选择（Base64 存入主题，FontFace 动态注册）
     --------------------------------------------------------- */

  const fontDropZone = form?.querySelector<HTMLElement>('[data-theme-font-drop]')!;
  const fontFileInput = (() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.woff2,.woff,.ttf,.otf,font/*,application/font-woff2';
    input.dataset.themeFontFile = '';
    input.hidden = true;
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    form?.append(input);
    return input;
  })();

  const isFontFile = (file: File): boolean =>
    /\.(woff2?|ttf|otf)$/i.test(file.name) ||
    file.type.startsWith('font/') ||
    /^application\/(font-woff2?|x-font-ttf|font-sfnt|octet-stream)$/i.test(file.type);

  function readFontFile(file: File): void {
    const request = ++fontReadRequest;
    if (!isFontFile(file)) {
      setFontError('仅支持字体文件（WOFF2 / TTF / OTF）');
      return;
    }
    if (file.size > MAX_FONT_BYTES) {
      setFontError(
        `字体 ${(file.size / 1024 / 1024).toFixed(1)}MB 超出上限：Base64 存储需小于 2MB，建议使用子集化后的字体`,
      );
      return;
    }
    const reader = new FileReader();
    const session = editorSession;
    const isCurrentRead = () => editor.open && session === editorSession && request === fontReadRequest;
    reader.addEventListener('load', () => {
      if (!isCurrentRead()) return;
      const dataUrl = sanitizeFontSrc(String(reader.result ?? ''));
      if (!dataUrl) {
        setFontError('字体读取失败，请换一个文件重试');
        return;
      }
      const baseName = file.name.replace(/\.[a-z0-9]+$/i, '');
      draft.font = {
        preset: 'custom',
        name: sanitizeFontName(draft.font?.name || baseName) || '自定义字体',
        src: dataUrl,
      };
      setFontError('');
      fillFontFields();
      preview();
    });
    reader.addEventListener('error', () => {
      if (isCurrentRead()) setFontError('字体读取失败，请换一个文件重试');
    });
    reader.readAsDataURL(file);
  }

  fontDropZone.addEventListener('click', () => fontFileInput.click());
  fontDropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fontFileInput.click();
    }
  });
  fontFileInput.addEventListener('change', () => {
    const file = fontFileInput.files?.[0];
    if (file) readFontFile(file);
    fontFileInput.value = '';
  });

  function highlightFontDrop(on: boolean): void {
    fontDropZone.classList.toggle('is-over', on);
  }

  fontDropZone.addEventListener('dragover', (event) => {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    highlightFontDrop(true);
  });
  fontDropZone.addEventListener('dragleave', () => highlightFontDrop(false));
  fontDropZone.addEventListener('drop', (event) => {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.stopPropagation();
    highlightFontDrop(false);
    const file = event.dataTransfer.files?.[0];
    if (file) readFontFile(file);
  });

  /* ---------------------------------------------------------
     编辑器对话框：按住标题栏拖动
     --------------------------------------------------------- */

  const grip = editor.querySelector<HTMLElement>('[data-theme-editor-grip]')!;
  let editorDx = 0;
  let editorDy = 0;

  grip.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    const startX = event.clientX - editorDx;
    const startY = event.clientY - editorDy;
    grip.setPointerCapture(event.pointerId);
    editor.classList.add('is-dragging');
    const move = (ev: PointerEvent) => {
      editorDx = ev.clientX - startX;
      editorDy = ev.clientY - startY;
      editor.style.transform = `translate(${editorDx}px, ${editorDy}px)`;
    };
    const end = () => {
      editor.classList.remove('is-dragging');
      grip.releasePointerCapture(event.pointerId);
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', end);
      grip.removeEventListener('pointercancel', end);
    };
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  });

  /* ---------------------------------------------------------
     关闭 / 导出 / 导入
     --------------------------------------------------------- */

  editor.querySelector('[data-theme-editor-close]')?.addEventListener('click', cancelEditor);
  editor.querySelector('[data-theme-cancel]')?.addEventListener('click', cancelEditor);
  editor.querySelector('[data-theme-save]')?.addEventListener('click', saveEditor);
  editor.querySelector('[data-theme-export]')?.addEventListener('click', handleExport);
  editor.addEventListener('close', () => {
    cancelPreview();
    editorSession += 1;
    closeColorPop();
    /* Esc / 点关闭等同取消：还原预览前主题（保存流程已在 close 前应用新主题） */
    applyTheme(activeThemeId, { persist: false });
    trigger.focus();
  });

  function handleExport(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    const payload = { format: 'cdu-ai-theme', version: 1, params: draft };
    const json = JSON.stringify(payload, null, 2);
    const fileBase = (draft.name || 'theme').replace(/[\\/:*?"<>|\s]+/g, '-').slice(0, 40);

    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cdu-ai-theme-${fileBase}.json`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      /* 下载失败时仍尝试复制 */
    }
    void navigator.clipboard?.writeText(json).catch(() => {
      /* 剪贴板不可用则仅下载 */
    });

    const original = button.textContent;
    button.textContent = '已复制并下载';
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 2000);
  }

  const importJson = importDialog.querySelector<HTMLTextAreaElement>('[data-theme-import-json]');
  const importFile = importDialog.querySelector<HTMLInputElement>('[data-theme-import-file]');
  const importError = importDialog.querySelector<HTMLElement>('[data-theme-import-error]');

  function openImport(): void {
    if (importJson) importJson.value = '';
    if (importFile) importFile.value = '';
    if (importError) importError.hidden = true;
    closeMenu();
    importDialog.showModal();
  }

  panel.querySelector('[data-theme-import-open]')?.addEventListener('click', openImport);

  importFile?.addEventListener('change', async () => {
    const file = importFile.files?.[0];
    if (!file || !importJson) return;
    try {
      importJson.value = await file.text();
    } catch {
      if (importError) {
        importError.textContent = '读取文件失败，请重试。';
        importError.hidden = false;
      }
    }
  });

  importDialog.querySelector('[data-theme-import-cancel]')?.addEventListener('click', () => {
    importDialog.close();
  });

  importDialog.querySelector('[data-theme-import-confirm]')?.addEventListener('click', () => {
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(importJson?.value ?? '');
    } catch {
      parsed = null;
    }
    const container = parsed as Record<string, unknown> | null;
    const rawParams = container && typeof container === 'object' && container.params
      ? container.params
      : container;
    if (!rawParams || typeof rawParams !== 'object' || Array.isArray(rawParams)) {
      if (importError) {
        importError.textContent = '无法识别的主题 JSON，请检查内容是否完整。';
        importError.hidden = false;
      }
      return;
    }
    const params = normalizeParams(rawParams);
    const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const nextThemes = [...customThemes, { id, createdAt: Date.now(), params, vars: resolveThemeVars(params) }];
    if (!persistCustomThemes(nextThemes)) {
      if (importError) {
        importError.textContent = '主题未导入：浏览器本地存储不可用或空间不足。请缩小背景图片或减少已存主题后重试。';
        importError.hidden = false;
      }
      return;
    }
    importDialog.close();
    applyTheme(id);
  });

  /* ---------------------------------------------------------
     初始化
     --------------------------------------------------------- */

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (savedThemeId() === null) {
      applyTheme(null, { persist: false });
    }
  });

  renderMenu();
  applyTheme(activeThemeId, { persist: false });
}
