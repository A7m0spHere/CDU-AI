const GLYPHS = '.:;+=*#%@';
const CELL_SIZE = 6;
const FRAME_INTERVAL = 1000 / 24;

interface Star {
  x: number;
  y: number;
  seed: number;
}

interface SurfacePoint extends Star {
  nx: number;
  ny: number;
  nz: number;
  light: number;
  rim: number;
}

function noise(column: number, row: number): number {
  const sample = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

function samplePlanet(width: number, height: number) {
  const surface: SurfacePoint[] = [];
  const stars: Star[] = [];
  const radius = Math.min(width * 0.38, height * 0.457);
  const centerX = width * 0.62;
  const centerY = height * 0.50;

  for (let row = 1; row * CELL_SIZE < height - CELL_SIZE; row += 1) {
    for (let column = 1; column * CELL_SIZE < width - CELL_SIZE; column += 1) {
      const x = column * CELL_SIZE;
      const y = row * CELL_SIZE;
      const seed = noise(column, row);
      const nx = (x - centerX) / radius;
      const ny = (y - centerY) / radius;
      const distanceSquared = nx * nx + ny * ny;
      if (distanceSquared >= 1) {
        if (seed < 0.012) stars.push({ x, y, seed });
        continue;
      }

      const nz = Math.sqrt(1 - distanceSquared);
      const sideLight = nx * 0.64 - ny * 0.71;
      const light = Math.max(0, sideLight + nz * 0.27 - 0.12);
      const rim = Math.pow(distanceSquared, 9) * Math.max(0, sideLight);
      if (light > 0.04 || rim > 0.03) {
        surface.push({ x, y, seed, nx, ny, nz, light, rim });
      }
    }
  }

  return { surface, stars };
}

function setupPlanet(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let pixelRatio = 0;
  let particles = samplePlanet(0, 0);
  let surfaceColor = '';
  let rimColor = '';
  let opacity = 0;
  let onScreen = false;
  let animationFrame = 0;
  let lastFrame = 0;

  const render = (time: number) => {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    context.font = '7.5px ui-monospace, monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillStyle = rimColor;
    for (const star of particles.stars) {
      const phase = star.seed * 440;
      context.globalAlpha = opacity * (0.16 + 0.07 * Math.sin(time * 0.9 + phase));
      context.fillText(star.seed < 0.0025 ? '+' : '.', star.x, star.y);
    }

    // Rotate the surface pattern while the light and the atmospheric rim stay fixed.
    const angle = time * 0.085;
    const sine = Math.sin(angle);
    const cosine = Math.cos(angle);
    for (const point of particles.surface) {
      const longitude = point.nx * cosine + point.nz * sine;
      const depth = point.nz * cosine - point.nx * sine;
      const warp = Math.sin(longitude * 7 - point.ny * 5 + depth * 3)
        + 0.55 * Math.sin(longitude * 15 + point.ny * 9 - depth * 8);
      const clouds = 0.5 + 0.5 * Math.sin(longitude * 11 + point.ny * 18 + warp * 2.3);
      const brightness = Math.min(1, point.light * (0.22 + clouds * 0.88) + point.rim * 0.94);
      if (brightness < 0.08 || point.seed > 0.21 + brightness * 0.76) continue;

      const glyph = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(brightness * GLYPHS.length))];
      const flicker = 0.86 + 0.14 * Math.sin(time * 2.2 + point.seed * 46);
      context.fillStyle = point.rim > 0.14 ? rimColor : surfaceColor;
      context.globalAlpha = opacity * (0.25 + brightness * 0.75) * flicker;
      context.fillText(glyph, point.x, point.y);
    }

    context.globalAlpha = 1;
  };

  const tick = (time: number) => {
    if (time - lastFrame >= FRAME_INTERVAL) {
      render(time / 1000);
      lastFrame = time;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  const syncAnimation = () => {
    if (onScreen && width > 0 && height > 0 && !document.hidden && !reducedMotion.matches) {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  };

  const redraw = () => {
    if (!width || !height) return;
    const style = getComputedStyle(canvas);
    surfaceColor = style.getPropertyValue('--particle-surface').trim();
    rimColor = style.getPropertyValue('--particle-rim').trim();
    opacity = Number(style.getPropertyValue('--particle-opacity'));
    render(reducedMotion.matches ? 0 : performance.now() / 1000);
  };

  const resize = () => {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    const nextPixelRatio = Math.min(2, window.devicePixelRatio || 1);
    if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextPixelRatio;
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particles = samplePlanet(width, height);
    redraw();
    syncAnimation();
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    syncAnimation();
  }).observe(canvas);
  new MutationObserver(redraw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'style'],
  });
  reducedMotion.addEventListener('change', () => {
    redraw();
    syncAnimation();
  });
  document.addEventListener('visibilitychange', syncAnimation);
  resize();
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-challenge-ascii-planet]');
if (canvas) setupPlanet(canvas);
