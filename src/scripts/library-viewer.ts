import { drawLibrary, libraryEntries, libraryInitialView } from '../lib/library-model';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const root of document.querySelectorAll<HTMLElement>('[data-library]')) {
  const viewer = root.querySelector<HTMLElement>('[data-library-viewer]');
  const clip = root.querySelector<SVGPathElement>('[data-library-clip]');
  const stage = root.closest<HTMLElement>('[data-explore-stage]');
  const menu = stage?.querySelector<HTMLElement>('[data-flow-menu]');
  if (!viewer || !clip || !stage || !menu) continue;

  const groups = [...root.querySelectorAll<SVGGElement>('[data-library-group]')].map(element => ({
    element, paths: [...element.querySelectorAll<SVGPathElement>('path')],
  }));
  const links = [...stage.querySelectorAll<HTMLAnchorElement>('[data-library-entry]')];
  let yaw = libraryInitialView.yaw;
  let pitch = libraryInitialView.pitch;
  let doors = [0, 0, 0];
  let selected = -1;
  let frame = 0;
  let drag: {
    id: number;
    x: number;
    y: number;
    yaw: number;
    pitch: number;
    moved: boolean;
    touch: boolean;
  } | null = null;
  let transition: {
    start: number;
    yaw: number;
    pitch: number;
    doors: number[];
    targetYaw: number;
    targetPitch: number;
    targetDoors: number[];
  } | null = null;

  const render = () => {
    const drawing = drawLibrary(yaw, pitch, doors);
    clip.setAttribute('d', drawing.portal);
    drawing.groups.forEach((group, index) => {
      const { element, paths } = groups[index];
      element.setAttribute('visibility', group.visible ? 'visible' : 'hidden');
      element.setAttribute('stroke-width', String(group.width));
      element.setAttribute('opacity', String(group.opacity));
      group.paths.forEach((path, pathIndex) => paths[pathIndex].setAttribute('d', path));
    });
    root.dataset.libraryYaw = String(yaw);
    root.dataset.libraryPitch = String(pitch);
    root.dataset.libraryAnimating = String(transition !== null);
  };

  const tick = (now: number) => {
    frame = 0;
    if (transition) {
      const current = transition;
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - current.start) / 520);
      const eased = 1 - (1 - progress) ** 3;
      yaw = current.yaw + (current.targetYaw - current.yaw) * eased;
      pitch = current.pitch + (current.targetPitch - current.pitch) * eased;
      doors = current.doors.map((open, index) => open + (current.targetDoors[index] - open) * eased);
      if (progress === 1) transition = null;
    }
    render();
    if (transition) frame = requestAnimationFrame(tick);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const moveTo = (targetYaw: number, targetPitch: number) => {
    // 跨过 0° 时沿最短路径转动，快速切换入口从当前姿态继续。
    const difference = ((targetYaw - yaw) % 360 + 540) % 360 - 180;
    const targetDoors = libraryEntries.map((_, index) => Number(index === selected));
    transition = { start: performance.now(), yaw, pitch, doors: [...doors], targetYaw: yaw + difference, targetPitch, targetDoors };
    root.dataset.libraryAnimating = 'true';
    schedule();
  };
  const markSelection = (index: number) => {
    selected = index;
    root.dataset.librarySelected = libraryEntries[index]?.key ?? '';
    links.forEach(link => {
      link.dataset.librarySelected = String(link.dataset.libraryEntry === libraryEntries[index]?.key);
    });
  };
  const select = (key: string | undefined) => {
    const index = libraryEntries.findIndex(entry => entry.key === key);
    if (index < 0 || drag) return;
    markSelection(index);
    moveTo(libraryEntries[index].yaw, libraryInitialView.pitch);
  };
  const reset = () => {
    markSelection(-1);
    moveTo(libraryInitialView.yaw, libraryInitialView.pitch);
  };
  const isInteractiveTarget = (target: EventTarget | null) => target instanceof Node && (viewer.contains(target) || menu.contains(target));

  for (const region of [viewer, menu]) {
    region.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch' && !drag && !isInteractiveTarget(event.relatedTarget)) reset();
    });
    region.addEventListener('focusout', event => {
      if (!isInteractiveTarget(event.relatedTarget)) reset();
    });
  }

  links.forEach(link => {
    link.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') select(link.dataset.libraryEntry);
    });
    link.addEventListener('focus', () => select(link.dataset.libraryEntry));
    link.addEventListener('pointerdown', () => select(link.dataset.libraryEntry));
  });
  viewer.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    transition = null;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch, moved: false, touch: event.pointerType === 'touch' };
    viewer.setPointerCapture(event.pointerId);
    if (event.pointerType === 'mouse') viewer.focus({ preventScroll: true });
  });
  viewer.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (drag.touch && !drag.moved && Math.abs(dx) <= Math.abs(dy)) return;
    drag.moved = true;
    root.dataset.libraryDragging = 'true';
    // 同一手势在手机与桌面上转动相近角度，纵向触摸滚动由浏览器处理。
    const sensitivity = 240 / Math.max(viewer.clientWidth, 240);
    yaw = drag.yaw - dx * sensitivity;
    pitch = drag.touch ? drag.pitch : Math.max(5, Math.min(25, drag.pitch - dy * sensitivity * .3));
    schedule();
  });
  const endDrag = (event: PointerEvent) => {
    if (event.pointerId !== drag?.id) return;
    const touch = drag.touch;
    drag = null;
    root.dataset.libraryDragging = 'false';
    if (viewer.hasPointerCapture(event.pointerId)) viewer.releasePointerCapture(event.pointerId);
    // 捕获指针期间允许拖出模型，松手时按实际指针位置决定是否复位。
    if (!touch && !isInteractiveTarget(document.elementFromPoint(event.clientX, event.clientY))) {
      reset();
    } else {
      moveTo(yaw, pitch);
    }
  };
  viewer.addEventListener('pointerup', endDrag);
  viewer.addEventListener('pointercancel', endDrag);
  viewer.addEventListener('lostpointercapture', endDrag);
  viewer.addEventListener('dblclick', reset);
  viewer.addEventListener('keydown', event => {
    const yawStep = event.shiftKey ? 30 : 10;
    switch (event.key) {
      case 'ArrowLeft': moveTo(yaw + yawStep, pitch); break;
      case 'ArrowRight': moveTo(yaw - yawStep, pitch); break;
      case 'ArrowUp': moveTo(yaw, Math.min(25, pitch + 3)); break;
      case 'ArrowDown': moveTo(yaw, Math.max(5, pitch - 3)); break;
      case 'Home': reset(); break;
      default: return;
    }
    event.preventDefault();
  });
  reducedMotion.addEventListener('change', () => {
    if (transition) schedule();
  });
  // 切走窗口后结束当前手势，避免返回时仍处于拖动状态。
  window.addEventListener('blur', () => {
    if (drag) endDrag(new PointerEvent('pointercancel', { pointerId: drag.id }));
    reset();
  });

  viewer.setAttribute('role', 'group');
  viewer.setAttribute('aria-label', '可旋转的成都大学图书馆');
  viewer.setAttribute('aria-describedby', 'library-help');
  viewer.tabIndex = 0;
  render();
  root.dataset.libraryReady = 'true';
}
