import { atProperty, type TokenSchema } from 'typestyles';

export const PALETTE_STEPS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;
export type PaletteStep = (typeof PALETTE_STEPS)[number];

/** Chromatic families sorted by OKLCH hue (0° = red), then neutral families (warm → cool). */
export const PALETTE_FAMILIES = [
  'rose',
  'crimson',
  'ruby',
  'red',
  'tomato',
  'orange',
  'amber',
  'gold',
  'yellow',
  'lime',
  'grass',
  'green',
  'emerald',
  'jade',
  'teal',
  'mint',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'iris',
  'violet',
  'purple',
  'plum',
  'fuchsia',
  'pink',

  // Browns
  'bronze',
  'brown',

  // Neutrals
  'taupe',
  'stone',
  'sand',
  'olive',
  'sage',
  'mist',
  'slate',
  'gray',
  'zinc',
  'mauve',
  'neutral',
] as const;

export type PaletteFamily = (typeof PALETTE_FAMILIES)[number];
export type PaletteTokenKey = `${PaletteFamily}-${PaletteStep}`;

const paletteKeys = PALETTE_FAMILIES.flatMap((family) =>
  PALETTE_STEPS.map((step) => `${family}-${step}` as PaletteTokenKey),
);

export const paletteTokenSchema = Object.fromEntries(
  paletteKeys.map((key) => [key, atProperty.color]),
) as { [K in PaletteTokenKey]: typeof atProperty.color } satisfies TokenSchema;
