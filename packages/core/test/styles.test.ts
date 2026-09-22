import { readFileSync } from 'node:fs';
import { getRegisteredCss, reset } from 'typestyles';
import { afterEach, describe, expect, it } from 'vite-plus/test';

afterEach(() => {
  reset();
});

describe('@var-ui/core/styles', () => {
  it('loads without throwing', async () => {
    await expect(import('../src/styles')).resolves.toBeDefined();
  });

  it('registers the default theme surface when the extraction entry loads', async () => {
    reset();
    const { registerDefaultTheme, registerBaseStyles } = await import('../src/styles');
    registerDefaultTheme();
    registerBaseStyles();
    const css = getRegisteredCss();
    expect(css).toContain('.theme-var-ui-default');
    expect(css).toMatch(/--var-ui-color-background-app:\s*light-dark\(/);
  });

  it('re-exports registrations so vp pack cannot emit an empty styles.mjs', () => {
    const source = readFileSync(new URL('../src/styles.ts', import.meta.url), 'utf8');
    expect(source).toMatch(/export\s*\{[\s\S]*registerDefaultTheme/);
    expect(source).toMatch(/export\s*\{[\s\S]*themeableComponents/);
    expect(source).toMatch(/export\s*\{[\s\S]*registerBaseStyles/);
  });
});
