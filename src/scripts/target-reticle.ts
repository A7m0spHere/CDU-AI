/**
 * Hero 右侧「看板娘学习网络」的瞄准框装饰。
 *
 * 借鉴 TargetCursor 的思路：四角瞄准框、待机时缓慢旋转、命中目标时吸附并暂停旋转。
 * 有意不照搬：不替换原生鼠标、不依赖 GSAP、不监听全局 mousemove / mousedown；
 * 只在本区域内生效，触摸设备与 prefers-reduced-motion 下不启用动画。
 */

const network = document.querySelector<HTMLElement>('[data-hero-network]');
const target = network?.querySelector<HTMLElement>('[data-hero-target]');
const figure = network?.querySelector<HTMLElement>('.hero-network__figure');

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const wideEnough = window.matchMedia('(min-width: 761px)');

if (network && target && canHover.matches && wideEnough.matches) {
  let active: HTMLElement | null = null;
  let pointerInside = false;

  const place = (element: HTMLElement | null) => {
    if (!element) {
      target.classList.remove('is-visible');
      return;
    }
    const networkRect = network.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const pad = element.classList.contains('hero-node') ? 7 : 14;
    target.style.transform = `translate(${rect.left - networkRect.left - pad}px, ${rect.top - networkRect.top - pad}px)`;
    target.style.width = `${rect.width + pad * 2}px`;
    target.style.height = `${rect.height + pad * 2}px`;
    target.classList.toggle('is-node', element.classList.contains('hero-node'));
    target.classList.add('is-visible');
  };

  const setActive = (element: HTMLElement | null) => {
    active = element;
    place(element);
    // 节点 hover 时有 3px 位移，等过渡结束再校正一次
    if (element) window.setTimeout(() => active === element && place(element), 240);
  };

  const hide = () => {
    active = null;
    target.classList.remove('is-visible');
  };

  const nodeFrom = (event: Event) => {
    const node = (event.target as Element | null)?.closest<HTMLElement>('.hero-node');
    return node;
  };

  network.addEventListener('pointerover', (event) => {
    pointerInside = true;
    setActive(nodeFrom(event) ?? figure ?? network);
  });

  network.addEventListener('pointermove', (event) => {
    if (!pointerInside) return;
    const node = nodeFrom(event);
    if (node && node !== active) setActive(node);
    if (!node && active !== figure) setActive(figure ?? network);
  });

  network.addEventListener('pointerleave', () => {
    pointerInside = false;
    if (!document.activeElement || !network.contains(document.activeElement)) hide();
  });

  network.addEventListener('focusin', (event) => {
    const node = nodeFrom(event);
    if (node) setActive(node);
  });

  network.addEventListener('focusout', (event) => {
    const next = event.relatedTarget as Node | null;
    if (next && network.contains(next)) return;
    if (pointerInside) return;
    hide();
  });

  const refresh = () => {
    if (active) place(active);
  };
  new ResizeObserver(refresh).observe(network);
  window.addEventListener('resize', refresh, { passive: true });
  reduced.addEventListener('change', () => {
    target.classList.toggle('reduce-motion', reduced.matches);
  });
  target.classList.toggle('reduce-motion', reduced.matches);
}

export {};
