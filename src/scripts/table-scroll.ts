/**
 * 表格横向滚动状态检测与右侧渐隐提示。
 *
 * 无 JS 时 `.table-scroll__inner` 已默认具备 `overflow-x: auto`，
 * 脚本只负责在确实发生横向溢出时标注 `data-overflowing="true"`
 * 与 `data-scrolled-end`，以及按需暴露键盘可滚动焦点。
 */
export function initTableScroll(): void {
  const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-table-scroll]'));
  if (containers.length === 0) return;

  const updateContainer = (container: HTMLElement) => {
    const inner = container.querySelector<HTMLElement>('.table-scroll__inner');
    if (!inner) return;

    const overflowing = inner.scrollWidth > inner.clientWidth + 2;
    const scrolledEnd = !overflowing || inner.scrollLeft + inner.clientWidth >= inner.scrollWidth - 2;

    container.dataset.overflowing = overflowing ? 'true' : 'false';
    container.dataset.scrolledEnd = scrolledEnd ? 'true' : 'false';

    if (overflowing) {
      inner.tabIndex = 0;
      inner.setAttribute('role', 'region');
      inner.setAttribute('aria-label', '可横向滑动的表格');
    } else {
      inner.removeAttribute('tabindex');
      inner.removeAttribute('role');
      inner.removeAttribute('aria-label');
    }
  };

  const updateAll = () => {
    containers.forEach(updateContainer);
  };

  const observer =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver((entries) => {
          for (const entry of entries) {
            const container = entry.target.closest<HTMLElement>('[data-table-scroll]');
            if (container) updateContainer(container);
          }
        })
      : null;

  containers.forEach((container) => {
    const inner = container.querySelector<HTMLElement>('.table-scroll__inner');
    if (!inner) return;
    inner.addEventListener('scroll', () => updateContainer(container), { passive: true });
    observer?.observe(inner);
    const table = inner.querySelector('table');
    if (table) observer?.observe(table);
  });

  updateAll();
  window.addEventListener('resize', updateAll, { passive: true });
}
