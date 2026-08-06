import { defaultThemeClassName } from '@var-ui/core';
import { SHOWCASE_THEMES, type ShowcaseThemeId } from '@/components/homepage/showcaseThemes';

export const DOCS_THEME_STORAGE_KEY = 'docs-theme-id';

const THEME_IDS = new Set<string>(SHOWCASE_THEMES.map((theme) => theme.id));

export function isShowcaseThemeId(value: string | null | undefined): value is ShowcaseThemeId {
  return value != null && THEME_IDS.has(value);
}

export function readStoredDocsThemeId(): ShowcaseThemeId {
  if (typeof localStorage === 'undefined') return 'default';
  const stored = localStorage.getItem(DOCS_THEME_STORAGE_KEY);
  return isShowcaseThemeId(stored) ? stored : 'default';
}

export function getDocsThemeClassName(themeId: ShowcaseThemeId): string {
  const theme = SHOWCASE_THEMES.find((entry) => entry.id === themeId);
  return theme?.className ?? defaultThemeClassName;
}

export const ALL_DOCS_THEME_CLASS_NAMES = SHOWCASE_THEMES.map((theme) => theme.className);

export function applyDocsThemeToDocument(themeId: ShowcaseThemeId, doc: Document = document): void {
  const className = getDocsThemeClassName(themeId);
  const root = doc.documentElement;
  for (const cls of ALL_DOCS_THEME_CLASS_NAMES) {
    root.classList.remove(cls);
  }
  root.classList.add(className);
}

export function setDocsTheme(themeId: ShowcaseThemeId): void {
  localStorage.setItem(DOCS_THEME_STORAGE_KEY, themeId);
  applyDocsThemeToDocument(themeId);
}
