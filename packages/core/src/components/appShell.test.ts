import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { appShell } from './appShell';

describe('appShell', () => {
  it('registers all slots', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-app-shell');
    expect(css).toContain('.var-ui-app-shell__banner');
    expect(css).toContain('.var-ui-app-shell__frame');
    expect(css).toContain('.var-ui-app-shell__topNav');
    expect(css).toContain('.var-ui-app-shell__sideNav');
    expect(css).toContain('.var-ui-app-shell__main');
    expect(css).toContain('.var-ui-app-shell__skipLink');
  });

  it('themes background and content padding via custom properties', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-app-shell-background');
    expect(css).toContain('--var-ui-app-shell-contentpadding');
  });

  it('applies height and variant selectors', () => {
    appShell({ height: 'fill', variant: 'elevated' });
    const css = getRegisteredCss();
    expect(css).toContain('100dvh');
    expect(css).toContain('box-shadow');
  });

  it('hides the side nav column when the root is mobile', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('[data-mobile]');
  });

  it('lays out top nav, side nav, and main in a grid', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('grid-template-areas');
    expect(css).toContain('grid-area');
  });

  it('registers the aside slot and its width custom property', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-app-shell__aside');
    expect(css).toContain('--var-ui-app-shell-asidewidth');
  });

  it('hides the aside column when the root is mobile', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('[data-mobile]');
  });

  it('expands the grid to three columns when the root has data-aside', () => {
    appShell();
    const css = getRegisteredCss();
    expect(css).toContain('[data-aside]');
  });
});
