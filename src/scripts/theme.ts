/**
 * 主题系统运行时
 * - 圆形色板菜单：内置黑白 + 预设 + 自定义（新建 / 编辑 / 删除）
 * - 应用与持久化主题；编辑、导入和导出按需加载 theme-editor.ts
 */
import { presetThemes, EGG_THEME_ID, EGG_SCENE } from '../data/themes';
import {
  THEME_STORAGE_KEY, CUSTOM_THEMES_STORAGE_KEY,
  type StoredTheme, type ThemeParams, type FontConfig,
  resolveThemeVars, normalizeParams, swatchBackground,
} from '../lib/theme-core';
import type { ThemeEditorHost } from './theme-editor';

interface ThemeRef {
  id: string;
  params: ThemeParams;
}

const root = document.documentElement;
/* 脚本于 body 末尾以模块方式加载，头部组件必已存在 */
const picker = document.querySelector<HTMLElement>('[data-theme-picker]')!;
const panel = document.querySelector<HTMLElement>('[data-theme-panel]')!;
const trigger = document.querySelector<HTMLButtonElement>('[data-theme-trigger]')!;

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

/* 旧版「小计姬」与「小计姬·胶片」两个对比变体已合并为 preset-techne，
   浏览器里留存的旧 id 做一次别名映射，避免升级后掉回默认主题 */
const LEGACY_THEME_IDS: Record<string, string> = {
  'preset-techne-marquee': 'preset-techne',
};

function savedThemeId(): string | null {
  try {
    const id = localStorage.getItem(THEME_STORAGE_KEY);
    return id ? (LEGACY_THEME_IDS[id] ?? id) : null;
  } catch {
    return null;
  }
}

