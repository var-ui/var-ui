import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import './globalBody';

describe('globalBody', () => {
  it('applies the theme font to the document body', () => {
    const css = getRegisteredCss();
    expect(css).toContain('body');
    expect(css).toContain('JetBrains Mono');
  });

  it('resets form-control fonts so buttons/inputs inherit the theme font', () => {
    const css = getRegisteredCss();
    expect(css).toMatch(/button,\s*input,\s*select,\s*textarea/);
    expect(css).toMatch(/button,\s*input,\s*select,\s*textarea[^{]*\{[^}]*inherit/);
  });
});
