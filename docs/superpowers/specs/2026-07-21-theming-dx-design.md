# Theming DX cleanup — design

Clarify Var UI theming so it demonstrates a design system on TypeStyles:
thin wrapper around engine APIs, Var UI token shape as the theming contract,
and `createColorTheme` as an optional color helper that plugs into that shape.

**Date:** 2026-07-21  
**Status:** Implemented  
**Plan:** `docs/superpowers/plans/2026-07-21-theming-dx.md`

**Related:** `ROADMAP.md` (V1 `createColorTheme`, V4 surfaces, V7 typed
theming); `specs/color-scale-generation.md`; `specs/typed-component-theming.md`;
`specs/surface-tone-override.md`

---

## Goals

- Make `createDesignTheme` a **thin** wrapper: merge Var UI defaults, then
  call TypeStyles `tokens.createTheme` / `colorMode` / `modes` with engine
  vocabulary (`base`, `modes`, `when.attr`).
- Treat **Var UI design tokens** as the theming API (TypeStyles does not
  define a product token shape).
- Let consumers start from **any built-in token pack** (`from: forestTokens`).
- Keep `createColorTheme` as the easy accent → light/dark **color** helper;
  shape stays `{ light, dark }` and feeds `colorMode`.
- Stop duplicating mode-invariant tokens (fontSize, radius, …) into both
  light and dark.
- Move **syntax** under the `color` namespace.
- Remove **`codeBlock` component tokens** (pre–`c.vars()` leftover); the
  `codeBlock` recipe reads semantic `color` tokens directly.
- Type theme token leaves so **token refs** (e.g. `designTokens.palette['sky-7']`)
  are valid, not only raw CSS literals.
- Remove stale / parallel theming stories from docs (dead README helpers).

## Non-goals

- Folding `accent` into `createDesignTheme` (generator stays separate).
- Regenerating gallery themes via `createColorTheme` (hand-authored packs
  remain).
- Amplify-style `overrides[]` array (use TypeStyles `modes` instead).
- Removing `extend` / `components` / `themeableComponents` in this pass
  (recipe override DX stays; may slim later).
- Changing TypeStyles itself.
- Mode-dependent elevation shadows for edge themes (ai-glow): use raw
  `modes` when needed, not a second full token tree.
- Accent-tinted syntax generation in `createColorTheme` (attach default
  syntax for this pass).

## Locked decisions

| Topic            | Choice                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| Mental model     | TypeStyles-first; sugar only for Var UI token shape + defaults                       |
| Theme factory    | Thin `createDesignTheme` (not raw-only, not thick inventiveness)                     |
| Built-in bases   | `from: forestTokens` (etc.), not `extends: forestTheme`                              |
| Naming           | Token packs (`defaultTokens`, `forestTokens`), not “faces”                           |
| Token layout     | Single `tokens` map; dark mode = color tree only                                     |
| Syntax           | Nested under `color.syntax` (drop top-level `syntax` namespace)                      |
| Component tokens | Remove `codeBlock` namespace; recipe uses `color.*` + `c.vars()`                     |
| Token leaf type  | Literals **or** TypeStyles token refs (`var(--…)` / ref strings)                     |
| Color helper     | `createColorTheme` → `{ light, dark }` color trees; `colorMode: createColorTheme(…)` |
| Surfaces         | Raw `modes` + `tokens.when.attr(SURFACE_ATTRIBUTE, …)` (no `surfaces` config key)    |
| Docs             | Always show compiled TypeStyles form alongside the wrapper                           |

---

## Architecture

```text
createColorTheme({ accent })
        │
        └─ { light: ColorValues, dark: ColorValues }   // includes syntax

createDesignTheme({
  name,
  from?,          // DesignTokenPack (default: defaultTokens)
  tokens?,        // DeepPartial<DesignThemeTokenValues>
  colorMode?,     // { light?, dark? } DeepPartial<ColorValues>
  modes?,         // ThemeModeDefinition[] (TypeStyles)
  extend?,
  components?,
})
        │
        ├─ resolve from.tokens / from.darkColor → merge tokens → resolve light/dark color
        ├─ tokens.colorMode.systemWithLightDarkOverride({ light: { color }, dark: { color }, … })
        ├─ tokens.createTheme(name, { base, modes: [...ambient, ...modes] })
        └─ extend / components (existing behavior)
```

Var UI owns: token taxonomy, default packs, color generator, conventions
(`data-mode`, `SURFACE_ATTRIBUTE`).  
TypeStyles owns: theme surfaces, condition engine, recipes, `styles.override`.