if (picker && panel && trigger) {

  let customThemes: StoredTheme[] = loadCustomThemes();
  let activeThemeId = savedThemeId();

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
    if (scene === 'techne') ensureTechneStage();
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

  /* 胶片带常驻，显隐由 data-bg-scene 控制，主立绘由 CSS 绘制。 */
  function ensureTechneStage(): void {
    if (document.querySelector('.techne-marquee')) return;
    const marquee = document.createElement('div');
    marquee.className = 'techne-marquee';
    marquee.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = 'techne-marquee__track';
    const group = document.createElement('div');
    group.className = 'techne-marquee__group';
    const roles = ['face', 'smile', 'bubble', 'fixed', 'badge', 'peace', 'cash', 'stand-b'];
    for (const role of roles) {
      const sticker = document.createElement('i');
      sticker.className = `techne-marquee__item techne-marquee__item--${role}`;
      group.append(sticker);
    }
    track.append(group);
    marquee.append(track);
    document.body.append(marquee);

    const observer = new ResizeObserver(() => {
      const groupWidth = group.getBoundingClientRect().width;
      if (!groupWidth) return;
      // 滚过一组贴纸以后，剩下的轨道仍须覆盖整条胶片带。
      const copies = Math.ceil(marquee.clientWidth / groupWidth) + 1;
      if (track.childElementCount !== copies) {
        track.replaceChildren(group, ...Array.from({ length: copies - 1 }, () => group.cloneNode(true)));
      }
      track.style.setProperty('--techne-marquee-offset', `${-groupWidth}px`);
    });
    observer.observe(marquee);
    observer.observe(group);
  }

  function applyTheme(id: string | null, options: { persist?: boolean } = {}): void {
    activeThemeId = id;
    clearInlineVars();
    const theme = id && id !== 'light' && id !== 'dark' ? findTheme(id) : null;
    if (theme) {
      applyVars(theme.params);
      /* 彩蛋主题：仅打上场景标记（egg-mascot.css 负责白底配色）
         立绘登场方式待定，暂不改动页面既有构图与人物 */
      if (id === EGG_THEME_ID) {
        root.dataset.bgScene = EGG_SCENE;
      }
    } else {
      root.dataset.theme = id === 'light' || id === 'dark' ? id : systemTheme();
      root.dataset.imageBg = 'false';
      root.dataset.bgScene = '';
    }
    if (options.persist !== false) persistActiveTheme(id);
    updateMetaColor();
    renderMenu();
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
    /* 隐藏主题（彩蛋）不进菜单，仅能通过彩蛋入口激活 */
    lightHost.replaceChildren(
      ...presetThemes.filter((item) => item.group === 'light' && !item.hidden).map(presetSwatch),
    );
    darkHost.replaceChildren(
      ...presetThemes.filter((item) => item.group === 'dark' && !item.hidden).map(presetSwatch),
    );
    featureHost.replaceChildren(
      ...presetThemes.filter((item) => item.group === 'feature' && !item.hidden).map(presetSwatch),
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
    else {
      cancelOpening();
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (panel.hidden && !openingCustomization) return;
    if (!picker.contains(event.target as Node)) {
      cancelOpening();
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (!panel.hidden || openingCustomization) && !document.querySelector('[data-theme-editor][open], [data-theme-import][open]')) {
      cancelOpening();
      closeMenu();
      trigger.focus();
    }
  });

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const selectButton = target.closest<HTMLElement>('[data-theme-select]');
    if (selectButton) {
      cancelOpening();
      applyTheme(selectButton.dataset.themeSelect ?? null);
      return;
    }
    if (target.closest('[data-theme-create]')) {
      void openCustomization('edit', null);
      return;
    }
    const editButton = target.closest<HTMLElement>('[data-theme-edit]');
    if (editButton) {
      void openCustomization('edit', editButton.dataset.themeEdit ?? null);
      return;
    }
    if (target.closest('[data-theme-import-open]')) {
      void openCustomization('import');
      return;
    }
    const deleteButton = target.closest<HTMLButtonElement>('[data-theme-delete]');
    if (deleteButton) {
      handleDelete(deleteButton);
    }
  });

  type EditorController = Awaited<ReturnType<typeof import('./theme-editor').initThemeEditor>>;
  let editorRequest: Promise<EditorController> | null = null;
  let openingCustomization = false;
  let openSequence = 0;

  function cancelOpening(): void {
    openSequence += 1;
    openingCustomization = false;
    panel.removeAttribute('aria-busy');
  }

  async function openCustomization(action: 'edit' | 'import', id: string | null = null): Promise<void> {
    if (openingCustomization) return;
    openingCustomization = true;
    const sequence = ++openSequence;
    panel.setAttribute('aria-busy', 'true');
    const error = panel.querySelector<HTMLElement>('[data-theme-menu-error]');
    if (error) error.hidden = true;
    try {
      if (!editorRequest) {
        const host: ThemeEditorHost = {
          get customThemes() { return customThemes; },
          get activeThemeId() { return activeThemeId; },
          trigger, iconClone, persistCustomThemes, applyTheme, clearInlineVars, applyVars,
          updateMetaColor, currentVar, closeMenu,
        };
        editorRequest = import('./theme-editor').then((module) => module.initThemeEditor(host));
      }
      const controller = await editorRequest;
      if (sequence !== openSequence) return;
      if (action === 'import') controller.openImport();
      else controller.openEditor(id);
    } catch {
      editorRequest = null;
      if (sequence !== openSequence) return;
      openMenu();
      if (error) {
        error.textContent = '主题编辑器加载失败，请重试；若仍失败，请刷新页面。';
        error.hidden = false;
      }
    } finally {
      if (sequence === openSequence) {
        openingCustomization = false;
        panel.removeAttribute('aria-busy');
      }
    }
  }

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
     彩蛋：连续点击左上角徽标 3 次 → 激活成大吉祥物主题
     --------------------------------------------------------- */

  const EGG_CLICKS = 3;
  const EGG_WINDOW = 900;

  /** 解锁提示：短暂浮现后自动消失，不拦截任何交互 */
  function showEggToast(): void {
    document.querySelector('.egg-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.setAttribute('role', 'status');
    const mark = document.createElement('span');
    mark.className = 'egg-toast__mark';
    mark.textContent = '✦';
    const text = document.createElement('span');
    text.textContent = '彩蛋解锁：成大吉祥物';
    toast.append(mark, text);
    document.body.append(toast);
    window.setTimeout(() => {
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 380);
    }, 2800);
  }

  function initEasterEgg(): void {
    const brand = document.querySelector<HTMLAnchorElement>('[data-brand]');
    if (!brand) return;
    let clicks = 0;
    let timer = 0;
    brand.addEventListener('click', (event) => {
      if (
        window.location.pathname !== '/' ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.detail === 0 ||
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
      ) return;
      // 首页普通点击留在当前页，避免刷新打断连点。
      event.preventDefault();
      clicks += 1;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        clicks = 0;
      }, EGG_WINDOW);
      if (clicks >= EGG_CLICKS) {
        clicks = 0;
        window.clearTimeout(timer);
        applyTheme(EGG_THEME_ID);
        showEggToast();
      }
    });
  }

  /* ---------------------------------------------------------
     初始化
     --------------------------------------------------------- */

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (savedThemeId() === null) {
      applyTheme(null, { persist: false });
    }
  });

  initEasterEgg();
  renderMenu();
  applyTheme(activeThemeId, { persist: false });
}
