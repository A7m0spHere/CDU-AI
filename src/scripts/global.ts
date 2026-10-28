import { initNavDock } from './nav-dock';
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
  button.addEventListener('click', async () => {
    const targetSelector = button.dataset.copyTarget;
    if (!targetSelector) return;
    const target = document.querySelector<HTMLElement>(targetSelector);
    const text = target?.textContent?.trim() ?? '';
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }

    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const original = label?.textContent ?? '复制';
    button.dataset.copied = 'true';
    if (label) label.textContent = '已复制';
    window.setTimeout(() => {
      button.dataset.copied = 'false';
      if (label) label.textContent = original;
    }, 1600);
  });
});

initNavDock();
