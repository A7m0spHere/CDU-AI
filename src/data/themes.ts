/**
 * 预设主题
 * ——占位示例：功能先行的临时参数，拿到正式背景参数后直接改这里即可。
 * 每个 preset 的 params 字段与自定义主题编辑器完全一致；
 * 修改后无需改任何逻辑，构建时会自动解析为整套设计令牌。
 */
import {
  defaultParams,
  normalizeFont,
  type ThemeParams,
} from '../lib/theme-core';

/** 预设在主题菜单中的分区：light 浅色 · dark 深色 · feature 特色（贴图 / 图片主题） */
export type PresetGroup = 'light' | 'dark' | 'feature';

export interface PresetTheme {
  id: string;
  group: PresetGroup;
  params: ThemeParams;
}

function preset(id: string, group: PresetGroup, overrides: Partial<ThemeParams>): PresetTheme {
  const base = defaultParams();
  return {
    id,
    group,
    params: {
      ...base,
      ...overrides,
      pageGradient: { ...base.pageGradient, ...(overrides.pageGradient ?? {}) },
      headerGradient: { ...base.headerGradient, ...(overrides.headerGradient ?? {}) },
      footerGradient: { ...base.footerGradient, ...(overrides.footerGradient ?? {}) },
      bgImage: { ...base.bgImage, ...(overrides.bgImage ?? {}) },
      code: { ...base.code, ...(overrides.code ?? {}) },
      font: normalizeFont(overrides.font ?? base.font),
    },
  };
}

