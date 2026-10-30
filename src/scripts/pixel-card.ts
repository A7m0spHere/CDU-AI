/**
 * 首页 Hero 左侧卡片的像素效果。
 *
 * 两层叠加：
 * 1. 底层（最初的行为）：指针进入卡片后，整片像素从卡片中心向外依次出现并持续闪烁，
 *    离开时逐个缩小熄灭；
 * 2. 指针层：指针附近的点被额外放大、提亮并向品牌蓝的中心色靠拢，同时铺一层很淡的光晕。
 *
 * 纯 Canvas 2D + TS，不引入三方库。
 * 降级：prefers-reduced-motion: reduce 完全不启用；触屏按下亮一瞬后整片熄灭；键盘 focus 在中心亮起。
 */

import { GLOW_CHANGE, glowEnabled } from './glow-pref';

type Rgb = readonly [number, number, number];

const DEFAULTS = {
  /** 点阵间距（CSS px），与最初版本一致 */
  gap: 10,
  /** 指针光晕半径：影响半径内的点 */
  radius: 96,
  /** 指针跟随缓动，越小越"拖尾" */
  follow: 0.3,
  /** 指针强度淡入淡出 */
  fade: 0.18,
  /** 触屏脉冲持续时间 */
  pulse: 720,
};

/** 底层点阵的底色（保持最初的"多色随机"质感，收敛到品牌蓝的同族色） */
const BASE: Record<'light' | 'dark', readonly string[]> = {
  light: ['#a3b0e9', '#8b9ce1', '#c9d2f6', '#b3bfec'],
  dark: ['#6d84e0', '#8ea3f0', '#5468bf', '#7b87ad'],
};

/** 指针附近的中心色：由边缘蓝过渡到中心亮蓝 */
const PALETTE: Record<'light' | 'dark', { core: Rgb; mid: Rgb; edge: Rgb }> = {
  // 统一用 #516fe3（维护者从参考图取的蓝）；浅色卡片上中心加深一档以免发灰
  light: { core: [63, 86, 214], mid: [81, 111, 227], edge: [129, 155, 242] },
  // 深色卡片中心提亮到浅蓝，边缘回落到同一个蓝
  dark: { core: [163, 183, 255], mid: [81, 111, 227], edge: [61, 84, 190] },
};

const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const mix = (from: Rgb, to: Rgb, t: number): Rgb => [
  Math.round(from[0] + (to[0] - from[0]) * t),
  Math.round(from[1] + (to[1] - from[1]) * t),
  Math.round(from[2] + (to[2] - from[2]) * t),
];

/** 边缘 → 中间 → 中心，两段插值，避免中心直接跳到纯白显得脏 */
const shade = (palette: { core: Rgb; mid: Rgb; edge: Rgb }, t: number): Rgb =>
  t < 0.55 ? mix(palette.edge, palette.mid, t / 0.55) : mix(palette.mid, palette.core, (t - 0.55) / 0.45);

/** 单个像素的状态机，行为与最初的版本一致：从 0 长到 maxSize，之后在区间内闪烁 */
class Pixel {
  size = 0;
  counter = 0;
  isShimmer = false;
  isReverse = false;
  isIdle = false;
  readonly minSize = 0.5;
  readonly maxSize: number;
  readonly speed: number;
  readonly sizeStep: number;
  readonly counterStep: number;
  readonly delay: number;

  constructor(
    readonly x: number,
    readonly y: number,
    readonly color: string,
    speed: number,
    delay: number,
    width: number,
    height: number,
  ) {
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.delay = delay;
    this.maxSize = Math.random() * 1.5 + 0.5;
    this.sizeStep = Math.random() * 0.4;
    this.counterStep = Math.random() * 4 + (width + height) * 0.01;
  }

