/**
 * 手机端底部拇指快捷导航栏的显隐控制：
 * - 向下滚动阅读时自动下沉收起，释放完整竖屏视野；
 * - 向上轻回拉、位于页面顶部或接近页底时立即浮现；
 * - 任意模态框（搜索、工具抽屉、灯箱、主题编辑器、活动抽屉）或移动菜单展开时自动退避。
 */
export function initMobileDock(): void {
  const dock = document.querySelector<HTMLElement>('[data-mobile-dock]');
  if (!dock) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  let lastY = window.scrollY;
  let downAccum = 0;
  let upAccum = 0;
  let hiddenByScroll = false;
  let ticking = false;

  const hasOpenOverlay = (): boolean => {
    if (document.querySelector('dialog[open]')) return true;
    const menu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
    return Boolean(menu?.open);
  };

  const syncState = () => {
    const blocked = !mobile.matches || hasOpenOverlay();
    dock.dataset.dockHidden = blocked || hiddenByScroll ? 'true' : 'false';
  };

  const updateScroll = () => {
    ticking = false;
    if (!mobile.matches) {
      hiddenByScroll = false;
      syncState();
      return;
    }

    const y = Math.max(0, window.scrollY);
    const dy = y - lastY;
    lastY = y;

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const nearTop = y < 64;
    const nearBottom = maxScroll > 160 && maxScroll - y < 120;

    if (nearTop || nearBottom) {
      hiddenByScroll = false;
      downAccum = 0;
      upAccum = 0;
      syncState();
      return;
    }

    if (dy > 0) {
      downAccum += dy;
      upAccum = 0;
      if (downAccum > 20 && y > 110) hiddenByScroll = true;
    } else if (dy < 0) {
      upAccum += -dy;
      downAccum = 0;
      if (upAccum > 10) hiddenByScroll = false;
    }

    syncState();
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScroll);
    },
    { passive: true },
  );

  // 监听 dialog / details 的 open 属性变化（包括按需创建的主题编辑器、图片灯箱等）
  const observer = new MutationObserver(() => syncState());
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['open'],
    childList: true,
  });

  mobile.addEventListener('change', () => {
    lastY = window.scrollY;
    downAccum = 0;
    upAccum = 0;
    hiddenByScroll = false;
    syncState();
  });

  syncState();
}
