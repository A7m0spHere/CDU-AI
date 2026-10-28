/**
 * 全站指针光晕的移动逻辑。
 *
 * 目标是"跟随但不黏手"：指针移动时目标点直达，元素用缓动追上去；
 * 只在移动期间 requestAnimationFrame，静止即停，避免常驻重绘。
 * 减少动效、触屏与隐藏标签页都不显示。
 */

const host = document.querySelector<HTMLElement>('[data-cursor-glow]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (host && finePointer.matches) {
  const EASE = 0.32;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;
  let frame = 0;
  let active = false;

  const place = () => {
    host.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  const tick = () => {
    frame = 0;
    x += (targetX - x) * EASE;
    y += (targetY - y) * EASE;
    place();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.4) frame = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (frame || reduced.matches || document.hidden) return;
    frame = requestAnimationFrame(tick);
  };

  const show = () => {
    if (active) return;
    active = true;
    host.dataset.active = 'true';
  };

  const hide = () => {
    if (!active) return;
    active = false;
    host.dataset.active = 'false';
  };

  window.addEventListener('pointermove', (event) => {
    if (reduced.matches || event.pointerType === 'touch') return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!active) {
      // 第一次出现时直接落到指针处，避免从屏幕中心滑过来
      x = targetX;
      y = targetY;
      place();
    }
    show();
    wake();
  }, { passive: true });

  // 指针离开窗口（relatedTarget 为空）或窗口失焦时淡出
  window.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) hide();
  });
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });

  const applyMotion = () => {
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      hide();
    }
  };
  reduced.addEventListener('change', applyMotion);

  place();
}

export {};