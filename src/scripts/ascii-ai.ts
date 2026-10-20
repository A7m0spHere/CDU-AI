/**
 * 把「AI」渲染成 ASCII 字符画（轻量 Canvas 实现）。
 *
 * 参考了常见的 ASCII text 效果（文字采样成字符 + 波浪 / 指针交互），
 * 但没有引入 three.js / React：这里只用 2D canvas，体积约 3KB。
 *
 * 约束：
 * - 默认静态渲染，不阻塞首屏；初始化完成后才显示 canvas；
 * - prefers-reduced-motion 时不做动画；
 * - 主题切换时重新计算字符颜色；不监听 scroll；
 * - 无 JS 时由组件里的 fallback 显示普通「AI」字样。
 */

const CHARSET = ' .:-=+*#%@';
const MONO = '"Cascadia Code", "JetBrains Mono", Consolas, "SFMono-Regular", monospace';
const LIGHT_COLORS = ['#6f6f78', '#333338', '#0b0b0d'];
const DARK_COLORS = ['#9a9aa3', '#c9c9d0', '#fafafa'];
const TARGET_FPS = 24;

interface AsciiInstanceState {
  hosts: HTMLElement[];
  raf: number;
  lastFrame: number;
  reduced: MediaQueryList;
}

function setupHost(host: HTMLElement, state: AsciiInstanceState) {
  const canvas = host.querySelector<HTMLCanvasElement>('canvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return () => {};

  let width = 0;
  let height = 0;
  let cell = 8;
  let cols = 0;
  let rows = 0;
  let alpha: Float32Array | null = null;
  let gradient: CanvasGradient | null = null;
  let pointer = { x: 0, y: 0, active: false };

  const isDark = () => document.documentElement.dataset.theme === 'dark';

  const monoFont = (size: number) => `${Math.max(6, Math.round(size))}px ${MONO}`;

  const sampleText = () => {
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round(width));
    off.height = Math.max(1, Math.round(height));
    const octx = off.getContext('2d');
    if (!octx) return null;

    octx.clearRect(0, 0, off.width, off.height);
    octx.fillStyle = '#000';
    octx.textBaseline = 'alphabetic';

    let fontSize = off.height * 1.02;
    octx.font = `italic 700 ${fontSize}px Georgia, "Times New Roman", serif`;
    const measured = octx.measureText('AI').width;
    if (measured > off.width * 0.98) {
      fontSize *= (off.width * 0.98) / measured;
      octx.font = `italic 700 ${fontSize}px Georgia, "Times New Roman", serif`;
    }
    const textWidth = octx.measureText('AI').width;
    octx.fillText('AI', (off.width - textWidth) / 2, off.height * 0.84);
    return octx.getImageData(0, 0, off.width, off.height);
  };

  const build = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(24, Math.round(rect.width));
    height = Math.max(16, Math.round(rect.height));

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 字符行数决定「颗粒度」：约 20–24 行时 AI 字形清楚但不至于太密。
    rows = Math.max(12, Math.min(28, Math.round(height / 4.6)));
    cell = height / rows;
    cols = Math.ceil(width / cell) + 1;

    const source = sampleText();
    alpha = new Float32Array(cols * rows);
    if (source) {
      const sw = source.width;
      const sh = source.height;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const sx = Math.min(sw - 1, Math.floor((col / cols) * sw));
          const sy = Math.min(sh - 1, Math.floor((row / rows) * sh));
          alpha[row * cols + col] = source.data[(sy * sw + sx) * 4 + 3] / 255;
        }
      }
    }

    gradient = null;
  };

  const render = (time: number) => {
    if (!alpha) return;
    if (!gradient) {
      gradient = ctx.createLinearGradient(0, 0, width, 0);
      const colors = isDark() ? DARK_COLORS : LIGHT_COLORS;
      colors.forEach((color, index) => gradient!.addColorStop(index / (colors.length - 1), color));
    }

    ctx.clearRect(0, 0, width, height);
    ctx.font = monoFont(cell * 0.96);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = gradient;

    const moving = !state.reduced.matches;
    const waveAmp = moving ? 0.55 : 0;
    const waveTime = time * 0.0016;
    const offsetX = pointer.active ? pointer.x * cell * 1.4 : 0;
    const offsetY = pointer.active ? pointer.y * cell * 1.4 : 0;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const sourceRow =
          waveAmp === 0
            ? row
            : Math.min(rows - 1, Math.max(0, Math.round(row + Math.sin(waveTime + col * 0.28) * waveAmp)));
        const value = alpha[sourceRow * cols + col] ?? 0;
        if (value < 0.18) continue;
        // 把透明度向上映射，让字符更实，避免「AI」看起来太虚。
        const scaled = 0.2 + value * 0.8;
        const char = CHARSET[Math.min(CHARSET.length - 1, Math.floor(scaled * CHARSET.length))];
        if (char === ' ') continue;
        ctx.fillText(char, col * cell + cell / 2 + offsetX, row * cell + offsetY);
      }
    }
  };

  const startAnimation = () => {
    cancelAnimationFrame(state.raf);
    const loop = (time: number) => {
      if (document.hidden) {
        state.raf = requestAnimationFrame(loop);
        return;
      }
      if (time - state.lastFrame >= 1000 / TARGET_FPS) {
        state.lastFrame = time;
        render(time);
      }
      state.raf = requestAnimationFrame(loop);
    };
    state.lastFrame = 0;
    state.raf = requestAnimationFrame(loop);
  };

  const drawStatic = () => {
    cancelAnimationFrame(state.raf);
    render(0);
  };

  const refresh = () => {
    build();
    gradient = null;
    if (state.reduced.matches) drawStatic();
    else startAnimation();
    host.classList.add('is-ready');
  };

  refresh();

  const resizeObserver = new ResizeObserver(() => refresh());
  resizeObserver.observe(host);

  const onPointerMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
      active: true,
    };
  };
  const onPointerLeave = () => {
    pointer = { x: 0, y: 0, active: false };
  };
  host.addEventListener('pointermove', onPointerMove);
  host.addEventListener('pointerleave', onPointerLeave);

  const themeObserver = new MutationObserver(() => {
    gradient = null;
    if (state.reduced.matches) drawStatic();
    else startAnimation();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const onMotionChange = () => {
    if (state.reduced.matches) drawStatic();
    else startAnimation();
  };
  state.reduced.addEventListener('change', onMotionChange);

  return () => {
    cancelAnimationFrame(state.raf);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    state.reduced.removeEventListener('change', onMotionChange);
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerleave', onPointerLeave);
  };
}

const hosts = Array.from(document.querySelectorAll<HTMLElement>('[data-ascii-ai]'));
if (hosts.length > 0) {
  const state = {
    hosts,
    raf: 0,
    lastFrame: 0,
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
  };
  for (const host of hosts) setupHost(host, state);
}
