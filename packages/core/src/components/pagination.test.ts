import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { pagination } from './pagination';

describe('pagination', () => {
  it('registers all slots and the size variant', () => {
    pagination({ size: 'sm' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-pagination');
    expect(css).toContain('.var-ui-pagination__controls');
    expect(css).toContain('.var-ui-pagination__ellipsis');
    expect(css).toContain('.var-ui-pagination__infoText');
    expect(css).toContain('.var-ui-pagination__dotsContainer');
    expect(css).toContain('.var-ui-pagination__dot');
    expect(css).toContain('.var-ui-pagination__dotActive');
    expect(css).toContain('.var-ui-pagination__pageSizeGroup');
    expect(css).toContain('.var-ui-pagination__ellipsis[data-size="sm"]');
    expect(css).toContain('.var-ui-pagination__dot[data-size="sm"]');
  });
});
