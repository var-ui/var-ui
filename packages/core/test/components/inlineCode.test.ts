import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { inlineCode } from '../../src/components/inlineCode';

describe('inlineCode', () => {
  it('registers a mono inline code class', () => {
    void inlineCode();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-inline-code');
    expect(css).toMatch(/font-family:.*var\(--var-ui-fontFamily-mono/);
  });
});
