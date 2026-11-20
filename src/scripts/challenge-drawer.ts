/**
 * 活动页原生 <dialog> 弹窗与抽屉控制器。
 * 统一管理「赛事速览」弹窗与「赛道与作品要求」右侧抽屉：
 * showModal() + @starting-style 入场 + 跨浏览器退场动画回退 + closedby="any" 遮罩关闭回退。
 */
let supportsDisplayTransition: boolean | undefined;

function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  void getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDisplay();
}

interface DialogController {
  open: () => void;
  close: () => Promise<void>;
}

function createDialogController(dialog: HTMLDialogElement): DialogController {
  const openButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(`[data-dialog-open="${dialog.id}"]`),
  );
  const closeButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-dialog-close]'));
  const anchorLinks = Array.from(dialog.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  const setExpanded = (expanded: boolean) => {
    for (const btn of openButtons) {
      btn.setAttribute('aria-expanded', String(expanded));
    }
  };

  let closing = false;

  const open = () => {
    if (dialog.open) return;
    dialog.removeAttribute('data-closing');
    closing = false;
    dialog.showModal();
    setExpanded(true);
  };

  const close = async () => {
    if (!dialog.open || closing) return;
    closing = true;

    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((animation) => animation.finished)),
          new Promise((resolve) => window.setTimeout(resolve, 400)),
        ]);
      }
      if (!dialog.hasAttribute('data-closing')) {
        closing = false;
        return;
      }
      dialog.removeAttribute('data-closing');
    }

    dialog.close();
    closing = false;
  };

  for (const btn of openButtons) {
    btn.addEventListener('click', open);
  }

  for (const btn of closeButtons) {
    btn.addEventListener('click', () => {
      void close();
    });
  }

  for (const link of anchorLinks) {
    link.addEventListener('click', async (event) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      event.preventDefault();
      await close();
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  dialog.addEventListener('cancel', (event) => {
    if (event.cancelable) {
      event.preventDefault();
      void close();
    }
  });

  dialog.addEventListener('close', () => {
    dialog.removeAttribute('data-closing');
    dialog.returnValue = '';
    closing = false;
    setExpanded(false);
  });

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (event: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (event) => {
      pressedOutside = isOutside(event);
    });
    dialog.addEventListener('pointerup', (event) => {
      if (pressedOutside && isOutside(event)) {
        void close();
      }
      pressedOutside = false;
    });
  }

  return { open, close };
}

function initChallengeDialogs(): void {
  const controllers = new Map<string, DialogController>();

  for (const id of ['challenge-overview-dialog', 'challenge-info-drawer']) {
    const el = document.getElementById(id);
    if (el instanceof HTMLDialogElement) {
      controllers.set(id, createDialogController(el));
    }
  }

  // 支持从「赛事速览」弹窗平滑切换到「赛道与作品要求」抽屉。
  const switchButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-dialog-switch]'));
  for (const btn of switchButtons) {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-dialog-switch');
      const currentDialog = btn.closest('dialog');
      if (!targetId || !(currentDialog instanceof HTMLDialogElement)) return;
      await controllers.get(currentDialog.id)?.close();
      controllers.get(targetId)?.open();
    });
  }

  // 手机端右侧「赛事速览」抽拉片：支持向左轻拉打开弹窗，同时保留普通点击交互。
  const pullTrigger = document.querySelector<HTMLButtonElement>('.challenge-aside-trigger');
  const overviewController = controllers.get('challenge-overview-dialog');
  if (pullTrigger && overviewController) {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let pulled = false;

    pullTrigger.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      startX = event.clientX;
      startY = event.clientY;
      tracking = true;
      pulled = false;
    });

    pullTrigger.addEventListener('pointermove', (event) => {
      if (!tracking) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 8) {
        tracking = false;
        pullTrigger.style.transform = '';
        return;
      }
      if (dx < 0) {
        const clamped = Math.max(-18, dx * 0.6);
        pullTrigger.style.transform = `translateX(${clamped}px)`;
        if (dx <= -18) {
          pulled = true;
          tracking = false;
          pullTrigger.style.transform = '';
          overviewController.open();
        }
      }
    });

    const resetPull = () => {
      tracking = false;
      pullTrigger.style.transform = '';
    };

    pullTrigger.addEventListener('pointerup', resetPull);
    pullTrigger.addEventListener('pointercancel', resetPull);
    pullTrigger.addEventListener('click', (event) => {
      if (pulled) {
        pulled = false;
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }
}

initChallengeDialogs();
