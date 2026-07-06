import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { progressBar } from './progressBar';
import { skeleton } from './skeleton';
import { spinner } from './spinner';
import { statusDot } from './statusDot';

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

describe('progressBar', () => {
  it('registers slots and tone variants', () => {
    progressBar({ tone: 'success' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-progress-bar-track');
    expect(css).toContain('example-ds-progress-bar-fill');
    expect(css).toContain('example-ds-progress-bar-root-tone-success');
  });
});

describe('statusDot', () => {
  it('registers tone and pulse variants', () => {
    statusDot({ tone: 'success', pulse: 'true' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-status-dot-base');
    expect(css).toContain('example-ds-status-dot-tone-success');
    expect(css).toContain('example-ds-status-dot-pulse-true');
  });
});
