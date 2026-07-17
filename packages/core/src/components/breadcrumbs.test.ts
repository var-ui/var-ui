import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { breadcrumbs } from './breadcrumbs';

describe('breadcrumbs', () => {
  it('registers root, list, item, ellipsisItem, and link slots', () => {
    breadcrumbs();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-breadcrumbs');
    expect(css).toContain('.var-ui-breadcrumbs__list');
    expect(css).toContain('.var-ui-breadcrumbs__item');
    expect(css).toContain('.var-ui-breadcrumbs__ellipsisItem');
    expect(css).toContain('.var-ui-breadcrumbs__link');
  });

  it('renders the default separator as a themeable custom property', () => {
    breadcrumbs();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-breadcrumbs-separator');
    expect(css).toContain('"/"');
  });
});
