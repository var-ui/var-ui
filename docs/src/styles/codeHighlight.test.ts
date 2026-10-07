import { describe, expect, it } from 'vite-plus/test';
import { cx, getRegisteredCss } from 'typestyles';
import { codeHljsScope } from './codeHighlight';

describe('codeHljsScope', () => {
  it('exposes a scope class for layout shells (attribute mode)', () => {
    expect(cx(codeHljsScope().root)).toBe('var-ui-docs-hljs');
  });

  it('registers scoped highlight.js token rules under [data-codeblock]', () => {
    codeHljsScope();
    const css = getRegisteredCss();

    expect(css).toContain('.var-ui-docs-hljs [data-codeblock] .hljs-keyword');
    expect(css).toContain('[data-mode="dark"] .var-ui-docs-hljs [data-codeblock] .hljs-keyword');
  });
});
