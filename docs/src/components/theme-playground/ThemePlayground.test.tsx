import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemePlayground from './ThemePlayground';

describe('ThemePlayground', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
  });

  it('renders bento showcase with default theme class', () => {
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.className).toContain('theme-var-ui-default');
  });

  it('updates preview theme class when preset changes', async () => {
    const user = userEvent.setup();
    render(<ThemePlayground />);
    await user.click(screen.getByRole('radio', { name: /forest/i }));
    const showcase = screen.getByTestId('bento-showcase');
    await waitFor(() => {
      expect(showcase.className).toContain('theme-var-ui-forest');
    });
  });

  it('inherits color-scheme from docs site', async () => {
    localStorage.setItem('theme-mode', 'dark');
    document.documentElement.setAttribute('data-mode', 'dark');
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.style.colorScheme).toBe('inherit');
  });
});
