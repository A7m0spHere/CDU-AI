/* ---------------------------------------------------------
   站内搜索
   静态索引由 /search-index.json 在构建时生成，前端按需加载。
   --------------------------------------------------------- */
interface SearchEntry {
  type: string;
  title: string;
  description: string;
  href: string;
  keywords: string;
}

const searchDialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');

if (searchDialog) {
  const searchInput = searchDialog.querySelector<HTMLInputElement>('[data-search-input]');
  const resultsHost = searchDialog.querySelector<HTMLElement>('[data-search-results]');
  const searchStatus = searchDialog.querySelector<HTMLElement>('[data-search-status]');
  let searchEntries: SearchEntry[] | null = null;
  let searchLoadFailed = false;
  let searchRequest: Promise<void> | null = null;
  let composing = false;
  const retryButton = searchDialog.querySelector<HTMLButtonElement>('[data-search-retry]');
  let previousFocus: HTMLElement | null = null;

  const normalize = (value: string) => value.toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ').trim();

  const createResult = (entry: SearchEntry): HTMLAnchorElement => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = entry.href;

    const type = document.createElement('span');
    type.className = 'search-result__type';
    type.textContent = entry.type;

    const copy = document.createElement('span');
    const title = document.createElement('span');
    title.className = 'search-result__title';
    title.textContent = entry.title;
    const desc = document.createElement('span');
    desc.className = 'search-result__desc';
    desc.textContent = entry.description;
    copy.append(title, desc);

    link.append(type, copy);
    link.addEventListener('click', () => {
      searchDialog.close();
    });
    return link;
  };

  const renderSearch = () => {
    if (!resultsHost) return;
    resultsHost.replaceChildren();
    if (retryButton) retryButton.hidden = !searchLoadFailed;

    if (!searchEntries) {
      if (searchStatus) {
        searchStatus.textContent = searchLoadFailed ? '搜索暂时不可用，请重试。' : '正在准备搜索索引…';
      }
      return;
    }

    const query = normalize(searchInput?.value ?? '');
    let results = searchEntries;
    let total = 0;
    if (query) {
      results = searchEntries
        .filter((entry) =>
          normalize(
            entry.title + ' ' + entry.description + ' ' + entry.keywords + ' ' + entry.type,
          ).includes(query),
        )
        .sort((a, b) => {
          const score = (entry: SearchEntry) => {
            let value = 0;
            if (normalize(entry.title).includes(query)) value += 3;
            if (normalize(entry.keywords).includes(query)) value += 2;
            if (normalize(entry.description).includes(query)) value += 1;
            return value;
          };
          return score(b) - score(a);
        });
      total = results.length;
      results = results.slice(0, 10);
    } else {
      results = searchEntries.filter((entry) => entry.type === '页面').slice(0, 7);
    }

    if (searchStatus) {
      searchStatus.textContent = query
        ? results.length > 0
          ? `找到 ${total} 条相关结果${total > results.length ? `，显示前 ${results.length} 条；可缩小关键词范围` : ''}`
          : '没有找到与「' + (searchInput?.value ?? '') + '」相关的内容'
        : '推荐入口 · 也可以输入关键词';
    }

    if (results.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = '试试更短的关键词，例如「工具」「入门」「海报」或「社区」。';
      resultsHost.append(empty);
      return;
    }

    results.forEach((entry) => resultsHost.append(createResult(entry)));
  };

  const loadSearchIndex = (): Promise<void> => {
    if (searchEntries) return Promise.resolve();
    if (searchRequest) return searchRequest;
    searchLoadFailed = false;
    renderSearch();
    searchRequest = fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error('index request failed');
        return response.json() as Promise<SearchEntry[]>;
      })
      .then((data) => {
        searchEntries = Array.isArray(data) ? data : [];
        if (searchDialog.open) renderSearch();
      })
      .catch(() => {
        searchLoadFailed = true;
        if (searchDialog.open) renderSearch();
      })
      .finally(() => { searchRequest = null; });
    return searchRequest;
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;

  const closeSearch = () => {
    if (!searchDialog.open || closing) return;
    if (prefersReducedMotion.matches) {
      searchDialog.close();
      return;
    }
    closing = true;
    searchDialog.classList.add('is-closing');
    window.setTimeout(() => {
      searchDialog.classList.remove('is-closing');
      closing = false;
      searchDialog.close();
    }, 150);
  };

  const openSearch = () => {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add('search-open');
    if (typeof searchDialog.showModal === 'function') {
      searchDialog.showModal();
    } else {
      searchDialog.setAttribute('open', '');
    }
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
    renderSearch();
    void loadSearchIndex();
  };

  document.querySelectorAll<HTMLElement>('[data-search-open]').forEach((trigger) => {
    trigger.addEventListener('click', openSearch);
  });

  searchDialog.querySelector('[data-search-close]')?.addEventListener('click', closeSearch);

  searchDialog.addEventListener('click', (event) => {
    if (event.target === searchDialog) closeSearch();
  });

  searchDialog.addEventListener('close', () => {
    document.body.classList.remove('search-open');
    previousFocus?.focus();
  });

  retryButton?.addEventListener('click', () => {
    searchInput?.focus();
    void loadSearchIndex();
  });
  searchInput?.addEventListener('compositionstart', () => { composing = true; });
  searchInput?.addEventListener('compositionend', () => { composing = false; renderSearch(); });
  searchInput?.addEventListener('input', renderSearch);
  searchInput?.addEventListener('keydown', (event) => {
    if (composing || event.isComposing) return;
    if (event.key === 'ArrowDown') {
      const first = resultsHost?.querySelector<HTMLAnchorElement>('.search-result');
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'Enter') {
      const first = resultsHost?.querySelector<HTMLAnchorElement>('.search-result');
      if (first) {
        event.preventDefault();
        first.click();
      }
    }
  });

  resultsHost?.addEventListener('keydown', (event) => {
    const links = Array.from(resultsHost.querySelectorAll<HTMLAnchorElement>('.search-result'));
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'ArrowDown' && current >= 0 && current < links.length - 1) {
      event.preventDefault();
      links[current + 1].focus();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (current <= 0) searchInput?.focus();
      else links[current - 1].focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (composing || event.isComposing) return;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!searchDialog.open) openSearch();
    }
    if (event.key === 'Escape' && searchDialog.open) {
      event.preventDefault();
      closeSearch();
    }
  });
}
