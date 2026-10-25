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
  let currentCategory = '';

  initFilter({
    searchWithinCategory: true,
    categoryAliases: config.aliases,
    beforeApply: ({ category }) => {
      if (category === currentCategory) return;
      currentCategory = category;
      const view = config.views[category] ?? config.views.all;
      const assigned = new Set<string>();
      for (const categoryView of view.categories) {
        for (const group of categoryView.groups) {
          const collapsed = new Set(group.collapsedIds);
          for (const id of group.toolIds) {
            const card = cards.get(id);
            const isCollapsed = collapsed.has(id);
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
  });
  root.dataset.catalogReady = 'true';
}
