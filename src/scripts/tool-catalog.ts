import { initFilter } from './filter';

interface CatalogGroupView {
  key: string;
  toolIds: string[];
  collapsedIds: string[];
}
interface CatalogView {
  id: string;
  categories: { id: string; groups: CatalogGroupView[] }[];
}

const CARD_INERT_SELECTORS = '.tool-card__identity, .tool-card__details, .tool-card__foot';

function syncSheetMark(card: HTMLElement, sheetMark: HTMLElement): void {
  const cardMark = card.querySelector<HTMLElement>('.tool-mark');
  if (!cardMark) return;
  sheetMark.className = cardMark.className;
  const clones = Array.from(cardMark.children).map((child) => {
    const node = child.cloneNode(true) as HTMLElement;
    if (node instanceof HTMLImageElement) node.loading = 'eager';
    return node;
  });
  sheetMark.replaceChildren(...clones);
}

/** 移动现有卡片，保留链接、详情状态和主题样式；手机端切换为 App 网格与底部抽屉。 */
export function initToolCatalog(): void {
  const root = document.querySelector<HTMLElement>('[data-tool-catalog]');
  const configuration = root?.querySelector<HTMLScriptElement>('[data-catalog-config]');
  if (!root || !configuration) return;

  const config = JSON.parse(configuration.textContent ?? '{}') as {
    views: Record<string, CatalogView>;
    categoryNames: Record<string, string>;
    aliases: Record<string, string>;
  };

  const cards = new Map(
    Array.from(root.querySelectorAll<HTMLElement>('[data-filter-card]')).map((card) => [card.dataset.toolId!, card]),
  );
  const targets = new Map(
    Array.from(root.querySelectorAll<HTMLElement>('[data-catalog-target]')).map((target) => [
      target.dataset.catalogTarget!,
      target,
    ]),
  );
  const pool = root.querySelector<HTMLElement>('[data-catalog-pool]')!;
  const results = root.querySelector<HTMLElement>('[data-catalog-results]')!;

  const capToggle = root.querySelector<HTMLButtonElement>('[data-cap-toggle]');
  const capToggleLabel = root.querySelector<HTMLElement>('[data-cap-toggle-label]');
  const capList = root.querySelector<HTMLElement>('[data-cap-list]');

  const sheet = root.querySelector<HTMLDialogElement>('[data-tool-sheet]');
  const sheetMark = sheet?.querySelector<HTMLElement>('[data-sheet-mark]') ?? null;
  const sheetTitle = sheet?.querySelector<HTMLElement>('[data-sheet-title]') ?? null;
  const sheetSub = sheet?.querySelector<HTMLElement>('[data-sheet-sub]') ?? null;
  const sheetCategory = sheet?.querySelector<HTMLElement>('[data-sheet-category]') ?? null;
  const sheetSummary = sheet?.querySelector<HTMLElement>('[data-sheet-summary]') ?? null;
  const sheetDescription = sheet?.querySelector<HTMLElement>('[data-sheet-description]') ?? null;
  const sheetBestWrap = sheet?.querySelector<HTMLElement>('[data-sheet-best-wrap]') ?? null;
  const sheetBest = sheet?.querySelector<HTMLElement>('[data-sheet-best]') ?? null;
  const sheetTags = sheet?.querySelector<HTMLElement>('[data-sheet-tags]') ?? null;
  const sheetCautionWrap = sheet?.querySelector<HTMLElement>('[data-sheet-caution-wrap]') ?? null;
  const sheetCaution = sheet?.querySelector<HTMLElement>('[data-sheet-caution]') ?? null;
  const sheetVerify = sheet?.querySelector<HTMLElement>('[data-sheet-verify]') ?? null;
  const sheetUrl = sheet?.querySelector<HTMLAnchorElement>('[data-sheet-url]') ?? null;
  const sheetRepo = sheet?.querySelector<HTMLAnchorElement>('[data-sheet-repo]') ?? null;
  const sheetClose = sheet?.querySelector<HTMLButtonElement>('[data-sheet-close]') ?? null;
  const sheetBody = sheet?.querySelector<HTMLElement>('[data-sheet-body]') ?? null;

  const mobile = window.matchMedia('(max-width: 760px)');
  const desktop = window.matchMedia('(min-width: 1021px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentView = '';
  let printing = false;
  let capExpanded = false;
  let activeCapCount = 0;
  let lastTrigger: HTMLButtonElement | null = null;
  let closeTimer = 0;

  const isMobileAppMode = () => mobile.matches && !printing;

  const syncCapPanel = () => {
    if (!capToggle || !capList) return;
    const compact = isMobileAppMode();
    capToggle.hidden = !compact;
    if (!compact) {
      capList.hidden = false;
      capToggle.setAttribute('aria-expanded', 'true');
      return;
    }
    capList.hidden = !capExpanded;
    capToggle.setAttribute('aria-expanded', String(capExpanded));
    if (capToggleLabel) {
      if (activeCapCount > 0) {
        capToggleLabel.textContent = capExpanded ? `收起（已选 ${activeCapCount}）` : `已选 ${activeCapCount} 项`;
      } else {
        capToggleLabel.textContent = capExpanded ? '收起' : '展开';
      }
    }
  };

  const closeSheet = (immediate = false) => {
    if (!sheet?.open) return;
    window.clearTimeout(closeTimer);
    if (immediate || reducedMotion.matches) {
      sheet.classList.remove('is-closing');
      delete sheet.dataset.closing;
      sheet.close();
      return;
    }
    if (sheet.dataset.closing === 'true') return;
    sheet.dataset.closing = 'true';
    sheet.classList.add('is-closing');
    const finish = () => {
      window.clearTimeout(closeTimer);
      sheet.classList.remove('is-closing');
      delete sheet.dataset.closing;
      if (sheet.open) sheet.close();
    };
    sheet.addEventListener('animationend', finish, { once: true });
    closeTimer = window.setTimeout(finish, 180);
  };

  const syncCardMode = () => {
    const appMode = isMobileAppMode();
    if (appMode) root.dataset.mobileAppGrid = 'true';
    else delete root.dataset.mobileAppGrid;

    if (!appMode && sheet?.open) closeSheet(true);

    cards.forEach((card) => {
      const tile = card.querySelector<HTMLButtonElement>('[data-tool-tile]');
      if (tile) tile.hidden = !appMode;
      card.querySelectorAll<HTMLElement>(CARD_INERT_SELECTORS).forEach((section) => {
        section.inert = appMode;
        if (appMode) section.setAttribute('aria-hidden', 'true');
        else section.removeAttribute('aria-hidden');
      });
    });

    syncCapPanel();
  };

  const openSheet = (card: HTMLElement, trigger: HTMLButtonElement) => {
    if (!sheet || !sheetTitle) return;
    lastTrigger = trigger;

    if (sheetMark) syncSheetMark(card, sheetMark);

    const name = card.querySelector<HTMLElement>('.tool-card__identity h3 a, .tool-card__identity h4 a')?.textContent?.trim() ?? '';
    const sub = card.querySelector<HTMLElement>('.tool-card__identity p')?.textContent?.trim() ?? '';
    const category = card.querySelector<HTMLElement>('[data-tool-category-label]')?.textContent?.trim() ?? '';
    const summary = card.querySelector<HTMLElement>('.tool-card__summary')?.textContent?.trim() ?? '';
    const description = card.querySelector<HTMLElement>('.tool-card__description')?.textContent?.trim() ?? '';
    const bestFor = card.dataset.bestFor?.trim() ?? '';
    const caution = card.querySelector<HTMLElement>('.tool-card__caution')?.textContent?.trim() ?? '';
    const verify = card.querySelector<HTMLElement>('.tool-card__verify');
    const primaryLink = card.querySelector<HTMLAnchorElement>('.tool-card__foot .link-arrow');
    const repoLink = card.querySelector<HTMLAnchorElement>('.tool-card__foot .tool-card__repo');

    sheetTitle.textContent = name;
    if (sheetSub) sheetSub.textContent = sub;
    if (sheetCategory) sheetCategory.textContent = category;
    if (sheetSummary) sheetSummary.textContent = summary;
    if (sheetDescription) sheetDescription.textContent = description;

    if (sheetBestWrap && sheetBest) {
      sheetBestWrap.hidden = !bestFor;
      sheetBest.textContent = bestFor;
    }

    if (sheetTags) {
      const tagNodes = Array.from(card.querySelectorAll<HTMLElement>('.tool-card__details .tag-list .tag')).map((tag) =>
        tag.cloneNode(true),
      );
      sheetTags.replaceChildren(...tagNodes);
      sheetTags.hidden = tagNodes.length === 0;
    }

    if (sheetCautionWrap && sheetCaution) {
      sheetCautionWrap.hidden = !caution;
      sheetCaution.textContent = caution;
    }

    if (sheetVerify) {
      if (verify) sheetVerify.replaceChildren(...Array.from(verify.childNodes).map((node) => node.cloneNode(true)));
      else sheetVerify.replaceChildren();
    }

    if (sheetUrl) {
      sheetUrl.hidden = !primaryLink;
      if (primaryLink) sheetUrl.href = primaryLink.href;
      else sheetUrl.removeAttribute('href');
    }

    if (sheetRepo) {
      sheetRepo.hidden = !repoLink;
      if (repoLink) sheetRepo.href = repoLink.href;
      else sheetRepo.removeAttribute('href');
    }

    window.clearTimeout(closeTimer);
    sheet.classList.remove('is-closing');
    delete sheet.dataset.closing;

    if (!sheet.open) sheet.showModal();
    if (sheetBody) sheetBody.scrollTop = 0;
    sheetClose?.focus({ preventScroll: true });
  };

  root.addEventListener('click', (event) => {
    const trigger = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-tool-tile]');
    if (!trigger || !isMobileAppMode()) return;
    const card = trigger.closest<HTMLElement>('[data-filter-card]');
    if (card) openSheet(card, trigger);
  });

  capToggle?.addEventListener('click', () => {
    capExpanded = !capExpanded;
    syncCapPanel();
  });

  sheetClose?.addEventListener('click', () => closeSheet());
  sheet?.addEventListener('click', (event) => {
    if (event.target === sheet) closeSheet();
  });
  sheet?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeSheet();
  });
  sheet?.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    sheet.classList.remove('is-closing');
    delete sheet.dataset.closing;
    if (lastTrigger?.isConnected && !lastTrigger.hidden) {
      lastTrigger.focus({ preventScroll: true });
    }
    lastTrigger = null;
  });

  const filter = initFilter({
    searchWithinCategory: true,
    categoryAliases: config.aliases,
    beforeApply: ({ category }) => {
      if (printing) return;
      if (category === currentView) return;
      currentView = category;
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
            if (label) {
              label.textContent =
                config.categoryNames[category === 'all' ? card.dataset.primaryCategory! : category] ?? '';
            }
            assigned.add(id);
          }
        }
      }
      cards.forEach((card, id) => {
        if (!assigned.has(id)) pool.append(card);
      });
    },
    afterApply: ({ reason, capabilities }) => {
      activeCapCount = capabilities.length;
      if ((reason === 'init' || reason === 'history') && activeCapCount > 0) {
        capExpanded = true;
      }
      syncCapPanel();
      if (reason === 'filter' && desktop.matches && !printing) {
        results.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    },
  });

  syncCardMode();
  mobile.addEventListener('change', () => {
    syncCardMode();
    if (!printing) filter?.refresh();
  });

  // 打印完整匹配集并展开折叠区，同时恢复为完整信息卡片而非图标瓷贴。
  window.addEventListener('beforeprint', () => {
    printing = true;
    syncCardMode();
    filter?.refresh();
    root.querySelectorAll<HTMLDetailsElement>('[data-collapse]').forEach((details) => {
      details.open = true;
    });
  });
  window.addEventListener('afterprint', () => {
    printing = false;
    syncCardMode();
    filter?.refresh();
  });

  root.dataset.catalogReady = 'true';
}
