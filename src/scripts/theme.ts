/**
 * 主题系统运行时
 * - 圆形色板菜单：内置黑白 + 预设 + 自定义（新建 / 编辑 / 删除）
 * - 应用与持久化主题；编辑、导入和导出按需加载 theme-editor.ts
 */
import { presetThemes } from '../data/themes';
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

function savedThemeId(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
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
