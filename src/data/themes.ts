/**
 * 预设主题
 * ——占位示例：功能先行的临时参数，拿到正式背景参数后直接改这里即可。
 * 每个 preset 的 params 字段与自定义主题编辑器完全一致；
 * 修改后无需改任何逻辑，构建时会自动解析为整套设计令牌。
 */
import {
  defaultParams,
  type ThemeParams,
} from '../lib/theme-core';

export interface PresetTheme {
  id: string;
  params: ThemeParams;
}

function preset(id: string, overrides: Partial<ThemeParams>): PresetTheme {
  const base = defaultParams();
  return {
    id,
    params: {
      ...base,
      ...overrides,
      pageGradient: { ...base.pageGradient, ...(overrides.pageGradient ?? {}) },
      headerGradient: { ...base.headerGradient, ...(overrides.headerGradient ?? {}) },
      bgImage: { ...base.bgImage, ...(overrides.bgImage ?? {}) },
      code: { ...base.code, ...(overrides.code ?? {}) },
    },
  };
}

export const presetThemes: PresetTheme[] = [
  preset('preset-ocean', {
    name: '海风',
    base: 'light',
    bg: '#edf4fb',
    ink: '#16232e',
    muted: '#4c5f6e',
    accent: '#0369a1',
    code: { bg: '#0b1620', fg: '#dbe7f0', muted: '#7d93a3' },
  }),
  preset('preset-sunset', {
    name: '落日',
    base: 'light',
    bg: '#fff6ec',
    ink: '#271a12',
    muted: '#6f5a4b',
    accent: '#c2410c',
    pageGradient: { enabled: true, angle: 160, stops: ['#ffe9d3', '#ffdfe7', '#ead9ff'] },
    code: { bg: '#231207', fg: '#f3e6da', muted: '#a89283' },
  }),
  preset('preset-dusk', {
    name: '暮紫',
    base: 'dark',
    bg: '#151020',
    ink: '#ece8f6',
    muted: '#a49bc2',
    accent: '#a78bfa',
    headerGradient: { enabled: true, angle: 120, stops: ['#241b3a', '#151020'] },
    code: { bg: '#0d0a16', fg: '#e6e1f2', muted: '#8f87ab' },
  }),
  preset('preset-forest', {
    name: '森林',
    base: 'dark',
    bg: '#0e1712',
    ink: '#e4f0e8',
    muted: '#8fb3a0',
    accent: '#34d399',
    radius: 7,
    code: { bg: '#0a120d', fg: '#dcefe3', muted: '#7fa38f' },
  }),
  preset('preset-sakura', {
    name: '樱粉',
    base: 'light',
    bg: '#fdf1f5',
    ink: '#26141b',
    muted: '#70525c',
    accent: '#db2777',
    radius: 8,
    code: { bg: '#2a1219', fg: '#f6e3ea', muted: '#b28e9b' },
  }),
];