---

## Token shape

### Leaf type: literals or token refs

Theme and pack values must accept both raw CSS and references into registered
tokens (palette, space, etc.). TypeStyles already emits refs as strings
(`var(--var-ui-palette-sky-7)`); built-ins already do this at runtime
(`p.palette['sage-1']`). The type layer must not block that.

**Do not** type theme leaves as `as const` literal maps (e.g.
`fontSize.md: '16px'` only). Those reject refs when authoring packs or
`createDesignTheme({ tokens })`.

```ts
/**
 * CSS value written into a theme / pack.
 * - Raw: `'#0064E0'`, `'16px'`, `'0 4px 12px …'`
 * - Ref: `designTokens.palette['sky-7']`, `designTokens.space[4]`, …
 * Aligns with TypeStyles `TokenValues` leaves (`string | number`).
 */
type DesignTokenLeaf = string | number;

/** Map a structural shape so every leaf is `DesignTokenLeaf`. */
type WithTokenLeaves<T> = {
  [K in keyof T]: T[K] extends string | number ? DesignTokenLeaf : WithTokenLeaves<T[K]>;
};
```

Use `WithTokenLeaves<…>` (or an equivalent) for **authored** value types
(`DesignColorValues`, pack `tokens`, `colorMode` slices). Keep separate
narrower types for the **default tables** in `primitive.ts` if useful for
scale generation, but convert at the pack/theme boundary.

Example that must type-check:

```ts
import { createDesignTheme, designTokens, forestTokens } from '@var-ui/core';

createDesignTheme({
  name: 'acme',
  from: forestTokens,
  tokens: {
    color: {
      accent: {
        default: designTokens.palette['sky-7'],
        hover: designTokens.palette['sky-8'],
      },
    },
    radius: {
      md: designTokens.radius.lg, // ref to another token, not only '8px'
    },
  },
});
```

Runtime: deep-merge and `tokens.createTheme` already stringify refs; no
special casing beyond typing + tests that emitted CSS contains
`var(--var-ui-…)` when a ref is supplied.

### Mode-invariant + color

```ts
type DesignColorValues = WithTokenLeaves<{
  background: { app: string; surface: string; subtle: string; elevated: string };
  text: { primary: string; secondary: string; onAccent: string; onDanger: string };
  accent: { default: string; hover: string };
  border: { default: string; strong: string; focus: string };
  shadow: { offset: string }; // hard-shadow color (stays under color)
  danger: { default: string; solid: string };
  success: { default: string; solid: string };
  warning: { default: string; onSolid: string };
  info: { default: string; onSolid: string };
  overlay: { default: string };
  syntax: DesignSyntaxValues; // moved from top-level syntax namespace
}>;

/** Values written into a theme / pack (no component token namespaces). */
type DesignThemeTokenValues = {
  color: DesignColorValues;
  space?: WithTokenLeaves<DesignSpaceValues>;
  radius?: WithTokenLeaves<DesignRadiusValues>;
  fontFamily?: WithTokenLeaves<DesignFontFamilyValues>;
  fontSize?: WithTokenLeaves<DesignFontSizeValues>;
  fontWeight?: WithTokenLeaves<DesignFontWeightValues>;
  lineHeight?: WithTokenLeaves<DesignLineHeightValues>;
  shadow?: WithTokenLeaves<DesignShadowValues>; // elevation xs/sm/md/…
  duration?: WithTokenLeaves<DesignDurationValues>;
  easing?: WithTokenLeaves<DesignEasingValues>;
  transition?: WithTokenLeaves<DesignTransitionValues>;
  borderWidth?: WithTokenLeaves<DesignBorderWidthValues>;
};
```

`DeepPartial<DesignThemeTokenValues>` / `DeepPartial<DesignColorValues>` for
config patches must preserve `DesignTokenLeaf` at leaves (not collapse to
literal-only primitives).

### Registration change

- Register syntax keys on the `color` namespace (e.g.
  `--var-ui-color-syntax-keyword`), not a separate `syntax` / `codeSyntax`
  namespace.
- Update recipes and docs that read `t.syntax.*` → `t.color.syntax.*` (or
  equivalent ref path after the move).
- Treat as a **breaking** token path change for `@var-ui/core` (document in
  changelog / migration note).

### Remove `codeBlock` component tokens

`packages/core/src/tokens/index.ts` already notes to remove this block.
`codeBlock` tokens only aliased semantic colors; with `c.vars()` the recipe
should default vars from `t.color.*` directly.

