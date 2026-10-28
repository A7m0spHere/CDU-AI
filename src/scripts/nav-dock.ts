/**
 * 顶部导航的两处光效行为（都只在这一个脚本里，避免再拆一个文件）：
 *
 * 1. dock 放大：参考 macOS Dock 的邻近放大，但幅度很小——鼠标 x 到入口中心的距离
 *    映射成 1 → 1.12 的缩放和 2.4px 的上浮。
 * 2. 光效汇聚：指针落到某个入口上时，把 `.nav-glow` 这团光挪到那一枚按钮的几何位置上，
 *    （外观见 styles/hover-glow.css，与首页引导图节点共用同一套渐变），
 *    并让光心跟着指针在这枚按钮里左右偏移；离开导航则熄灭。
 *    同时给 <html> 打上 data-nav-light，让全站指针光晕先撤走（见 cursor-glow.css），
 *    看起来就是「光收进了按钮」，而不是两处同时发亮。
 *
 * 为什么手写而不是上库：站点是 Astro + 原生脚本，没有 React / motion；
 * 这里只有「距离 → 缩放」和「矩形 → 光的位置」两条逻辑，rAF 足够。
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
const HIT_SLOP = 14; // 命中判定在按钮左右各放宽的像素（填补按钮之间的缝）

export function initNavDock(): void {
  const nav = document.querySelector<HTMLElement>('.desktop-nav');
  if (!nav) return;

  const items = Array.from(nav.querySelectorAll<HTMLElement>('.nav-link, .nav-cta'));
  if (items.length === 0) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  const glow = nav.querySelector<HTMLElement>('.nav-glow');
  const docEl = document.documentElement;
  const entries: DockEntry[] = items.map((el) => ({ el, value: 0 }));
  let pointerX: number | null = null;
  let clientX: number | null = null;
  let frameId = 0;
  let hovered: HTMLElement | null = null;

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
    // 按钮被放大时真实尺寸在变，光要逐帧贴住，否则会明显比按钮小一圈
    if (hovered) aimGlow(hovered, clientX ?? undefined);
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

  const setGlowActive = (active: boolean): void => {
    if (!glow) return;
    glow.dataset.active = active ? 'true' : 'false';
    // 注意：这里不能叫 navGlow，否则会和 .nav-glow 自己的 data-nav-glow 撞名
    docEl.dataset.navLight = active ? 'true' : 'false';
  };

  /** 把光挪到某个入口上；pointerX 有值时顺便让光心贴住指针。 */
  const aimGlow = (el: HTMLElement, pointerX?: number): void => {
    if (!glow) return;
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    glow.style.setProperty('--glow-x', `${(rect.left - navRect.left).toFixed(1)}px`);
    glow.style.setProperty('--glow-y', `${(rect.top - navRect.top).toFixed(1)}px`);
    glow.style.setProperty('--glow-w', `${rect.width.toFixed(1)}px`);
    glow.style.setProperty('--glow-h', `${rect.height.toFixed(1)}px`);
    glow.style.setProperty('--glow-r', window.getComputedStyle(el).borderRadius);
    if (pointerX !== undefined) {
      const ratio = (pointerX - rect.left) / Math.max(rect.width, 1);
      glow.style.setProperty('--glow-cx', `${(Math.min(1, Math.max(0, ratio)) * 100).toFixed(1)}%`);
    }
    setGlowActive(true);
  };

  /** 找指针落点所在的入口：按钮之间只有 1–2px 的缝，所以命中判定要放宽一点。 */
  const itemAt = (x: number, y: number): HTMLElement | null => {
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      if (y < rect.top - 6 || y > rect.bottom + 6) continue;
      if (x < rect.left - HIT_SLOP || x > rect.right + HIT_SLOP) continue;
      return el;
    }
    return null;
  };

  nav.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    clientX = event.clientX;
    schedule();

    const item = itemAt(event.clientX, event.clientY);
    if (item) {
      hovered = item;
      aimGlow(item, event.clientX);
    } else if (hovered) {
      hovered = null;
      setGlowActive(false);
    }
  });

  nav.addEventListener('pointerleave', () => {
    pointerX = null;
    clientX = null;
    hovered = null;
    setGlowActive(false);
    schedule();
  });

  // 键盘 Tab 到某个入口时也轻微抬起、并把光移过去，保证焦点可见且与鼠标体验一致
  items.forEach((el) => {
    el.addEventListener('focus', () => {
      el.style.setProperty('--dock-scale', '1.06');
      el.style.setProperty('--dock-lift', '-2px');
      aimGlow(el);
    });
    el.addEventListener('blur', () => {
      el.style.removeProperty('--dock-scale');
      el.style.removeProperty('--dock-lift');
      if (!hovered) setGlowActive(false);
    });
  });
}
