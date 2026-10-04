import { describe, expect, it } from 'vite-plus/test';
import { highlightCodeBlockContent } from './highlightCodeBlock';

describe('highlightCodeBlockContent', () => {
  it('returns highlighted html for a language', () => {
    const result = highlightCodeBlockContent('const value = 1;', 'tsx');
    expect(result.codeHtml).toContain('hljs-keyword');
    expect(result.codeClassName).toBe('hljs language-typescript');
  });

  it('returns per-line html when line numbers are enabled', () => {
    const result = highlightCodeBlockContent('const a = 1;\nconst b = 2;', 'tsx', {
      showLineNumbers: true,
    });
    expect(result.lineHtml).toHaveLength(2);
    expect(result.lineHtml?.[0]).toContain('hljs-keyword');
  });
});
