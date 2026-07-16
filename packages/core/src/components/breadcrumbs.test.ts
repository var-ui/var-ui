import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { breadcrumbs } from './breadcrumbs';

describe('breadcrumbs', () => {
  it('registers root, list, item, ellipsisItem, and link slots', () => {
    breadcrumbs();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-breadcrumbs-root');
    expect(css).toContain('var-ui-breadcrumbs-list');
    expect(css).toContain('var-ui-breadcrumbs-item');
    expect(css).toContain('var-ui-breadcrumbs-ellipsisItem');
    expect(css).toContain('var-ui-breadcrumbs-link');
  });

  it('renders the default separator as a themeable custom property', () => {
    breadcrumbs();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-breadcrumbs-separator');
    expect(css).toContain('"/"');
  });
});
