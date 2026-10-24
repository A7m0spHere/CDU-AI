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
 * - 分类（data-filter-value）：单选，代表「当前浏览的分支」；输入关键词时暂时让位给搜索。
 * - 能力（data-filter-cap）：多选，是用户明确打开的开关，因此搜索时依然生效，取交集。
 * 关键词搜索本身是全局的：命中名称、别名、技术类型、标签等卡片上的全部可搜文本。
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
    const activeChip = chips.find((chip) => chip.dataset.filterValue === activeValue);
    // 搜索是全局的：一旦输入关键词，就忽略当前分类分支，避免「明明有却搜不到」。
    const searching = query.length > 0;
    let visible = 0;
    for (const card of cards) {
      const haystack = normalize(card.dataset.search ?? card.textContent ?? '');
      const categoryMatch = searching || chipMatches(activeChip, card);
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

    // 默认收起的社区条目区：有匹配结果才显示；搜索或任一筛选生效时直接展开，
    // 保证关键词与筛选能到达完整目录，不会因为折叠而漏掉结果。
    const filtering = searching || activeCaps.size > 0 || activeValue !== defaultValue;
    collapses.forEach((details) => {
      const hasVisibleCard = Array.from(details.querySelectorAll<HTMLElement>(cardSelector)).some(
        (card) => !card.hidden,
      );
      details.hidden = !hasVisibleCard;
      if (hasVisibleCard) details.open = filtering;
    });

    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', chip.dataset.filterValue === activeValue ? 'true' : 'false');
    });
    capChips.forEach((chip) => {
      chip.setAttribute('aria-pressed', activeCaps.has(chip.dataset.filterCap ?? '') ? 'true' : 'false');
    });
  };

  const setFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
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
