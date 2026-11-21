/**
 * 「鼠标光效」与「光效拖尾」两个总开关。
 *
 * 站点的光效有几条链路，共用 data-glow：
 *   - 全站指针光晕（scripts/cursor-glow.ts）
 *   - 顶部导航光效汇聚（scripts/nav-dock.ts）
 *   - 页头控件、站内按钮、搜索框与列表卡片（scripts/ui-glow.ts → hover-glow.ts）
 *   - 首页 Hero 点阵光（scripts/pixel-card.ts）
 * 「光效拖尾」（scripts/cursor-trail.ts）是单独的一条链路、单独的开关 data-trail：
 * 关掉光晕之后仍可只留流星尾迹，两个开关互不牵连。
 *
 * 存 localStorage，并在 BaseLayout 的首屏脚本里先写一次 <html data-glow / data-trail>，
 * 避免「上次关了、这次打开页面又闪一下」。面板里的开关（ThemePicker.astro）
 * 改完立刻广播 cdu:glow-change / cdu:trail-change，各驱动器据此收尾或继续。
 */

const STORAGE_KEY = 'cdu-ai-glow';
const TRAIL_KEY = 'cdu-ai-trail';

/** 开关变化时在 document 上广播，detail.enabled 是新的状态 */
export const GLOW_CHANGE = 'cdu:glow-change';
export const TRAIL_CHANGE = 'cdu:trail-change';

export function glowEnabled(): boolean {
  return document.documentElement.dataset.glow === 'on';
}

export function trailEnabled(): boolean {
  return document.documentElement.dataset.trail === 'on';
}

function apply(enabled: boolean): void {
  document.documentElement.dataset.glow = enabled ? 'on' : 'off';
}

function applyTrail(enabled: boolean): void {
  document.documentElement.dataset.trail = enabled ? 'on' : 'off';
}

export function setGlowEnabled(enabled: boolean): void {
  apply(enabled);
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    /* 隐私模式下写不进去就只影响本次会话 */
  }
  document.dispatchEvent(new CustomEvent(GLOW_CHANGE, { detail: { enabled } }));
}

export function setTrailEnabled(enabled: boolean): void {
  applyTrail(enabled);
  try {
    localStorage.setItem(TRAIL_KEY, enabled ? 'on' : 'off');
  } catch {
    /* 同上 */
  }
  document.dispatchEvent(new CustomEvent(TRAIL_CHANGE, { detail: { enabled } }));
}

/** 读取偏好、同步开关外观、绑定点击 */
export function initGlowPref(): void {
  let saved: string | null = null;
  let savedTrail: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
    savedTrail = localStorage.getItem(TRAIL_KEY);
  } catch {
    saved = null;
    savedTrail = null;
  }
  apply(saved === 'on');
  applyTrail(savedTrail === 'on');

  const glow = document.querySelector<HTMLButtonElement>('[data-glow-toggle]');
  if (glow) {
    const sync = (): void => glow.setAttribute('aria-checked', glowEnabled() ? 'true' : 'false');
    sync();
    glow.addEventListener('click', () => setGlowEnabled(!glowEnabled()));
    document.addEventListener(GLOW_CHANGE, sync);
  }

  const trail = document.querySelector<HTMLButtonElement>('[data-trail-toggle]');
  if (trail) {
    const sync = (): void => trail.setAttribute('aria-checked', trailEnabled() ? 'true' : 'false');
    sync();
    trail.addEventListener('click', () => setTrailEnabled(!trailEnabled()));
    document.addEventListener(TRAIL_CHANGE, sync);
  }
}

initGlowPref();
