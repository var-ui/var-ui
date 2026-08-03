import { atProperty, type TokenSchema } from 'typestyles';

export const PALETTE_STEPS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;
export type PaletteStep = (typeof PALETTE_STEPS)[number];

export const PALETTE_FAMILIES = [
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'emerald',
  'fuchsia',
  'gold',
  'grass',
  'gray',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mauve',
  'mint',
  'mist',
  'neutral',
  'olive',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'rose',
  'ruby',
  'sage',
  'sand',
  'slate',
  'sky',
  'stone',
  'taupe',
  'teal',
  'tomato',
  'violet',
  'yellow',
  'zinc',
] as const;

export type PaletteFamily = (typeof PALETTE_FAMILIES)[number];
export type PaletteTokenKey = `${PaletteFamily}-${PaletteStep}`;

const paletteKeys = PALETTE_FAMILIES.flatMap((family) =>
  PALETTE_STEPS.map((step) => `${family}-${step}` as PaletteTokenKey),
);

export const paletteTokenSchema = Object.fromEntries(
  paletteKeys.map((key) => [key, atProperty.color]),
) as { [K in PaletteTokenKey]: typeof atProperty.color } satisfies TokenSchema;
