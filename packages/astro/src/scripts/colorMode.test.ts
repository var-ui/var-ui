import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { readStoredColorMode, resolveColorMode, applyColorModeToDocument } from './colorMode';

describe('colorMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
  });

  it('reads valid stored modes only', () => {
    localStorage.setItem('theme-mode', 'dark');
    expect(readStoredColorMode('theme-mode')).toBe('dark');
    localStorage.setItem('theme-mode', 'nope');
    expect(readStoredColorMode('theme-mode')).toBeNull();
  });

  it('resolveColorMode maps system via matchMedia stub', () => {
    expect(resolveColorMode('light')).toBe('light');
    expect(resolveColorMode('dark')).toBe('dark');
  });

  it('applyColorModeToDocument sets or clears data-mode', () => {
    applyColorModeToDocument('dark');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    applyColorModeToDocument('system');
    expect(document.documentElement.hasAttribute('data-mode')).toBe(false);
  });
});
