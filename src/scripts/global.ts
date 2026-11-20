import { initNavDock } from './nav-dock';
import { initImageLightbox } from './image-lightbox';
import { copyText } from '../lib/clipboard';
import './theme';
import './search';

const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  let ticking = false;
  const updateHeader = () => {
    header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    ticking = false;
  };
  updateHeader();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );
}

const mobileMenu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.open = false;
    });
  });

  document.addEventListener('click', (event) => {
    if (mobileMenu.open && !mobileMenu.contains(event.target as Node)) {
      mobileMenu.open = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.open) {
      mobileMenu.open = false;
      mobileMenu.querySelector('summary')?.focus();
    }
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-copy-target]').forEach((button) => {
  button.hidden = false;
  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const original = label?.textContent ?? '复制';
  const status = button.closest('[data-copy-card]')?.querySelector<HTMLElement>('[data-copy-status]');
  let resetTimer: number | undefined;
  button.addEventListener('click', async () => {
    const targetSelector = button.dataset.copyTarget;
    if (!targetSelector) return;
    const target = document.querySelector<HTMLElement>(targetSelector);
    const text = target?.textContent?.trim() ?? '';
    if (!text || button.dataset.copying === 'true') return;
    clearTimeout(resetTimer);
    button.dataset.copying = 'true';
    button.setAttribute('aria-busy', 'true');
    button.dataset.copied = 'false';
    if (label) label.textContent = original;
    if (status) status.textContent = '';
    try {
      await copyText(text);
      button.dataset.copied = 'true';
      if (label) label.textContent = '已复制';
      if (status) status.textContent = '已复制';
      resetTimer = window.setTimeout(() => {
        button.dataset.copied = 'false';
        if (label) label.textContent = original;
        if (status) status.textContent = '';
      }, 1600);
    } catch {
      if (status) status.textContent = '复制失败，请选中提示词手动复制。';
    } finally {
      delete button.dataset.copying;
      button.removeAttribute('aria-busy');
    }
  });
});

initNavDock();
initImageLightbox();
