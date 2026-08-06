import { describe, expect, it } from 'vite-plus/test';
import { formatCssVarName, getShadowSwatches, groupShadowSwatches } from './shadow-tokens';

describe('shadow-tokens', () => {
  it('builds swatches for box and elevation shadows', () => {
    const swatches = getShadowSwatches();
    expect(swatches).toHaveLength(8);

    const md = swatches.find((swatch) => swatch.token === 'shadow.md');
    expect(md).toMatchObject({
      group: 'box',
      cssVar: 'var(--var-ui-shadow-md)',
    });
    expect(md?.defaultValue).toContain('2px 4px 4px');
  });

  it('groups swatches by box and elevation', () => {
    const groups = groupShadowSwatches(getShadowSwatches());
    expect(groups.get('box')).toHaveLength(5);
    expect(groups.get('elevation')).toHaveLength(3);
    expect(groups.get('elevation')?.[0]?.token).toBe('shadow.elevation.low');
  });

  it('formats css var names for display', () => {
    expect(formatCssVarName('var(--var-ui-shadow-md)')).toBe('--var-ui-shadow-md');
  });
});
