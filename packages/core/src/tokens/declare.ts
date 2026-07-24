import { typestyles } from '../runtime';
import { tokenSchema } from './schema';

/** Declare refs for authoring defaults and theme overrides (`tokens.color.text.primary`, …). */
export const tokens = typestyles.tokens.declare('', tokenSchema);
