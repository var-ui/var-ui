# Typed Theming & Component Overrides (V7)

A single, fully-typed customization experience for var-ui consumers: override
built-in token values, mint new custom tokens that participate in color modes,
and restyle any component's `base` / `variants` / `compoundVariants` with full
CSS property control — with variant names autocompleted from the recipe itself
and **no class names anywhere in user code**.

This goes one step past the V3 two-tier model
(`specs/component-override-contract.md`): where V3 gives consumers component
CSS variables (Tier 1) and stable class names (Tier 2), this spec adds the
recipe-shaped override config that V3 explicitly deferred ("bulk override
config objects for theme authors — not planned in TypeStyles either"). That
deferral is deliberately revisited here: the config-object DX becomes the
**primary** documented customization surface, with Tiers 1–2 remaining the
substrate and escape hatch.

**Status: needs TypeStyles engine work first** — `styles.override()` and the
component metadata contract below are new engine capabilities (TypeStyles
`IMPROVEMENTS.md` P5 track). var-ui consumes them as a versioned dependency,
same split as V2–V4.

---

## The DX (what a consumer writes)

### Batteries included — one theme call

`createDesignTheme` keeps its existing config (`name`, `light`, `dark`,
`surfaces`) and gains two optional fields, fully backward compatible:

```ts
import { createDesignTheme } from '@var-ui/core';

export const acme = createDesignTheme({
  name: 'acme',
  light: acmeLight,
  dark: acmeDark,

  // NEW — custom tokens; leaves are a string or { light, dark }
  extend: {
    brand: {
      glow: {
        light: '0 0 0 3px oklch(90% 0.1 280)',
        dark: '0 0 16px oklch(70% 0.2 280)',
      },
      halo: 'radial-gradient(circle, oklch(70% 0.2 280 / 0.4), transparent)',
    },
  },

  // NEW — typed component restyling; `t` = built-in tokens + custom refs
  components: (t) => ({
    button: {
      base: {
        borderRadius: t.radius.lg,
        boxShadow: t.brand.glow,
        '&:hover': { boxShadow: 'none' },
      },
      variants: {
        intent: {
          // ⌨ keys autocomplete: primary | secondary | ghost | danger
          primary: { textTransform: 'uppercase' },
        },
      },
      compoundVariants: [
        {
          variants: { intent: 'primary', size: 'lg' },
          style: { letterSpacing: '0.05em' },
        },
      ],
    },
    card: { base: { borderWidth: t.borderWidth.default } },
  }),
});

// acme.className    → provider class, as today
// acme.tokens       → designTokens + { brand: { glow: 'var(--var-ui-brand-glow)', … } }
```

Everything is typed end-to-end:

- `light` / `dark` — existing typed `DesignColorValues` shapes.
- `extend` — inferred generic; `acme.tokens.brand.glow` is a typed `var()` ref.
- `components` — keys restricted to the themeable-component registry; each
  value's variant dimensions and option names come from the recipe's own type;
  style blocks are full `CSSProperties` (nested selectors, at-rules, token
  refs — the same style language recipes are written in).

### Composable primitives (what the sugar compiles to)

Both are public exports of `@var-ui/core`; the unified config is sugar over
them, mirroring how `createDesignTheme` already wraps `tokens.createTheme`.

```ts
import { overrideComponent, extendTokens, button } from '@var-ui/core';

// App-global restyle — no theme required
overrideComponent(button, { base: { borderRadius: '999px' } });

// Theme-scoped, colocatable anywhere in the app
overrideComponent(
  button,
  { variants: { intent: { danger: { fontWeight: 700 } } } },
  { theme: acme },
);

// Theme-independent custom tokens with mode-aware leaves
const brand = extendTokens('brand', {
  glow: { light: '…', dark: '…' },
});
```

---

## Engine layer (TypeStyles): `styles.override()`

```ts
styles.override(component, overrideConfig, options?);
```

- `component` — any `styles.component()` return (dimensioned, flat, slot, or
  multi-slot; one overload per shape).
- `overrideConfig` — mirrors the recipe config shape, but every style position
  is plain `CSSProperties` (no variant _definitions_, only restyling):

  ```ts
  type OverrideConfig<V extends VariantDefinitions> = {
    base?: CSSProperties;
    variants?: { [K in keyof V]?: { [O in keyof V[K]]?: CSSProperties } };
    compoundVariants?: Array<{
      variants: { [K in keyof V]?: CompoundSelectionValue<VariantOptionKey<V, K>> };
      style: CSSProperties;
    }>;
  };
  ```

- `options` — `{ scope?: string; layer?: string }`; `scope` is a selector
  prefix (e.g. `.theme-acme`), `layer` a cascade layer name from the
  instance's stack.

### Design point 1 — typing by inference, not registration

`ComponentReturn<V>` is generic in the full variant definitions, so
`override<V>(component: ComponentReturn<V>, config: OverrideConfig<V>)`
recovers every dimension and option name from the recipe's type — the same
mechanism as the existing `ComponentVariants<T>` utility. No codegen, no
registration step, works for any TypeStyles-based system, not just var-ui.

Slot recipes mirror their authoring shape — per-slot style blocks with slot
names typed from the recipe:

```ts
styles.override(alert, {
  base: { root: { borderStyle: 'dashed' } },
  variants: { tone: { danger: { icon: { scale: '1.2' } } } },
});
```

### Design point 2 — runtime via a metadata contract, not string parsing

Component functions already expose class names at runtime (`button.base`,
`button['intent-primary']`), but reconstructing `dimension → option` from
hyphenated keys is ambiguous (`layout-icon`), and slot recipes expose no
typed class map at all. So `styles.component()` attaches a **non-enumerable
`__meta`** to every returned function:

```ts
type ComponentMeta = {
  namespace: string;
  kind: 'dimensioned' | 'flat' | 'slot' | 'multi-slot';
  slots?: readonly string[];
  /** dimension → option → class name (per slot for slot recipes) */
  classNames: Record<string, unknown>;
  baseClassName: string; // or per-slot map
};
```

`override()` walks the config against `__meta` and emits selectors from the
recorded class names. This also formalizes V3's classname-stability contract:
the metadata **is** the public surface, and the snapshot lint rule defends it.

### Design point 3 — compound overrides need no new class names

A compound override emits a conjunction selector —
`.button-intent-primary.button-size-sm { … }` — rather than needing the
recipe's internal compound class. Within the override layer, specificity
resolves in the expected order automatically: base (1 class) < variant (1
class, later source order) < compound (2+ classes).

Emission goes through the normal `insertRules` pipeline, wrapped in `layer`
and prefixed by `scope`, so overrides participate in dedup, HMR, and SSR
extraction like all other rules.

### Runtime validation

TypeScript prevents unknown dimensions/options at compile time; for JS
consumers, `override()` validates config keys against `__meta` in development
and warns on unknown dimensions, options, or slots (no throw — emit what is
valid).

---

## var-ui layer

### Custom token semantics (`extend` / `extendTokens`)

- Each `extend` namespace is registered **once** via `tokens.create(namespace,
refShape)` on var-ui's shared runtime — custom property names are
  theme-independent (`--var-ui-brand-glow`), so refs are stable across themes.
- Theme values are applied under `.theme-<name>` through the same base+modes
  machinery `createDesignTheme` already uses — `{ light, dark }` leaves ride
  the existing `data-mode` / system color-mode handling for free; plain string
  leaves are mode-invariant.
- Two themes extending the same namespace union their key sets at `:root`
  (defaults from first registration); each theme assigns its own values.
  Distinct namespaces per concern are recommended in docs.
- Standalone `extendTokens('brand', values)` registers the namespace and
  applies values globally (`:root` + mode rules) instead of under a theme
  class; the returned refs are the same either way.
- The `createDesignTheme<E>` generic threads through: the `components`
  callback parameter is `DesignTokens & TokenRefsOf<E>`, and the returned
  theme carries `.tokens` with the same merged shape. The callback form exists
  precisely to resolve the custom-tokens-before-components ordering.

### The themeable-component registry

`@var-ui/core` maintains a `themeableComponents` registry object mapping
public names to recipe functions (`{ button, card, alert, … }` — every
published recipe). The `components` map type is derived from it:

- unknown keys are type errors;
- each value is `OverrideConfigFor<typeof recipe>` (dimensioned, flat, or
  slot shape as appropriate).

Each entry compiles to
`styles.override(recipe, config, { scope: '.theme-<name>', layer: 'overrides' })`.
Adding a recipe to core means adding it to the registry (one line; a unit test
asserts registry ⊇ public recipe exports).

### Cascade strategy

Core's layer stack grows by one:

```
['tokens', 'components', 'overrides', 'utilities']
```

- Recipes stay in `components`; **all** consumer overrides land in
  `overrides`, so they beat recipe CSS regardless of selector specificity.
- `utilities` (the `layout` / `text` helpers) still beats overrides —
  per-instance utility classes are the most explicit intent.
- Within `overrides`, theme-scoped rules (`.theme-acme .button-base`)
  out-rank app-global ones (`.button-base`) on specificity — the intended
  precedence, with no extra machinery.
- Nested conflicting theme regions remain the V3 escape hatch
  (`styles.scope()` / `@scope`); this spec does not re-solve proximity.

### React integration

Themes still apply via `DesignSystemProvider`. One sugar change:
`customTheme?: DesignTheme` prop alongside `customThemeClassName` (accepts the
`createDesignTheme` return directly). Because overrides target the same class
names recipes already render, **no component wrapper changes at all**.

---

## Typed component vars (phased follow-up, not v1)

Tier 1 vars (`--var-ui-button-background`) are settable today as literal
custom-property keys inside any override block. _Typed_ access —
`vars: { background: t.color.accent.subtle }` autocompleted from the recipe's
`c.vars()` declarations — requires the var tree to surface in
`ComponentReturn`'s type parameters (an engine type change to
`styles.component`). Specced as an explicit phase 2; the override config
reserves the `vars` key for it.

