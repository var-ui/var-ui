import { DesignSystemProvider } from '@var-ui/react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function renderSwitcher(defaultTheme: 'light' | 'dark' | 'system') {
  return render(
    <DesignSystemProvider defaultTheme={defaultTheme}>
      <ColorModeSwitcher />
    </DesignSystemProvider>,
  );
}

describe('ColorModeSwitcher', () => {
  it('renders a button for each of light, dark, and system', () => {
    renderSwitcher('light');
    expect(screen.getByRole('button', { name: 'Light' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'System' })).toBeTruthy();
  });

  it('marks the button matching the current preference as pressed', () => {
    renderSwitcher('dark');
    expect(screen.getByRole('button', { name: 'Dark' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
    expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('switches the pressed button when a different mode is clicked', async () => {
    renderSwitcher('light');
    await userEvent.click(screen.getByRole('button', { name: 'System' }));
    expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });
});
