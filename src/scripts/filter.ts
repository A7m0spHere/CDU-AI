interface FilterOptions {
  rootSelector?: string;
  chipSelector?: string;
  capSelector?: string;
  searchSelector?: string;
  cardSelector?: string;
  countSelector?: string;
  emptySelector?: string;
  clearSelector?: string;
  collapseSelector?: string;
  searchWithinCategory?: boolean;
  categoryAliases?: Record<string, string>;
  beforeApply?: (state: { category: string; query: string; capabilities: string[] }) => void;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ');
}

const toSet = (value: string | undefined): Set<string> =>
  new Set((value ?? '').split(/\s+/).filter(Boolean));

/**
 * 目录筛选（工具页 / 术语页共用）。
 *
 * 两层筛选，逻辑写死在这里，避免页面上出现说不清的组合规则：
 * - 分类（data-filter-value）：单选；工具页在当前栏目内搜索，术语页保留全局搜索。
 * - 能力（data-filter-cap）：多选，是用户明确打开的开关，因此搜索时依然生效，取交集。
 * 关键词命中名称、别名、技术类型、标签等卡片上的全部可搜文本。
 * 三者都满足才显示；结果数量、空状态、URL（?category=&caps=&q=）始终与结果一致。
 */
export function initFilter(options: FilterOptions = {}): void {
  const {
    rootSelector = '[data-filter-root]',
    chipSelector = '[data-filter-value]',
    capSelector = '[data-filter-cap]',
    searchSelector = '[data-filter-search]',
    cardSelector = '[data-filter-card]',
    countSelector = '[data-filter-count]',
    emptySelector = '[data-empty-state]',
    clearSelector = '[data-clear-filters]',
    collapseSelector = '[data-collapse]',
    searchWithinCategory = false,
    categoryAliases = {},
    beforeApply,
  } = options;

  const root = document.querySelector<HTMLElement>(rootSelector);
  if (!root) return;

  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>(chipSelector));
  const capChips = Array.from(root.querySelectorAll<HTMLButtonElement>(capSelector));
  const search = root.querySelector<HTMLInputElement>(searchSelector);
  const cards = Array.from(root.querySelectorAll<HTMLElement>(cardSelector));
  const count = root.querySelector<HTMLElement>(countSelector);
  const empty = root.querySelector<HTMLElement>(emptySelector);
  const clear = root.querySelector<HTMLButtonElement>(clearSelector);
  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-filter-group]'));
  const collapses = Array.from(root.querySelectorAll<HTMLDetailsElement>(collapseSelector));
  const foldedCount = root.querySelector<HTMLElement>('[data-filter-folded-count]');
  const foldedNote = root.querySelector<HTMLElement>('[data-filter-folded-note]');
  const searchScope = root.querySelector<HTMLElement>('[data-filter-scope]');

  const updateFoldedCount = () => {
    const folded = collapses.reduce((total, details) => total + (details.hidden || details.open ? 0 :
      Array.from(details.querySelectorAll<HTMLElement>(cardSelector)).filter((card) => !card.hidden).length), 0);
    if (foldedCount) foldedCount.textContent = String(folded);
    if (foldedNote) foldedNote.hidden = folded === 0;
  };
  collapses.forEach((details) => details.addEventListener('toggle', updateFoldedCount));

  // 默认分支：页面加载、清除筛选时回到这一项（术语页默认停在「AI 主线」）。
  const defaultChip =
    chips.find((chip) => chip.hasAttribute('data-filter-default')) ??
    chips.find((chip) => chip.dataset.filterValue === 'all');
  const defaultValue = defaultChip?.dataset.filterValue ?? 'all';

  let activeValue = defaultValue;
  let query = '';
  const activeCaps = new Set<string>();

  /** 一个筛选项可以匹配多个分类（data-filter-match），也可以只匹配单个分类。 */
  const chipMatches = (chip: HTMLButtonElement | undefined, card: HTMLElement): boolean => {
    if (!chip) return true;
    const cardCategories = toSet(card.dataset.category);
    const categories = chip.dataset.filterMatch;
    if (categories) {
      const set = toSet(categories);
      return [...set].some((value) => cardCategories.has(value));
    }
    const value = chip.dataset.filterValue ?? '';
    return value === 'all' || cardCategories.has(value);
  };

  const capsMatch = (card: HTMLElement): boolean => {
    if (activeCaps.size === 0) return true;
    const cardCaps = toSet(card.dataset.capabilities);
    return [...activeCaps].every((cap) => cardCaps.has(cap));
  };

  const apply = () => {
    beforeApply?.({ category: activeValue, query, capabilities: [...activeCaps] });
    const activeChip = chips.find((chip) => chip.dataset.filterValue === activeValue);
    const searching = query.length > 0;
    if (searchWithinCategory) {
      const label = activeChip?.dataset.filterLabel ?? '全部工具';
      if (search) search.placeholder = activeValue === 'all' ? '搜索全部工具…' : `在${label}中搜索…`;
      if (searchScope) searchScope.textContent = `搜索范围：${label}`;
    }
    let visible = 0;
    for (const card of cards) {
      const haystack = normalize(card.dataset.search ?? card.textContent ?? '');
      const categoryMatch = (!searchWithinCategory && searching) || chipMatches(activeChip, card);
      const queryMatch = !searching || haystack.includes(query);
      const show = categoryMatch && capsMatch(card) && queryMatch;
      card.hidden = !show;
      card.classList.remove('filter-appear');
      if (show) {
        // 仅给可见卡片加一次轻量进入动画，用索引做极短 stagger
        card.style.setProperty('--filter-i', String(Math.min(visible, 10)));
        void card.offsetWidth;
        card.classList.add('filter-appear');
        window.setTimeout(() => card.classList.remove('filter-appear'), 320);
        visible += 1;
      }
    }

    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.hidden = activeValue === defaultValue && query.length === 0 && activeCaps.size === 0;

    groups.forEach((group) => {
      const hasVisibleCard = Array.from(group.querySelectorAll<HTMLElement>(cardSelector)).some(
        (card) => !card.hidden,
      );
      group.hidden = !hasVisibleCard;
    });

    // 浏览场景分类时保持默认收起，仅搜索或能力筛选时展开匹配的社区条目。
    const filtering = searching || activeCaps.size > 0;
    collapses.forEach((details) => {
      const hasVisibleCard = Array.from(details.querySelectorAll<HTMLElement>(cardSelector)).some(
        (card) => !card.hidden,
      );
      details.hidden = !hasVisibleCard;
      if (hasVisibleCard) details.open = filtering;
      const matchingCount = Array.from(details.querySelectorAll<HTMLElement>(cardSelector)).filter((card) => !card.hidden).length;
      const label = details.querySelector<HTMLElement>('[data-collapse-count]');
      if (label) label.textContent = String(matchingCount);
    });
    updateFoldedCount();

    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', chip.dataset.filterValue === activeValue ? 'true' : 'false');
    });
    capChips.forEach((chip) => {
      chip.setAttribute('aria-pressed', activeCaps.has(chip.dataset.filterCap ?? '') ? 'true' : 'false');
    });
  };

  const setFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('category');
    const category = categoryAliases[requestedCategory ?? ''] ?? requestedCategory;
    const q = params.get('q');
    const caps = params.get('caps');
    if (category && chips.some((chip) => chip.dataset.filterValue === category)) {
      activeValue = category;
    }
    if (caps) {
      caps
        .split(',')
        .map((cap) => cap.trim())
        .filter((cap) => capChips.some((chip) => chip.dataset.filterCap === cap))
        .forEach((cap) => activeCaps.add(cap));
    }
    if (q) {
      query = normalize(q).trim();
      if (search) search.value = q;
    }
    apply();
  };

  const syncUrl = () => {
    const params = new URLSearchParams(window.location.search);
    if (activeValue === defaultValue) params.delete('category');
    else params.set('category', activeValue);
    if (activeCaps.size === 0) params.delete('caps');
    else params.set('caps', [...activeCaps].sort().join(','));
    if (!query) params.delete('q');
    else params.set('q', query);
    const next = params.toString();
    const nextUrl = next ? `${window.location.pathname}?${next}` : window.location.pathname;
    window.history.replaceState(null, '', nextUrl);
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeValue = chip.dataset.filterValue ?? defaultValue;
      apply();
      syncUrl();
    });
  });

  capChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cap = chip.dataset.filterCap ?? '';
      if (activeCaps.has(cap)) activeCaps.delete(cap);
      else activeCaps.add(cap);
      apply();
      syncUrl();
    });
  });

  if (search) {
    let timer = 0;
    search.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        query = normalize(search.value).trim();
        apply();
        syncUrl();
      }, 90);
    });
  }

  clear?.addEventListener('click', () => {
    activeValue = defaultValue;
    query = '';
    activeCaps.clear();
    if (search) search.value = '';
    apply();
    syncUrl();
    search?.focus();
  });

  setFromUrl();
}
