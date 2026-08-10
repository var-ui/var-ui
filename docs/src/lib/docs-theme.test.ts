import { defaultThemeClassName } from '@var-ui/core';
import { forestTheme } from '@/themes';
import { describe, expect, it, beforeEach } from 'vite-plus/test';
import {
  ALL_DOCS_THEME_CLASS_NAMES,
  DOCS_THEME_STORAGE_KEY,
  applyDocsThemeToDocument,
  getDocsThemeClassName,
  readStoredDocsThemeId,
  setDocsTheme,
} from './docs-theme';
import { resetDocsThemeStylesForTests } from './docs-theme-styles';

describe('docs-theme', () => {
  beforeEach(() => {
    localStorage.clear();
    resetDocsThemeStylesForTests();
    document.documentElement.className = defaultThemeClassName;
  });

  it('reads the default theme when storage is empty', () => {
    expect(readStoredDocsThemeId()).toBe('default');
    expect(getDocsThemeClassName('default')).toBe(defaultThemeClassName);
  });

  it('persists and applies a selected theme class on the document root', async () => {
    setDocsTheme('forest');
    await Promise.resolve();
    expect(localStorage.getItem(DOCS_THEME_STORAGE_KEY)).toBe('forest');
    expect(readStoredDocsThemeId()).toBe('forest');
    expect(document.documentElement.classList.contains(forestTheme.className)).toBe(true);
    expect(document.documentElement.classList.contains(defaultThemeClassName)).toBe(false);
  });

  it('replaces any previous theme class when switching themes', () => {
    applyDocsThemeToDocument('forest');
    applyDocsThemeToDocument('default');
    expect(document.documentElement.classList.contains(forestTheme.className)).toBe(false);
    expect(document.documentElement.classList.contains(defaultThemeClassName)).toBe(true);
    for (const className of ALL_DOCS_THEME_CLASS_NAMES) {
      const matches = [...document.documentElement.classList].filter((cls) => cls === className);
      expect(matches.length).toBeLessThanOrEqual(1);
    }
  });
});
