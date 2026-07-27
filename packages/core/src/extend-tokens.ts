import { type CreateTokenValues, type CreatedTokenRef, type TokenValues } from 'typestyles';
import { typestyles } from './runtime';

/** Leaf that is constant across color modes, or has distinct light/dark values. */
export type ModeAwareTokenLeaf = string | { light: string; dark: string };

/** Nested map of mode-aware or plain string leaves (same nesting as `tokens.create`). */
export type ExtendTokenValues = {
  [key: string]: ModeAwareTokenLeaf | ExtendTokenValues;
};

type TokenRefTree<T> = T extends ModeAwareTokenLeaf
  ? string
  : T extends ExtendTokenValues
    ? { readonly [K in keyof T]: TokenRefTree<T[K]> }
    : never;

/** `var(--…)` ref tree for an `extend` / `extendTokens` value shape. */
export type TokenRefsOf<E extends Record<string, ExtendTokenValues>> = {
  readonly [N in keyof E]: TokenRefTree<E[N]>;
};

const registered = new Map<string, CreatedTokenRef<TokenValues, string>>();

function ensureNamespace(
  namespace: string,
  values: CreateTokenValues,
): CreatedTokenRef<TokenValues, string> {
  const existing = registered.get(namespace);
  if (existing) return existing;
  const created = typestyles.tokens.create(namespace, values);
  registered.set(namespace, created);
  return created;
}

/**
 * Register a custom token namespace (once) with optional `{ light, dark }` leaves.
 * TypeStyles compiles compatible values to `light-dark()` on `:root` and emits dark
 * fallback rules for shadow-like leaves.
 */
export function extendTokens<const V extends ExtendTokenValues>(
  namespace: string,
  values: V,
): TokenRefTree<V> {
  return ensureNamespace(namespace, values as CreateTokenValues) as unknown as TokenRefTree<V>;
}

/** Register namespaces from an `extend` map; return refs + values for theme `base`. */
export function registerExtendMap<const E extends Record<string, ExtendTokenValues>>(
  extend: E,
): {
  refs: TokenRefsOf<E>;
  overrides: Record<string, CreateTokenValues>;
} {
  const refs = {} as Record<string, unknown>;
  const overrides: Record<string, CreateTokenValues> = {};

  for (const [namespace, values] of Object.entries(extend) as Array<
    [keyof E & string, ExtendTokenValues]
  >) {
    refs[namespace] = ensureNamespace(namespace, values as CreateTokenValues);
    overrides[namespace] = values as CreateTokenValues;
  }

  return { refs: refs as TokenRefsOf<E>, overrides };
}

/** Test-only: clear the extend namespace registry (pair with typestyles `reset()`). */
export function resetExtendTokenRegistry(): void {
  registered.clear();
}