  /** 推进一帧；返回这一帧是否该画出来 */
  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return false;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) {
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;
      this.size += this.isReverse ? -this.speed : this.speed;
    } else {
      this.size += this.sizeStep;
    }
    return true;
  }

  /** 脱离时逐帧缩小；返回是否还有残余尺寸 */
  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.size = 0;
      this.isIdle = true;
      return false;
    }
    this.size -= 0.12;
    return this.size > 0;
  }
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const host of document.querySelectorAll<HTMLElement>('[data-hero-pixels]')) {
  const canvas = host.querySelector<HTMLCanvasElement>('.home-hero__pixels');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) continue;

  let width = 0;
  let height = 0;
  let pixels: Pixel[] = [];

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let intensity = 0;
  let goal = 0;
  let mode: 'appear' | 'disappear' = 'disappear';
  let frame = 0;
  let lastFrame = 0;
  let pulseTimer: ReturnType<typeof setTimeout> | undefined;

  const palette = () => (document.documentElement.dataset.theme === 'dark' ? PALETTE.dark : PALETTE.light);
  const baseColors = () => (document.documentElement.dataset.theme === 'dark' ? BASE.dark : BASE.light);

  const layout = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));

    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const colors = baseColors();
    const next: Pixel[] = [];
    for (let x = 0; x < width; x += DEFAULTS.gap) {
      for (let y = 0; y < height; y += DEFAULTS.gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - width / 2;
        const dy = y - height / 2;
        // 与最初一致：离中心越远出现得越晚，形成从中心向外扩散的感觉
        next.push(new Pixel(x + DEFAULTS.gap / 2, y + DEFAULTS.gap / 2, color, 0.025, Math.hypot(dx, dy), width, height));
      }
    }
    pixels = next;
    ctx.clearRect(0, 0, width, height);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    if (pixels.length === 0) return;

    const appearing = mode === 'appear';
    const tones = palette();
    const radius = DEFAULTS.radius;
    const radiusSq = radius * radius;
    const pointerOn = intensity > 0.004;

    // 指针光晕：只铺在半径内，让点与点之间也带一点光
    if (pointerOn) {
      const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      halo.addColorStop(0, rgba(tones.mid, 0.3 * intensity));
      halo.addColorStop(0.5, rgba(tones.edge, 0.1 * intensity));
      halo.addColorStop(1, rgba(tones.edge, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    let alive = false;
    for (const pixel of pixels) {
      const visible = appearing ? pixel.appear() : pixel.disappear();
      if (!alive && (!pixel.isIdle || appearing)) alive = true;
      if (!visible) continue;

      let size = pixel.size;
      let color = pixel.color;

      if (pointerOn) {
        const dx = pixel.x - pointer.x;
        const dy = pixel.y - pointer.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < radiusSq) {
          // 平方衰减：中心集中、边缘快速回落
          const t = 1 - Math.sqrt(distanceSq) / radius;
          const t2 = t * t;
          size *= 1 + 2.4 * t2;
          color = rgba(shade(tones, 0.2 + 0.8 * t2), 1);
        }
      }

      ctx.fillStyle = color;
      ctx.fillRect(pixel.x - size / 2, pixel.y - size / 2, size, size);
    }

    return alive;
  };

  const tick = (now: number) => {
    frame = 0;
    if (document.hidden) return;
    if (lastFrame && now - lastFrame < 1000 / 60 - 1) {
      frame = requestAnimationFrame(tick);
      return;
    }
    lastFrame = now;

    pointer.x += (target.x - pointer.x) * DEFAULTS.follow;
    pointer.y += (target.y - pointer.y) * DEFAULTS.follow;
    intensity += (goal - intensity) * DEFAULTS.fade;
    if (Math.abs(goal - intensity) < 0.004) intensity = goal;

    const alive = draw();
    const settled = !alive && Math.abs(target.x - pointer.x) + Math.abs(target.y - pointer.y) < 0.3 && intensity === goal;
    if (!settled) frame = requestAnimationFrame(tick);
    else lastFrame = 0;
  };

  const wake = () => {
    if (frame || reduced.matches || document.hidden) return;
    lastFrame = 0;
    frame = requestAnimationFrame(tick);
  };

  const pointTo = (clientX: number, clientY: number, snap = false) => {
    const rect = host.getBoundingClientRect();
    target.x = clientX - rect.left;
    target.y = clientY - rect.top;
    if (snap) {
      pointer.x = target.x;
      pointer.y = target.y;
    }
  };

  const reveal = (clientX?: number, clientY?: number) => {
    mode = 'appear';
    goal = 1;
    if (typeof clientX === 'number' && typeof clientY === 'number') pointTo(clientX, clientY, true);
    wake();
  };

  const hide = () => {
    mode = 'disappear';
    goal = 0;
    wake();
  };

  host.addEventListener('pointerenter', (event) => {
    if (reduced.matches || event.pointerType === 'touch' || !glowEnabled()) return;
    // 从边缘进来时直接落到指针处，否则光晕会从上次的位置飞过来
    reveal(event.clientX, event.clientY);
  });

  host.addEventListener('pointermove', (event) => {
    if (reduced.matches || event.pointerType === 'touch' || !glowEnabled()) return;
    pointTo(event.clientX, event.clientY);
    if (mode !== 'appear') reveal();
    else wake();
  });

  host.addEventListener('pointerleave', hide);

  // 触屏：按下处亮一下再整片熄灭，不做跟随
  host.addEventListener('pointerdown', (event) => {
    if (reduced.matches || event.pointerType !== 'touch' || !glowEnabled()) return;
    reveal(event.clientX, event.clientY);
    clearTimeout(pulseTimer);
    pulseTimer = setTimeout(hide, DEFAULTS.pulse);
  });

  // 键盘：聚焦到卡片（例如「开始学习」按钮）时在中心亮起
  host.addEventListener('focusin', () => {
    if (reduced.matches || !glowEnabled()) return;
    target.x = pointer.x = width / 2;
    target.y = pointer.y = height / 2;
    mode = 'appear';
    goal = 1;
    wake();
  });

  host.addEventListener('focusout', (event) => {
    if (host.contains(event.relatedTarget as Node | null)) return;
    hide();
  });

  new ResizeObserver(() => {
    layout();
    if (!frame) {
      mode = 'disappear';
      draw();
    }
  }).observe(host);

  new MutationObserver(() => {
    // 主题切换后底色与中心色都变了，重建点阵并重画一帧
    layout();
    if (!frame) {
      mode = 'disappear';
      draw();
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const onMotionChange = () => {
    if (!reduced.matches) return;
    clearTimeout(pulseTimer);
    cancelAnimationFrame(frame);
    frame = 0;
    intensity = 0;
    goal = 0;
    mode = 'disappear';
    pixels = [];
    layout();
    ctx.clearRect(0, 0, width, height);
  };
  reduced.addEventListener('change', onMotionChange);

  document.addEventListener(GLOW_CHANGE, (event) => {
    if ((event as CustomEvent<{ enabled: boolean }>).detail.enabled) return;
    hide();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
  });

  layout();
}