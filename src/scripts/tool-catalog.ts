import { initFilter } from './filter';

interface CatalogGroupView { key: string; toolIds: string[]; collapsedIds: string[] }
interface CatalogView { id: string; categories: { id: string; groups: CatalogGroupView[] }[] }

/** 移动现有卡片，保留链接、详情状态和主题样式；不克隆条目。 */
export function initToolCatalog(): void {
  const root = document.querySelector<HTMLElement>('[data-tool-catalog]');
  const configuration = root?.querySelector<HTMLScriptElement>('[data-catalog-config]');
  if (!root || !configuration) return;
  const config = JSON.parse(configuration.textContent ?? '{}') as {
    views: Record<string, CatalogView>;
    categoryNames: Record<string, string>;
    aliases: Record<string, string>;
  };
  const cards = new Map(Array.from(root.querySelectorAll<HTMLElement>('[data-filter-card]')).map((card) => [card.dataset.toolId!, card]));
  const targets = new Map(Array.from(root.querySelectorAll<HTMLElement>('[data-catalog-target]')).map((target) => [target.dataset.catalogTarget!, target]));
  const pool = root.querySelector<HTMLElement>('[data-catalog-pool]')!;
  const mobile = window.matchMedia('(max-width: 760px)');
  const pageSize = 9;
  const pagination = root.querySelector<HTMLElement>('[data-catalog-pagination]')!;
  const previous = pagination.querySelector<HTMLButtonElement>('[data-catalog-previous]')!;
  const next = pagination.querySelector<HTMLButtonElement>('[data-catalog-next]')!;
  const first = pagination.querySelector<HTMLButtonElement>('[data-catalog-first]')!;
  const pageLabel = pagination.querySelector<HTMLElement>('[data-catalog-page-label]')!;
  const range = root.querySelector<HTMLElement>('[data-catalog-range]')!;
  const results = root.querySelector<HTMLElement>('[data-catalog-results]')!;
  let currentView = '';
  let currentPage = 1;
  let totalPages = 1;
  let printing = false;

  const syncPageUrl = () => {
    const url = new URL(window.location.href);
    if (mobile.matches && currentPage > 1) url.searchParams.set('page', String(currentPage));
    else url.searchParams.delete('page');
    if (url.href !== window.location.href) window.history.replaceState(null, '', url);
  };

  const filter = initFilter({
    searchWithinCategory: true,
    categoryAliases: config.aliases,
    beforeApply: ({ category }) => {
      if (printing) return;
      const paginated = mobile.matches && category === 'all';
      const viewKey = `${category}:${paginated}`;
      if (viewKey === currentView) return;
      currentView = viewKey;
      const view = config.views[category] ?? config.views.all;
      const assigned = new Set<string>();
      for (const categoryView of view.categories) {
        for (const group of categoryView.groups) {
          const collapsed = new Set(group.collapsedIds);
          for (const id of group.toolIds) {
            const card = cards.get(id);
            // 手机全目录由分页收纳所有条目，避免分页内再次折叠。
            const isCollapsed = !paginated && collapsed.has(id);
            const target = targets.get(`${group.key}${isCollapsed ? '-more' : ''}`);
            if (!card || !target) continue;
            target.append(card);
            if (isCollapsed) card.dataset.collapsed = 'true';
            else delete card.dataset.collapsed;
            const label = card.querySelector<HTMLElement>('[data-tool-category-label]');
            if (label) label.textContent = config.categoryNames[category === 'all' ? card.dataset.primaryCategory! : category] ?? '';
            assigned.add(id);
          }
        }
      }
      cards.forEach((card, id) => { if (!assigned.has(id)) pool.append(card); });
    },
    selectCards: (matches, { category, reason }) => {
      if (printing) {
        pagination.hidden = true;
        range.hidden = true;
        return matches;
      }
      if (reason === 'init' || reason === 'history') {
        const requested = new URLSearchParams(window.location.search).get('page') ?? '1';
        currentPage = /^[1-9]\d*$/.test(requested) && Number.isSafeInteger(Number(requested)) ? Number(requested) : 1;
      } else if (reason === 'filter') currentPage = 1;

      const paginated = mobile.matches && category === 'all';
      totalPages = paginated ? Math.max(1, Math.ceil(matches.length / pageSize)) : 1;
      currentPage = Math.min(Math.max(1, currentPage), totalPages);
      syncPageUrl();
      pagination.hidden = !paginated || totalPages === 1;
      range.hidden = !paginated || matches.length === 0;
      previous.disabled = currentPage === 1;
      next.disabled = currentPage === totalPages;
      first.hidden = !paginated || totalPages === 1 || currentPage !== totalPages;
      next.hidden = !first.hidden;
      pageLabel.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;

      if (!paginated) return matches;
      // 使用栏目顺序切页，不受卡片先前移入折叠区或其他栏目的顺序影响。
      const matched = new Set(matches);
      const ordered = config.views.all.categories.flatMap((item) => item.groups.flatMap((group) => group.toolIds))
        .map((id) => cards.get(id)!).filter((card) => matched.has(card));
      const start = (currentPage - 1) * pageSize;
      const selected = ordered.slice(start, start + pageSize);
      range.textContent = `，当前显示 ${matches.length ? start + 1 : 0}–${start + selected.length} 项`;
      return selected;
    },
  });

  const changePage = (page: number) => {
    const requested = Math.min(Math.max(1, page), totalPages);
    if (requested === currentPage) return;
    currentPage = requested;
    const url = new URL(window.location.href);
    if (currentPage > 1) url.searchParams.set('page', String(currentPage));
    else url.searchParams.delete('page');
    window.history.pushState(null, '', url);
    filter?.refresh();
    results.focus({ preventScroll: true });
    results.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  previous.addEventListener('click', () => changePage(currentPage - 1));
  next.addEventListener('click', () => changePage(currentPage + 1));
  first.addEventListener('click', () => changePage(1));
  mobile.addEventListener('change', () => { if (!printing) filter?.refresh(); });
  // 打印完整匹配集，不把屏幕分页变成内容截断。
  window.addEventListener('beforeprint', () => {
    printing = true;
    filter?.refresh();
    root.querySelectorAll<HTMLDetailsElement>('[data-collapse]').forEach((details) => { details.open = true; });
  });
  window.addEventListener('afterprint', () => { printing = false; filter?.refresh(); });
  root.dataset.catalogReady = 'true';
}
