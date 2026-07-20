import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import HomepageIsland from './HomepageIsland';

describe('HomepageIsland', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
  });

  it('syncs bento color mode when Astro ColorModeToggle updates document data-mode', async () => {
    localStorage.setItem('theme-mode', 'light');
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase');
    expect(container.getAttribute('data-mode')).toBe('light');

    await act(async () => {
      localStorage.setItem('theme-mode', 'dark');
      document.documentElement.setAttribute('data-mode', 'dark');
    });

    await waitFor(() => {
      expect(container.getAttribute('data-mode')).toBe('dark');
    });
  });

  it('syncs bento color mode from storage events in other tabs', async () => {
    localStorage.setItem('theme-mode', 'light');
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase');
    expect(container.getAttribute('data-mode')).toBe('light');

    await act(async () => {
      localStorage.setItem('theme-mode', 'system');
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme-mode',
          newValue: 'system',
          storageArea: localStorage,
        }),
      );
    });

    await waitFor(() => {
      expect(container.getAttribute('data-mode')).toBe('system');
    });
  });
});
