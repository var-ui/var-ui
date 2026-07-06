import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { skeleton } from './skeleton';
import { spinner } from './spinner';

describe('spinner', () => {
  it('registers an animated ring with reduced-motion fallback', () => {
    spinner({ size: 'lg' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-spinner-base');
    expect(css).toContain('example-ds-spinner-size-lg');
    expect(css).toContain('animation');
    expect(css).toContain('prefers-reduced-motion');
  });
});

describe('skeleton', () => {
  it('registers shape variants with a shimmer animation', () => {
    skeleton({ shape: 'circle' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-skeleton-base');
    expect(css).toContain('example-ds-skeleton-shape-circle');
    expect(css).toContain('animation');
  });
});
