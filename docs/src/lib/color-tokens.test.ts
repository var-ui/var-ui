import { describe, expect, it } from 'vite-plus/test';
import {
  formatCssVarName,
  getPaletteSwatches,
  getSemanticSwatches,
  groupSemanticSwatches,
} from './color-tokens';

describe('color-tokens', () => {
  it('builds palette swatches for every family and step', () => {
    const swatches = getPaletteSwatches();
    expect(swatches).toHaveLength(390);
    expect(swatches[0]).toMatchObject({
      family: 'amber',
      step: '1',
      token: 'amber-1',
      cssVar: 'var(--var-ui-color-palette-amber-1)',
    });
  });

  it('builds semantic swatches with css vars', () => {
    const swatches = getSemanticSwatches();
    const accent = swatches.find((swatch) => swatch.token === 'color.accent.default');
    expect(accent).toMatchObject({
      group: 'accent',
      cssVar: 'var(--var-ui-color-accent-default)',
    });
  });

  it('groups semantic swatches by top-level namespace', () => {
    const groups = groupSemanticSwatches(getSemanticSwatches());
    expect(groups.get('background')?.length).toBeGreaterThan(0);
    expect(groups.get('code')?.length).toBeGreaterThan(10);
  });

  it('formats css var names for display', () => {
    expect(formatCssVarName('var(--var-ui-color-palette-sky-7)')).toBe(
      '--var-ui-color-palette-sky-7',
    );
  });
});
