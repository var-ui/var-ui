import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { list } from './list';

describe('list', () => {
  it('registers slots and density/listStyle/hasDividers variants', () => {
    list({ density: 'compact', listStyle: 'decimal', hasDividers: true });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-list');
    expect(css).toContain('.var-ui-list__item');
    expect(css).toContain('.var-ui-list__label');
    expect(css).toContain('.var-ui-list__item[data-density="compact"]');
    expect(css).toContain('[data-list-style="decimal"]');
    expect(css).toContain('[data-has-dividers]');
  });

  it('themes item padding and colors via custom properties', () => {
    list();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-list-itempaddingy');
    expect(css).toContain('--var-ui-list-itempaddingx');
    expect(css).toContain('--var-ui-list-labelcolor');
    expect(css).toContain('--var-ui-list-descriptioncolor');
  });
});
