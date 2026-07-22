import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { APP_SHELL_MAIN_ID, initAppShell } from './appShell';

function mountAppShell(breakpoint = 'md'): HTMLElement {
  const root = document.createElement('div');
  root.dataset.varUiAppShell = '';
  root.dataset.mobileBreakpoint = breakpoint;
  document.body.appendChild(root);
  return root;
}

describe('initAppShell', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('sets data-mobile when the viewport matches the breakpoint', () => {
    const root = mountAppShell('md');
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    initAppShell(root);
    expect(root.hasAttribute('data-mobile')).toBe(true);
  });

  it('clears data-mobile when the viewport is wider than the breakpoint', () => {
    const root = mountAppShell('md');
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    initAppShell(root);
    expect(root.hasAttribute('data-mobile')).toBe(false);
  });

  it('exports the main landmark id used by skip links', () => {
    expect(APP_SHELL_MAIN_ID).toBe('var-ui-app-shell-main');
  });
});
