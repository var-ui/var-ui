import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { checkbox } from './checkbox';

describe('checkbox group slots', () => {
  it('registers group and groupLabel slots', () => {
    checkbox();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-checkbox-group');
    expect(css).toContain('var-ui-checkbox-groupLabel');
  });
});
