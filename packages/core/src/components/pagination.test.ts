import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { pagination } from './pagination';

describe('pagination', () => {
  it('registers all slots and the size variant', () => {
    pagination({ size: 'sm' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-pagination-root');
    expect(css).toContain('var-ui-pagination-controls');
    expect(css).toContain('var-ui-pagination-ellipsis');
    expect(css).toContain('var-ui-pagination-infoText');
    expect(css).toContain('var-ui-pagination-dotsContainer');
    expect(css).toContain('var-ui-pagination-dot');
    expect(css).toContain('var-ui-pagination-dotActive');
    expect(css).toContain('var-ui-pagination-pageSizeGroup');
    expect(css).toContain('var-ui-pagination-ellipsis-size-sm');
    expect(css).toContain('var-ui-pagination-dot-size-sm');
  });
});
