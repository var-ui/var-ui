import { describe, expect, it } from 'vite-plus/test';
import { generateThemeCode } from './generateThemeCode';
import {
  DEFAULT_THEME_PLAYGROUND_STATE,
  DEFAULT_THEME_PLAYGROUND_TYPOGRAPHY,
} from './themePlaygroundState';

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
    expect(code).toContain('from: forestPreset');
  });

  it('exports ai-glow preset', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      presetId: 'ai-glow',
    });
    expect(code).toContain('aiGlowPreset');
  });

  it('exports token overrides on default preset', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      colors: { 'color.tone.accent.foreground': '#3b82f6' },
    });
    expect(code).toContain('createDesignTheme');
    expect(code).toContain('accent');
    expect(code).toContain('#3b82f6');
    expect(code).not.toContain('defaultThemeClassName');
  });

  it('exports token overrides with preset base', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      presetId: 'forest',
      colors: { 'color.tone.accent.foreground': '#3b82f6' },
      typography: { ...DEFAULT_THEME_PLAYGROUND_TYPOGRAPHY, baseSize: 'lg' },
    });
    expect(code).toContain('from: forestPreset');
    expect(code).toContain('tokens:');
    expect(code).toContain('fontSize');
  });
});
