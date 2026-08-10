import { describe, expect, it } from 'vite-plus/test';
import { extractThemeOnlyCss } from './extract-theme-css';

const FULL_EXTRACTION_FIXTURE = `
@layer components {
.var-ui-button { color: red; }
}
@property --var-ui-space-0 { syntax: "<length>"; inherits: true; initial-value: 0px; }
@font-face { font-family: "Newsreader"; src: url('/fonts/newsreader-latin.woff2') format('woff2'); }
.theme-var-ui-forest { color-scheme: light dark; --var-ui-space-0: 0px; }
.theme-var-ui-forest .var-ui-side-nav { margin: 8px; }
`;

describe('extractThemeOnlyCss', () => {
  it('strips duplicated core CSS and keeps @font-face + theme class rules', () => {
    const trimmed = extractThemeOnlyCss(FULL_EXTRACTION_FIXTURE, 'forest');
    expect(trimmed).toContain('@font-face');
    expect(trimmed).toContain('.theme-var-ui-forest');
    expect(trimmed).not.toContain('.var-ui-button');
    expect(trimmed).not.toContain('@property');
    expect(trimmed.length).toBeLessThan(FULL_EXTRACTION_FIXTURE.length);
  });

  it('throws when theme markers are missing', () => {
    expect(() => extractThemeOnlyCss('.var-ui-button { color: red; }', 'forest')).toThrow(
      'No theme CSS found for "forest"',
    );
  });
});
