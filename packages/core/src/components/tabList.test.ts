import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { tabList } from './tabList';

describe('tabList', () => {
  it('registers all slots', () => {
    tabList();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-tab-list');
    expect(css).toContain('.var-ui-tab-list__tab');
    expect(css).toContain('.var-ui-tab-list__indicator');
    expect(css).toContain('.var-ui-tab-list__menu');
    expect(css).toContain('.var-ui-tab-list__menuTrigger');
  });

  it('themes tab and indicator colors via custom properties', () => {
    tabList();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-tab-list-tabcolor');
    expect(css).toContain('--var-ui-tab-list-tabselectedcolor');
    expect(css).toContain('--var-ui-tab-list-indicatorcolor');
  });

  it('styles selected and disabled tabs via data attribute selectors', () => {
    tabList();
    const css = getRegisteredCss();
    expect(css).toContain('[data-selected]');
    expect(css).toContain('[data-disabled]');
  });

  it('switches layout, orientation, and divider via data attributes on root', () => {
    tabList();
    const css = getRegisteredCss();
    expect(css).toContain('[data-layout="fill"]');
    expect(css).toContain('[data-orientation="vertical"]');
    expect(css).toContain('[data-has-divider]');
  });

  it('applies size variants to tab and menuTrigger', () => {
    tabList({ size: 'sm' });
    const smCss = getRegisteredCss();
    expect(smCss).toContain('2rem');

    tabList({ size: 'lg' });
    const lgCss = getRegisteredCss();
    expect(lgCss).toContain('3rem');
  });
});
