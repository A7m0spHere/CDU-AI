function fillGeometry(rect: DOMRect, container: DOMRect) {
  return {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate(${rect.left - container.left}px, ${rect.top - container.top}px)`,
  };
}

function setupChapterNavigation(nav: HTMLElement) {
  const items = nav.querySelector<HTMLElement>('.challenge-jumps__items');
  const fill = nav.querySelector<HTMLElement>('.challenge-jumps__fill');
  if (!items || !fill) return;

  const chapters = Array.from(items.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')).flatMap((link) => {
    const section = document.getElementById(link.hash.slice(1));
    return section ? [{ link, section }] : [];
  });
  if (!chapters.length) return;

  const header = document.querySelector<HTMLElement>('.site-header');
  const mobile = window.matchMedia('(max-width: 820px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active: typeof chapters[number] | undefined;
  let hovered: HTMLAnchorElement | undefined;
  let focused: HTMLAnchorElement | undefined;
  let fillTarget: HTMLAnchorElement | undefined;
  let fillAnimation: Animation | undefined;
  let scrollFrame = 0;

  const updateFill = (pointer?: PointerEvent, reposition = false) => {
    const target = hovered ?? focused ?? active?.link;
    if (target === fillTarget && !pointer && !reposition) return;

    const previous = fillTarget ? fill.getBoundingClientRect() : undefined;
    fillAnimation?.cancel();
    fillTarget = target;
    fill.toggleAttribute('data-visible', Boolean(target));
    if (!target) return;

    const container = items.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const end = fillGeometry(rect, container);
    Object.assign(fill.style, end);
    if (reposition || reducedMotion.matches || (!previous && !pointer)) return;

    const start = fillGeometry(previous ?? rect, container);
    if (pointer) {
      const dx = Math.min(1, Math.max(-1, (pointer.clientX - rect.left) * 2 / rect.width - 1));
      const dy = Math.min(1, Math.max(-1, (pointer.clientY - rect.top) * 2 / rect.height - 1));
      start.transform += ` translate(${dx * 3}px, ${dy * 3}px) scale(${1 + Math.abs(dx) * 0.035}, ${1 + Math.abs(dy) * 0.07})`;
    }
    fillAnimation = fill.animate([start, end], {
      duration: 280,
      easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)',
    });
  };

  const revealInMobileNav = (link: HTMLAnchorElement) => {
    if (!mobile.matches) return;
    const viewport = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    if (rect.left < viewport.left + 8) {
      nav.scrollBy({ left: rect.left - viewport.left - 8, behavior: 'instant' });
    } else if (rect.right > viewport.right - 8) {
      nav.scrollBy({ left: rect.right - viewport.right + 8, behavior: 'instant' });
    }
  };

  const updateActive = () => {
    scrollFrame = 0;
    const offset = (header?.getBoundingClientRect().bottom ?? 0) + (mobile.matches ? nav.offsetHeight : 0);
    const readingLine = Math.max(offset + 24, Math.min(window.innerHeight * 0.3, 250));
    let next: typeof chapters[number] | undefined;

    for (const chapter of chapters) {
      if (chapter.section.getBoundingClientRect().top > readingLine) break;
      next = chapter;
    }
    if (next && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      next = chapters[chapters.length - 1];
    }
    if (next === active) return;

    active?.link.removeAttribute('aria-current');
    active = next;
    if (active) {
      active.link.setAttribute('aria-current', 'location');
      revealInMobileNav(active.link);
    }
    updateFill();
  };

  const scheduleUpdate = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActive);
  };

  for (const { link } of chapters) {
    link.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      hovered = link;
      updateFill(event);
    });
    link.addEventListener('focus', () => {
      if (!link.matches(':focus-visible')) return;
      focused = link;
      updateFill();
    });
    link.addEventListener('blur', () => {
      if (focused !== link) return;
      focused = undefined;
      updateFill();
    });
  }
  items.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovered = undefined;
    updateFill();
  });

  const refresh = () => {
    scheduleUpdate();
    updateFill(undefined, true);
  };
  new ResizeObserver(refresh).observe(items);
  reducedMotion.addEventListener('change', refresh);
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  window.addEventListener('resize', refresh);
  nav.dataset.hoverFillReady = '';
  scheduleUpdate();
}

const nav = document.querySelector<HTMLElement>('.challenge-jumps');
if (nav) setupChapterNavigation(nav);
