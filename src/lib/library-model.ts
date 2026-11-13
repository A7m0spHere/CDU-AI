// 依据成都大学图书馆实景概括的线稿模型，坐标用于交互展示，并非测绘数据。
// 建筑特征参考 https://lib.cdu.edu.cn/gk/bgjs.htm
type Point3 = readonly [number, number, number];
type Face = 'front' | 'right' | 'back' | 'left';
type Stroke = readonly Point3[];

interface ModelGroup {
  id: string;
  paths: Stroke[];
  width: number;
  opacity: number;
  face?: Face;
  clipped?: boolean;
}

export const libraryEntries = [
  { key: 'guide', yaw: 24 },
  { key: 'tools', yaw: 0 },
  { key: 'glossary', yaw: -24 },
] as const;
export const libraryInitialView = { yaw: 45, pitch: 9 };

const width = 11;
const depth = 9.4;
const height = 8.4;
const baseHeight = 1;
const floors = 8;
const opening = { left: 3.2, right: 7.8, top: 5.625 };
const insetAt = (z: number) => (height - z) * .045;
const level = (floor: number) => baseHeight + (height - baseHeight) * floor / floors;
const frontY = (z: number) => depth - insetAt(z);
const glassY = frontY(0) - .55;
const vestibule = { left: 4.05, right: 6.95, front: glassY + .3, height: 1.2 };
const line = (from: Point3, to: Point3): Stroke => [from, to];
const polygon = (points: Point3[]): Stroke => [...points, points[0]];
const portal = polygon([
  [opening.left, frontY(0), 0], [opening.right, frontY(0), 0],
  [opening.right, frontY(opening.top), opening.top], [opening.left, frontY(opening.top), opening.top],
]);

const groups: ModelGroup[] = [];
const add = (id: string, paths: Stroke[], strokeWidth: number, opacity: number, face?: Face, clipped = false) => {
  groups.push({ id, paths, width: strokeWidth, opacity, face, clipped });
};

add('site', [polygon([
  [-.7, -.7, -.14], [11.7, -.7, -.14], [11.7, 10.1, -.14], [-.7, 10.1, -.14],
])], 1, .2);

// 四个立面的分格使用相同构造，转动时只显示朝向观察者的立面。
let seed = 20260601;
const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (const face of ['front', 'right', 'back', 'left'] as const) {
  const span = face === 'front' || face === 'back' ? width : depth;
  const point = (u: number, z: number): Point3 => {
    const inset = insetAt(z);
    switch (face) {
      case 'front': return [u, depth - inset, z];
      case 'right': return [width - inset, depth - u, z];
      case 'back': return [width - u, inset, z];
      case 'left': return [inset, u, z];
    }
  };
  const ranges = (z: number): Array<readonly [number, number]> => {
    const inset = insetAt(z);
    return face === 'front' && z < opening.top - .01
      ? [[inset, opening.left], [opening.right, span - inset]]
      : [[inset, span - inset]];
  };
  const outline: Stroke[] = [
    line(point(insetAt(0), 0), point(0, height)),
    line(point(span - insetAt(0), 0), point(span, height)),
  ];
  for (const [from, to] of ranges(0)) outline.push(line(point(from, 0), point(to, 0)));

  const floorLines: Stroke[] = [];
  const bands: Stroke[] = [];
  const panels: Stroke[] = [];
  const baseGlass: Stroke[] = [];
  for (let floor = 0; floor <= floors; floor++) {
    const z = level(floor);
    for (const [from, to] of ranges(z)) floorLines.push(line(point(from, z), point(to, z)));
  }
  for (let floor = 0; floor < floors; floor++) {
    const bottom = level(floor);
    const floorHeight = level(floor + 1) - bottom;
    const bandZ = bottom + floorHeight * .72;
    for (const [from, to] of ranges(bandZ)) bands.push(line(point(from, bandZ), point(to, bandZ)));
    const z = bottom + floorHeight * .12;
    for (const [from, to] of ranges(z)) {
      for (let u = from + .5; u < to - 1.7; u += 2.3) {
        if (random() < .35) continue;
        const panelWidth = .75 + random() * .7;
        const panelHeight = floorHeight * (.3 + random() * .16);
        panels.push(polygon([
          point(u, z), point(u + panelWidth, z),
          point(u + panelWidth, z + panelHeight), point(u, z + panelHeight),
        ]));
      }
    }
  }
  for (const [from, to] of ranges(0)) {
    for (let u = from + .5; u < to - .3; u += .85) {
      baseGlass.push(line(point(u, 0), point(u, baseHeight)));
    }
    baseGlass.push(line(point(from, .55), point(to, .55)));
  }
  add(`${face}-panels`, panels, .75, .2, face);
  add(`${face}-base`, baseGlass, .85, .3, face);
  add(`${face}-floors`, floorLines, 1.1, .62, face);
  add(`${face}-bands`, bands, .9, .22, face);
  add(`${face}-outline`, outline, 1.5, .9, face);
  add(`${face}-roof-edge`, [line(point(0, height - .18), point(span, height - .18))], 1, .5, face);
}

