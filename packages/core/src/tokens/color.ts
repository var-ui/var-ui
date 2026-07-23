import { tokens } from '../runtime';
import type { DesignTokens } from './types';

/** Typed refs for every `color.*` leaf; emits matching `@property` declarations. */
export const color = tokens.declare<DesignTokens['color']>('color');
