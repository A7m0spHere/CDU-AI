/**
 * 「鼠标光效」总开关。
 *
 * 站点的光效有四条链路，共用这一个偏好：
 *   - 全站指针光晕（scripts/cursor-glow.ts）
 *   - 顶部导航光效汇聚（scripts/nav-dock.ts）
 *   - 页头控件、站内按钮、搜索框与列表卡片（scripts/ui-glow.ts → hover-glow.ts）
 *   - 首页 Hero 点阵光（scripts/pixel-card.ts）
 *
 * 存 localStorage，并在 BaseLayout 的首屏脚本里先写一次 <html data-glow>，
 * 避免「上次关了、这次打开页面又闪一下光」。面板里的开关（ThemePicker.astro）
 * 改完立刻广播 cdu:glow-change，各驱动器据此收尾/继续。
 */

const STORAGE_KEY = 'cdu-ai-glow';

/** 开关变化时在 document 上广播，detail.enabled 是新的状态 */
export const GLOW_CHANGE = 'cdu:glow-change';

export function glowEnabled(): boolean {
  return document.documentElement.dataset.glow !== 'off';
}

function apply(enabled: boolean): void {
  document.documentElement.dataset.glow = enabled ? 'on' : 'off';
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

/** 读取偏好、同步开关外观、绑定点击 */
export function initGlowPref(): void {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    saved = null;
  }
  apply(saved !== 'off');

  const toggle = document.querySelector<HTMLButtonElement>('[data-glow-toggle]');
  if (!toggle) return;

  const sync = (): void => {
    toggle.setAttribute('aria-checked', glowEnabled() ? 'true' : 'false');
  };
  sync();
  toggle.addEventListener('click', () => setGlowEnabled(!glowEnabled()));
  document.addEventListener(GLOW_CHANGE, sync);
}

initGlowPref();
