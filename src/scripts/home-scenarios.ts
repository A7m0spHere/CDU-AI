// 每组卡片独立切换。触摸手势留给页面与横向展台，鼠标可以拖动换卡。
for (const group of document.querySelectorAll<HTMLElement>('[data-scenario-stack]')) {
  const cards = Array.from(group.querySelectorAll<HTMLElement>('[data-scenario-card]'));
  const next = group.querySelector<HTMLButtonElement>('[data-scenario-next]');
  const position = group.querySelector<HTMLElement>('[data-scenario-position]');
  const announcement = group.querySelector<HTMLElement>('[data-scenario-announcement]');
  if (cards.length < 2 || !next || !position || !announcement) continue;

  let active = 0;
  let drag: { card: HTMLElement; pointer: number; x: number; y: number; dx: number; captured: boolean } | null = null;

  const show = (index: number) => {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const depth = (i - active + cards.length) % cards.length;
      card.dataset.depth = String(depth);
      card.style.setProperty('--stack-depth', String(depth));
      card.inert = depth !== 0;
      if (depth === 0) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
    });
    position.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    announcement.textContent = `${cards[active].dataset.scenarioTitle}，第 ${active + 1} 张，共 ${cards.length} 张`;
  };

  const endDrag = (cancelled: boolean) => {
    if (!drag) return;
    const { card, pointer, dx } = drag;
    drag = null;
    card.classList.remove('is-dragging');
    card.style.removeProperty('--drag-x');
    card.style.removeProperty('--drag-y');
    card.style.removeProperty('--drag-angle');
    if (card.hasPointerCapture(pointer)) card.releasePointerCapture(pointer);
    if (!cancelled && Math.abs(dx) > Math.min(80, card.clientWidth * 0.22)) show(active + 1);
  };

  next.addEventListener('click', () => {
    endDrag(true);
    show(active + 1);
  });

  cards.forEach((card) => {
    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || card !== cards[active] || drag) return;
      drag = { card, pointer: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, captured: false };
      card.setPointerCapture(event.pointerId);
    });
    card.addEventListener('pointermove', (event) => {
      if (!drag || drag.card !== card || drag.pointer !== event.pointerId) return;
      drag.dx = event.clientX - drag.x;
      if (Math.abs(drag.dx) < 5 && !drag.captured) return;
      drag.captured = true;
      card.classList.add('is-dragging');
      card.style.setProperty('--drag-x', `${Math.max(-140, Math.min(140, drag.dx))}px`);
      card.style.setProperty('--drag-y', `${Math.max(-35, Math.min(35, event.clientY - drag.y))}px`);
      card.style.setProperty('--drag-angle', `${drag.dx * 0.035}deg`);
    });
    card.addEventListener('pointerup', () => endDrag(false));
    card.addEventListener('pointercancel', () => endDrag(true));
    card.addEventListener('lostpointercapture', () => endDrag(true));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') endDrag(true);
  });
  window.addEventListener('blur', () => endDrag(true));
  group.dataset.ready = 'true';
}

export {};
