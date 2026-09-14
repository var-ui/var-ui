import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Surface } from './Surface';

describe('Surface', () => {
  it('renders children inside a div with surface class', () => {
    render(<Surface>Content</Surface>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('var-ui-surface');
  });

  it('forwards native div attributes', () => {
    const { container } = render(
      <Surface data-widget-id="widget-1" id="surface-root">
        Content
      </Surface>,
    );
    const el = container.querySelector('#surface-root');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('data-widget-id')).toBe('widget-1');
  });
});
