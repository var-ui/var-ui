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

/** @deprecated Theme `extend` registers namespaces via `createTheme`; kept for tests that call `extendTokens` alone. */
export function registerExtendMap<const E extends Record<string, ExtendTokenValues>>(
  extend: E,
): { refs: TokenRefsOf<E>; overrides: Record<string, CreateTokenValues> } {
  const refs = {} as Record<string, unknown>;
  const overrides: Record<string, CreateTokenValues> = {};
  for (const [namespace, values] of Object.entries(extend) as Array<
    [keyof E & string, ExtendTokenValues]
  >) {
    refs[namespace] = extendTokens(namespace, values);
    overrides[namespace] = values as CreateTokenValues;
  }
  return { refs: refs as TokenRefsOf<E>, overrides };
}

/** @deprecated Pair with `reset()` from `typestyles` — namespace state clears on global reset. */
export function resetExtendTokenRegistry(): void {}
