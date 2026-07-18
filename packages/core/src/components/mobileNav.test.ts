import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { mobileNav } from './mobileNav';

describe('mobileNav', () => {
  it('registers all slots', () => {
    mobileNav();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-mobile-nav__overlay');
    expect(css).toContain('.var-ui-mobile-nav__panel');
    expect(css).toContain('.var-ui-mobile-nav__header');
    expect(css).toContain('.var-ui-mobile-nav__closeButton');
    expect(css).toContain('.var-ui-mobile-nav__toggle');
  });

  it('themes overlay and panel colors via custom properties', () => {
    mobileNav();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-mobile-nav-overlaybackground');
    expect(css).toContain('--var-ui-mobile-nav-panelbackground');
    expect(css).toContain('--var-ui-mobile-nav-panelborder');
    expect(css).toContain('--var-ui-mobile-nav-panelwidth');
  });

  it('positions the panel on start or end via data-side', () => {
    mobileNav();
    const css = getRegisteredCss();
    expect(css).toContain('[data-side="start"]');
    expect(css).toContain('[data-side="end"]');
    expect(css).toContain('translateX(-100%)');
    expect(css).toContain('translateX(100%)');
  });

  it('hides the overlay when data-open is absent', () => {
    mobileNav();
    const css = getRegisteredCss();
    expect(css).toContain(':not([data-open])');
  });
});