export const presetThemes: PresetTheme[] = [
  /* —— 浅色 —— */
  preset('preset-ocean', 'light', {
    name: '海风',
    base: 'light',
    bg: '#edf4fb',
    ink: '#16232e',
    muted: '#4c5f6e',
    accent: '#0369a1',
    code: { bg: '#0b1620', fg: '#dbe7f0', muted: '#7d93a3' },
  }),
  preset('preset-sunset', 'light', {
    name: '落日',
    base: 'light',
    bg: '#fff6ec',
    ink: '#271a12',
    muted: '#6f5a4b',
    accent: '#c2410c',
    pageGradient: { enabled: true, angle: 160, stops: ['#ffe9d3', '#ffdfe7', '#ead9ff'] },
    code: { bg: '#231207', fg: '#f3e6da', muted: '#a89283' },
  }),
  preset('preset-sakura', 'light', {
    name: '樱粉',
    base: 'light',
    bg: '#fdf1f5',
    ink: '#26141b',
    muted: '#70525c',
    accent: '#db2777',
    radius: 8,
    code: { bg: '#2a1219', fg: '#f6e3ea', muted: '#b28e9b' },
  }),

  /* —— 深色 —— */
  preset('preset-dusk', 'dark', {
    name: '暮紫',
    base: 'dark',
    bg: '#151020',
    ink: '#ece8f6',
    muted: '#a49bc2',
    accent: '#a78bfa',
    headerGradient: { enabled: true, angle: 120, stops: ['#241b3a', '#151020'] },
    code: { bg: '#0d0a16', fg: '#e6e1f2', muted: '#8f87ab' },
  }),
  preset('preset-forest', 'dark', {
    name: '森林',
    base: 'dark',
    bg: '#0e1712',
    ink: '#e4f0e8',
    muted: '#8fb3a0',
    accent: '#34d399',
    radius: 7,
    code: { bg: '#0a120d', fg: '#dcefe3', muted: '#7fa38f' },
  }),
  /* Dracula：最流行的暗色开发者主题之一 */
  preset('preset-dracula', 'dark', {
    name: '德古拉',
    base: 'dark',
    bg: '#282a36',
    ink: '#f8f8f2',
    muted: '#9ba0c0',
    accent: '#bd93f9',
    pageGradient: { enabled: true, angle: 160, stops: ['#2f3140', '#282a36'] },
    radius: 8,
    code: { bg: '#21222c', fg: '#f8f8f2', muted: '#6272a4' },
  }),
  /* Nord：北极蓝灰 */
  preset('preset-nord', 'dark', {
    name: '极北',
    base: 'dark',
    bg: '#2e3440',
    ink: '#eceff4',
    muted: '#a7b1c2',
    accent: '#88c0d0',
    pageGradient: { enabled: true, angle: 160, stops: ['#333a4a', '#2e3440'] },
    radius: 6,
    code: { bg: '#272c36', fg: '#eceff4', muted: '#7b88a1' },
  }),
  /* Catppuccin Mocha：柔和粉彩暗色 */
  preset('preset-catppuccin', 'dark', {
    name: '摩卡',
    base: 'dark',
    bg: '#1e1e2e',
    ink: '#cdd6f4',
    muted: '#9399b2',
    accent: '#89b4fa',
    pageGradient: { enabled: true, angle: 160, stops: ['#262637', '#1e1e2e'] },
    radius: 8,
    code: { bg: '#11111b', fg: '#cdd6f4', muted: '#9399b2' },
  }),

  /* —— 特色：贴图 / 图片主题 —— */

  /* 我的世界：草方块贴图（导航栏=草顶面，正文=草块侧面：草皮连着泥土）+ 方块像素字体 + 全站直角 */
  preset('preset-minecraft', 'feature', {
    name: '我的世界',
    base: 'dark',
    bg: '#8a5a32',
    ink: '#f6f1e3',
    muted: '#d8c9a8',
    accent: '#3fb911',
    pageGradient: {
      enabled: true,
      angle: 180,
      stops: ['#91bd59', '#8a5a32', '#5c3a1e'],
      texture: 'grass-block',
    },
    headerGradient: {
      enabled: true,
      angle: 90,
      stops: ['#7fcb63', '#6aa63f'],
      texture: 'grass',
    },
    footerGradient: {
      enabled: true,
      angle: 180,
      stops: ['#8a5a32', '#5c3a1e'],
      texture: 'dirt-deep',
    },
    radius: 0,
    font: { preset: 'pixel', name: '', src: '' },
    code: { bg: '#1d1f21', fg: '#e8e8ec', muted: '#9a9aa4' },
  }),
  /* 鲸鱼娘：深海蓝 + DeepSeek 品牌蓝，背景为社区创作的鲸鱼娘形象
     图片署名（CC BY-NC-SA 4.0，非商用）：原创 OC「溟月」上善无形 · DeepSeek 元素二创 ZipZipPipe · 修复 QYQCAMIAO
     来源 https://github.com/fornarwhal/deepseek-whale-girl-icon —— 公开部署时请在页面可见处保留署名 */
  preset('preset-whale', 'feature', {
    name: '鲸鱼娘',
    base: 'dark',
    bg: '#0d1530',
    ink: '#e6f0ff',
    muted: '#8fa3c8',
    accent: '#4d6bfe',
    pageGradient: { enabled: false, angle: 200, stops: ['#1c2f6e', '#0d1530', '#070b1c'] },
    headerGradient: { enabled: true, angle: 120, stops: ['#16245c', '#0d1530'] },
    footerGradient: { enabled: true, angle: 180, stops: ['#0d1530', '#070b1c'] },
    bgImage: { enabled: true, url: '/images/whale-girl.png', overlay: 42 },
    radius: 8,
    code: { bg: '#0a0f24', fg: '#dce7ff', muted: '#7c8fb8' },
  }),
  /* 奶鲸：蓝色大肥鲸表情包形象（网络流传，来源待考），浅灰底 + 奶鲸蓝 */
  preset('preset-milk-whale', 'feature', {
    name: '奶鲸',
    base: 'light',
    bg: '#eef1f5',
    ink: '#12224e',
    muted: '#5a6a8c',
    accent: '#2f6bdf',
    pageGradient: { enabled: false, angle: 180, stops: ['#dfe7f2', '#eef1f5'] },
    bgImage: { enabled: true, url: '/images/milk-whale.jpg', overlay: 30 },
    radius: 9,
    code: { bg: '#12224e', fg: '#e3ecff', muted: '#8fa3c8' },
  }),
  /* 小计姬（Techne-chan）：社区创作的 AI 学习助手拟人形象，浅蓝紫科技场景
     立绘 / 贴纸由 techne.css 浮层合成（比例自适应 + 羽化 + 漂浮），素材来自用户提供的形象包 */
  preset('preset-techne', 'feature', {
    name: '小计姬',
    base: 'light',
    bg: '#dfe6f5',
    ink: '#141c33',
    muted: '#566180',
    accent: '#3d6ce0',
    pageGradient: {
      enabled: true,
      angle: 160,
      stops: ['#e9eefb', '#d8e1f6', '#c9d5f2'],
      texture: 'techne',
    },
    radius: 8,
    code: { bg: '#141c33', fg: '#e3ecff', muted: '#8fa3c8' },
  }),
];
