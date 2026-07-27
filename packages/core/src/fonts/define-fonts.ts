import type { DefineFontsInput, DefineFontsResult, FontFaceDefinition } from './types';

const FONT_SLOTS = ['display', 'sans', 'mono'] as const;

function fontStack(face: FontFaceDefinition, fallback: string): string {
  return `${JSON.stringify(face.family)}, ${fallback}`;
}

export function defineFonts(input: DefineFontsInput): DefineFontsResult {
  const fonts: FontFaceDefinition[] = [];
  const fontFamily: DefineFontsResult['tokens']['fontFamily'] = {};

  for (const slot of FONT_SLOTS) {
    const config = input[slot];
    if (!config) continue;
    fonts.push(config.face);
    fontFamily[slot] = fontStack(config.face, config.fallback);
  }

  return { fonts, tokens: { fontFamily } };
}
