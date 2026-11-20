/**
 * 活动页「赛道与作品要求」右侧抽屉弹窗控制器。
 * 遵循原生 <dialog> Top Layer 模式：showModal() + @starting-style 入场 + 跨浏览器退场动画回退。
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

function initChallengeDrawer(): void {
  const drawer = document.getElementById('challenge-info-drawer');
  if (!(drawer instanceof HTMLDialogElement)) return;

  const openButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-challenge-drawer-open]'));
  const closeButton = drawer.querySelector<HTMLButtonElement>('[data-challenge-drawer-close]');
  const anchorLinks = Array.from(drawer.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  const setExpanded = (expanded: boolean) => {
    for (const btn of openButtons) {
      btn.setAttribute('aria-expanded', String(expanded));
    }
  };

  let closing = false;

  const openDrawer = () => {
    if (drawer.open) return;
    drawer.removeAttribute('data-closing');
    closing = false;
    drawer.showModal();
    setExpanded(true);
  };

  const closeDrawer = async () => {
    if (!drawer.open || closing) return;
    closing = true;

    if (!supportsTopLayerExit()) {
      drawer.setAttribute('data-closing', '');
      const animations = drawer.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((animation) => animation.finished)),
          new Promise((resolve) => window.setTimeout(resolve, 400)),
        ]);
      }
      if (!drawer.hasAttribute('data-closing')) {
        closing = false;
        return;
      }
      drawer.removeAttribute('data-closing');
    }

    drawer.close();
    closing = false;
  };

  for (const btn of openButtons) {
    btn.addEventListener('click', openDrawer);
  }

  closeButton?.addEventListener('click', () => {
    void closeDrawer();
  });

  // 站内锚点跳转前先平滑关闭抽屉，再滚动到目标区域。
  for (const link of anchorLinks) {
    link.addEventListener('click', async (event) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      event.preventDefault();
      await closeDrawer();
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // 拦截 Esc / closedby 产生的 cancel 请求以保留滑出退场动画。
  drawer.addEventListener('cancel', (event) => {
    if (event.cancelable) {
      event.preventDefault();
      void closeDrawer();
    }
  });

  drawer.addEventListener('close', () => {
    drawer.removeAttribute('data-closing');
    drawer.returnValue = '';
    closing = false;
    setExpanded(false);
  });

  // 对尚未实现 closedby="any" 的浏览器（如 Safari）补充遮罩点击关闭回退。
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (event: PointerEvent) => {
      const rect = drawer.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    drawer.addEventListener('pointerdown', (event) => {
      pressedOutside = isOutside(event);
    });
    drawer.addEventListener('pointerup', (event) => {
      if (pressedOutside && isOutside(event)) {
        void closeDrawer();
      }
      pressedOutside = false;
    });
  }
}

function initPendingEntryFeedback(): void {
  const pendingButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-pending-entry]'));
  const feedback = document.querySelector<HTMLElement>('[data-pending-feedback]');
  if (!feedback || pendingButtons.length === 0) return;

  for (const button of pendingButtons) {
    button.addEventListener('click', () => {
      feedback.textContent = button.getAttribute('data-pending-entry') ?? '报名入口暂未开放。';
      feedback.hidden = false;
    });
  }
}

initChallengeDrawer();
initPendingEntryFeedback();
