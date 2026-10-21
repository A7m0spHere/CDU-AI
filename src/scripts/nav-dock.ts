/**
 * 顶部导航的 dock 放大效果（参考 macOS Dock 的邻近放大，但只做很小的幅度）。
 *
 * 为什么手写而不是上库：站点是 Astro + 原生脚本，没有 React / motion；
 * 这里的交互只用到「鼠标 x 到元素中心的距离 → 缩放」一条逻辑，用 rAF + 缓动足够。
 * 关闭条件：触屏 / 减少动效偏好 / 导航隐藏（移动端）时直接不启用。
 */

type DockEntry = {
  el: HTMLElement;
  /** 当前缩放系数（0–1），用于缓动 */
  value: number;
};

const AMPLITUDE = 0.12; // 最大放大比例（1 → 1.12）
const RANGE = 120; // 影响半径（px）
const EASE = 0.22; // 每帧逼近目标的比例
const LIFT = 2.4; // 最大上浮（px）

export function initNavDock(): void {
  const nav = document.querySelector<HTMLElement>('.desktop-nav');
  if (!nav) return;

  const items = Array.from(nav.querySelectorAll<HTMLElement>('.nav-link, .nav-cta'));
  if (items.length === 0) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  const entries: DockEntry[] = items.map((el) => ({ el, value: 0 }));
  let pointerX: number | null = null;
  let frameId = 0;

  /** 指针到元素中心的距离，映射成 0–1 的放大强度（近处为 1，超出半径为 0）。 */
  const targetFor = (el: HTMLElement): number => {
    if (pointerX === null) return 0;
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(pointerX - (rect.left + rect.width / 2));
    if (distance >= RANGE) return 0;
    const falloff = 1 - distance / RANGE;
    return falloff * falloff; // 平方衰减，靠近时更明显、远处更平缓
  };

  const tick = (): void => {
    let active = false;
    for (const entry of entries) {
      const goal = targetFor(entry.el);
      entry.value += (goal - entry.value) * EASE;
      if (Math.abs(goal - entry.value) < 0.002) entry.value = goal;
      if (entry.value > 0.002 || goal > 0) active = true;
      entry.el.style.setProperty('--dock-scale', (1 + entry.value * AMPLITUDE).toFixed(3));
      entry.el.style.setProperty('--dock-lift', `${(-entry.value * LIFT).toFixed(2)}px`);
    }
    frameId = active ? window.requestAnimationFrame(tick) : 0;
  };

  const schedule = (): void => {
    if (frameId === 0) frameId = window.requestAnimationFrame(tick);
  };

  nav.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    schedule();
  });

  nav.addEventListener('pointerleave', () => {
    pointerX = null;
    schedule();
  });

  // 键盘 Tab 到某个入口时也轻微抬起，保证焦点可见且与鼠标体验一致
  items.forEach((el) => {
    el.addEventListener('focus', () => {
      el.style.setProperty('--dock-scale', '1.06');
      el.style.setProperty('--dock-lift', '-2px');
    });
    el.addEventListener('blur', () => {
      el.style.removeProperty('--dock-scale');
      el.style.removeProperty('--dock-lift');
    });
  });
}
