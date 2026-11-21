/**
 * 「光效拖尾」：指针划过时留下的一条流星尾迹。
 *
 * 与全站指针光晕（cursor-glow.ts）分开实现，也分开开关：
 *   - 光晕是停在指针周围的一团柔光，回答「指针在哪」；
 *   - 拖尾是刚过去的轨迹，回答「指针刚往哪走」，只在该动的时候出现。
 * 两者都只是装饰：不拦截事件、不改光标、不参与布局，减少动效与触屏下都不出现。
 *
 * 画法：一张固定在最上层的 canvas，按帧取最近 780ms 的采样点，
 * 用纯 2D 分段多层梯形柔光带（外晕 / 中柔光 / 核心亮带，不使用全屏 ctx.filter blur）
 * 沿路径渐细渐亮绘制，头部再叠一颗 28px 径向亮核；
 * 指针停下后尾迹自然淡完，帧循环随之停下，空闲时不占 CPU。
 */

import { trailEnabled, TRAIL_CHANGE } from './glow-pref';

type Point = { x: number; y: number; t: number };

/** 尾迹存活时间（ms）：拖得越长，划过之后那条「流星」留得越久 */
const AGE = 780;
/** 采样上限，避免长距离甩动时点数无限增长 */
const MAX_POINTS = 160;
/** 小于这个距离的移动只更新头部时间，不新增采样点 */
const MIN_STEP = 1.2;

/** 分段多层柔光带配置：宽度倍率与峰值透明度，避免每帧全屏 Gaussian Blur 的开销与兼容性问题 */
const BAND_LAYERS = [
  { widthScale: 2.8, alphaScale: 0.085 },
  { widthScale: 1.55, alphaScale: 0.22 },
  { widthScale: 0.9, alphaScale: 0.44 },
] as const;

