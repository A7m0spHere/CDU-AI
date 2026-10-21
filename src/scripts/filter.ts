interface FilterOptions {
  rootSelector?: string;
  chipSelector?: string;
  searchSelector?: string;
  cardSelector?: string;
  countSelector?: string;
  emptySelector?: string;
  clearSelector?: string;
  activeEmptySelector?: string;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ');
}

export function initFilter(options: FilterOptions = {}): void {
  const {
    rootSelector = '[data-filter-root]',
    chipSelector = '[data-filter-value]',
    searchSelector = '[data-filter-search]',
    cardSelector = '[data-filter-card]',
    countSelector = '[data-filter-count]',
    emptySelector = '[data-empty-state]',
    clearSelector = '[data-clear-filters]',
  } = options;

  const root = document.querySelector<HTMLElement>(rootSelector);
  if (!root) return;

  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>(chipSelector));
  const search = root.querySelector<HTMLInputElement>(searchSelector);
  const cards = Array.from(root.querySelectorAll<HTMLElement>(cardSelector));
  const count = root.querySelector<HTMLElement>(countSelector);
  const empty = root.querySelector<HTMLElement>(emptySelector);
  const clear = root.querySelector<HTMLButtonElement>(clearSelector);
  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-filter-group]'));

  // 默认分支：页面加载、清除筛选时回到这一项（术语页默认停在「AI 主线」）。
  const defaultChip =
    chips.find((chip) => chip.hasAttribute('data-filter-default')) ??
    chips.find((chip) => chip.dataset.filterValue === 'all');
  const defaultValue = defaultChip?.dataset.filterValue ?? 'all';

  let activeValue = defaultValue;
  let query = '';

  /** 一个筛选项可以匹配多个分类（data-filter-match），也可以只匹配单个分类。 */
  const chipMatches = (chip: HTMLButtonElement | undefined, card: HTMLElement): boolean => {
    if (!chip) return true;
    const categories = chip.dataset.filterMatch;
    if (categories) {
      const set = new Set(categories.split(/\s+/).filter(Boolean));
      return set.has(card.dataset.category ?? '');
    }
    const value = chip.dataset.filterValue ?? '';
    return value === 'all' || (card.dataset.category ?? '') === value;
  };

  const apply = () => {
    const activeChip = chips.find((chip) => chip.dataset.filterValue === activeValue);
    let visible = 0;
    for (const card of cards) {
      const haystack = normalize(card.dataset.search ?? card.textContent ?? '');
      const categoryMatch = chipMatches(activeChip, card);
      const queryMatch = query.length === 0 || haystack.includes(query);
      const show = categoryMatch && queryMatch;
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
    if (clear) clear.hidden = activeValue === defaultValue && query.length === 0;

    groups.forEach((group) => {
      const hasVisibleCard = Array.from(group.querySelectorAll<HTMLElement>(cardSelector)).some(
        (card) => !card.hidden,
      );
      group.hidden = !hasVisibleCard;
    });

    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', chip.dataset.filterValue === activeValue ? 'true' : 'false');
    });
  };

  const setFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const q = params.get('q');
    if (category && chips.some((chip) => chip.dataset.filterValue === category)) {
      activeValue = category;
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
    if (search) search.value = '';
    apply();
    syncUrl();
    search?.focus();
  });

  setFromUrl();
}