- Delete `codeBlockTokens` / `designComponentTokens` and drop `codeBlock` from
  `designTokens`.
- Update `codeBlock` recipe: e.g. `background` ← `t.color.background.surface`,
  header/inline/highlight ← `t.color.background.subtle`, border ←
  `t.color.border.default` (same mapping as today’s aliases).
- Theme customization for code blocks uses Tier 1 `c.vars` / `components`
  overrides, not a `codeBlock` token namespace.
- Docs/README: remove `designComponentTokens` / `codeBlock` token guidance.

### Why not full light/dark trees

`fontSize`, `fontWeight`, `radius`, etc. do not change with color mode.
Style themes (new-wave, windows-95, …) currently duplicate those into both
modes; the new shape sets them once under `tokens`.

---

## `createDesignTheme` API

```ts
type DesignThemeConfig<E extends ExtendMap = Record<string, never>> = {
  name: string;

  /** Token pack to merge onto. Defaults to `defaultTokens`. */
  from?: DesignTokenPack;

  /** Mode-invariant patches + optional light `color` overrides. */
  tokens?: DeepPartial<DesignThemeTokenValues>;

  /**
   * Ambient light/dark color slices (Var UI color tree only).
   * Same shape as `createColorTheme`’s return value.
   */
  colorMode?: {
    light?: DeepPartial<DesignColorValues>;
    dark?: DeepPartial<DesignColorValues>;
  };

  /** Additional TypeStyles modes (surfaces, custom conditions). */
  modes?: ThemeModeDefinition[];

  extend?: E;
  components?: ThemeComponentsConfig<DesignThemeTokens<E>>;
};

/** Built-in or custom base for `from`. */
type DesignTokenPack = {
  /** Mode-invariant namespaces + light color (incl. syntax). */
  tokens: DesignThemeTokenValues;
  /** Dark color tree only (incl. syntax). */
  darkColor: DesignColorValues;
};
```

### Merge rules

1. `pack = from ?? defaultTokens`
2. `mergedTokens = deepMerge(pack.tokens, tokens ?? {})`
3. `lightColor = deepMerge(mergedTokens.color, colorMode?.light ?? {})`
4. `darkColor = deepMerge(pack.darkColor, colorMode?.dark ?? {})`  
   Dark mode never re-applies fontSize/radius/etc. — only the color tree.
5. TypeStyles `base` = `{ ...modeInvariant(mergedTokens), color: lightColor }`  
   (`modeInvariant` = all keys except peeling color into the face values above).
6. Ambient modes from `tokens.colorMode.systemWithLightDarkOverride` with
   `light: { color: lightColor }`, `dark: { color: darkColor }`, existing
   `data-mode` / system behavior unchanged.
7. Append consumer `modes` as-is.
8. `extend` / `components` keep current semantics.

Public pack exports (name matches `from: forestTokens`):

```ts
export const defaultTokens: DesignTokenPack;
export const forestTokens: DesignTokenPack;
export const roseTokens: DesignTokenPack;
// … amber, aiGlow, newWave, windows95, classicSystem
```

For direct access without the pack wrapper, destructure:
`const { tokens, darkColor } = forestTokens`.

### Compilation (documented)

```ts
tokens.createTheme(name, {
  base: { ...invariants, color: lightColor },
  modes: [
    ...tokens.colorMode.systemWithLightDarkOverride({
      attribute: 'data-mode',
      values: { light: 'light', dark: 'dark' },
      scope: 'self',
      light: { color: lightColor },
      dark: { color: darkColor },
    }),
    ...modes,
  ],
});
```

---

## `createColorTheme`

- **Keep** return shape: `{ light: DesignColorValues; dark: DesignColorValues }`.
- Each map includes **`syntax`**. For this pass, attach
  `defaultLightSyntaxValues` / `defaultDarkSyntaxValues` (no accent-tinted
  syntax generation yet). Hand-authored packs may still override syntax.
- Primary consumption:

  ```ts
  createDesignTheme({
    name: 'acme',
    colorMode: createColorTheme({ accent: '#7c3aed' }),
  });
  ```

- Custom helpers must return the same `{ light, dark }` color shape.

---

## Surfaces

Remove `DesignThemeConfig.surfaces`. Fixed-tone subtrees use TypeStyles modes:

```ts
const colors = createColorTheme({ accent: '#7c3aed' });

createDesignTheme({
  name: 'acme',
  from: forestTokens,
  colorMode: colors,
  modes: [
    {
      id: 'surface-dark',
      overrides: { color: colors.dark },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    },
    {
      id: 'surface-light',
      overrides: { color: colors.light },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    },
  ],
});
```