const canvas = document.querySelector<HTMLCanvasElement>('[data-cursor-trail]');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  const root = document.documentElement;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let sized = false;
  let points: Point[] = [];
  let frame = 0;
  const enabled = (): boolean => !reduced.matches && !coarse.matches && trailEnabled();

  const readTint = (): string => {
    const raw = window.getComputedStyle(root).getPropertyValue('--brand-rgb').trim();
    if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(raw)) return raw;
    return root.dataset.theme === 'dark' ? '96, 165, 250' : '37, 99, 235';
  };
  let cachedTint = readTint();

  const clear = (): void => {
    if (ctx && width > 0 && height > 0) ctx.clearRect(0, 0, width, height);
    canvas.dataset.active = 'false';
    if (frame !== 0) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const ensureSized = (): void => {
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextW = window.innerWidth;
    const nextH = window.innerHeight;
    if (sized && nextW === width && nextH === height && nextDpr === dpr) return;
    dpr = nextDpr;
    width = nextW;
    height = nextH;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    sized = true;
  };

  const releaseCanvas = (): void => {
    points = [];
    clear();
    if (sized) {
      canvas.width = 0;
      canvas.height = 0;
      width = 0;
      height = 0;
      sized = false;
    }
  };

  const resize = (): void => {
    if (!enabled()) {
      releaseCanvas();
      return;
    }
    ensureSized();
    points = [];
    clear();
  };

  /** 沿路径进度 0..1 映射透明度曲线，无论直线还是画圈折返都沿路径方向平滑淡出 */
  const pathAlpha = (lifeVal: number): number => {
    if (lifeVal <= 0.12) return 0;
    return Math.pow(lifeVal, 2.1);
  };

  const draw = (now: number): void => {
    frame = 0;
    if (!ctx) return;

    // 只丢已经淡完的采样点；剩下一个点时也要画，否则「一帧一个点」的快扫
    // 会在每帧都把唯一那个点清掉，尾迹永远起不来。
    while (points.length > 0 && now - points[0].t > AGE) points.shift();

    if (!enabled() || points.length === 0) {
      points = [];
      clear();
      return;
    }

    ensureSized();
    if (width === 0 || height === 0) return;
    ctx.clearRect(0, 0, width, height);
    const rgb = cachedTint;
    const strength = root.dataset.theme === 'dark' ? 1.25 : 1;

    const lifeAt = (index: number): number => Math.max(0, 1 - (now - points[index].t) / AGE);
    const halfWidthAt = (lifeVal: number): number => (1 + 10.6 * Math.pow(lifeVal, 1.6)) / 2;

    if (points.length > 1) {
      const n = points.length;
      const lifes = new Array<number>(n);
      const normalsX = new Array<number>(n);
      const normalsY = new Array<number>(n);
      const baseHalves = new Array<number>(n);

      for (let i = 0; i < n; i++) {
        const l = lifeAt(i);
        lifes[i] = l;
        baseHalves[i] = halfWidthAt(l);
        const prev = points[Math.max(0, i - 1)];
        const next = points[Math.min(n - 1, i + 1)];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        normalsX[i] = -dy / len;
        normalsY[i] = dx / len;
      }

      // 分层分段绘制：每层用不同半宽倍率叠出柔和外晕，且每段按自身 life 着色，画圈折返不失真
      for (const layer of BAND_LAYERS) {
        for (let i = 0; i < n - 1; i++) {
          const midLife = (lifes[i] + lifes[i + 1]) * 0.5;
          const alpha = Math.min(1, pathAlpha(midLife) * layer.alphaScale * strength);
          if (alpha < 0.004) continue;

          const hw0 = baseHalves[i] * layer.widthScale;
          const hw1 = baseHalves[i + 1] * layer.widthScale;
          const p0 = points[i];
          const p1 = points[i + 1];

          ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p0.x + normalsX[i] * hw0, p0.y + normalsY[i] * hw0);
          ctx.lineTo(p1.x + normalsX[i + 1] * hw1, p1.y + normalsY[i + 1] * hw1);
          ctx.lineTo(p1.x - normalsX[i + 1] * hw1, p1.y - normalsY[i + 1] * hw1);
          ctx.lineTo(p0.x - normalsX[i] * hw0, p0.y - normalsY[i] * hw0);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // 头部亮核：一小团径向光，让尾迹有个「星」的头
    const head = points[points.length - 1];
    const headLife = Math.max(0, 1 - (now - head.t) / AGE);
    const core = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 28);
    core.addColorStop(0, `rgba(${rgb}, ${(0.66 * headLife).toFixed(3)})`);
    core.addColorStop(0.38, `rgba(${rgb}, ${(0.24 * headLife).toFixed(3)})`);
    core.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 28, 0, Math.PI * 2);
    ctx.fill();

    canvas.dataset.active = 'true';
    // 还有未淡完的采样点就继续下一帧；全都过期后自然停下（trim 会在下一帧把它们清空）
    frame = window.requestAnimationFrame(draw);
  };

  const schedule = (): void => {
    if (frame === 0) frame = window.requestAnimationFrame(draw);
  };

  if (enabled()) ensureSized();
  window.addEventListener('resize', resize, { passive: true });

  new MutationObserver(() => {
    cachedTint = readTint();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'style'] });

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse' || !enabled()) return;
      const now = performance.now();
      const last = points[points.length - 1];
      if (!last) {
        points.push({ x: event.clientX, y: event.clientY, t: now });
      } else {
        const dx = event.clientX - last.x;
        const dy = event.clientY - last.y;
        const distance = Math.hypot(dx, dy);
        if (distance < MIN_STEP) {
          last.t = now;
        } else {
          // 浏览器给的是离散采样：一步跨得太远就直接连线会看到一串「珠子」。
          // 按约 8px 一段插值补点，尾迹才是一条连续、渐细的流星。
          const steps = Math.min(24, Math.max(1, Math.ceil(distance / 8)));
          for (let i = 1; i <= steps; i++) {
            const ratio = i / steps;
            points.push({
              x: last.x + dx * ratio,
              y: last.y + dy * ratio,
              t: now - (steps - i) * 4,
            });
          }
          if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
        }
      }
      schedule();
    },
    { passive: true },
  );

  // 指针离开窗口、切到后台或改窗口大小：尾迹立刻收掉，不留一帧残影
  document.addEventListener('pointerleave', () => {
    points = [];
    clear();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      points = [];
      clear();
    }
  });

  // 面板里切换「光效拖尾」：关闭时释放画布；开启时按需分配
  document.addEventListener(TRAIL_CHANGE, () => {
    if (!enabled()) {
      releaseCanvas();
    } else {
      ensureSized();
    }
  });

  reduced.addEventListener('change', () => {
    if (!enabled()) releaseCanvas();
  });
}
