import { createTocSpy, positionTocIndicator, toc, type TocHeading } from '@var-ui/core';
import type { RecipeClass } from '../utils';
import { recipeClassName } from '../utils';

const ROOT_SELECTOR = '[data-var-ui-toc]';
const INITIALIZED_ATTR = 'data-var-ui-toc-initialized';

function slotClass(slot: RecipeClass): string {
  return recipeClassName(slot);
}

function ensureIndicator(list: HTMLOListElement): void {
  if (list.querySelector('[data-toc-indicator]')) return;

  const s = toc();
  const indicator = document.createElement('span');
  indicator.className = slotClass(s.indicator);
  indicator.dataset.tocIndicator = '';
  indicator.setAttribute('aria-hidden', 'true');
  list.prepend(indicator);
}

function renderTocList(list: HTMLOListElement, headings: TocHeading[]): void {
  const s = toc();
  ensureIndicator(list);

  for (const child of [...list.children]) {
    if (!(child instanceof HTMLElement) || !child.hasAttribute('data-toc-indicator')) {
      child.remove();
    }
  }

  for (const heading of headings) {
    const item = document.createElement('li');
    item.className = slotClass(s.item);
    if (heading.level === 3) item.dataset.nested = '';

    const link = document.createElement('a');
    link.className = slotClass(s.link);
    link.href = `#${heading.id}`;
    link.textContent = heading.text;
    link.dataset.tocLink = heading.id;

    item.append(link);
    list.append(item);
  }
}

export function setActive(list: HTMLOListElement, id: string | null): void {
  let activeLink: HTMLAnchorElement | null = null;

  for (const link of list.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')) {
    const isActive = link.dataset.tocLink === id;
    if (isActive) {
      link.setAttribute('data-selected', '');
      link.setAttribute('aria-current', 'location');
      activeLink = link;
    } else {
      link.removeAttribute('data-selected');
      link.removeAttribute('aria-current');
    }
  }

  positionTocIndicator(list, activeLink);
}

export function initToc(root: HTMLElement): () => void {
  if (root.hasAttribute(INITIALIZED_ATTR)) return () => {};
  root.setAttribute(INITIALIZED_ATTR, '');

  const isAuto = root.dataset.auto === 'true' || root.dataset.auto === '';
  if (!isAuto) return () => {};

  const contentSelector = root.dataset.contentSelector;
  const list = root.querySelector<HTMLOListElement>('[data-var-ui-toc-list]');
  if (!contentSelector || !list) return () => {};

  const contentRoot = document.querySelector(contentSelector);
  if (!contentRoot) return () => {};

  const minHeadings = Number.parseInt(root.dataset.minHeadings ?? '2', 10);
  const headerOffset = root.dataset.headerOffset
    ? Number.parseInt(root.dataset.headerOffset, 10)
    : undefined;
  const headingSelector = root.dataset.headingSelector;

  return createTocSpy({
    contentRoot,
    headingSelector,
    minHeadings,
    headerOffset,
    onHeadingsChange: (headings) => {
      if (headings.length < minHeadings) {
        root.hidden = true;
        for (const child of [...list.children]) {
          if (!(child instanceof HTMLElement) || !child.hasAttribute('data-toc-indicator')) {
            child.remove();
          }
        }
        setActive(list, null);
        return;
      }

      root.hidden = false;
      renderTocList(list, headings);
    },
    onActiveChange: (activeId) => {
      setActive(list, activeId);
    },
  });
}

export function initTocs(): void {
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    initToc(root);
  });
}
