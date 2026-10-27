// 采样扭转曲面；同一份几何用于静态 SVG 与浏览器 Canvas。
export function createExploreSurface(columns: number, rows: number): Float32Array {
  const points = new Float32Array(columns * rows * 4);
  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < rows; row++) {
      const noise = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
      const grain = noise - Math.floor(noise);
      const u = ((column + grain * .45) / columns) * Math.PI * 2;
      const v = ((row + .5 + (grain - .5) * .4) / rows * 2 - 1) * .62;
      const radius = 1.02 + v * Math.cos(u / 2);
      const index = (column * rows + row) * 4;
      points[index] = radius * Math.cos(u);
      points[index + 1] = v * Math.sin(u / 2) * .92 + Math.sin(u * 3) * .08;
      points[index + 2] = radius * Math.sin(u);
      points[index + 3] = grain;
    }
  }
  return points;
}

export function projectExploreSurface(
  points: Float32Array,
  width: number,
  height: number,
  tiltX = 0,
  tiltY = 0,
  target: Float32Array = new Float32Array(points.length),
): Float32Array {
  const ax = .9 + tiltX, ay = .4 + tiltY, az = -.2;
  const cx = Math.cos(ax), sx = Math.sin(ax);
  const cy = Math.cos(ay), sy = Math.sin(ay);
  const cz = Math.cos(az), sz = Math.sin(az);
  for (let index = 0; index < points.length; index += 4) {
    const x = points[index], y = points[index + 1], z = points[index + 2];
    const rx = x * cy + z * sy;
    const rz = -x * sy + z * cy;
    const ry = y * cx - rz * sx;
    const depth = y * sx + rz * cx;
    const perspective = 4.8 / (4.8 + depth);
    const near = Math.max(0, Math.min(1, (1.5 - depth) / 3));
    const grain = points[index + 3];
    target[index] = width * .5 + (rx * cz - ry * sz) * perspective * width * .27;
    target[index + 1] = height * .44 + (rx * sz + ry * cz) * perspective * height * .27;
    target[index + 2] = (.22 + near * .7) * (.5 + grain * .5);
    target[index + 3] = .65 + near * .75 + grain * .3;
  }
  return target;
}
