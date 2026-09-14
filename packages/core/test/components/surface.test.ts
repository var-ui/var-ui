import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { surface } from '../../src/components/surface';

describe('surface', () => {
  it('registers a bordered surface box class', () => {
    void surface();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-surface');
    expect(css).toMatch(/background-color:.*var\(--var-ui-color-background-surface/);
    expect(css).toMatch(/border.*var\(--var-ui-color-border-default/);
  });
});
