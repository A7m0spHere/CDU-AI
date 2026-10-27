import { createExploreSurface, projectExploreSurface } from '../lib/explore-dot-field';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

for (const host of document.querySelectorAll<HTMLElement>('[data-explore-dots]')) {
  const stage = host.closest<HTMLElement>('[data-explore-stage]');
  const canvas = host.querySelector<HTMLCanvasElement>('canvas');
  const context = canvas?.getContext('2d');
  if (!stage || !canvas || !context) continue;

  let width = 0, height = 0;
  let source: Float32Array = new Float32Array(0);
  let projected: Float32Array = new Float32Array(0);
  let primary = '', secondary = '';
  let x = 0, y = 0, targetX = 0, targetY = 0;
  let frame = 0, lastFrame = 0;
  let visible = false;

  const palette = () => {
    const style = getComputedStyle(stage);
    // 直接读语义变量，避免继承 color 的样式刷新晚于主题属性写入。
    primary = style.getPropertyValue('--brand').trim() || getComputedStyle(canvas).color;
    secondary = style.getPropertyValue('--ink').trim() || style.color;
  };
  const draw = () => {
    if (!width || !height) return;
    projectExploreSurface(source, width, height, y, x, projected);
    context.clearRect(0, 0, width, height);
    for (let index = 0; index < projected.length; index += 4) {
      context.fillStyle = source[index + 3] > .92 ? secondary : primary;
      context.globalAlpha = projected[index + 2] * (source[index + 3] > .92 ? .3 : 1);
      const size = projected[index + 3];
      context.fillRect(projected[index], projected[index + 1], size, size);
    }
    context.globalAlpha = 1;
    host.dataset.dotReady = 'true';
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    host.dataset.dotState = visible && !document.hidden ? 'idle' : 'paused';
  };
  const tick = (now: number) => {
    frame = 0;
    if (!visible || document.hidden || reduced.matches || !finePointer.matches) {
      stop();
      return;
    }
    if (now - lastFrame < 1000 / 30) {
      frame = requestAnimationFrame(tick);
      return;
    }
    lastFrame = now;
    x += (targetX - x) * .22;
    y += (targetY - y) * .22;
    draw();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .0005) {
      host.dataset.dotState = 'moving';
      frame = requestAnimationFrame(tick);
    } else {
      stop();
    }
  };
  const wake = () => {
    if (!frame && visible && !document.hidden && !reduced.matches && finePointer.matches) {
      lastFrame = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    source = createExploreSurface(width < 600 ? 180 : 280, width < 600 ? 38 : 64);
    projected = new Float32Array(source.length);
    draw();
  };
  const reset = () => {
    stop();
    x = y = targetX = targetY = 0;
    palette();
    draw();
  };

  stage.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reduced.matches || !finePointer.matches) return;
    const rect = stage.getBoundingClientRect();
    targetX = (event.clientX - rect.left - rect.width / 2) / rect.width * .24;
    targetY = (event.clientY - rect.top - rect.height / 2) / rect.height * .16;
    wake();
  });
  stage.addEventListener('pointerleave', () => {
    targetX = targetY = 0;
    wake();
  });
  reduced.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  new MutationObserver(reset).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    reset();
  }).observe(stage);
  palette();
  resize();
}

export {};
