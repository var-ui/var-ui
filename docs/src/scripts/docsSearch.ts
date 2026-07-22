import {
  filterDocsSearchItems,
  flattenDocsSearchGroups,
  groupDocsSearchResults,
  moveDocsSearchActiveIndex,
} from '../lib/docs-search';
import type { DocsSearchItem } from '../lib/search-index';

const ROOT_SELECTOR = '[data-docs-search]';
const INITIALIZED_ATTR = 'data-docs-search-initialized';

function parseIndex(root: HTMLElement): DocsSearchItem[] {
  const script = root.querySelector<HTMLScriptElement>('script[data-docs-search-index]');
  if (!script?.textContent) return [];
  try {
    const parsed: unknown = JSON.parse(script.textContent);
    return Array.isArray(parsed) ? (parsed as DocsSearchItem[]) : [];
  } catch {
    return [];
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function initDocsSearch(): void {
  document.querySelectorAll(ROOT_SELECTOR).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.hasAttribute(INITIALIZED_ATTR)) return;
    node.setAttribute(INITIALIZED_ATTR, '');

    const dialogEl = node.querySelector<HTMLDialogElement>('[data-docs-search-dialog]');
    const rootEl = node.querySelector<HTMLElement>('.docs-search__root');
    const panelEl = node.querySelector<HTMLElement>('[data-docs-search-panel]');
    const inputEl = node.querySelector<HTMLInputElement>('[data-docs-search-input]');
    const resultsEl = node.querySelector<HTMLElement>('[data-docs-search-results]');
    const openButtons = node.querySelectorAll('[data-docs-search-open]');
    if (!dialogEl || !rootEl || !panelEl || !inputEl || !resultsEl) return;

    // Narrowed locals so nested handlers see non-null elements.
    const dialog: HTMLDialogElement = dialogEl;
    const root: HTMLElement = rootEl;
    const panel: HTMLElement = panelEl;
    const input: HTMLInputElement = inputEl;
    const results: HTMLElement = resultsEl;

    const index = parseIndex(node);
    let activeIndex = -1;
    let flatItems: DocsSearchItem[] = [];

    const resultLinkClass = node.dataset.classResultLink ?? 'docs-search__item';
    const resultLinkActiveClass = node.dataset.classResultLinkActive ?? 'is-active';
    const resultTitleClass = node.dataset.classResultTitle ?? 'docs-search__title';
    const resultMetaClass = node.dataset.classResultMeta ?? 'docs-search__meta';
    const emptyClass = node.dataset.classEmpty ?? 'docs-search__empty';

    function setOpen(open: boolean): void {
      if (open) {
        if (!dialog.open) dialog.showModal();
        root.setAttribute('data-open', '');
        panel.setAttribute('data-open', '');
        input.value = '';
        render('');
        queueMicrotask(() => input.focus());
      } else if (dialog.open) {
        root.removeAttribute('data-open');
        panel.removeAttribute('data-open');
        dialog.close();
      }
    }

    function render(query: string): void {
      const filtered = filterDocsSearchItems(index, query);
      const groups = groupDocsSearchResults(filtered);
      flatItems = flattenDocsSearchGroups(groups);
      activeIndex = flatItems.length > 0 ? 0 : -1;

      if (groups.length === 0) {
        results.innerHTML = `<p class="${emptyClass}" data-docs-search-empty>No results</p>`;
        return;
      }

      let flatIdx = 0;
      results.innerHTML = groups
        .map((group) => {
          const itemsHtml = group.items
            .map((item) => {
              const optionIndex = flatIdx++;
              const active = optionIndex === activeIndex ? ` ${resultLinkActiveClass}` : '';
              const meta = item.meta
                ? `<span class="${resultMetaClass}">${escapeHtml(item.meta)}</span>`
                : '';
              return `<a
                class="${resultLinkClass}${active}"
                href="${escapeAttr(item.id)}"
                role="option"
                data-docs-search-item
                data-index="${optionIndex}"
                id="docs-search-option-${optionIndex}"
              ><span class="${resultTitleClass}">${escapeHtml(item.title)}</span>${meta}</a>`;
            })
            .join('');
          return `<section class="docs-search__group" data-group="${group.id}">
            <h2 class="docs-search__group-label">${escapeHtml(group.label)}</h2>
            <div class="docs-search__group-items" role="group" aria-label="${escapeAttr(group.label)}">${itemsHtml}</div>
          </section>`;
        })
        .join('');

      syncActive();
    }

    function syncActive(): void {
      results.querySelectorAll<HTMLElement>('[data-docs-search-item]').forEach((el) => {
        const idx = Number(el.dataset.index);
        const isActive = idx === activeIndex;
        el.classList.toggle(resultLinkActiveClass, isActive);
        el.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      input.setAttribute(
        'aria-activedescendant',
        activeIndex >= 0 ? `docs-search-option-${activeIndex}` : '',
      );
      results.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
    }

    function activate(direction: 'up' | 'down'): void {
      activeIndex = moveDocsSearchActiveIndex(activeIndex, flatItems.length, direction);
      syncActive();
    }

    function selectActive(): void {
      const item = activeIndex >= 0 ? flatItems[activeIndex] : undefined;
      if (!item) return;
      setOpen(false);
      window.location.assign(item.id);
    }

    openButtons.forEach((button) => {
      button.addEventListener('click', () => setOpen(true));
    });

    dialog.addEventListener('close', () => {
      root.removeAttribute('data-open');
      panel.removeAttribute('data-open');
      activeIndex = -1;
      flatItems = [];
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) setOpen(false);
    });

    input.addEventListener('input', () => {
      render(input.value);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activate('down');
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activate('up');
      } else if (event.key === 'Enter') {
        event.preventDefault();
        selectActive();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    });

    results.addEventListener('mousemove', (event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-docs-search-item]',
      );
      if (!target || !results.contains(target)) return;
      const idx = Number(target.dataset.index);
      if (!Number.isFinite(idx) || idx === activeIndex) return;
      activeIndex = idx;
      syncActive();
    });

    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        if (isEditableTarget(event.target) && !dialog.open) return;
        event.preventDefault();
        setOpen(!dialog.open);
      }
    });
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", '&#39;');
}
