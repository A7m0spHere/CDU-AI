/**
 * 「光效拖尾」：指针划过时留下的一条流星尾迹。
 *
 * 与全站指针光晕（cursor-glow.ts）分开实现，也分开开关：
 *   - 光晕是停在指针周围的一团柔光，回答「指针在哪」；
 *   - 拖尾是刚过去的轨迹，回答「指针刚往哪走」，只在该动的时候出现。
 * 两者都只是装饰：不拦截事件、不改光标、不参与布局，减少动效与触屏下都不出现。
 *
 * 画法：一张固定在最上层的 canvas，按帧取最近 420ms 的采样点，
 * 由旧到新画一串渐细渐亮的线段，头部再叠一颗亮核；
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

const canvas = document.querySelector<HTMLCanvasElement>('[data-cursor-trail]');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  const root = document.documentElement;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let points: Point[] = [];
  let frame = 0;
  const enabled = (): boolean => !reduced.matches && !coarse.matches && trailEnabled();

  /** 深浅主题各取一档蓝：浅色底上用深一点的品牌蓝才看得出来 */
  const tint = (): string => (root.dataset.theme === 'dark' ? '150, 190, 255' : '81, 111, 227');

  const clear = (): void => {
    if (ctx) ctx.clearRect(0, 0, width, height);
    canvas.dataset.active = 'false';
  };

  const resize = (): void => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    clear();
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

    ctx.clearRect(0, 0, width, height);
    const rgb = tint();

    // 尾迹画成一条「渐变宽度的带」，而不是逐段描线：
    // 逐段 stroke 时相邻线段的圆头会互相叠加，尾巴上会出现一串珠子；
    // 一次 fill 出来的带子才是连续、平滑、越靠近头越粗的流星。
    const life = (index: number): number => {
      const point = points[index];
      return Math.max(0, 1 - (now - point.t) / AGE);
    };
    const halfWidth = (index: number): number => (1 + 10.6 * Math.pow(life(index), 1.6)) / 2;

    if (points.length > 1) {
      const left: Point[] = [];
      const right: Point[] = [];
      for (let i = 0; i < points.length; i++) {
        const prev = points[Math.max(0, i - 1)];
        const next = points[Math.min(points.length - 1, i + 1)];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const length = Math.hypot(dx, dy) || 1;
        // 法线方向：把宽度摊在轨迹两侧
        const nx = (-dy / length) * halfWidth(i);
        const ny = (dx / length) * halfWidth(i);
        left.push({ x: points[i].x + nx, y: points[i].y + ny, t: points[i].t });
        right.push({ x: points[i].x - nx, y: points[i].y - ny, t: points[i].t });
      }

      const tail = points[0];
      const head = points[points.length - 1];
      const ribbon = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      // 尾巴彻底透明、越靠头越实：远看只有后半截亮着，才像一颗掠过的流星。
      // 深色底上 screen 混合看起来会淡一档，浓度乘 1.3 补回来。
      const strength = root.dataset.theme === 'dark' ? 1.3 : 1;
      const stop = (at: number, alpha: number): void => {
        ribbon.addColorStop(at, 'rgba(' + rgb + ', ' + (alpha * strength).toFixed(3) + ')');
      };
      stop(0, 0);
      stop(0.45, 0.05);
      stop(0.7, 0.24);
      stop(0.88, 0.46);
      stop(1, 0.62);

      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x, left[i].y);
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
      ctx.closePath();

      // 先糊一层同样的形状当外发光，再叠清晰的那一条：
      // 单靠一条实心带子会读成「画上去的线」，外面有一圈晕才像光
      ctx.save();
      ctx.filter = 'blur(7px)';
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = ribbon;
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = ribbon;
      ctx.fill();
    }

    // 头部亮核：一小团径向光，让尾迹有个「星」的头
    const head = points[points.length - 1];
    const headLife = Math.max(0, 1 - (now - head.t) / AGE);
    const core = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 28);
    core.addColorStop(0, 'rgba(' + rgb + ', ' + (0.66 * headLife).toFixed(3) + ')');
    core.addColorStop(0.38, 'rgba(' + rgb + ', ' + (0.24 * headLife).toFixed(3) + ')');
    core.addColorStop(1, 'rgba(' + rgb + ', 0)');
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

  resize();
  window.addEventListener('resize', resize, { passive: true });

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

  // 面板里关掉「光效拖尾」：正在画的尾迹立刻擦掉
  document.addEventListener(TRAIL_CHANGE, () => {
    if (!trailEnabled()) {
      points = [];
      clear();
    }
  });

  reduced.addEventListener('change', () => {
    points = [];
    clear();
  });
}
