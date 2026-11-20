/**
 * 移动端 / 窄屏「本页小节」底部半屏目录抽屉。
 *
 * 桌面端右侧已有 `.wiki-toc`；当屏幕 `<= 1100px` 或处于粗指针设备时，
 * 通过右下角悬浮按钮唤起底部半屏抽屉，点击任意小节后关闭抽屉并滚到对应锚点。
 */
export function initTocSheet(): void {
  const trigger = document.querySelector<HTMLButtonElement>('[data-toc-open]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-toc-sheet]');
  if (!trigger || !dialog) return;

  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-toc-close]');
  const links = Array.from(dialog.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let pendingHash: string | null = null;

  const finishClose = () => {
    dialog.classList.remove('is-closing');
    closing = false;
    if (dialog.open) dialog.close();
    trigger.setAttribute('aria-expanded', 'false');

    if (pendingHash) {
      const targetId = decodeURIComponent(pendingHash.slice(1));
      pendingHash = null;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          block: 'start',
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
        if (window.location.hash !== `#${encodeURIComponent(targetId)}`) {
          history.replaceState(null, '', `#${encodeURIComponent(targetId)}`);
        }
        return;
      }
    }

    trigger.focus();
  };

  const closeSheet = (hash: string | null = null) => {
    if (!dialog.open || closing) return;
    pendingHash = hash;
    if (reducedMotion.matches) {
      finishClose();
      return;
    }
    closing = true;
    dialog.classList.add('is-closing');
    window.setTimeout(finishClose, 150);
  };

  trigger.addEventListener('click', () => {
    if (dialog.open || closing) return;
    trigger.setAttribute('aria-expanded', 'true');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  });

  closeBtn?.addEventListener('click', () => closeSheet());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeSheet();
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeSheet();
  });

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      closeSheet(link.hash || null);
    });
  });
}
