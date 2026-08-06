import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders a scrollable viewport with recipe classes', () => {
    const { container } = render(
      <ScrollArea fade="vertical" style={{ height: 200 }}>
        <p>content</p>
      </ScrollArea>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('var-ui-scroll-area');
    expect(root.getAttribute('data-fade')).toBe('vertical');

    const viewport = root.querySelector('.var-ui-scroll-area__viewport') as HTMLElement;
    expect(viewport).toBeTruthy();
    expect(viewport.textContent).toContain('content');
    expect(viewport.querySelector('.var-ui-scroll-area__fadeTop')).toBeTruthy();
  });

  it('renders vertical fade edges when fade is enabled', () => {
    const { container } = render(
      <ScrollArea fade="vertical">
        <p>content</p>
      </ScrollArea>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(
      root.querySelector('.var-ui-scroll-area__viewport .var-ui-scroll-area__fadeTop'),
    ).toBeTruthy();
    expect(
      root.querySelector('.var-ui-scroll-area__viewport .var-ui-scroll-area__fadeBottom'),
    ).toBeTruthy();
    expect(root.querySelector('.var-ui-scroll-area__fadeStart')).toBeNull();
    expect(root.querySelector('.var-ui-scroll-area__fadeEnd')).toBeNull();
  });

  it('does not render fade edges when fade is disabled', () => {
    const { container } = render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.querySelector('.var-ui-scroll-area__fadeTop')).toBeNull();
    expect(root.querySelector('.var-ui-scroll-area__fadeBottom')).toBeNull();
  });
});
