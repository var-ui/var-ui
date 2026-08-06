import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { codeHljsScope } from './codeHighlight';

describe('codeHljsScope', () => {
  it('emits resolved dark-mode syntax colors for highlight.js classes', () => {
    codeHljsScope();
    const css = getRegisteredCss();
    expect(css).toContain('html[data-mode="dark"] .var-ui-docs-hljs [data-codeblock] .hljs');
    expect(css).toMatch(
      /prefers-color-scheme:\s*dark[\s\S]*html:not\(\[data-mode="light"\]\) \.var-ui-docs-hljs \[data-codeblock\] \.hljs/,
    );
    expect(css).toContain('.var-ui-docs-hljs [data-codeblock] .hljs-keyword');
    expect(css).toContain('color-scheme: inherit');
  });
});
