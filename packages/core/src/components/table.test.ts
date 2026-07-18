import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { table } from './table';

describe('table', () => {
  it('registers slots and density/dividers variants', () => {
    table({ density: 'compact', dividers: 'columns' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-table');
    expect(css).toContain('.var-ui-table__row');
    expect(css).toContain('.var-ui-table__cell');
    expect(css).toContain('.var-ui-table__headerCell[data-density="compact"]');
    expect(css).toContain('[data-dividers="columns"]');
  });

  it('themes boolean chrome variants: isStriped, hasHover, stickyHeader', () => {
    table({ isStriped: true, hasHover: true, stickyHeader: true });
    const css = getRegisteredCss();
    expect(css).toContain('[data-is-striped]');
    expect(css).toContain('[data-has-hover]');
    expect(css).toContain('[data-sticky-header]');
    expect(css).toContain('position: sticky');
  });

  it('supports textOverflow truncate variant', () => {
    table({ textOverflow: 'truncate' });
    const css = getRegisteredCss();
    expect(css).toContain('[data-text-overflow="truncate"]');
    expect(css).toContain('text-overflow: ellipsis');
  });

  it('themes header/border/stripe colors via custom properties', () => {
    table();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-table-headerbg');
    expect(css).toContain('--var-ui-table-bordercolor');
    expect(css).toContain('--var-ui-table-stripebg');
    expect(css).toContain('--var-ui-table-hoverbg');
  });
});