const glassWall: Stroke[] = [polygon([
  [opening.left + .1, glassY, 0], [opening.right - .1, glassY, 0],
  [opening.right - .1, glassY, opening.top - .1], [opening.left + .1, glassY, opening.top - .1],
])];
for (let column = 1; column < 5; column++) {
  const x = opening.left + .1 + (opening.right - opening.left - .2) * column / 5;
  glassWall.push(line([x, glassY, 0], [x, glassY, opening.top - .1]));
}
for (let floor = 1; floor < 5; floor++) {
  const z = level(floor);
  glassWall.push(line([opening.left + .1, glassY, z], [opening.right - .1, glassY, z]));
}
// 两侧洞口墙同时建模，裁剪随视角更新。
const recess: Stroke[] = [polygon([
  [opening.left, frontY(0), 0], [opening.right, frontY(0), 0],
  [opening.right, glassY, 0], [opening.left, glassY, 0],
])];
for (const x of [opening.left, opening.right]) {
  recess.push(polygon([
    [x, frontY(0), 0], [x, frontY(opening.top), opening.top],
    [x, glassY, opening.top], [x, glassY, 0],
  ]));
}
add('recess', recess, 1, .45, 'front', true);
add('glass-wall', glassWall, 1, .5, 'front', true);
add('portal', [portal], 1.7, .92, 'front');

const canopy: Stroke[] = [polygon([
  [vestibule.left - .16, glassY, 1.32], [vestibule.right + .16, glassY, 1.32],
  [vestibule.right + .16, vestibule.front + .1, 1.32], [vestibule.left - .16, vestibule.front + .1, 1.32],
])];
for (const x of [vestibule.left, vestibule.right]) {
  canopy.push(polygon([
    [x, glassY, 0], [x, vestibule.front, 0],
    [x, vestibule.front, vestibule.height], [x, glassY, vestibule.height],
  ]));
}
canopy.push(line([vestibule.left, vestibule.front, 1.2], [vestibule.right, vestibule.front, 1.2]));
add('canopy', canopy, 1, .5, 'front');
add('steps', [
  line([vestibule.left - .55, vestibule.front + .2, 0], [vestibule.right + .55, vestibule.front + .2, 0]),
  line([vestibule.left - .75, vestibule.front + .46, -.06], [vestibule.right + .75, vestibule.front + .46, -.06]),
  line([vestibule.left - .55, vestibule.front + .2, 0], [vestibule.left - .75, vestibule.front + .46, -.06]),
  line([vestibule.right + .55, vestibule.front + .2, 0], [vestibule.right + .75, vestibule.front + .46, -.06]),
], .9, .42, 'front');

const roof: Stroke[] = [polygon([[0, 0, height], [width, 0, height], [width, depth, height], [0, depth, height]])];
for (const [inset, z] of [[0, height], [.34, height], [.32, height - .3]]) {
  roof.push(polygon([
    [3.3 + inset, 2.7 + inset, z], [7.7 - inset, 2.7 + inset, z],
    [7.7 - inset, 7 - inset, z], [3.3 + inset, 7 - inset, z],
  ]));
}
for (const x of [3.3, 7.7]) {
  for (const y of [2.7, 7]) {
    roof.push(line([x, y, height], [x + (x === 3.3 ? .32 : -.32), y + (y === 2.7 ? .32 : -.32), height - .3]));
  }
}
add('courtyard', roof, 1, .5);

function doorPaths(index: number, open: number): Stroke[] {
  const left = vestibule.left + .08 + index * .92;
  const right = left + .9;
  const y = vestibule.front + .02;
  const top = 1.04;
  const angle = open * Math.PI * .36;
  const paths: Stroke[] = [polygon([[left, y, 0], [right, y, 0], [right, y, top], [left, y, top]])];
  for (const [hinge, direction] of [[left, 1], [right, -1]]) {
    const point = (distance: number, z: number): Point3 => [
      hinge + direction * distance * Math.cos(angle), y + distance * Math.sin(angle), z,
    ];
    paths.push(
      polygon([point(0, 0), point(.45, 0), point(.45, top), point(0, top)]),
      line(point(.37, .43), point(.37, .65)),
      line(point(.04, .1), point(.41, .1)),
    );
  }
  return paths;
}

export function drawLibrary(yaw: number, pitch: number, doors: readonly number[] = [0, 0, 0]) {
  const radians = yaw * Math.PI / 180;
  const elevation = pitch * Math.PI / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const sinPitch = Math.sin(elevation);
  const cosPitch = Math.cos(elevation);
  // 提高俯角时适当收小模型，完整保留屋顶与台地。
  const extent = (Math.abs(sin) * width / 2 + Math.abs(cos) * depth / 2) * 56.6 * sinPitch + height / 2 * 38.5 * cosPitch;
  const zoom = Math.min(1, 245 / extent);
  const coordinate = ([x, y, z]: Point3) => {
    const dx = x - width / 2;
    const dy = y - depth / 2;
    return [
      500 + (dx * cos - dy * sin) * 56.6 * zoom,
      260 + ((dx * sin + dy * cos) * 56.6 * sinPitch - (z - height / 2) * 38.5 * cosPitch) * zoom,
    ].map(value => value.toFixed(1)).join(',');
  };
  const path = (points: Stroke) => points.map((point, index) => `${index ? 'L' : 'M'}${coordinate(point)}`).join('');
  const visible = { front: cos > .001, right: sin > .001, back: cos < -.001, left: sin < -.001 };
  const doorGroups = libraryEntries.map((entry, index): ModelGroup => ({
    id: `door-${entry.key}`, paths: doorPaths(index, doors[index]), face: 'front',
    width: 1.4 + doors[index] * 1.1, opacity: .65 + doors[index] * .35,
  }));
  return {
    portal: path(portal),
    groups: [...groups, ...doorGroups].map(group => ({
      ...group,
      visible: !group.face || visible[group.face],
      paths: group.paths.map(path),
    })),
  };
}
