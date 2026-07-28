import type {
  CreateTokenValues,
  CreatedTokenRef,
  ModeAwareTokenLeaf,
  TokenRefTree,
  TokenValues,
} from 'typestyles';
import { typestyles } from './runtime';

export type { ModeAwareTokenLeaf } from 'typestyles';

/** Nested map of mode-aware or plain string leaves (same nesting as `tokens.create`). */
export type ExtendTokenValues = {
  [key: string]: ModeAwareTokenLeaf | ExtendTokenValues;
};

/** `var(--…)` ref tree for an `extend` / `extendTokens` value shape. */
export type TokenRefsOf<E extends Record<string, ExtendTokenValues>> = {
  readonly [N in keyof E]: TokenRefTree<E[N]>;
};

const registered = new Map<string, CreatedTokenRef<TokenValues, string>>();

function ensureNamespace<const V extends CreateTokenValues>(
  namespace: string,
  values: V,
): TokenRefTree<V> {
  const existing = registered.get(namespace);
  if (existing) return typestyles.tokens.use(existing as CreatedTokenRef<V, string>);
  const created = typestyles.tokens.create(namespace, values);
  registered.set(namespace, created as CreatedTokenRef<TokenValues, string>);
  return typestyles.tokens.use(created);
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
  return ensureNamespace(namespace, values);
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
    refs[namespace] = ensureNamespace(namespace, values);
    overrides[namespace] = values;
  }

  return { refs: refs as TokenRefsOf<E>, overrides };
}

/** Test-only: clear the extend namespace registry (pair with typestyles `reset()`). */
export function resetExtendTokenRegistry(): void {
  registered.clear();
}
