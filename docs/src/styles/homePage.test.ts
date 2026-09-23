import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { styles } from '@var-ui/core';
import { homePage } from './homePage';

describe('homePage CSS', () => {
  it('registers hero, feature grid, and responsive layout slots', () => {
    homePage();
    const css = getRegisteredCss();
    const belowMd = styles.breakpoint('md', 'max');

    expect(css).toContain('72rem');
    expect(css).toContain('grid-template-columns');
    expect(css).toContain('repeat(3');
    expect(css).toContain(belowMd);
    expect(css).toContain('radial-gradient');
    expect(css).toContain('text-align: center');
    expect(css).toContain('home-page__heroWordmark');
  });
});
