import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { topNav } from './topNav';

describe('topNav', () => {
  it('registers all slots', () => {
    topNav();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-top-nav');
    expect(css).toContain('.var-ui-top-nav__heading');
    expect(css).toContain('.var-ui-top-nav__start');
    expect(css).toContain('.var-ui-top-nav__center');
    expect(css).toContain('.var-ui-top-nav__end');
    expect(css).toContain('.var-ui-top-nav__item');
    expect(css).toContain('.var-ui-top-nav__menuTrigger');
    expect(css).toContain('.var-ui-top-nav__megaPanel');
    expect(css).toContain('.var-ui-top-nav__megaItem');
    expect(css).toContain('.var-ui-top-nav__featuredCard');
  });

  it('themes background, item, and accent colors via custom properties', () => {
    topNav();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-top-nav-background');
    expect(css).toContain('--var-ui-top-nav-itemcolor');
    expect(css).toContain('--var-ui-top-nav-itemselectedbackground');
    expect(css).toContain('--var-ui-top-nav-itemselectedcolor');
  });

  it('styles selected and disabled items via data attribute selectors', () => {
    topNav();
    const css = getRegisteredCss();
    expect(css).toContain('[data-selected]');
    expect(css).toContain('[data-disabled]');
  });

  it('switches root layout between flex and grid via data-layout', () => {
    topNav();
    const css = getRegisteredCss();
    expect(css).toContain('[data-layout="grid"]');
  });
});
