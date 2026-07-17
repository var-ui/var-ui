import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { banner } from './banner';
import { progressBar } from './progressBar';
import { skeleton } from './skeleton';
import { spinner } from './spinner';
import { statusDot } from './statusDot';

describe('spinner', () => {
  it('registers an animated ring with reduced-motion fallback', () => {
    spinner({ size: 'lg' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-spinner');
    expect(css).toContain('.var-ui-spinner[data-size="lg"]');
    expect(css).toContain('animation');
    expect(css).toContain('prefers-reduced-motion');
  });
});

describe('skeleton', () => {
  it('registers shape variants with a shimmer animation', () => {
    skeleton({ shape: 'circle' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-skeleton');
    expect(css).toContain('.var-ui-skeleton[data-shape="circle"]');
    expect(css).toContain('animation');
  });
});

describe('progressBar', () => {
  it('registers slots and tone variants', () => {
    progressBar({ tone: 'success' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-progress-bar__track');
    expect(css).toContain('.var-ui-progress-bar__fill');
    expect(css).toContain('.var-ui-progress-bar[data-tone="success"]');
  });
});

describe('banner', () => {
  it('registers slots and tone variants', () => {
    banner({ tone: 'warning', appearance: 'solid' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-banner[data-tone="warning"]');
    expect(css).toContain('.var-ui-banner__dismiss');
  });
});

describe('statusDot', () => {
  it('registers tone and pulse variants', () => {
    statusDot({ tone: 'success', pulse: 'true' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-status-dot');
    expect(css).toContain('.var-ui-status-dot[data-tone="success"]');
    expect(css).toContain('.var-ui-status-dot[data-pulse]');
  });
});
