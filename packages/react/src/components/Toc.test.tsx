import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Toc } from './Toc';

describe('Toc', () => {
  it('renders manual items', () => {
    render(
      <Toc title="On this page">
        <Toc.Item label="Examples" href="#examples" isSelected />
        <Toc.Item label="Default" href="#default" isNested />
      </Toc>,
    );

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(nav).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Examples' }).getAttribute('aria-current')).toBe(
      'location',
    );
    expect(screen.getByRole('link', { name: 'Default' })).toBeTruthy();
  });
});
