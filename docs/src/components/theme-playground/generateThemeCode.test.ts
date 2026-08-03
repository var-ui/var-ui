import { describe, expect, it } from 'vite-plus/test';
import { generateThemeCode } from './generateThemeCode';
import { DEFAULT_THEME_PLAYGROUND_STATE } from './themePlaygroundState';

describe('generateThemeCode', () => {
  it('exports default theme class usage', () => {
    const { code, filename, language } = generateThemeCode(DEFAULT_THEME_PLAYGROUND_STATE);
    expect(language).toBe('ts');
    expect(filename).toBe('theme.ts');
    expect(code).toContain('defaultThemeClassName');
    expect(code).toContain('@var-ui/core');
  });

  it('exports createDesignTheme from preset for forest', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      presetId: 'forest',
    });
    expect(code).toContain('createDesignTheme');
    expect(code).toContain('forestPreset');
    expect(code).toContain("name: 'forest'");
  });

  it('exports ai-glow preset', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      presetId: 'ai-glow',
    });
    expect(code).toContain('aiGlowPreset');
  });
});
