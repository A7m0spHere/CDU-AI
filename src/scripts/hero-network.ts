/**
 * 首页「看板娘学习引导图」交互：
 * - 节点 hover / focus 点亮对应连线与端点；
 * - 未开启「减少动效」时自动轮播点亮节点，悬停可临时接管；
 * - 页面不可见时暂停，避免无意义的定时器。
 */

const network = document.querySelector<HTMLElement>('[data-hero-network]');
if (network) {
  const nodes = Array.from(network.querySelectorAll<HTMLAnchorElement>('[data-node]'));
  const links = new Map(
    Array.from(network.querySelectorAll<SVGPathElement>('[data-link]')).map((path) => [path.dataset.link, path]),
  );
  const dots = new Map(
    Array.from(network.querySelectorAll<SVGCircleElement>('[data-dot]')).map((dot) => [dot.dataset.dot, dot]),
  );
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let active: string | null = null;
  let timer = 0;
  let cycleIndex = -1;
  let paused = false;

  const setActive = (key: string | null) => {
    if (key === active) return;
    active = key;
    for (const node of nodes) node.classList.toggle('is-active', node.dataset.node === key);
    for (const [id, path] of links) path.classList.toggle('is-active', id === key);
    for (const [id, dot] of dots) dot.classList.toggle('is-active', id === key);
  };

  const cycle = () => {
    if (nodes.length === 0) return;
    cycleIndex = (cycleIndex + 1) % nodes.length;
    setActive(nodes[cycleIndex].dataset.node ?? null);
  };

  const stopTimer = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  const startTimer = () => {
    if (reduced.matches || paused || timer !== 0) return;
    timer = window.setInterval(cycle, 2600);
  };

  const takeOver = (key: string | null) => {
    stopTimer();
    setActive(key);
  };

  const release = () => {
    setActive(null);
    startTimer();
  };

  for (const node of nodes) {
    node.addEventListener('pointerenter', () => takeOver(node.dataset.node ?? null));
    node.addEventListener('pointerleave', release);
    node.addEventListener('focus', () => takeOver(node.dataset.node ?? null));
    node.addEventListener('blur', release);
  }

  // 页面滚出视口或切到后台时暂停轮播
  const visibility = () => {
    paused = document.hidden;
    if (paused) {
      stopTimer();
      setActive(null);
    } else {
      startTimer();
    }
  };
  document.addEventListener('visibilitychange', visibility);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        paused = !entries.some((entry) => entry.isIntersecting);
        if (paused) {
          stopTimer();
          setActive(null);
        } else {
          startTimer();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(network);
  }

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stopTimer();
      setActive(null);
    } else {
      startTimer();
    }
  });

  startTimer();
}

export {};
