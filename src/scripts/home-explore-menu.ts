// 流动横幅仅在桌面主动悬停或键盘聚焦时播放；链接始终使用原生导航。
const finePointer = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-flow-link]')) {
  const reveal = link.querySelector<HTMLElement>('[data-flow-reveal]');
  const inner = link.querySelector<HTMLElement>('[data-flow-inner]');
  if (!reveal || !inner) continue;

  // 每个循环至少铺满入口宽度，菜单展开为整宽后仍保持连续。
  const measure = () => link.style.setProperty('--flow-width', `${link.clientWidth}px`);
  measure();
  if ('ResizeObserver' in window) {
    new ResizeObserver(measure).observe(link);
  }

  let hovered = false;
  let focused = false;
  let open = false;
  let visible = true;
  let animations: Animation[] = [];
  const enabled = () => finePointer.matches && !reducedMotion.matches;
  const edge = (event: PointerEvent) => {
    const rect = link.getBoundingClientRect();
    return event.clientY - rect.top < rect.height / 2 ? -1 : 1;
  };
  const playback = () => {
    link.dataset.flowRunning = String(open && visible && !document.hidden && enabled());
  };
  const cancel = () => {
    for (const animation of animations) animation.cancel();
    animations = [];
  };
  const place = (show: boolean, direction: number) => {
    reveal.style.transform = `translateY(${show ? 0 : direction * 101}%)`;
    inner.style.transform = `translateY(${show ? 0 : -direction * 101}%)`;
  };
  const update = (direction: number) => {
    const next = (hovered || focused) && enabled();
    if (next === open) return;
    const resting = animations.length === 0;
    const fromReveal = getComputedStyle(reveal).transform;
    const fromInner = getComputedStyle(inner).transform;
    cancel();
    open = next;
    place(open, direction);
    link.dataset.flowActive = String(open);
    playback();
    const from = open && resting ? `translateY(${direction * 101}%)` : fromReveal;
    const innerFrom = open && resting ? `translateY(${-direction * 101}%)` : fromInner;
    const timing = { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
    animations = [
      reveal.animate([{ transform: from }, { transform: reveal.style.transform }], timing),
      inner.animate([{ transform: innerFrom }, { transform: inner.style.transform }], timing),
    ];
    const current = animations[0];
    current.onfinish = () => {
      if (animations[0] === current) animations = [];
    };
  };
  const reset = () => {
    cancel();
    if (!finePointer.matches) hovered = false;
    open = (hovered || focused) && enabled();
    place(open, 1);
    link.dataset.flowActive = String(open);
    playback();
  };

  link.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) return;
    hovered = true;
    update(edge(event));
  });
  link.addEventListener('pointerleave', (event) => {
    hovered = false;
    update(edge(event));
  });
  link.addEventListener('focus', () => {
    focused = true;
    update(1);
  });
  link.addEventListener('blur', () => {
    focused = false;
    update(1);
  });
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', playback);
  window.addEventListener('blur', () => {
    hovered = false;
    update(1);
    link.dataset.flowRunning = 'false';
  });
  window.addEventListener('focus', playback);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      playback();
    });
    observer.observe(link);
  }
  reset();
  link.dataset.flowReady = 'true';
}

export {};
