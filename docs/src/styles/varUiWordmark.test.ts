import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { varUiWordmark } from './varUiWordmark';

describe('varUiWordmark CSS', () => {
  it('registers shared syntax slots and both display sizes', () => {
    varUiWordmark({ size: 'hero' });
    varUiWordmark({ size: 'header' });
    const css = getRegisteredCss();

    expect(css).toContain('display: inline-flex');
    expect(css).toContain('font-family: var(--var-ui-fontFamily-mono)');
    expect(css).toContain('color: var(--var-ui-color-code-keyword)');
    expect(css).toContain('clamp(3.5rem, 13vw, 8rem)');
    expect(css).toContain('font-size: var(--var-ui-fontSize-md)');
  });
});