Built-in themes that currently set `surfaces` migrate to the same `modes`
entries (or a tiny internal helper used only inside `packages/core` themes,
not part of the public config shape). Prefer **inlining modes** in built-ins
so the docs example matches what we ship.

Keep exporting `SURFACE_ATTRIBUTE`.

---

## Built-in themes migration

Each gallery theme becomes a pack + `createDesignTheme` call:

```ts
export const forestTokens: DesignTokenPack = {
  tokens: {
    color: { ...forestLightColor, syntax: defaultLightSyntax },
    shadow: neoBrutalistShadow,
  },
  darkColor: { ...forestDarkColor, syntax: defaultDarkSyntax },
};

export const forestTheme = createDesignTheme({
  name: 'forest',
  from: forestTokens,
  modes: [
    /* surface-light / surface-dark using pack colors */
  ],
});
```

Style themes (ai-glow, new-wave, …) put fontSize/radius/etc. once under
`tokens`, not duplicated per mode. If dark needs different elevation
shadows, add a dedicated `modes` entry.

---

## Docs / cleanup

- Rewrite `packages/core/README.md` theming sections:
  - Ladder: token pack → `createDesignTheme` → optional `createColorTheme` /
    `colorMode` → `modes` / `extend` / `components`.
  - Delete references to `mergeDesignThemeOverrides`,
    `createBrandAccentOverrides`, `theme-api.ts`, `DesignThemeOverrides`,
    `designMotion`, `designComponentTokens` / `codeBlock` token namespace if
    those APIs are absent or removed.
  - Document token-ref leaves (palette / space refs in `tokens` / `colorMode`).
  - Show TypeStyles compilation next to the wrapper example.
- Update `specs/color-scale-generation.md` consumption example to
  `colorMode: createColorTheme(…)`.
- Note breaking: `syntax` → `color.syntax`; `light`/`dark`/`surfaces` config
  keys removed; `codeBlock` token namespace removed.

---

## Public API summary

| Export                               | Role                                          |
| ------------------------------------ | --------------------------------------------- |
| `createDesignTheme`                  | Thin typed wrapper                            |
| `createColorTheme`                   | Accent → `{ light, dark }` color trees        |
| `defaultTokens`, `forestTokens`, …   | `DesignTokenPack` bases for `from`            |
| `SURFACE_ATTRIBUTE`                  | Fixed-tone convention                         |
| `deepMergeThemeOverrides`            | Internal/merge helper; not a second theme API |
| `extendTokens` / `overrideComponent` | Advanced/composable primitives                |
| `tokens` / `styles` / `global`       | Re-exported TypeStyles runtime                |

Removed from public theme config: top-level `light`, `dark`, `surfaces`.

---

## Testing

- Unit: merge rules (`from`, `tokens`, `colorMode` partials).
- Unit: `createColorTheme` output includes `syntax`; still snapshot color maps.
- Unit: ambient CSS still emits `data-mode` + system dark rules with only
  `color-*` (and syntax under color) in dark overrides — not fontSize.
- Unit: surface modes via `modes` + `SURFACE_ATTRIBUTE`.
- Unit / type: `tokens` / `colorMode` accept `designTokens.palette[…]` (and
  similar refs); emitted CSS contains the corresponding `var(--var-ui-…)`.
- Unit: `codeBlock` recipe no longer reads `t.codeBlock.*`; defaults match
  prior color aliases.
- Migration: built-in themes still register; visual/gallery smoke as today.
- Update extend/components tests to new config shape.

---

## Implementation order (for the plan)

1. Token leaf typing (`DesignTokenLeaf` / `WithTokenLeaves`) for authored values.
2. Token registration: syntax under `color`; remove `codeBlock` tokens; point
   `codeBlock` recipe at `color.*`; update refs/recipes.
3. `DesignTokenPack` + export packs from built-ins (extract values).
4. Rewrite `createDesignTheme` config + merge + compilation.
5. Adapt `createColorTheme` (+ tests/snapshots) for `syntax`.
6. Migrate all built-in themes off `light`/`dark`/`surfaces`.
7. Docs + README cleanup; breaking-change notes.

---

## Open follow-ups (not this spec)

- Slim or demote public `overrideComponent` in favor of documenting
  `styles.override`.
- Whether standalone `extendTokens` global dark path can fold into theme-only
  `extend` later.
- Optional internal `surfaceModes(light, dark)` helper for built-ins only.