---

## Testing

- **Engine (TypeStyles repo):** type-level tests for inference across all four
  recipe shapes; emitted-CSS snapshots for base/variant/compound/slot
  overrides, scoped and unscoped, layered and unlayered; dev-warning tests for
  unknown keys; `__meta` shape tests.
- **var-ui core:** `createDesignTheme` extension tests — custom token
  registration + mode-aware leaves (snapshot the emitted theme CSS),
  `components` compilation (spy on `styles.override` args or snapshot CSS),
  registry-completeness test (every public recipe is registered).
- **var-ui react:** `customTheme` prop test.
- **Example app:** one demo theme exercising `extend` + `components`
  end-to-end for visual QA across light/dark.

---

## Relationship to existing specs

- **V3 (`component-override-contract.md`):** superseded in one respect — the
  "bulk override config objects" out-of-scope line. The two-tier model
  remains: Tier 1 vars are still the cheapest single-property override, Tier 2
  class names remain public API (now formalized as `__meta`), and this spec's
  config DX becomes the primary documented path (docs restructure as
  "customize with `components`/`overrideComponent` → drop to vars → drop to
  class names/`@scope`"). V3's snapshot lint becomes more load-bearing but is
  **not a blocker** for this work.
- **V4 (`surface-tone-override.md`):** orthogonal; custom tokens participate
  in `surfaces` overrides through the same theme machinery.

---

## Explicitly out of scope

- **New variant options** (e.g. adding `intent: 'brand'`) and the React
  prop-type widening it requires — documented future direction; the override
  config shape leaves room (a `variants` key whose options extend the recipe's
  set) but nothing is designed here.
- **Per-mode blocks inside component overrides** — use mode-aware tokens
  (`extend`) instead; keeps overrides mode-agnostic and avoids duplicating the
  condition engine inside `override()`.
- **Responsive/breakpoint values in overrides** — var-ui's runtime configures
  no breakpoints today.
- **Nested-theme proximity tie-breaking** — existing `@scope` story.
- **Compiler/static extraction changes** — overrides run at module import and
  flow through existing extraction.

---

## Implementation tasks

### Engine side (TypeStyles repo — P5 track, ships in a minor)

1. `__meta` component metadata contract on all four `styles.component()`
   return shapes (non-enumerable; documented as public API).
2. `styles.override()` — overloads, `OverrideConfig` types, emission
   (scope/layer/compound conjunctions), dev validation.
3. Type-level + snapshot tests; `IMPROVEMENTS.md` entry; docs page.

### var-ui side (blocked on the above)

1. **Task 0** — bump `typestyles` catalog to the release carrying
   `styles.override`; add `overrides` to the layer stack in `runtime.ts`.
2. **Task 1** — `extendTokens` + `createDesignTheme` `extend` support
   (generic threading, mode-aware leaves, `.tokens` on the return).
3. **Task 2** — `themeableComponents` registry + `overrideComponent` +
   `createDesignTheme` `components` support.
4. **Task 3** — `customTheme` prop on `DesignSystemProvider`.
5. **Task 4** — docs: restructure the customization story (config DX primary,
   tiers as substrate); example-app demo theme.
6. **Task 5** — check off V7 in `ROADMAP.md`; update the engine-dependency
   status table.
