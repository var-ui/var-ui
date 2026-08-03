import { createTabsController } from '../../../packages/astro/src/scripts/tabs';

const TAB_IDS = ['documentation', 'props', 'styles'] as const;
const INITIALIZED_ATTR = 'data-component-doc-tabs-initialized';

type ComponentDocTab = (typeof TAB_IDS)[number];

function parseTab(value: string | null | undefined): ComponentDocTab {
  const normalized = value?.trim().toLowerCase();
  return TAB_IDS.includes(normalized as ComponentDocTab)
    ? (normalized as ComponentDocTab)
    : 'documentation';
}

function tabIdFromLocation(): ComponentDocTab {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('tab');
  if (fromQuery) return parseTab(fromQuery);
  const fromHash = window.location.hash.replace(/^#/, '');
  return parseTab(fromHash);
}

function selectTabById(root: HTMLElement, tabId: string): void {
  const tab = root.querySelector<HTMLElement>(`[role="tab"]#tab-${tabId}`);
  if (!tab) return;
  tab.click();
}

function syncLocation(tabId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tabId);
  url.hash = '';
  window.history.replaceState({}, '', url);
}

function syncTocVisibility(root: HTMLElement): void {
  const docPanel = root.querySelector<HTMLElement>('#panel-documentation');
  const toc = root.querySelector<HTMLElement>('[data-component-doc-toc]');
  if (!docPanel || !toc) return;

  if (docPanel.hasAttribute('hidden')) {
    toc.setAttribute('hidden', '');
  } else {
    toc.removeAttribute('hidden');
  }
}

export function initComponentDocTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-component-doc-tabs]').forEach((root) => {
    if (root.hasAttribute(INITIALIZED_ATTR)) return;
    root.setAttribute(INITIALIZED_ATTR, '');

    createTabsController(root);

    const initialTab = tabIdFromLocation();
    if (initialTab !== 'documentation') {
      requestAnimationFrame(() => {
        selectTabById(root, initialTab);
        syncTocVisibility(root);
      });
    } else {
      syncTocVisibility(root);
    }

    root.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabId = tab.id.replace(/^tab-/, '');
        if (TAB_IDS.includes(tabId as ComponentDocTab)) {
          syncLocation(tabId);
        }
        requestAnimationFrame(() => syncTocVisibility(root));
      });
    });

    const tablist = root.querySelector('[role="tablist"]');
    tablist?.addEventListener('keydown', () => {
      requestAnimationFrame(() => syncTocVisibility(root));
    });
  });
}

function onPageLoad(): void {
  initComponentDocTabs();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
