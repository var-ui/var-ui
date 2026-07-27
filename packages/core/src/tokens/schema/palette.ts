import { atProperty, type TokenSchema } from 'typestyles';
import { basePaletteTokenValues } from '../palette';

type PaletteKey = keyof typeof basePaletteTokenValues;

export const paletteTokenSchema = Object.fromEntries(
  (Object.keys(basePaletteTokenValues) as PaletteKey[]).map((key) => [key, atProperty.color]),
) as { [K in PaletteKey]: typeof atProperty.color } satisfies TokenSchema;
