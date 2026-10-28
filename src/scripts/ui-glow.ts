/**
 * 「光效汇聚」的自动接线：凡是长得像按钮的控件，都自动获得同一束光。
 *
 * 页头搜索框、主题键、GitHub 键和首屏主按钮此前是手写的宿主（hover-glow-host +
 * data-glow-host + 一层 .hover-glow--inset）。站内还有一批同类控件——正文按钮、
 * 筛选片、复制键、关闭键、主题面板里的小按钮——手写会散在十几个文件里、还容易漏，
 * 所以这里按选择器批量接管：补宿主类、补 data-glow-host、插一层光，
 * 之后由 scripts/hover-glow.ts 的通用驱动器负责点亮。
 *
 * 文档里有静态标记时不会重复插入；主题面板重建、筛选渲染出的新按钮由
 * MutationObserver 补挂，因此不会出现「刚打开面板时没有光」的断层。
 *
 * 当前接管的面板清单见 AUTO_HOSTS；刻意的例外：
 *   - .theme-swatch-btn（取色色块，光会盖掉正在看的颜色）
 *   - .term-steps__item / .term-quiz__option（正文里的阅读步骤与测验选项，
 *     属于内容而非行动入口，整页发光会盖过正文）
 *   - .nav-link / .nav-cta（由顶部导航的 nav-glow 统一处理，再叠一层会双重发光）
 *
 * 侧栏搜索框（.search-field）与列表卡片（.tool-card / .glossary-term / .branch-row__label）
 * 也在这里：输入框的底色是 input 自己的，光层要压在它上面才看得见（见 hover-glow.css）。
 */

import { initInsetGlow } from './hover-glow';

/** 与页头控件同类的按钮：行动按钮、筛选片、复制/关闭键、主题面板控件 */
const AUTO_HOSTS = [
  '.btn',
  '.filter-chip',
  '.clear-filters',
  '.copy-button',
  '.term-copy',
  '.term-prompt__copy',
  '[data-scenario-next]',
  '.search-dialog__close',
  '.theme-editor__close',
  '.theme-panel__link',
  '.theme-mini-btn',
  '.theme-font-option',
  // 侧栏搜索框：搜索本身就是一个入口，指针落上去该有同一束光
  '.search-field',
  // 列表卡片：工具卡、术语卡与术语侧栏的分支行
  '.tool-card',
  '.glossary-term',
  '.branch-row__label',
];

const SELECTOR = ['[data-glow-host]', ...AUTO_HOSTS].join(',');

/** 给一枚控件补上宿主类、标记与光层（幂等） */
function decorate(host: HTMLElement): void {
  host.classList.add('hover-glow-host');
  host.setAttribute('data-glow-host', '');
  if (host.querySelector(':scope > .hover-glow') !== null) return;
  const glow = document.createElement('span');
  glow.className = 'hover-glow hover-glow--inset';
  glow.setAttribute('data-glow', '');
  glow.setAttribute('aria-hidden', 'true');
  host.prepend(glow);
}

function decorateAll(root: ParentNode): void {
  for (const host of root.querySelectorAll<HTMLElement>(SELECTOR)) decorate(host);
}

export function initUiGlow(): void {
  decorateAll(document);

  const root = document.documentElement;
  const show = initInsetGlow({
    items: Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)),
    onActive: (active) => {
      root.dataset.uiLight = active ? 'true' : 'false';
    },
  });

  // 后加进来的按钮（主题面板重建、筛选结果、对话框内容）也要有光
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(SELECTOR)) decorate(node);
        decorateAll(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const hostFrom = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof Element)) return null;
    return target.closest<HTMLElement>('[data-glow-host]');
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  // CSS 在这种环境下本来就把 .hover-glow 藏了，这里同步跳过，省掉无意义的逐帧写入
  const enabled = () => !reduced.matches && !coarse.matches;

  let frame = 0;
  let pending: { host: HTMLElement | null; x: number } | null = null;

  const flush = () => {
    frame = 0;
    if (pending === null) return;
    const { host, x } = pending;
    pending = null;
    if (host === null || !enabled()) {
      show(null);
      return;
    }
    show(host, x);
  };

  const schedule = (host: HTMLElement | null, x: number) => {
    pending = { host, x };
    if (frame === 0) frame = window.requestAnimationFrame(flush);
  };

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      schedule(hostFrom(event.target), event.clientX);
    },
    { passive: true },
  );

  // 指针直接离开窗口时不会再有 pointermove，单独收一次尾
  document.addEventListener('pointerleave', () => schedule(null, 0));

  // 键盘 Tab 到控件上也要亮：没有指针位置，就让亮心落在控件中央
  document.addEventListener('focusin', (event) => {
    const host = hostFrom(event.target);
    if (host === null) return;
    const rect = host.getBoundingClientRect();
    schedule(host, rect.left + rect.width / 2);
  });

  document.addEventListener('focusout', (event) => {
    const host = hostFrom(event.target);
    if (host === null) return;
    const next = event.relatedTarget as Node | null;
    if (next === null || !host.contains(next)) schedule(null, 0);
  });
}

initUiGlow();
