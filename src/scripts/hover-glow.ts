/**
 * 首页引导图节点的「光效汇聚」。
 *
 * 顶部导航那套是浮在导航条上的一枚 .nav-glow（见 nav-dock.ts）；
 * 引导图的节点是叠在看板娘插画上的实心卡片，光只能亮在卡片里面，
 * 所以每张卡自带一层 .hover-glow--inset，这里只负责：
 *   - 指针进到哪张卡，就点亮哪张卡的那一层；
 *   - 亮心跟着指针在卡片里左右移动（写 --glow-cx）；
 *   - 亮起时给 <html> 打 data-hero-light，让全站指针光晕让位（见 cursor-glow.css）。
 *
 * 外观（渐变、模糊、深浅主题）与导航共用 styles/hover-glow.css，不在这里写颜色。
 */

type InsetGlowOptions = {
  items: HTMLElement[];
  /** 亮起 / 熄灭回调，用来切换 <html> 上的 data-hero-light */
  onActive?: (active: boolean) => void;
};

/** 传入要亮的卡片（null 表示熄灭）；pointerX 有值时让亮心贴住指针。 */
export type ShowGlow = (item: HTMLElement | null, pointerX?: number) => void;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function initInsetGlow({ items, onActive }: InsetGlowOptions): ShowGlow {
  const glows = new Map<HTMLElement, HTMLElement>();
  for (const item of items) {
    const glow = item.querySelector<HTMLElement>('[data-node-glow]');
    if (glow) glows.set(item, glow);
  }

  let active: HTMLElement | null = null;

  return (item, pointerX) => {
    if (!item || !glows.has(item)) {
      if (active === null) return;
      glows.get(active)?.removeAttribute('data-active');
      active = null;
      onActive?.(false);
      return;
    }

    if (active !== null && active !== item) glows.get(active)?.removeAttribute('data-active');
    const glow = glows.get(item);
    if (!glow) return;
    glow.dataset.active = 'true';
    active = item;

    if (pointerX !== undefined) {
      const rect = item.getBoundingClientRect();
      const ratio = clamp01((pointerX - rect.left) / Math.max(rect.width, 1));
      glow.style.setProperty('--glow-cx', `${(ratio * 100).toFixed(1)}%`);
    }

    onActive?.(true);
  };
}
