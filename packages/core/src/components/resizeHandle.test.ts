import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { resizeHandle } from './resizeHandle';

describe('resizeHandle', () => {
  it('registers root and pill slots', () => {
    resizeHandle();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-resize-handle');
    expect(css).toContain('var-ui-resize-handle__pill');
  });

  it('themes grip colors via custom properties', () => {
    resizeHandle();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-resize-handle-linecolor');
    expect(css).toContain('--var-ui-resize-handle-pillcolor');
    expect(css).toContain('--var-ui-resize-handle-focusring');
  });

  it('supports horizontal and vertical orientation selectors', () => {
    resizeHandle();
    const css = getRegisteredCss();
    expect(css).toContain('[data-orientation="horizontal"]');
    expect(css).toContain('[data-orientation="vertical"]');
  });
});
