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

/** 尾迹存活时间（ms） */
const AGE = 420;
/** 采样上限，避免长距离甩动时点数无限增长 */
const MAX_POINTS = 64;
/** 小于这个距离的移动只更新头部时间，不新增采样点 */
const MIN_STEP = 1.5;

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
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 尾迹：越靠近头部越亮、越粗，越靠尾部越淡、越细
    for (let i = 1; i < points.length; i++) {
      const from = points[i - 1];
      const to = points[i];
      const life = 1 - (now - to.t) / AGE;
      if (life <= 0) continue;
      const alpha = Math.pow(life, 1.6) * 0.62;
      ctx.strokeStyle = 'rgba(' + rgb + ', ' + alpha.toFixed(3) + ')';
      ctx.lineWidth = 0.9 + 3.1 * life;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }

    // 头部亮核：一小团径向光，让尾迹有个「星」的头
    const head = points[points.length - 1];
    const headLife = Math.max(0, 1 - (now - head.t) / AGE);
    const core = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 22);
    core.addColorStop(0, 'rgba(' + rgb + ', ' + (0.62 * headLife).toFixed(3) + ')');
    core.addColorStop(0.4, 'rgba(' + rgb + ', ' + (0.2 * headLife).toFixed(3) + ')');
    core.addColorStop(1, 'rgba(' + rgb + ', 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 22, 0, Math.PI * 2);
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
      if (last && Math.hypot(event.clientX - last.x, event.clientY - last.y) < MIN_STEP) {
        last.t = now;
      } else {
        points.push({ x: event.clientX, y: event.clientY, t: now });
        if (points.length > MAX_POINTS) points.shift();
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
