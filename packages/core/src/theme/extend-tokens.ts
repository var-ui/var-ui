import type { CreateTokenValues, ModeAwareTokenLeaf, TokenRefTree } from 'typestyles';
import { typestyles } from '../runtime';

export type { ModeAwareTokenLeaf } from 'typestyles';

/** Nested map of mode-aware or plain string leaves (same nesting as `tokens.create`). */
export type ExtendTokenValues = {
  [key: string]: ModeAwareTokenLeaf | ExtendTokenValues;
};

/** `var(--…)` ref tree for an `extend` / `extendTokens` value shape. */
export type TokenRefsOf<E extends Record<string, ExtendTokenValues>> = {
  readonly [N in keyof E]: TokenRefTree<E[N]>;
};

/**
 * Register a custom token namespace (once) with optional `{ light, dark }` leaves.
 * Delegates to TypeStyles `tokens.ensureNamespace` (#218).
 */
export function extendTokens<const V extends ExtendTokenValues>(
  namespace: string,
  values: V,
): TokenRefTree<V> {
  return typestyles.tokens.ensureNamespace(
    namespace,
    values as CreateTokenValues,
  ) as TokenRefTree<V>;
}
