/**
 * 「光效汇聚」的通用驱动器：谁带 [data-glow-host]，指针落上去就点亮它内部那层光。
 *
 * 顶部导航那套是浮在导航条上的一枚 .nav-glow（见 nav-dock.ts），几何逐帧跟着 dock 放大；
 * 实心表面上（首页引导图节点、主按钮、搜索框、图标键）光只能亮在自身圆角里，
 * 所以这些地方各自带一层 .hover-glow--inset，这里只负责：
 *   - 指针进到哪个宿主，就点亮哪个宿主的那一层；
 *   - 亮心跟着指针在宿主里左右移动（写 --glow-cx）；
 *   - 通过 onActive 回调通知调用方（首页打 data-hero-light、页头打 data-ui-light），
 *     让全站指针光晕让位（见 styles/cursor-glow.css）。
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
    const glow = item.querySelector<HTMLElement>('[data-glow]');
    if (glow) glows.set(item, glow);
  }

  let active: HTMLElement | null = null;

  /** 点亮 / 熄灭一枚宿主：宿主自己也留个标记，方便 CSS 让 hover 底色给光让位 */
  const activate = (item: HTMLElement | null) => {
    if (active === item) return;
    if (active !== null) {
      glows.get(active)?.removeAttribute('data-active');
      delete active.dataset.glowOn;
    }
    active = item;
    if (item === null) return;
    glows.get(item)?.setAttribute('data-active', 'true');
    item.dataset.glowOn = 'true';
  };

  return (item, pointerX) => {
    if (!item || !glows.has(item)) {
      if (active === null) return;
      activate(null);
      onActive?.(false);
      return;
    }

    activate(item);
    const glow = glows.get(item);
    if (!glow) return;

    if (pointerX !== undefined) {
      const rect = item.getBoundingClientRect();
      const ratio = clamp01((pointerX - rect.left) / Math.max(rect.width, 1));
      glow.style.setProperty('--glow-cx', `${(ratio * 100).toFixed(1)}%`);
    }

    onActive?.(true);
  };
}
