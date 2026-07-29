import { describe, expect, it } from 'vite-plus/test';
import { iconNameList } from '../../src/icons/iconNames';
import {
  defaultGlyphInnerHtml,
  defaultIconSvg,
  defaultIconSvgs,
} from '../../src/icons/default-glyphs';

describe('default-glyphs (core)', () => {
  it('ships an SVG string for every semantic icon name', () => {
    for (const name of iconNameList) {
      expect(defaultIconSvgs[name], `missing default glyph: ${name}`).toBeTypeOf('string');
      expect(defaultIconSvgs[name]).toContain('<svg');
      expect(defaultIconSvgs[name]).toContain(defaultGlyphInnerHtml[name]);
    }
  });

  it('builds SVG strings via defaultIconSvg', () => {
    expect(defaultIconSvg('close')).toBe(defaultIconSvgs.close);
  });
});
