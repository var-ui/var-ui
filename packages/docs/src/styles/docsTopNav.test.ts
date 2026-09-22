import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { styles } from '@var-ui/core';
import { docsTopNav } from './docsTopNav';

describe('docsTopNav CSS', () => {
  it('keeps a nowrap header and collapses start/toggle at design breakpoints', () => {
    docsTopNav();
    const css = getRegisteredCss();
    const belowXl = styles.breakpoint('xl', 'max');
    const belowMd = styles.breakpoint('md', 'max');
    const belowSm = styles.breakpoint('sm', 'max');

    expect(css).toContain('flex-wrap: nowrap');
    expect(css).toContain(belowXl);
    expect(css).toContain(belowMd);
    expect(css).toContain(belowSm);
    expect(css).toContain('[data-var-ui-top-nav-start]');
    expect(css).toContain('[data-var-ui-mobile-nav-toggle]');
  });
});
