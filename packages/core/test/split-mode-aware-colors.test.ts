import { describe, it, expect } from 'vite-plus/test';
import { splitModeAwareColorValues } from '../src/split-mode-aware-colors';
import { createToneFace } from '../src/tokens/tone-face';

describe('splitModeAwareColorValues', () => {
  it('splits inline light/dark leaves into base light values and dark patches', () => {
    const { base, darkPatch } = splitModeAwareColorValues({
      background: {
        app: {
          light: 'oklch(95% 0.02 150)',
          dark: 'oklch(23% 0.02 165)',
        },
        surface: '#fff',
      },
    });

    expect(base).toEqual({
      background: {
        app: 'oklch(95% 0.02 150)',
        surface: '#fff',
      },
    });
    expect(darkPatch).toEqual({
      background: {
        app: 'oklch(23% 0.02 165)',
      },
    });
  });

  it('splits mode-aware tone faces into base light values and dark patches', () => {
    const toneFace = createToneFace({
      light: {
        foreground: '#111',
        background: '#222',
        onFilledFallback: '#000',
      },
      dark: {
        foreground: '#eee',
        background: '#333',
        onFilledFallback: '#000',
      },
    });

    const { base, darkPatch } = splitModeAwareColorValues({
      tone: {
        accent: toneFace,
      },
    });

    expect(base).toEqual({
      tone: {
        accent: {
          foreground: '#111',
          background: '#222',
          subtleBackground: toneFace.subtleBackground!.light,
          border: toneFace.border!.light,
          foregroundOnBackground: toneFace.foregroundOnBackground!.light,
        },
      },
    });
    expect(darkPatch).toEqual({
      tone: {
        accent: {
          foreground: '#eee',
          background: '#333',
          subtleBackground: toneFace.subtleBackground!.dark,
          border: toneFace.border!.dark,
          foregroundOnBackground: toneFace.foregroundOnBackground!.dark,
        },
      },
    });
  });
});
