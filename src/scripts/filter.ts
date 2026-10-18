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

  let activeCategory = 'all';
  let query = '';

  const apply = () => {
    let visible = 0;
    for (const card of cards) {
      const category = card.dataset.category ?? '';
      const haystack = normalize(card.dataset.search ?? card.textContent ?? '');
      const categoryMatch = activeCategory === 'all' || category === activeCategory;
      const queryMatch = query.length === 0 || haystack.includes(query);
      const show = categoryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    }

    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.hidden = activeCategory === 'all' && query.length === 0;

    groups.forEach((group) => {
      const hasVisibleCard = Array.from(group.querySelectorAll<HTMLElement>(cardSelector)).some(
        (card) => !card.hidden,
      );
      group.hidden = !hasVisibleCard;
    });

    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', chip.dataset.filterValue === activeCategory ? 'true' : 'false');
    });
  };

  const setFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const q = params.get('q');
    if (category && chips.some((chip) => chip.dataset.filterValue === category)) {
      activeCategory = category;
    }
    if (q) {
      query = normalize(q).trim();
      if (search) search.value = q;
    }
    apply();
  };

  const syncUrl = () => {
    const params = new URLSearchParams(window.location.search);
    if (activeCategory === 'all') params.delete('category');
    else params.set('category', activeCategory);
    if (!query) params.delete('q');
    else params.set('q', query);
    const next = params.toString();
    const nextUrl = next ? `${window.location.pathname}?${next}` : window.location.pathname;
    window.history.replaceState(null, '', nextUrl);
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.filterValue ?? 'all';
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
    activeCategory = 'all';
    query = '';
    if (search) search.value = '';
    apply();
    syncUrl();
    search?.focus();
  });

  setFromUrl();
}