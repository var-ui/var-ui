import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { popover } from './popover';

describe('popover', () => {
  it('registers root and title slots', () => {
    popover();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-popover-root');
    expect(css).toContain('var-ui-popover-title');
  });
});
