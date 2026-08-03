import { describe, expect, it } from 'vite-plus/test';
import { highlightCode, highlightCodeClassName } from './highlightCode';

describe('highlightCode', () => {
  it('escapes plain text when language is omitted', () => {
    expect(highlightCode('<Button />')).toBe('&lt;Button /&gt;');
  });

  it('highlights typescript / tsx', () => {
    const html = highlightCode('const value: string = "hi";', 'tsx');
    expect(html).toContain('hljs-keyword');
    expect(html).toContain('hljs-string');
  });

  it('highlights html via xml grammar', () => {
    const html = highlightCode('<button type="button">Click</button>', 'html');
    expect(html).toContain('hljs-tag');
    expect(html).toContain('hljs-name');
  });

  it('highlights astro frontmatter and template separately', () => {
    const html = highlightCode(
      `---
import { Button } from '@var-ui/astro';
---

<Button>Click me</Button>`,
      'astro',
    );

    expect(html.startsWith('---\n')).toBe(true);
    expect(html).toContain('hljs-string');
    expect(html).toContain('hljs-tag');
  });

  it('returns hljs class names for known languages', () => {
    expect(highlightCodeClassName('tsx')).toBe('hljs language-typescript');
    expect(highlightCodeClassName('astro')).toBe('hljs language-astro');
    expect(highlightCodeClassName()).toBe('');
  });
});
