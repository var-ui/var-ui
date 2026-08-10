import type { ShowcaseThemeId } from '@/components/homepage/showcaseThemes';
import { getDocsThemeStylesHref } from './showcase-theme-ids';

const loadedThemeStyles = new Set<string>();

function findThemeStylesheet(themeId: ShowcaseThemeId): HTMLLinkElement | null {
  return document.querySelector(`link[data-docs-theme-style="${themeId}"]`);
}

/**
 * Load extracted CSS for a non-default showcase theme. Default theme styles live in
 * `/typestyles.css`.
 */
export function ensureDocsThemeStyles(themeId: ShowcaseThemeId, onReady?: () => void): void {
  const href = getDocsThemeStylesHref(themeId);
  if (!href) {
    onReady?.();
    return;
  }

  if (loadedThemeStyles.has(href)) {
    onReady?.();
    return;
  }

  const existing = findThemeStylesheet(themeId);
  if (existing) {
    loadedThemeStyles.add(href);
    if (existing.sheet) {
      onReady?.();
    } else {
      existing.addEventListener('load', () => onReady?.(), { once: true });
    }
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.docsThemeStyle = themeId;

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    loadedThemeStyles.add(href);
    onReady?.();
  };

  link.addEventListener('load', finish, { once: true });
  link.addEventListener('error', finish, { once: true });
  document.head.appendChild(link);

  // jsdom and some SSR environments never fire load/error for external CSS.
  queueMicrotask(() => {
    if (!link.sheet) finish();
  });
}

/** @internal Test helper */
export function resetDocsThemeStylesForTests(): void {
  loadedThemeStyles.clear();
  for (const link of document.querySelectorAll('link[data-docs-theme-style]')) {
    link.remove();
  }
}
