import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { tree } from './tree';

describe('tree', () => {
  it('registers slots and density variant', () => {
    tree({ density: 'compact' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-tree');
    expect(css).toContain('.var-ui-tree__item');
    expect(css).toContain('.var-ui-tree__row');
    expect(css).toContain('.var-ui-tree__toggle');
    expect(css).toContain('.var-ui-tree__label');
    expect(css).toContain('.var-ui-tree__description');
    expect(css).toContain('.var-ui-tree__group');
    expect(css).toContain('.var-ui-tree__start');
    expect(css).toContain('.var-ui-tree__end');
    expect(css).toContain('.var-ui-tree__row[data-density="compact"]');
    expect(css).toContain('[data-expanded]');
    expect(css).toContain('[data-selected]');
    expect(css).toContain('rotate(90deg)');
  });

  it('themes indent, row hover, selected bg, and label colors via custom properties', () => {
    tree();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-tree-indentsize');
    expect(css).toContain('--var-ui-tree-hoverbg');
    expect(css).toContain('--var-ui-tree-selectedbg');
    expect(css).toContain('--var-ui-tree-labelcolor');
    expect(css).toContain('--var-ui-tree-descriptioncolor');
  });
});
