/**
 * 主题引擎（纯函数，无 DOM 依赖）
 * 自定义主题由少量核心参数推导出整套设计令牌（tokens.css 的 CSS 变量）。
 * 运行时编辑与构建期预设解析共用这一份逻辑。
 */

export type ThemeBase = 'light' | 'dark';

export interface GradientConfig {
  enabled: boolean;
  angle: number; // 0-360，单位 deg
  stops: string[]; // 2-5 个十六进制颜色
}

export interface BgImageConfig {
  enabled: boolean;
  url: string;
  overlay: number; // 0-100，背景色遮罩不透明度，用于保证文字可读性
}

export interface CodeConfig {
  bg: string;
  fg: string;
  muted: string;
}

export interface ThemeParams {
  name: string;
  base: ThemeBase;
  bg: string; // 背景主体颜色
  ink: string; // 主文字颜色
  muted: string; // 次要文字颜色
  accent: string; // 品牌 / 交互强调色
  pageGradient: GradientConfig; // 整页背景渐变
  headerGradient: GradientConfig; // 顶部导航栏渐变
  footerGradient: GradientConfig; // 底部页脚渐变
  bgImage: BgImageConfig; // 背景图片
  radius: number; // 0-10 圆角程度，5 为项目默认
  code: CodeConfig; // 代码块配色
}

/** 存入 localStorage 的自定义主题：同时保存参数与已解析变量（供首屏防闪烁脚本直接使用） */
export interface StoredTheme {
  id: string;
  createdAt: number;
  params: ThemeParams;
  vars: Record<string, string>;
}

export const THEME_STORAGE_KEY = 'cdu-ai-theme';
export const CUSTOM_THEMES_STORAGE_KEY = 'cdu-ai-custom-themes';

export const MIN_GRADIENT_STOPS = 2;
export const MAX_GRADIENT_STOPS = 5;

/* ---------------------------------------------------------
   颜色工具
   --------------------------------------------------------- */

export type Rgb = [number, number, number];

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB_RE = /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})/i;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 解析 hex / rgb() 字符串为 [r, g, b]；不合法时返回 null */
export function parseColor(input: string): Rgb | null {
  const value = input.trim();
  const hexMatch = HEX_RE.exec(value);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const rgbMatch = RGB_RE.exec(value);
  if (rgbMatch) {
    return [
      clamp(Number(rgbMatch[1]), 0, 255),
      clamp(Number(rgbMatch[2]), 0, 255),
      clamp(Number(rgbMatch[3]), 0, 255),
    ];
  }
  return null;
}

/** 任意输入归一化为 #rrggbb；不合法时返回 fallback */
export function normalizeColor(input: string, fallback: string): string {
  return toHex(parseColor(input) ?? parseColor(fallback) ?? [0, 0, 0]);
}

