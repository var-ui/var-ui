import { DesignSystemProvider, IconProvider } from '@var-ui/react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const icons = {
  colorModeLight: <span />,
  colorModeDark: <span />,
  colorModeSystem: <span />,
};

function renderSwitcher(defaultColorMode: 'light' | 'dark' | 'system') {
  return render(
    <DesignSystemProvider defaultColorMode={defaultColorMode}>
      <IconProvider icons={icons}>
        <ColorModeSwitcher />
      </IconProvider>
    </DesignSystemProvider>,
  );
}

describe('ColorModeSwitcher', () => {
  it('renders a segment for each of light, dark, and system', () => {
    renderSwitcher('light');
    expect(screen.getByRole('radio', { name: 'Light' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'System' })).toBeTruthy();
  });

  it('marks the segment matching the current preference as checked', () => {
    renderSwitcher('dark');
    expect(screen.getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Light' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('radio', { name: 'System' }).getAttribute('aria-checked')).toBe(
      'false',
    );
  });

  it('switches the checked segment when a different mode is clicked', async () => {
    renderSwitcher('light');
    await userEvent.click(screen.getByRole('radio', { name: 'System' }));
    expect(screen.getByRole('radio', { name: 'System' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Light' }).getAttribute('aria-checked')).toBe('false');
  });
});
