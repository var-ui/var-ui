import type { DocsThemePreset } from './presets';
import { createThemeClassMap, getAllThemeClassNames, getDocsThemeStylesHref } from './presets';

const loadedThemeStyles = new Set<string>();

/**
 * Load extracted CSS for a lazy showcase theme. Non-lazy themes live in the main
 * typestyles stylesheet.
 */
export function ensureDocsThemeStyles(
  themeId: string,
  presets: readonly DocsThemePreset[] | undefined | null,
  onReady?: () => void,
): void {
  const href = getDocsThemeStylesHref(themeId, presets);
  if (!href) {
    onReady?.();
    return;
  }

  if (loadedThemeStyles.has(href)) {
    onReady?.();
    return;
  }

  const existing = document.querySelector(`link[data-docs-theme-style="${themeId}"]`);
  if (existing instanceof HTMLLinkElement) {
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

export type DocsThemeController = {
  storageKey: string;
  isThemeId: (value: string | null | undefined) => value is string;
  readStoredThemeId: () => string;
  getThemeClassName: (themeId: string) => string;
  allClassNames: string[];
  applyThemeToDocument: (themeId: string, doc?: Document) => void;
  setTheme: (themeId: string) => void;
};

export function createDocsThemeController(
  presets: readonly DocsThemePreset[],
  options?: {
    storageKey?: string;
    defaultThemeId?: string;
    fallbackClassName?: string;
  },
): DocsThemeController {
  const storageKey = options?.storageKey ?? 'docs-theme-id';
  const defaultThemeId = options?.defaultThemeId ?? presets[0]?.id ?? 'default';
  const classMap = createThemeClassMap(presets);
  const allClassNames = getAllThemeClassNames(presets);
  const fallbackClassName =
    options?.fallbackClassName ?? classMap[defaultThemeId] ?? allClassNames[0] ?? '';
  const ids = new Set(presets.map((p) => p.id));

  const isThemeId = (value: string | null | undefined): value is string =>
    value != null && ids.has(value);

  const readStoredThemeId = (): string => {
    if (typeof localStorage === 'undefined') return defaultThemeId;
    const stored = localStorage.getItem(storageKey);
    return isThemeId(stored) ? stored : defaultThemeId;
  };

  const getThemeClassName = (themeId: string): string => classMap[themeId] ?? fallbackClassName;

  const applyThemeClassToRoot = (themeId: string, doc: Document): void => {
    const className = getThemeClassName(themeId);
    const root = doc.documentElement;
    for (const cls of allClassNames) {
      root.classList.remove(cls);
    }
    root.classList.add(className);
  };

  const applyThemeToDocument = (themeId: string, doc: Document = document): void => {
    const apply = () => applyThemeClassToRoot(themeId, doc);
    if (typeof document !== 'undefined' && doc === document) {
      ensureDocsThemeStyles(themeId, presets, apply);
      return;
    }
    apply();
  };

  const setTheme = (themeId: string): void => {
    localStorage.setItem(storageKey, themeId);
    applyThemeToDocument(themeId);
  };

  return {
    storageKey,
    isThemeId,
    readStoredThemeId,
    getThemeClassName,
    allClassNames,
    applyThemeToDocument,
    setTheme,
  };
}
