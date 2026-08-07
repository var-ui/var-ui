import { typestyles } from '../runtime';
import { tokenSchema } from './schema';

/** Declared token refs — consumed by recipes, defaults, and theme surfaces. */
export const tokens = typestyles.tokens.declare(tokenSchema);

/** Alias kept for recipe imports (`designTokens as t`). */
export const t = tokens;
