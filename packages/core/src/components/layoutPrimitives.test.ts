import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { aspectRatio } from './aspectRatio';
import { center } from './center';
import { divider } from './divider';
import { grid } from './grid';
import { section } from './section';
import { stack } from './stack';

describe('layout primitives', () => {
  it('stack registers direction and gap variants', () => {
    stack({ direction: 'row', gap: 'lg' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-stack-base');
    expect(css).toContain('example-ds-stack-direction-row');
    expect(css).toContain('example-ds-stack-gap-lg');
  });

  it('grid registers auto-fill column mode with a min-column var', () => {
    grid({ columns: 'auto' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-grid-base');
    expect(css).toMatch(/auto-fill.*minmax/);
  });

  it('divider registers both orientations', () => {
    divider({ orientation: 'vertical' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-divider-orientation-vertical');
  });

  it('section, center, aspectRatio register base classes', () => {
    section();
    center();
    aspectRatio();
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-section-root');
    expect(css).toContain('example-ds-center-base');
    expect(css).toContain('example-ds-aspect-ratio-base');
  });
});
