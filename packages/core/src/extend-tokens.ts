import {
  flattenTokenEntries,
  scopedTokenNamespace,
  type CreatedTokenRef,
  type CSSProperties,
  type TokenValues,
} from 'typestyles';
import { global, tokens } from './runtime';

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

function isModeAwareLeaf(value: unknown): value is { light: string; dark: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'light' in value &&
    'dark' in value &&
    typeof (value as { light: unknown }).light === 'string' &&
    typeof (value as { dark: unknown }).dark === 'string'
  );
}

/** Flatten extend values into light-mode and dark-mode plain token trees for `tokens.create` / themes. */
export function splitExtendValues(values: ExtendTokenValues): {
  light: TokenValues;
  dark: TokenValues;
  hasDark: boolean;
} {
  const light: Record<string, unknown> = {};
  const dark: Record<string, unknown> = {};
  let hasDark = false;

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'string') {
      light[key] = value;
      dark[key] = value;
      continue;
    }
    if (isModeAwareLeaf(value)) {
      light[key] = value.light;
      dark[key] = value.dark;
      hasDark = true;
      continue;
    }
    const nested = splitExtendValues(value as ExtendTokenValues);
    light[key] = nested.light;
    dark[key] = nested.dark;
    if (nested.hasDark) hasDark = true;
  }

  return { light: light as TokenValues, dark: dark as TokenValues, hasDark };
}

function customPropertyDeclarations(
  namespace: string,
  values: TokenValues,
): Record<string, string> {
  const cssNs = scopedTokenNamespace(tokens.scopeId?.trim() || undefined, namespace);
  const props: Record<string, string> = {};
  for (const [path, value] of flattenTokenEntries(values)) {
    props[`--${cssNs}-${path}`] = String(value);
  }
  return props;
}

function ensureNamespace(
  namespace: string,
  lightValues: TokenValues,
): CreatedTokenRef<TokenValues, string> {
  const existing = registered.get(namespace);
  if (existing) return existing;
  const created = tokens.create(namespace, lightValues);
  registered.set(namespace, created);
  return created;
}

function emitGlobalDarkOverrides(namespace: string, darkValues: TokenValues): void {
  const props = customPropertyDeclarations(namespace, darkValues) as unknown as CSSProperties;
  // Match design-theme colorMode: explicit data-mode + system preference fallback.
  global.style(':root[data-mode="dark"]', props, { layer: 'tokens' });
  global.style(
    ':root',
    {
      '@media (prefers-color-scheme: dark)': props,
    } as unknown as CSSProperties,
    { layer: 'tokens' },
  );
}

/**
 * Register a custom token namespace (once) and apply mode-aware values globally
 * (`:root` + dark mode rules), returning `var(--…)` refs.
 */
export function extendTokens<const V extends ExtendTokenValues>(
  namespace: string,
  values: V,
): TokenRefTree<V> {
  const { light, dark, hasDark } = splitExtendValues(values);
  const refs = ensureNamespace(namespace, light) as unknown as TokenRefTree<V>;
  if (hasDark) emitGlobalDarkOverrides(namespace, dark);
  return refs;
}

/** Register namespaces from an `extend` map; return refs + light/dark override slices for themes. */
export function registerExtendMap<const E extends Record<string, ExtendTokenValues>>(
  extend: E,
): {
  refs: TokenRefsOf<E>;
  lightOverrides: Record<string, TokenValues>;
  darkOverrides: Record<string, TokenValues>;
  hasDark: boolean;
} {
  const refs = {} as Record<string, unknown>;
  const lightOverrides: Record<string, TokenValues> = {};
  const darkOverrides: Record<string, TokenValues> = {};
  let hasDark = false;

  for (const [namespace, values] of Object.entries(extend) as Array<
    [keyof E & string, ExtendTokenValues]
  >) {
    const split = splitExtendValues(values);
    refs[namespace] = ensureNamespace(namespace, split.light);
    lightOverrides[namespace] = split.light;
    darkOverrides[namespace] = split.dark;
    if (split.hasDark) hasDark = true;
  }

  return {
    refs: refs as TokenRefsOf<E>,
    lightOverrides,
    darkOverrides,
    hasDark,
  };
}

/** Test-only: clear the extend namespace registry (pair with typestyles `reset()`). */
export function resetExtendTokenRegistry(): void {
  registered.clear();
}
