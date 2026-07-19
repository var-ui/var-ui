import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { outline } from './outline';

describe('outline', () => {
  it('registers outline slots', () => {
    outline();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-outline');
    expect(css).toContain('.var-ui-outline__title');
    expect(css).toContain('.var-ui-outline__list');
    expect(css).toContain('.var-ui-outline__link');
    expect(css).toContain('.var-ui-outline__linkActive');
    expect(css).toContain('.var-ui-outline__linkNested');
  });

  it('themes border and link colors via custom properties', () => {
    outline();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-outline-border');
    expect(css).toContain('--var-ui-outline-linkcolor');
    expect(css).toContain('--var-ui-outline-linkactivecolor');
  });
});
