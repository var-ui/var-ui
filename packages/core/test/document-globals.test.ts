import { describe, it, expect } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';

describe('document-globals', () => {
  it('registers html scroll and body reset styles', async () => {
    await import('../src/document-globals');
    const css = getRegisteredCss();
    expect(css).toContain('scroll-behavior: smooth');
    expect(css).toContain('scroll-behavior: auto');
    expect(css).toMatch(/body\s*\{[^}]*margin:\s*0/);
    expect(css).toContain('font: inherit');
  });
});
