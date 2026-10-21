import { initNavDock } from './nav-dock';

const THEME_KEY = 'cdu-ai-theme';
const root = document.documentElement;

function updateThemeControls(theme: string): void {
  const toDark = theme !== 'dark';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
    const label = toDark ? '切换到深色主题' : '切换到浅色主题';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  });
}

function applyTheme(theme: string): void {
  root.dataset.theme = theme;
  updateThemeControls(theme);
}

function savedTheme(): string | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

applyTheme(savedTheme() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* 无法持久化时仍切换本次主题 */
    }
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (savedTheme()) return;
  applyTheme(event.matches ? 'dark' : 'light');
});

const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  let ticking = false;
  const updateHeader = () => {
    header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    ticking = false;
  };
  updateHeader();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );
}

const mobileMenu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.open = false;
    });
  });

  document.addEventListener('click', (event) => {
    if (mobileMenu.open && !mobileMenu.contains(event.target as Node)) {
      mobileMenu.open = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.open) {
      mobileMenu.open = false;
      mobileMenu.querySelector('summary')?.focus();
    }
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const targetSelector = button.dataset.copyTarget;
    if (!targetSelector) return;
    const target = document.querySelector<HTMLElement>(targetSelector);
    const text = target?.textContent?.trim() ?? '';
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }

    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const original = label?.textContent ?? '复制';
    button.dataset.copied = 'true';
    if (label) label.textContent = '已复制';
    window.setTimeout(() => {
      button.dataset.copied = 'false';
      if (label) label.textContent = original;
    }, 1600);
  });
});
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

    if (!searchEntries) {
      if (searchStatus) {
        searchStatus.textContent = searchLoadFailed ? '搜索索引加载失败，请刷新页面重试。' : '正在准备搜索索引…';
      }
      return;
    }

    const query = normalize(searchInput?.value ?? '');
    let results = searchEntries;
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
        })
        .slice(0, 10);
    } else {
      results = searchEntries.filter((entry) => entry.type === '页面').slice(0, 7);
    }

    if (searchStatus) {
      searchStatus.textContent = query
        ? results.length > 0
          ? '找到 ' + results.length + ' 条相关结果'
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
    if (searchRequest) return searchRequest;
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
      });
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

  searchInput?.addEventListener('input', renderSearch);
  searchInput?.addEventListener('keydown', (event) => {
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

initNavDock();
