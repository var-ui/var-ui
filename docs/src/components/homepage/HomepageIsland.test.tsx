import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import HomepageIsland from './HomepageIsland';

describe('HomepageIsland', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
  });

  it('inherits color-scheme from the docs site on load and after toggle updates', async () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.setAttribute('data-mode', 'light');
    document.documentElement.style.colorScheme = 'light';
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.style.colorScheme).toBe('inherit');
    expect(container.getAttribute('data-mode')).toBeNull();

    await act(async () => {
      localStorage.setItem('theme-mode', 'dark');
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    });

    await waitFor(() => {
      expect(container.style.colorScheme).toBe('inherit');
      expect(container.getAttribute('data-mode')).toBeNull();
    });
  });

  it('keeps inheriting color-scheme when storage changes in other tabs', async () => {
    localStorage.setItem('theme-mode', 'light');
    document.documentElement.setAttribute('data-mode', 'light');
    render(<HomepageIsland />);

    const container = screen.getByTestId('bento-showcase') as HTMLElement;
    expect(container.style.colorScheme).toBe('inherit');

    await act(async () => {
      localStorage.setItem('theme-mode', 'system');
      document.documentElement.removeAttribute('data-mode');
      document.documentElement.style.colorScheme = '';
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme-mode',
          newValue: 'system',
          storageArea: localStorage,
        }),
      );
    });

    await waitFor(() => {
      expect(container.style.colorScheme).toBe('inherit');
    });
  });
});
