# Conditional Component Overrides (V8)

Typed light/dark and condition-aware styling for `styles.override()` — so theme
authors can restyle components per mode **without hand-written selector
strings**.

Two complementary TypeStyles features:

1. **Mode-aware property values** — `{ light, dark }` on individual properties,
   compiled to CSS `light-dark()`, parallel to responsive `{ base, md }`.
   Covers most ambient light/dark tweaks in overrides (and recipes).

2. **`conditions` blocks** — `ThemeCondition`-gated style patches for anything
   `light-dark()` cannot express (reduced motion, arbitrary media, multi-property
   nested blocks, custom conditions).

V7 (`specs/typed-component-theming.md`) deliberately deferred per-mode
override blocks in favor of mode-aware tokens. That remains the right default
for **palette** changes. This spec covers structural differences (layout,
motion, typography) that should not be forced into the token tree.

**Status: shipped (TypeStyles 0.16+)** — var-ui wires `colorModes` +
`breakpoints` on the shared runtime, global `color-scheme` CSS, exports `when`
presets for `conditions`, and documents the DX below.

**Deferred (separate track):** ~~recompile token `colorMode` / surface modes to
`light-dark()`~~ — **shipped in V9** (see
[Future: `color-scheme` + `light-dark()` for tokens](#future-color-scheme--light-dark-for-tokens)).

**Engine home:** TypeStyles repo — new `specs/override-conditions.md` (or
equivalent) should mirror this document's engine sections verbatim.

---

## The DX we want to ship

### In a var-ui theme

```ts
import { createDesignTheme, when } from '@var-ui/core';

export const acme = createDesignTheme({
  name: 'acme',
  components: {
    button: (t) => ({
      base: {
        // Mode-aware COLOR values → light-dark() (when color-scheme is set)
        borderColor: { light: t.color.border.default, dark: t.color.border.strong },

        // Non-color structural diffs → conditions (light-dark can't do these)
        letterSpacing: '0.02em',
        conditions: [
          when.dark({ letterSpacing: '0.06em', fontWeight: 600 }),
          when.reducedMotion({ transition: 'none' }),
        ],
      },

      variants: {
        intent: {
          primary: {
            textTransform: 'uppercase',
            letterSpacing: { light: '0.04em', dark: '0.08em' },
          },
        },
      },

      compoundVariants: [
        {
          variants: { intent: 'primary', size: 'lg' },
          style: {
            padding: {
              light: `${t.space[3]} ${t.space[5]}`,
              dark: `${t.space[4]} ${t.space[6]}`,
            },
          },
        },
      ],
    }),

    card: (t) => ({
      base: {
        root: {
          borderRadius: t.radius.lg,
          padding: { base: t.space[4], md: t.space[6] },
        },
      },
    }),
  },
});
```

`when.surface.dark(…)` is only needed until var-ui pins `color-scheme` on
`surface` markers (see [Surfaces and `color-scheme`](#surfaces-and-color-scheme));
after that, `{ light, dark }` values resolve correctly inside fixed-tone
subtrees automatically.

### Standalone override (no theme)

```ts
import { styles, when, button } from '@var-ui/core';

styles.override(
  button,
  {
    base: {
      fontWeight: { light: 400, dark: 600 },
      conditions: [when.reducedMotion({ transition: 'none' })],
    },
  },
  { selectorPrefix: '.theme-acme', layer: 'overrides' },
);
```

### Custom condition (escape hatch — still typed)

```ts
import { typestyles, when } from '@var-ui/core';

conditions: [
  when.match(typestyles.tokens.when.media('(min-width: 1280px)'), { maxWidth: '40rem' }),
];
```

### What authors never write

```ts
// ❌ footgun — duplicates the theme condition engine in string form
'html[data-mode="dark"] &': { … },
'@media (prefers-color-scheme: dark)': {
  'html:not([data-mode="light"]) &': { … },
},
'[data-surface="dark"] &': { … },
```

---

## Design principles

1. **Mode values before conditions** — if a difference is a single property (or
   independent properties), use `{ light, dark }` and let `light-dark()` handle
   resolution. Reserve `conditions` for non-color-scheme gates and multi-rule
   blocks.

2. **`light-dark()` + `color-scheme`, not `data-mode` selectors** — mode-aware
   property values compile to `light-dark(light, dark)` and rely on the
   **computed `color-scheme`** of the element tree. var-ui (or any host) sets
   `color-scheme` from `data-mode`; TypeStyles does not re-implement the
   `data-mode` / `prefers-color-scheme` OR logic per property.

3. **Reuse `ThemeCondition` for `conditions`** — the same `tokens.when.*`
   builders and compiler that power `tokens.createTheme()` modes. No parallel
   condition vocabulary.

4. **Palette stays in tokens** — `colorMode` / `extend { light, dark }` remain
   the primary path for colors. Mode values in overrides are for structural
   properties; token emission may later adopt `light-dark()` too (deferred).

5. **No selector strings in the happy path** — `when.selector()` remains an
   engine escape hatch; design systems ship named presets (`when.reducedMotion`,
   etc.).

6. **Same cascade story as V7** — `conditions` emit through `styles.override()`
   into the configured `layer` and `selectorPrefix`. Mode values inline into
   the unconditional rule (no extra selectors).

7. **Responsive is orthogonal** — `{ base, md }` and `{ light, dark }` compose
   on the same property in a later TypeStyles minor (see
   [Combining mode + responsive](#combining-mode--responsive)); v1 may restrict
   to one adaptive shape per property with a dev warning.

---

## Mode-aware property values (TypeStyles)

Parallel to responsive `{ base, md }` — enabled when `createStyles` (or
`createTypeStyles`) configures **color modes**.

### Instance config

```ts
createTypeStyles({
  scopeId: 'var-ui',
  breakpoints: { fromTokens: designTokens.breakpoint },
  colorModes: ['light', 'dark'], // reserved mode keys for property objects
});
```

`colorModes` registers which keys may appear in adaptive property values (like
`breakpoints` registers `md`, `lg`, …). For var-ui: `['light', 'dark']` only.

### Authoring

```ts
base: {
  letterSpacing: '0.02em',                              // both modes
  fontWeight: { light: 400, dark: 600 },                // → light-dark(400, 600)
  padding: { light: t.space[4], dark: t.space[5] },
}
```

### Emission

When a property value is a plain object whose keys are **exactly** a subset of
the configured `colorModes` (and no breakpoint keys), serialize based on the
**target CSS property**:

| Property type                                                                                                    | Emission                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Accepts `<color>` (and related: `color`, `background-color`, `border-color`, `fill`, `stroke`, `caret-color`, …) | `light-dark(light, dark)`                                                                                               |
| Accepts `<image>` (`background-image`, `list-style-image`, …)                                                    | `light-dark(light, dark)`                                                                                               |
| Everything else (`padding`, `font-weight`, `letter-spacing`, `box-shadow` shorthand, …)                          | **Cannot use `light-dark()`** — emit via `conditions` / `ThemeCondition` (or dev-warn and require `conditions` instead) |

> **CSS reality check (2026):** `light-dark()` is specified to return `<color>`
> or `<image>` only. A proposal to generalize it to lengths and other types is
> open at CSSWG but not shipped in any engine. Do not assume
> `font-weight: light-dark(400, 600)` works.

Rules:

- **Both `light` and `dark` required** when using object form on color/image
  properties.
- A bare scalar applies to **both** modes (no `light-dark()` wrapper).
- Works in recipes, `styles.class`, and `styles.override`.
- Does **not** emit `@media (prefers-color-scheme)` or `[data-mode]` rules —
  resolution is entirely via **used `color-scheme`**.

### Runtime contract (var-ui / host responsibility)

`light-dark()` resolves from the element's **used `color-scheme`**. var-ui must
keep these in sync:

| User `data-mode` | `color-scheme` on theme root         |
| ---------------- | ------------------------------------ |
| `light`          | `light`                              |
| `dark`           | `dark`                               |
| `system`         | omitted or `light dark` (OS decides) |

`DesignSystemProvider` already sets `document.documentElement.style.colorScheme`
when `applyToDocument` is true. Extend so:

- The default wrapper (`display: contents` div) also sets `colorScheme` inline
  when not using `applyToDocument`.
- Init scripts / Astro `ThemeScript` set `color-scheme` alongside `data-mode`.

No TypeStyles runtime involvement — compile-time only, same as breakpoints.

### Surfaces and `color-scheme`

Fixed-tone subtrees (`data-surface="light"|"dark"`) can participate in
`light-dark()` without per-override `when.surface.*` if the host sets:

```css
[data-surface='dark'] {
  color-scheme: dark;
}
[data-surface='light'] {
  color-scheme: light;
}
```

(var-ui global CSS in the `tokens` layer.) Descendants then resolve the dark
branch of `light-dark()` inside a dark surface even when ambient mode is light.

Token surface **mode overrides** (V4) remain as-is until the deferred token
migration; this is only about override/recipe property values.

### Combining mode + responsive

**v1:** a property may be mode-adaptive **or** breakpoint-adaptive, not both.
Dev-warn if `{ light, dark, base, md }` keys are mixed on one value.

**v2 (follow-up):** nested adaptive values:

```ts
padding: {
  light: { base: t.space[4], md: t.space[6] },
  dark: { base: t.space[5], md: t.space[7] },
}
```

…emitting `@media` blocks each containing `light-dark(…)`. Not required for V8
ship.

### Types

```ts
type ColorModeMap = readonly ['light', 'dark']; // instance config

type ModeAwareValue<T extends string | number, M extends ColorModeMap> =
  | T
  | { [K in M[number]]: T }; // both keys required

// Fold into existing ResponsiveValue machinery or sibling type;
// property assignability on VariantOptionStyle gains ModeAwareValue when
// colorModes is configured (mirror breakpoint generic inference).
```

### Tests (TypeStyles)

| Case                                        | Assert                                         |
| ------------------------------------------- | ---------------------------------------------- |
| `{ light: 'a', dark: 'b' }` on `fontWeight` | `light-dark(a, b)`                             |
| Scalar value                                | unchanged                                      |
| Missing `dark` in object                    | dev warning, no emit                           |
| `colorModes` not configured                 | dev warning if object uses `light`/`dark` keys |
| Override + recipe + `styles.class`          | same serialization                             |
| Token `var()` refs in both branches         | preserved inside `light-dark()`                |

---

## `conditions` blocks (TypeStyles)

### 1. New types

```ts
/** A single conditional patch on a component override selector. */
type ConditionalOverride = {
  /** Optional label for devtools / HMR / snapshot tests. */
  id?: string;
  when: ThemeCondition;
  style: VariantOptionStyle;
};

/**
 * Style block for overrides: normal CSS properties + nested selectors/at-rules,
 * plus an optional `conditions` array.
 *
 * `conditions` is a **reserved key** (like `variants` on recipes) — not emitted
 * as CSS. Dev validation warns if a user typo creates an unknown top-level key;
 * `conditions` is excluded from that warning list.
 */
type StylableOverride = VariantOptionStyle & {
  conditions?: readonly ConditionalOverride[];
};
```

Update all override config shapes to use `StylableOverride` wherever
`VariantOptionStyle` appears today:

| Config                                          | Positions that become `StylableOverride`                  |
| ----------------------------------------------- | --------------------------------------------------------- |
| `OverrideConfig<V>`                             | `base`                                                    |
| `OverrideConfig<V>['variants'][dim][option]`    | each variant option style                                 |
| `OverrideConfig<V>['compoundVariants'][].style` | compound style                                            |
| `SlotOverrideConfig`                            | each slot style in `base`, `variants`, `compoundVariants` |
| `FlatOverrideConfig`                            | `base` and flat keys                                      |
| `MultiSlotOverrideConfig`                       | each slot in `base`                                       |

Export `ConditionalOverride` and `StylableOverride` from `typestyles`.

### 2. `conditions` semantics

Given a style block:

```ts
{
  padding: '8px',           // unconditional
  '&:hover': { … },         // unconditional nested
  conditions: [
    { when: A, style: { padding: '12px' } },
    { when: B, style: { fontWeight: 600 } },
  ],
}
```

Emission:

1. Serialize unconditional keys (everything except `conditions`) into the
   **existing** override rule for that selector target (base / variant /
   compound / slot) — unchanged V7 behavior.

2. For each `ConditionalOverride`, emit a **separate** rule (or rule group) with
   the **same component selector** (including variant/compound conjunction and
   `selectorPrefix`), wrapped in the compiled condition for `when`.

3. Conditional rules do not merge into the unconditional rule — they are
   additive patches. When a condition is active, both unconditional and
   matching conditional declarations apply; conflicts resolve by normal CSS
   cascade (same specificity → source order; conditional rules emitted after
   unconditional for the same target).

4. `conditions` entries may themselves contain nested selectors, at-rules, and
   responsive property values — `style` is a full `VariantOptionStyle`.

5. Empty `style: {}` is a no-op (no rule emitted).

6. `when.or` emits **one rule per OR branch** (same as theme modes).

### 3. Condition compilation context

Theme modes compile conditions against the **theme class element** (the
`.theme-{name}` node). Override conditions compile against the **component
element** (the node matched by the override selector from `__tsMeta`), while
still respecting `selectorPrefix` for theme scoping.

Add an internal compile option:

```ts
type ConditionCompileContext = {
  /** Selector for the element conditions with `scope: 'self'` apply to. */
  anchor: string;
  /**
   * When set (override path), inserted as an ancestor prefix inside compiled
   * selectors — e.g. `.theme-acme` from `selectorPrefix`.
   */
  scopePrefix?: string;
};
```

| Call site                    | `anchor`                         | `scopePrefix`           |
| ---------------------------- | -------------------------------- | ----------------------- |
| `tokens.createTheme`         | `.theme-{name}`                  | —                       |
| `styles.override` (base)     | component base selector fragment | `selectorPrefix` if set |
| `styles.override` (variant)  | variant conjunction selector     | `selectorPrefix` if set |
| `styles.override` (compound) | compound conjunction selector    | `selectorPrefix` if set |

**Scope mapping** (unchanged condition objects, different anchor):

| `when.attr` / `when.className` scope | Meaning for overrides                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `self`                               | Match on the **component element**                                                             |
| `ancestor`                           | Match on an **ancestor of the component** (inside `scopePrefix` if set)                        |
| `descendant`                         | Match when a **descendant of the component** has the attr/class — rare; see surface note below |

**Surface pinning** uses `descendant` scope on theme modes because the theme
class is the anchor and `data-surface` marks a subtree. For component overrides,
the common case is the inverse: the component is **inside** a
`data-surface="dark"` subtree. TypeStyles must support:

```ts
when.attr('data-surface', 'dark', { scope: 'ancestor' });
```

…meaning "this component has an ancestor (within the themed region) with
`data-surface="dark"`". var-ui's `when.surface.dark` preset uses `ancestor`,
not `descendant`.

> **Engine action:** Document `ancestor` for override use cases. If
> `descendant` on override anchor is rarely useful, dev-warn when
> `descendant` is combined with override compilation (optional, not blocking).

Refactor the existing theme condition compiler to accept
`ConditionCompileContext` instead of hard-coding the theme class as anchor.

### 4. Emission examples

Override call:

```ts
styles.override(
  button,
  {
    base: {
      letterSpacing: '0.02em',
      conditions: [
        {
          when: tokens.when.attr('data-mode', 'dark', { scope: 'ancestor' }),
          style: { letterSpacing: '0.06em' },
        },
      ],
    },
  },
  { selectorPrefix: '.theme-acme', layer: 'overrides' },
);
```

Expected CSS (illustrative):

```css
@layer overrides {
  .theme-acme .var-ui-button {
    letter-spacing: 0.02em;
  }
  .theme-acme :is(:root, [data-mode='dark']) .var-ui-button,
  .theme-acme [data-mode='dark'] .var-ui-button {
    letter-spacing: 0.06em;
  }
}
```

Exact selector spelling is an implementation detail; snapshot tests are the
contract. Requirements:

- `selectorPrefix` is always an **ancestor** of the component selector.
- Attribute `ancestor` conditions must match when the attribute appears on any
  ancestor of the component, up to and including `:root` / `html` when
  `applyToDocument` places `data-mode` there.
- Media conditions wrap the full scoped selector:
  `@media (prefers-color-scheme: dark) { .theme-acme … .var-ui-button { … } }`.
- `when.and` / `when.not` compile to a single rule when the engine supports
  collapsing them (same rules as theme modes today).
- Unsupported combinations log a **dev warning** and emit **no rule** (same as
  `when.not(descendant)` on themes).

### 5. Interaction with existing override features

| Feature                  | Behavior with `conditions`                                                |
| ------------------------ | ------------------------------------------------------------------------- |
| `selectorPrefix`         | Prepended to every conditional rule, same as unconditional                |
| `layer`                  | All conditional rules use the same layer                                  |
| Variants                 | `conditions` on a variant option patches **that variant's** selector only |
| Compound variants        | `conditions` on compound `style` patches the compound conjunction only    |
| Slot recipes             | `conditions` allowed per slot style block                                 |
| Multi-slot (no variants) | `conditions` per slot in `base`                                           |
| Flat recipes             | `conditions` on `base` and named flat keys                                |
| Dev key validation       | `conditions` is reserved; validate inner `style` keys, not `when`         |
| `__tsMeta`               | Unchanged — conditions do not affect selector fragment lookup             |

### 6. Dev validation

In development, `styles.override()` should:

- Warn on unknown keys inside each `ConditionalOverride` (only `id`, `when`,
  `style` allowed).
- Warn on empty `when` or missing `style`.
- Reuse theme-mode validation for unsupported `when` shapes.
- Optionally warn when `conditions` is present but empty.

No throw — emit valid rules, skip invalid entries.

### 7. Public API surface (TypeStyles)

No new runtime entry points beyond extended `styles.override()` typing and
emission. Existing exports used by consumers:

```ts
// Already public — conditions reference these
tokens.when.attr | .media | .className | .and | .or | .not | .prefersDark | .prefersLight
type ThemeCondition
type ConditionalOverride  // new
type StylableOverride     // new (or keep internal name, export alias)
```

Optional convenience (TypeStyles-level, design-system agnostic):

```ts
/** Build a ConditionalOverride — sugar over { when, style }. */
function conditional(
  when: ThemeCondition,
  style: VariantOptionStyle,
  id?: string,
): ConditionalOverride;
```

Design-system presets (`when.dark`, etc.) stay in var-ui / HeroUI / etc.

### 8. Zero-runtime / extraction

Conditional override rules register through the same `insertRules` path as V7
overrides. No compiler changes required beyond importing modules that call
`styles.override()`. Snapshot and extraction tests should include conditional
rules in emitted CSS.

### 9. Type-level tests (TypeStyles)

- `conditions` accepted on `base`, variant options, compound styles, slot
  blocks, flat keys.
- `conditions` rejected on invalid positions (e.g. top-level of `OverrideConfig`
  as a sibling of `base` — **not** in v1; only inside `StylableOverride`).
- `style` inside `ConditionalOverride` retains CSS property IntelliSense.
- Slot / multi-slot / flat overloads propagate `StylableOverride`.

### 10. Runtime / snapshot tests (TypeStyles)

| Case                                                     | Assert                              |
| -------------------------------------------------------- | ----------------------------------- |
| Base + one `when.attr` ancestor condition                | Snapshot selector + declarations    |
| `when.prefersDark`                                       | `@media` wrapper                    |
| `when.or` (attr dark + system dark)                      | Two rules or equivalent OR emission |
| `when.and` + `when.not`                                  | Matches theme-mode compiler output  |
| With `selectorPrefix`                                    | Prefix on all branches              |
| With `layer`                                             | `@layer` wrapper                    |
| Variant option `conditions`                              | Variant selector only               |
| Compound `conditions`                                    | Conjunction selector only           |
| Slot recipe per-slot `conditions`                        | Per-slot selector                   |
| `conditions` + responsive `{ base, md }` in same `style` | Both emit                           |
| Unsupported `when.not(descendant)`                       | Dev warning, no CSS                 |
| HMR re-register                                          | Idempotent replace                  |

---

## var-ui follow-on (after TypeStyles ships)

Thin design-system layer — no engine logic duplication.

### 1. `themeWhen` — canonical `ThemeCondition` presets

Used by `conditions` and by theme `modes` — not by `{ light, dark }` property
values (those use `light-dark()` + `color-scheme`).

```ts
// packages/core/src/theme-conditions.ts
export const themeWhen = {
  colorModeResolvedDark: …,  // for conditions only; mirrors ambient dark detection
  colorModeExplicitDark: …,
  colorModeExplicitLight: …,
  colorModeSystemDark: …,
  reducedMotion: when.media('(prefers-reduced-motion: reduce)'),
};
```

`surfaceDark` / `surfaceLight` presets are unnecessary once global
`color-scheme` rules on `data-surface` ship.

### 2. `when` — ergonomic `ConditionalOverride` builders

`when.dark` / `when.light` are **optional** once mode-aware values ship — most
ambient light/dark diffs become `{ light, dark }` on properties. Keep presets
for `conditions` and for multi-property blocks:

```ts
export const when = {
  // Optional sugar — prefer { light, dark } on properties when possible
  dark: (style: VariantOptionStyle) => conditional(themeWhen.colorModeResolvedDark, style),
  light: (style) => conditional(themeWhen.colorModeExplicitLight, style),
  reducedMotion: (style) => conditional(themeWhen.reducedMotion, style),
  match: (condition: ThemeCondition, style: VariantOptionStyle) => conditional(condition, style),
};
```

`when.surface.*` drops once global `color-scheme` on `data-surface` ships.

Re-export `ThemeCondition`, `ConditionalOverride`, and `typestyles.tokens.when`
from `@var-ui/core` for custom presets.

### 3. `colorModes` + breakpoints on shared runtime

```ts
// packages/core/src/runtime.ts
createTypeStyles({
  …,
  colorModes: ['light', 'dark'],
  breakpoints: { fromTokens: designTokens.breakpoint },
});
```

### 4. `color-scheme` wiring

- Set `colorScheme` on the provider wrapper (not only `applyToDocument` path).
- Emit global rules pinning `color-scheme` on `[data-surface='light'|'dark']`.
- Keep `data-mode` for app logic / SSR init; `color-scheme` is what CSS uses.

### 5. `createDesignTheme` / `overrideComponent`

No compilation changes — `components` entries already pass through to
`styles.override()`. Types pick up `StylableOverride` automatically once
TypeStyles exports them.

### 6. Docs

- Update `specs/typed-component-theming.md` — link here for override modes.
- Update `docs/content/theming/customize.mdx` — document `{ light, dark }`
  (preferred) and `conditions` / `when.*` (escape hatches).
- Migrate `proseContent` string selectors to mode values or `conditions`.

### 7. Catalog bump

```yaml
# pnpm-workspace.yaml
typestyles: ^0.16.0
```

---

## Browser support & SSR research (2026)

Research backing a **`light-dark()` + `color-scheme` strategy for tokens and
color properties**, with `conditions` retained for non-color overrides.

### `color-scheme` — safe to depend on

|                     |                                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Baseline**        | Widely available since **January 2022**                                                                                                             |
| **Engines**         | Chrome 98+, Edge 98+, Firefox 96+, **Safari 13+**, iOS 13+                                                                                          |
| **Behavior**        | Tells the UA which schemes the page supports; styles native UI (form controls, scrollbars, canvas default) accordingly. Inherits.                   |
| **Subtree pinning** | `color-scheme: dark` on an element forces dark for descendants — replaces `data-surface` token patches for **color** resolution via `light-dark()`. |

Progressive enhancement: unsupported browsers ignore the property and stay
light-default for native UI. No breakage.

**Also ship** `<meta name="color-scheme" content="light dark">` in `<head>` —
parsed before stylesheets, reduces incorrect canvas/scrollbar coloring during
load ([HTML meta spec](https://html.spec.whatwg.org/), [web.dev](https://web.dev/articles/light-dark)).

### `light-dark()` — viable for tokens; narrower than we assumed

|                   |                                                                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Baseline**      | **Newly available** since **May 2024**; expected **Widely available ~Nov 2026** ([Web Features Explorer](https://web-platform-dx.github.io/web-features-explorer/features/light-dark/)) |
| **Engines**       | Chrome **123+**, Edge 123+, Firefox **120+**, Safari **17.5+**, iOS **17.5+**                                                                                                           |
| **Not supported** | Safari ≤ 17.4, Chrome ≤ 122, Samsung Internet ≤ 26, UC Browser, KaiOS                                                                                                                   |
| **Usage**         | ~1.35% of Chrome page loads (growing)                                                                                                                                                   |

**What it accepts today:** two `<color>` values or two `<image>` values only
([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark),
[CSS Color 5](https://drafts.csswg.org/css-color-5/#light-dark)). Works inside
custom properties:

```css
--var-ui-color-accent: light-dark(oklch(55% 0.2 290), oklch(72% 0.16 290));
color: var(--var-ui-color-accent);
```

**What it does NOT accept today:** lengths, font weights, full `box-shadow`
shorthands, etc. CSSWG [issue #10152](https://github.com/w3c/csswg-drafts/issues/10152)
proposes generalizing the function; no engine support yet. Non-color mode diffs
stay on `conditions` / `@media (prefers-color-scheme)`.

**Shadow tokens:** a whole shadow like `2px 2px 0 #000` is not a `<color>`.
Options: keep shadow values on theme `modes`, split shadow into a color token
with `light-dark()` inside a fixed template, or use two mode-specific custom
properties (same as today's approach, smaller win).

### How `light-dark()` resolves (vs today's `data-mode` CSS)

`light-dark()` reads the element's **used `color-scheme`**, not
`prefers-color-scheme` directly and not `data-mode`:

| `color-scheme` on element                                 | `light-dark(a, b)` returns |
| --------------------------------------------------------- | -------------------------- |
| `light` (or first value of `light dark` when OS is light) | `a`                        |
| `dark`                                                    | `b`                        |
| `light dark` + OS/system preference                       | OS picks                   |
| unset                                                     | `a` (light default)        |

Mapping var-ui's three-way `data-mode`:

| `data-mode`       | `color-scheme` on `<html>`            |
| ----------------- | ------------------------------------- |
| `light`           | `light`                               |
| `dark`            | `dark`                                |
| `system` / absent | omit, or `light dark` (let OS decide) |

`data-mode` remains useful for **app state**, storage, and React context.
**`color-scheme` is what makes `light-dark()` work.** Both must be set together
in boot scripts.

### SSR / flash risk

**Risk:** wrong mode branch visible before CSS/JS apply — FOIC (flash of
incorrect color).

| Layer                                                      | What it prevents                                                       | var-ui today                                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `<meta name="color-scheme" content="light dark">`          | Early canvas/native UI hint                                            | **Missing** from ThemeScript / docs                                                |
| Blocking inline `<script>` in `<head>`                     | Pinned preference before paint                                         | **Partial** — `ThemeScript` sets `data-mode` + theme class, **not `color-scheme`** |
| `color-scheme` in CSS `:root { color-scheme: light dark }` | Default once CSS loads                                                 | Not emitted globally                                                               |
| React `useLayoutEffect` (`DesignSystemProvider`)           | Sync before paint (client)                                             | Sets `style.colorScheme` when `applyToDocument` — **too late for SSR HTML**        |
| `data-mode` + `@media` token rules (current)               | Works once CSS loads; pinned mode needs `data-mode` on html before CSS | ThemeScript sets `data-mode` early ✓                                               |

**Migrating tokens to `light-dark()` does not worsen flash** if we fix boot:

1. Add `<meta name="color-scheme" content="light dark">`.
2. Extend `ThemeScript` / `bootTheme` / `getColorModeInitScript` to set
   `document.documentElement.style.colorScheme = 'light' | 'dark'` for pinned
   modes (same timing as `data-mode`).
3. Emit `:root, .theme-* { color-scheme: light dark; }` in global CSS as
   fallback for `system` mode.
4. Emit `[data-surface='dark'] { color-scheme: dark; }` (and `light`) in the
   tokens layer.

For **SSR HTML without inline script** (rare): ship `color-scheme: light dark`
in CSS only — system users get correct OS branch; pinned-dark users may flash
until hydration (same class of problem as today with `data-mode`).

**Optional legacy fallback** (only if we must support Safari < 17.5):

```css
:root {
  --accent: oklch(55% …);
  @media (prefers-color-scheme: dark) {
    :root:not([data-mode='light']) {
      --accent: oklch(72% …);
    }
  }
  @supports (color: light-dark(white, black)) {
    --accent: light-dark(oklch(55% …), oklch(72% …));
  }
}
```

Google documents this pattern in [modern-web-guidance dark mode](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/user-experience/dark-mode.md).
Doubles CSS for tokens — only worth it with a hard legacy browser requirement.

### Recommendation (updated)

| Layer                              | Approach                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Token colors + `extend` leaves** | **Go `light-dark()`** — drop `colorMode` / surface **color** mode CSS rules in a follow-up PR. Biggest win, smallest author API. |
| **Token shadows**                  | Keep theme `modes` for now, or refactor shadow colors inside templates.                                                          |
| **Override color properties**      | `{ light, dark }` → `light-dark()` where property accepts `<color>`.                                                             |
| **Override structural properties** | `conditions` + `when.dark` (unchanged).                                                                                          |
| **SSR**                            | Fix boot (`meta` + inline `color-scheme`) **in the same PR** as token migration — not optional.                                  |
| **Legacy fallback**                | Skip unless product requires Safari ≤ 17.4 / Chrome ≤ 122.                                                                       |

---

## Future: `color-scheme` + `light-dark()` for tokens

**Status: shipped (V9)** — ambient `colorMode` and compatible `extend` leaves
compile to `light-dark()` on theme custom properties; surface color modes
removed in favor of global `color-scheme` on `data-surface`. Shadow `modes`
remain for non-color token diffs.

### Idea

Today `createDesignTheme` emits separate rules for ambient light/dark and
surfaces — `data-mode` attribute selectors, `prefers-color-scheme` fallbacks,
and descendant `data-surface` token patches. Much of this exists to flip
`--var-ui-color-*` custom properties.

If hosts reliably set `color-scheme` (ambient + surface), token emission could
simplify to:

```css
.theme-acme {
  color-scheme: light dark;
  --var-ui-color-accent-default: light-dark(oklch(55% …), oklch(72% …));
  --var-ui-color-background-surface: light-dark(#fff, #181818);
}
```

Explicit `data-mode="light"|"dark"` would set `color-scheme` on the theme root
(unchanged React/Astro behavior). `data-mode="system"` omits it so the OS
picks. Surface markers set local `color-scheme`, potentially **replacing**
surface token mode layers for colors.

`extend { light, dark }` leaves would compile to the same `light-dark()` on
`--var-ui-{namespace}-*` properties instead of separate dark override rules.

### Benefits

- Smaller CSS (one rule per token namespace vs N mode branches).
- Override `{ light, dark }` and token values share one resolution mechanism.
- Surfaces "just work" for any property using `light-dark()`, not only colors.

### Risks (updated from research)

| Topic                        | Finding                                                                                                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser support              | `color-scheme`: universal on modern targets. `light-dark()`: Safari 17.5+ / Chrome 123+ — **~0.1% Safari 17.4 tail** on iOS; acceptable for a design-system target unless enterprise legacy is required. |
| Non-color tokens             | `light-dark()` **cannot** wrap lengths/font-weight/shadow shorthands today. Shadow `modes` stay.                                                                                                         |
| `color.syntax` / code blocks | Pin `color-scheme: dark` on code surfaces; test contrast.                                                                                                                                                |
| SSR flash                    | **Real risk** if boot omits `color-scheme`; **fixable** with meta + inline script (see research section). Not a reason to avoid `light-dark()`.                                                          |
| Third-party CSS              | `color-scheme` theming native controls — generally desired for a design system.                                                                                                                          |
| Migration                    | Snapshot-diff built-in themes; ship boot script + meta in same release.                                                                                                                                  |

### Recommendation

- **V8 (TypeStyles):** mode values for **color properties** + `conditions` for
  everything else; wire `color-scheme` boot in var-ui.
- **V8b / V9 (var-ui tokens):** migrate `colorMode` + surface **color** tokens
  to `light-dark()`; delete redundant mode CSS once boot + snapshots pass.
  Keep shadow `modes` until shadow story is settled. **Done (V9).**

---

## Relationship to existing specs

| Spec                                       | Relationship                                                                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V7 `typed-component-theming.md`            | Override style blocks gain `{ light, dark }` values and `conditions`.                                                                                     |
| V4 `surface-tone-override.md`              | Token surface modes unchanged in V8. Global `color-scheme` on `data-surface` complements surface modes for override properties. Token migration deferred. |
| V3 `component-override-contract.md`        | Tier 1 vars unchanged. Conditional overrides are Tier 2+ config DX, not a new tier.                                                                       |
| TypeStyles `specs/styles-override-meta.md` | `__tsMeta` unchanged. Conditions compile to additional rules on existing selector fragments.                                                              |

---

## Explicitly out of scope (V8)

- **Token `colorMode` / surface recompile via `light-dark()`** — deferred; see
  [Future](#future-color-scheme--light-dark-for-tokens).
- **Per-mode override objects at config top level** — e.g. `{ dark: { base: … } }`.
  Use `{ light, dark }` on properties or `conditions` entries.
- **String selector presets in var-ui** — engine features only.
- **Mode + responsive on the same property (v1)** — v2 nested adaptive values.
- **New variant options** — unchanged from V7.
- **Conditional `c.vars()` / typed component vars** — still phase 2 in V7.
- **Nested-theme proximity** — still `styles.scope()` / `@scope`.

---

## Implementation checklist

### TypeStyles (blocking)

- [ ] `colorModes` instance config + `{ light, dark }` property serialization → `light-dark()`.
- [ ] Export `ConditionalOverride`, `StylableOverride` types.
- [ ] Extend `OverrideConfig` / slot / flat / multi-slot shapes.
- [ ] Refactor condition compiler to `ConditionCompileContext` (`anchor` + `scopePrefix`).
- [ ] Emit conditional rules from `styles.override()` through `insertRules`.
- [ ] Dev validation for `conditions` entries and mode-aware values.
- [ ] Type-level + snapshot + dev-warning tests (mode values + conditions).
- [ ] Engine spec mirror + docs page + `IMPROVEMENTS.md` entry.

### var-ui (after engine release)

- [ ] Bump `typestyles` catalog.
- [ ] Wire `colorModes` + `breakpoints` on `createTypeStyles`.
- [ ] `color-scheme` on provider wrapper + `data-surface` global rules.
- [ ] Add `theme-conditions.ts` + `when` helpers (reduced-motion-first).
- [ ] Snapshot tests for mode values + `conditions` in themes.
- [ ] Docs update (customize + V7 spec cross-link).
- [ ] Check off V8 in `ROADMAP.md`.

---

## Open questions (resolve during TypeStyles implementation)

### Mode-aware values

1. **Reserved keys** — reject `{ light, dark, base }` on one object in v1, or
   treat unknown keys as dev warnings?
2. **`light-dark()` fallback** — if only `dark` is provided, allow
   `light-dark(initial, dark)` or require both sides?
3. **Custom properties** — confirm `light-dark(var(--a), var(--b))` registers
   correctly in all supported browsers for override emission.

### `conditions`

4. **`:root` vs `html` in ancestor selectors** — when `data-mode` is on
   `document.documentElement`, should `ancestor` attr conditions match both
   `:root[data-mode]` and `html[data-mode]` for robustness, or is one sufficient?
5. **`when.or` specificity** — confirm conditional OR branches emit as separate
   rules with identical specificity (theme mode parity).
6. **`conditions` on unconditional-only blocks** — allow `base: { conditions: [...] }` with no other keys? (Recommended: yes.)

### Deferred token migration

7. **`light-dark()` on `@property` tokens** — does typed custom property
   registration need syntax updates when values become `light-dark()`?
8. **Surface token modes** — can `color-scheme` on `data-surface` fully replace
   descendant color overrides, or do some tokens need explicit mode rules?