export function toHex([r, g, b]: Rgb): string {
  return (
    '#' +
    [r, g, b]
      .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function toRgbString(rgb: Rgb): string {
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}

/** 线性插值混合：t 为 b 所占比例（0-1） */
export function mixColor(a: string, b: string, t: number): string {
  const ca = parseColor(a) ?? [0, 0, 0];
  const cb = parseColor(b) ?? [0, 0, 0];
  const k = clamp(t, 0, 1);
  return toHex([
    ca[0] + (cb[0] - ca[0]) * k,
    ca[1] + (cb[1] - ca[1]) * k,
    ca[2] + (cb[2] - ca[2]) * k,
  ]);
}

export function withAlpha(color: string, alpha: number): string {
  const c = parseColor(color) ?? [0, 0, 0];
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${clamp(alpha, 0, 1)})`;
}

/** 相对亮度（WCAG 定义），用于判断深浅、选取反差文字 */
export function luminance(color: string): number {
  const [r, g, b] = parseColor(color) ?? [0, 0, 0];
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function isDarkColor(color: string): boolean {
  return contrastRatio(color, '#ffffff') > contrastRatio(color, '#000000');
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** 优先保留中性灰阶；中间亮度下用黑白兜底，保证自动配色可读。 */
function readableText(bg: string, dark: string, light: string): string {
  const best = contrastRatio(bg, dark) >= contrastRatio(bg, light) ? dark : light;
  if (contrastRatio(bg, best) >= 4.5) return best;
  return isDarkColor(bg) ? '#ffffff' : '#000000';
}

/** 根据背景亮度自动推荐主文字颜色 */
export function autoInk(bg: string): string {
  return readableText(bg, '#1a1a1f', '#f5f5f7');
}

/** hex → HSV（h: 0-360, s/v: 0-1），供自绘取色器使用 */
export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const [r, g, b] = parseColor(hex) ?? [0, 0, 0];
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

/** HSV → hex */
export function hsvToHex(h: number, s: number, v: number): string {
  const hh = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = v - c;
  let rgb: [number, number, number];
  if (hh < 60) rgb = [c, x, 0];
  else if (hh < 120) rgb = [x, c, 0];
  else if (hh < 180) rgb = [0, c, x];
  else if (hh < 240) rgb = [0, x, c];
  else if (hh < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return toHex([
    Math.round((rgb[0] + m) * 255),
    Math.round((rgb[1] + m) * 255),
    Math.round((rgb[2] + m) * 255),
  ]);
}

/** 根据背景亮度自动推荐次要文字颜色 */
export function autoMuted(bg: string): string {
  return readableText(bg, '#55555e', '#a2a2ad');
}

/** 根据代码块底色自动推荐代码文字 / 注释颜色 */
export function autoCode(codeBg: string): CodeConfig {
  const dark = isDarkColor(codeBg);
  return {
    bg: normalizeColor(codeBg, dark ? '#101014' : '#f4f4f5'),
    fg: readableText(codeBg, '#1a1a1f', '#e8e8ec'),
    muted: readableText(codeBg, '#6b6b74', '#9a9aa4'),
  };
}

/** 背景图片 URL 安全校验：仅允许 http(s)、站内相对路径与 data:image */
export function sanitizeImageUrl(rawUrl: string): string {
  const url = rawUrl.trim();
  if (!url) return '';
  if (/^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);base64,[a-z0-9+/=\s]+$/i.test(url)) {
    return url.replace(/\s+/g, '');
  }
  if (/^https?:\/\/[^\s"'()<>]+$/.test(url)) return url;
  if (/^\/[^/\\][^\s"'()<>]*$/.test(url)) return url;
  return '';
}

/* ---------------------------------------------------------
   参数归一化与默认值
   --------------------------------------------------------- */

function record(input: unknown): Record<string, unknown> {
  return input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
}

function text(input: unknown): string {
  return typeof input === 'string' ? input : '';
}

function numeric(input: unknown): number {
  return typeof input === 'number' || (typeof input === 'string' && input.trim())
    ? Number(input)
    : NaN;
}

function normalizeGradient(input: unknown, fallback: GradientConfig): GradientConfig {
  const source = record(input);
  const stops = Array.isArray(source.stops)
    ? source.stops
        .filter((stop): stop is string => typeof stop === 'string')
        .map((stop) => normalizeColor(stop, fallback.stops[0]))
        .slice(0, MAX_GRADIENT_STOPS)
    : [];
  const merged = [...new Set(stops)];
  while (merged.length < MIN_GRADIENT_STOPS) {
    merged.push(fallback.stops[merged.length % fallback.stops.length]);
  }
  const angle = numeric(source.angle);
  return {
    enabled: source.enabled === true,
    angle: Number.isFinite(angle) ? clamp(Math.round(angle), 0, 360) : fallback.angle,
    stops: merged,
  };
}

/** 将任意输入（如导入的 JSON）归一化为合法 ThemeParams，不合法字段回退默认值 */
export function normalizeParams(input: unknown): ThemeParams {
  const source = record(input);
  const fallback = defaultParams();
  const codeSource = record(source.code);
  const imageSource = record(source.bgImage);
  const base: ThemeBase = source.base === 'dark' ? 'dark' : 'light';
  const bg = normalizeColor(text(source.bg), fallback.bg);
  const radius = numeric(source.radius);
  const overlay = numeric(imageSource.overlay);
  return {
    name:
      typeof source.name === 'string' && source.name.trim()
        ? source.name.trim().slice(0, 24)
        : fallback.name,
    base,
    bg,
    ink: normalizeColor(text(source.ink), autoInk(bg)),
    muted: normalizeColor(text(source.muted), autoMuted(bg)),
    accent: normalizeColor(text(source.accent), fallback.accent),
    pageGradient: normalizeGradient(source.pageGradient, fallback.pageGradient),
    headerGradient: normalizeGradient(source.headerGradient, fallback.headerGradient),
    footerGradient: normalizeGradient(source.footerGradient, fallback.footerGradient),
    bgImage: {
      enabled: imageSource.enabled === true,
      url: sanitizeImageUrl(text(imageSource.url)),
      overlay: Number.isFinite(overlay) ? clamp(Math.round(overlay), 0, 100) : 46,
    },
    radius: Number.isFinite(radius) ? clamp(Math.round(radius), 0, 10) : 5,
    code: {
      bg: normalizeColor(text(codeSource.bg), fallback.code.bg),
      fg: normalizeColor(text(codeSource.fg), fallback.code.fg),
      muted: normalizeColor(text(codeSource.muted), fallback.code.muted),
    },
  };
}

export function defaultParams(): ThemeParams {
  return {
    name: '我的主题',
    base: 'light',
    bg: '#f5f6fa',
    ink: '#1c1d24',
    muted: '#55565f',
    accent: '#2563eb',
    pageGradient: { enabled: false, angle: 160, stops: ['#e8ecf7', '#f7f4ef'] },
    headerGradient: { enabled: false, angle: 120, stops: ['#ffffff', '#eef1f8'] },
    footerGradient: { enabled: false, angle: 180, stops: ['#f2f3f7', '#e9ebf2'] },
    bgImage: { enabled: false, url: '', overlay: 46 },
    radius: 5,
    code: { bg: '#14151b', fg: '#e9e9ee', muted: '#9a9aa4' },
  };
}

/** 新建自定义主题时以当前背景色为起点 */
export function draftParams(bg: string, accent: string, base: ThemeBase): ThemeParams {
  const params = defaultParams();
  return {
    ...params,
    name: '我的主题',
    base,
    bg: normalizeColor(bg, params.bg),
    ink: autoInk(bg),
    muted: autoMuted(bg),
    accent: normalizeColor(accent, params.accent),
    code: autoCode(isDarkColor(bg) ? bg : params.code.bg),
    pageGradient: { ...params.pageGradient, stops: [mixColor(bg, params.accent, 0.12), bg] },
    headerGradient: {
      ...params.headerGradient,
      stops: [mixColor(bg, params.accent, 0.16), bg],
    },
    footerGradient: {
      ...params.footerGradient,
      stops: [mixColor(bg, params.accent, 0.1), mixColor(bg, params.ink, 0.04)],
    },
  };
}

/* ---------------------------------------------------------
   变量推导：ThemeParams → CSS 变量表
   --------------------------------------------------------- */

function gradientCss(gradient: GradientConfig): string {
  const angle = clamp(Math.round(gradient.angle), 0, 360);
  return `linear-gradient(${angle}deg, ${gradient.stops.join(', ')})`;
}

/** 菜单圆形色板使用的预览背景 */
export function swatchBackground(params: ThemeParams): string {
  if (params.pageGradient.enabled) return gradientCss(params.pageGradient);
  return params.bg;
}

export function resolveThemeVars(params: ThemeParams): Record<string, string> {
  const { bg, ink, muted, accent } = params;
  const darkBg = isDarkColor(bg);
  const onBrand = readableText(accent, '#12151c', '#ffffff');

  const vars: Record<string, string> = {};

  /* surfaces */
  vars['--bg'] = bg;
  vars['--bg-soft'] = mixColor(bg, ink, 0.03);
  vars['--surface'] = bg;
  vars['--surface-strong'] = mixColor(bg, ink, darkBg ? 0.06 : 0.02);
  vars['--surface-muted'] = mixColor(bg, ink, 0.05);
  vars['--bg-inverse'] = ink;
  vars['--ink-on-inverse'] = bg;

  /* text */
  vars['--ink'] = ink;
  vars['--ink-soft'] = mixColor(ink, bg, 0.18);
  vars['--muted'] = muted;
  vars['--faint'] = mixColor(muted, bg, 0.22);

  /* lines */
  vars['--line'] = mixColor(bg, ink, 0.11);
  vars['--line-strong'] = mixColor(bg, ink, 0.2);

  /* brand / accent */
  vars['--brand'] = accent;
  vars['--brand-strong'] = mixColor(accent, isDarkColor(onBrand) ? '#ffffff' : '#000000', 0.16);
  vars['--brand-soft'] = mixColor(bg, accent, darkBg ? 0.16 : 0.08);
  vars['--brand-tint'] = mixColor(bg, accent, 0.04);
  vars['--on-brand'] = onBrand;
  vars['--accent'] = accent;
  vars['--accent-vivid'] = darkBg
    ? mixColor(accent, '#000000', 0.22)
    : mixColor(accent, '#ffffff', 0.3);
  vars['--accent-soft'] = vars['--brand-soft'];

  /* states */
  vars['--focus'] = accent;
  /* 背景图片与整页渐变互相冲突：图片开启时渐变不再叠加 */
  const imageActive = params.bgImage.enabled && !!params.bgImage.url;
  /* 顶部 / 底部与背景图片自由共存：
     - 未设渐变且图片开启 → 导航栏底色透明，仅留毛玻璃（半透明磨砂效果）
     - 页脚未设渐变 → 始终透明，整页渐变或图片自然延伸到底 */
  vars['--header-bg'] = params.headerGradient.enabled
    ? gradientCss(params.headerGradient)
    : imageActive
      ? 'transparent'
      : withAlpha(bg, 0.86);
  vars['--footer-bg'] = params.footerGradient.enabled
    ? gradientCss(params.footerGradient)
    : 'transparent';

  /* 页面背景层：图片开启时不再叠加整页渐变（两者冲突），只留遮罩与图片 */
  const layers: string[] = [];
  const sizes: string[] = [];
  const attachments: string[] = [];
  if (params.pageGradient.enabled && !imageActive) {
    layers.push(gradientCss(params.pageGradient));
    sizes.push('auto');
    attachments.push('scroll');
  }
  if (params.bgImage.enabled && params.bgImage.url) {
    if (params.bgImage.overlay > 0) {
      /* background-image 只接受图像：遮罩需包成同色双向渐变 */
      const alpha = withAlpha(bg, params.bgImage.overlay / 100);
      layers.push(`linear-gradient(${alpha}, ${alpha})`);
      sizes.push('cover');
      attachments.push('fixed');
    }
    layers.push(`url("${params.bgImage.url}")`);
    sizes.push('cover');
    attachments.push('fixed');
  }
  vars['--page-bg-image'] = layers.length > 0 ? layers.join(', ') : 'none';
  vars['--page-bg-size'] = sizes.length > 0 ? sizes.join(', ') : 'auto';
  vars['--page-bg-attach'] = attachments.length > 0 ? attachments.join(', ') : 'scroll';
  vars['--page-bg-pos'] = 'center';

  /* 圆角：radius 滑杆 0-10，5 为项目默认比例 */
  const scale = params.radius / 5;
  const radii: Array<[string, number]> = [
    ['--radius-xs', 6],
    ['--radius-sm', 8],
    ['--radius-md', 12],
    ['--radius-lg', 16],
    ['--radius-xl', 22],
  ];
  for (const [key, base] of radii) {
    vars[key] = `${Math.round(base * scale)}px`;
  }
  vars['--radius-pill'] = '999px';

  /* code */
  vars['--code-bg'] = params.code.bg;
  vars['--code-fg'] = params.code.fg;
  vars['--code-muted'] = params.code.muted;
  vars['--theme-code-token-fg'] = params.code.fg;
  vars['--theme-code-token-muted'] = params.code.muted;

  return vars;
}
