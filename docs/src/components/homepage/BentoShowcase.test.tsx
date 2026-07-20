import { forestTheme } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider } from '@var-ui/react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { BentoShowcase } from './BentoShowcase';

function renderShowcase(
  themeId: Parameters<typeof BentoShowcase>[0]['themeId'],
  defaultColorMode: 'light' | 'dark' | 'system' = 'light',
) {
  return render(
    <DesignSystemProvider defaultColorMode={defaultColorMode}>
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <BentoShowcase themeId={themeId} />
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>,
  );
}

describe('BentoShowcase', () => {
  it('renders all 9 tiles', () => {
    renderShowcase('default');
    expect(screen.getByText('Invite a teammate')).toBeTruthy();
    expect(screen.getByText('Deploy queued')).toBeTruthy();
    expect(screen.getByText('Notification preferences')).toBeTruthy();
    expect(screen.getByText('No projects yet')).toBeTruthy();
    expect(screen.getByText('Release notes')).toBeTruthy();
    expect(screen.getByText('Design team')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Product tour' })).toBeTruthy();
    expect(screen.getByText('Layout preview')).toBeTruthy();
    expect(screen.getByText("You're on the Free plan")).toBeTruthy();
  });

  it('applies the selected theme class and the ambient light/dark mode to the container', () => {
    renderShowcase('forest');
    const container = screen.getByTestId('bento-showcase');
    expect(container.className).toContain(forestTheme.className);
    expect(container.getAttribute('data-mode')).toBe('light');
  });

  it('passes through a "system" ambient mode to the container', () => {
    renderShowcase('default', 'system');
    const container = screen.getByTestId('bento-showcase');
    expect(container.getAttribute('data-mode')).toBe('system');
  });
});
