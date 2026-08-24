import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Hidden } from './Hidden';

describe('Hidden', () => {
  it('always renders children', () => {
    render(
      <Hidden hide={{ md: true }}>
        <span>sidebar</span>
      </Hidden>,
    );
    expect(screen.getByText('sidebar')).toBeTruthy();
  });

  it('honors as', () => {
    const { container } = render(
      <Hidden as="aside" hide={{ md: true }}>
        nav
      </Hidden>,
    );
    expect(container.querySelector('aside')).toBeTruthy();
  });

  it('applies a hidden class for hide true', () => {
    const { container } = render(<Hidden hide>secret</Hidden>);
    expect(container.firstElementChild?.className).toContain('hidden-always');
  });
});
