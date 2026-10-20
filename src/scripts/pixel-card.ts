/**
 * 首页 Hero 左侧卡片的像素粒子效果。
 * 参考 PixelCard 思路（hover / focus 时像素从中心向外出现并轻微闪烁），
 * 用纯 Canvas + TS 重写，不引入 React；减少动效时完全禁用。
 */

const DEFAULTS = {
  gap: 10,
  speed: 0.025,
  light: ['#7dd3fc', '#38bdf8', '#bae6fd', '#cbd5e1'],
  dark: ['#38bdf8', '#60a5fa', '#7dd3fc', '#475569'],
};

class Pixel {
  x: number;
  y: number;
  color: string;
  speed: number;
  delay: number;
  size = 0;
  sizeStep = Math.random() * 0.4;
  minSize = 0.5;
  maxSize: number;
  counter = 0;
  counterStep: number;
  isIdle = false;
  isReverse = false;
  isShimmer = false;

  constructor(x: number, y: number, color: string, speed: number, delay: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.delay = delay;
    this.maxSize = Math.random() * 1.5 + 0.5;
    this.counterStep = Math.random() * 4 + (width + height) * 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const centerOffset = 1 - this.size * 0.5;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear(ctx: CanvasRenderingContext2D) {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) this.shimmer();
    else this.size += this.sizeStep;
    this.draw(ctx);
  }

  disappear(ctx: CanvasRenderingContext2D) {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size -= 0.12;
    this.draw(ctx);
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    this.size += this.isReverse ? -this.speed : this.speed;
  }
}

const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-pixels]'));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const card of cards) {
  const canvas = card.querySelector<HTMLCanvasElement>('.home-hero__pixels');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) continue;

  let pixels: Pixel[] = [];
  let animationId = 0;
  let lastFrame = 0;
  let width = 0;
  let height = 0;
  let dirty = true;

  const colors = () =>
    document.documentElement.dataset.theme === 'dark' ? DEFAULTS.dark : DEFAULTS.light;

  const initPixels = () => {
    const rect = card.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette = colors();
    const next: Pixel[] = [];
    for (let x = 0; x < width; x += DEFAULTS.gap) {
      for (let y = 0; y < height; y += DEFAULTS.gap) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        next.push(new Pixel(x, y, color, DEFAULTS.speed, distance, width, height));
      }
    }
    pixels = next;
    dirty = false;
    ctx.clearRect(0, 0, width, height);
  };

  const run = (mode: 'appear' | 'disappear') => {
    if (reducedMotion.matches) return;
    if (dirty || pixels.length === 0) initPixels();
    cancelAnimationFrame(animationId);
    lastFrame = 0;

    const frame = (now: number) => {
      animationId = requestAnimationFrame(frame);
      if (document.hidden) return;
      const interval = 1000 / 60;
      if (now - lastFrame < interval) return;
      lastFrame = now - ((now - lastFrame) % interval);

      ctx.clearRect(0, 0, width, height);
      let allIdle = true;
      for (const pixel of pixels) {
        if (mode === 'appear') pixel.appear(ctx);
        else pixel.disappear(ctx);
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle) cancelAnimationFrame(animationId);
    };

    animationId = requestAnimationFrame(frame);
  };

  card.addEventListener('pointerenter', () => run('appear'));
  card.addEventListener('pointerleave', () => run('disappear'));
  card.addEventListener('focusin', () => run('appear'));
  card.addEventListener('focusout', (event) => {
    if (!card.contains(event.relatedTarget as Node | null)) run('disappear');
  });

  new ResizeObserver(() => {
    dirty = true;
    if (!reducedMotion.matches) {
      // 尺寸变化时重置画布，避免坐标错位
      cancelAnimationFrame(animationId);
      initPixels();
    }
  }).observe(card);

  new MutationObserver(() => {
    dirty = true;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  reducedMotion.addEventListener('change', () => {
    cancelAnimationFrame(animationId);
    if (reducedMotion.matches) {
      ctx.clearRect(0, 0, width, height);
    }
    dirty = true;
  });
}

export {};
