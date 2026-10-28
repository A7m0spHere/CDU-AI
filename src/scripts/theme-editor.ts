/** 自定义主题编辑与导入：首次打开时才加载并绑定事件。 */
import editorStyles from '../styles/theme-editor.css?url';
import {
  MIN_GRADIENT_STOPS, MAX_GRADIENT_STOPS, MAX_FONT_BYTES, FONT_PRESETS,
  type StoredTheme, type ThemeParams, type GradientConfig, type FontPreset, type Rgb,
  resolveThemeVars, normalizeParams, draftParams, parseColor, toHex, toRgbString,
  mixColor, autoInk, autoMuted, autoCode, hexToHsv, hsvToHex,
  sanitizeImageUrl, sanitizeFontName, sanitizeFontSrc,
} from '../lib/theme-core';

type GradientKind = keyof Pick<ThemeParams, 'pageGradient' | 'headerGradient' | 'footerGradient'>;

export interface ThemeEditorHost {
  readonly customThemes: StoredTheme[];
  readonly activeThemeId: string | null;
  trigger: HTMLButtonElement;
  iconClone: (name: 'add' | 'edit' | 'del') => Node | null;
  persistCustomThemes: (themes: StoredTheme[]) => boolean;
  applyTheme: (id: string | null, options?: { persist?: boolean }) => void;
  clearInlineVars: () => void;
  applyVars: (params: ThemeParams) => void;
  updateMetaColor: () => void;
  currentVar: (name: string, fallback: string) => string;
  closeMenu: () => void;
}

export async function initThemeEditor(host: ThemeEditorHost) {
  // 用 URL 加载，避免 Astro 把动态模块的 CSS 提升到每个页面的 head。
  await new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = editorStyles;
    link.onload = () => resolve();
    link.onerror = () => {
      link.remove();
      reject(new Error('theme editor styles unavailable'));
    };
    document.head.append(link);
  });
  const { trigger, iconClone, persistCustomThemes, applyTheme, clearInlineVars, applyVars, updateMetaColor, currentVar, closeMenu } = host;
  const template = document.querySelector<HTMLTemplateElement>('[data-theme-dialogs]')!;
  document.body.append(template.content.cloneNode(true));
  const root = document.documentElement;
  const editor = document.querySelector<HTMLDialogElement>('[data-theme-editor]')!;
  const importDialog = document.querySelector<HTMLDialogElement>('[data-theme-import]')!;
  const form = editor.querySelector<HTMLFormElement>('[data-theme-form]');
  const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
  let editingId: string | null = null;
  let themeBeforePreview: string | null = host.activeThemeId;
  let draft: ThemeParams = normalizeParams(null);

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
    themeBeforePreview = host.activeThemeId;
    const stored = existingId ? host.customThemes.find((item) => item.id === existingId) : null;
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
    const previous = host.customThemes.find((item) => item.id === id);
    const nextTheme = { id, createdAt: previous?.createdAt ?? Date.now(), params, vars };
    const nextThemes = previous
      ? host.customThemes.map((item) => item.id === id ? nextTheme : item)
      : [...host.customThemes, nextTheme];
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
    applyTheme(host.activeThemeId, { persist: false });
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
    const nextThemes = [...host.customThemes, { id, createdAt: Date.now(), params, vars: resolveThemeVars(params) }];
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


  importDialog.addEventListener('close', () => trigger.focus());
  return { openEditor, openImport };
}
