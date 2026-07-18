import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { list } from './list';

describe('list', () => {
  it('registers slots and density/listStyle/hasDividers variants', () => {
    list({ density: 'compact', listStyle: 'decimal', hasDividers: true });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-list-root');
    expect(css).toContain('var-ui-list-item');
    expect(css).toContain('var-ui-list-label');
    expect(css).toContain('data-density="compact"');
    expect(css).toContain('data-list-style="decimal"');
    expect(css).toContain('data-has-dividers');
  });
});
