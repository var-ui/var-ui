import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { sideNav } from './sideNav';

describe('sideNav', () => {
  it('registers all slots', () => {
    sideNav();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-side-nav');
    expect(css).toContain('.var-ui-side-nav__stickyTop');
    expect(css).toContain('.var-ui-side-nav__topContent');
    expect(css).toContain('.var-ui-side-nav__scrollable');
    expect(css).toContain('.var-ui-side-nav__footer');
    expect(css).toContain('.var-ui-side-nav__footerIcons');
    expect(css).toContain('.var-ui-side-nav__heading');
    expect(css).toContain('.var-ui-side-nav__section');
    expect(css).toContain('.var-ui-side-nav__sectionTitle');
    expect(css).toContain('.var-ui-side-nav__item');
    expect(css).toContain('.var-ui-side-nav__itemLabel');
    expect(css).toContain('.var-ui-side-nav__collapseButton');
  });

  it('defines component vars on the root class rule', () => {
    sideNav();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-side-nav-itemselectedbackground:');
    expect(css).toContain('--var-ui-side-nav-itemselectedcolor:');
  });

  it('themes background, item, and accent colors via custom properties', () => {
    sideNav();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-side-nav-background');
    expect(css).toContain('--var-ui-side-nav-itemcolor');
    expect(css).toContain('--var-ui-side-nav-itemselectedbackground');
    expect(css).toContain('--var-ui-side-nav-itemselectedcolor');
  });

  it('styles selected items via a data-selected attribute selector', () => {
    sideNav();
    const css = getRegisteredCss();
    expect(css).toContain('[data-selected]');
  });

  it('hides item labels and section titles when the nav is collapsed', () => {
    sideNav();
    const css = getRegisteredCss();
    expect(css).toContain('[data-collapsed]');
    expect(css).toContain('width: 3.5rem');
  });
});
