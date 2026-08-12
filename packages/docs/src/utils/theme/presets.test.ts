import { describe, expect, it } from 'vite-plus/test';
import {
  createThemeClassMap,
  getDocsThemeStylesHref,
  getLazyThemePresets,
  resolveThemePresets,
} from './presets';
import { extractThemeOnlyCss } from './extract-theme-css';

const samplePresets = [
  { id: 'default', label: 'Default', className: 'theme-var-ui-default', swatch: '#64748b' },
  { id: 'forest', label: 'Forest', className: 'theme-var-ui-forest', swatch: '#16a34a' },
];

describe('resolveThemePresets', () => {
  it('defaults lazyCss false for first/default and true for others', () => {
    const resolved = resolveThemePresets(samplePresets);
    expect(resolved[0]?.lazyCss).toBe(false);
    expect(resolved[1]?.lazyCss).toBe(true);
    expect(resolved[1]?.entry).toBe('typestyles-themes/forest.ts');
  });

  it('respects explicit lazyCss / entry', () => {
    const resolved = resolveThemePresets([
      { id: 'custom', label: 'Custom', className: 'x', lazyCss: true, entry: 'themes/custom.ts' },
    ]);
    expect(resolved[0]).toMatchObject({ lazyCss: true, entry: 'themes/custom.ts' });
  });
});

describe('getLazyThemePresets / href', () => {
  it('lists only lazy presets and builds hrefs', () => {
    expect(getLazyThemePresets(samplePresets).map((p) => p.id)).toEqual(['forest']);
    expect(getDocsThemeStylesHref('forest', samplePresets)).toBe('/themes/forest.css');
    expect(getDocsThemeStylesHref('default', samplePresets)).toBeUndefined();
  });

  it('builds class map', () => {
    expect(createThemeClassMap(samplePresets)).toEqual({
      default: 'theme-var-ui-default',
      forest: 'theme-var-ui-forest',
    });
  });
});

describe('extractThemeOnlyCss', () => {
  it('slices from @font-face or theme class', () => {
    const css = '/* head */\n@font-face{font-family:x}\n.theme-var-ui-forest{--c:1}';
    expect(extractThemeOnlyCss(css, 'forest').startsWith('@font-face')).toBe(true);
  });

  it('throws when theme class missing', () => {
    expect(() => extractThemeOnlyCss('.other{}', 'forest')).toThrow(/No theme CSS/);
  });
});
