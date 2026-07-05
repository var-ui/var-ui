# var-ui Roadmap

Tracking doc for var-ui's own design-system work, in the style of
[TypeStyles' `IMPROVEMENTS.md`](https://github.com/type-styles/typestyles/blob/main/IMPROVEMENTS.md)
(the sibling project this is built on). Each task ships as its own PR; check
items off and link the PR as they land. Full designs live in `specs/`.

## Why var-ui exists

Meta open-sourced **Astryx**, an internal-tools design system built on
StyleX. Astryx's actual achievement is that a restrictive compiler (StyleX)
can still produce a flexible, easily-themeable system — but it gets there by
working _around_ StyleX: theming is 100% plain CSS custom properties
generated from a `defineTheme()` config, component-level overrides are plain
CSS scoped via `@scope` against stable classes, and StyleX itself is demoted
to an internal implementation detail plus an optional `xstyle` escape hatch
for power users.

var-ui exists to prove the same flexible, CSS-native theming story doesn't
need a workaround in the first place, when the foundation is
[TypeStyles](https://github.com/type-styles/typestyles) instead of StyleX:
real CSS custom properties, semantic/readable class names, cascade layers, and
a general theme condition engine, all reachable directly — no compiler
restriction to route around, no escape hatch needed for the common case.

**Scope:** var-ui is the actual public, open-source design system —
components, themes, tokens, docs, and a public npm surface (`@var-ui/*`). Core
CSS/theming _engine_ capabilities that var-ui needs from TypeStyles itself
(generative color/type/motion/radius scales, the `@scope` override helper, the
`descendant` condition-engine scope) are designed and built in the TypeStyles
framework — var-ui consumes them as a versioned dependency, it doesn't reimplement
them. See TypeStyles' `IMPROVEMENTS.md` P5 section for that side of the work.

## Status of TypeStyles engine dependencies

| Capability                                                                   | TypeStyles status | var-ui impact                                             |
| ---------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------- |
| `typestyles/color-scale` (`parseColor`, `generateRamp`, `contrastRatio`)     | **Shipped**       | Powers `createColorTheme` today                           |
| `typestyles/token-scale` (geometric/linear scale + duration-band generators) | **Shipped** (0.8) | V2 ready — spec: `type-motion-radius-scale-generation.md` |
| `styles.scope()` + classname-stability contract + lint rule                  | **Shipped** (0.8) | V3 ready — spec: `component-override-contract.md`         |
| `descendant` scope on the theme condition engine                             | **Shipped** (0.8) | V4 ready — spec: `surface-tone-override.md`               |

Don't re-derive these designs here — when picking up a blocked item, check
TypeStyles' `IMPROVEMENTS.md`/`specs/` for current status first.

---

## V1 — Color theme generation

- [x] **V1 — `createColorTheme`** — generate a full functional light/dark
      color palette from one accent color, built on `typestyles/color-scale`.
      Spec: `specs/color-scale-generation.md`.

## V2 — Generative primitive scales

- [ ] **V2 — Wire `generateGeometricScale`/`generateLinearScale`/
      `expandDurationBand` into `packages/core/src/tokens/primitive.ts`** —
      replace hand-picked `fontSizeValues`/`radiusValues` and add duration
      min/max bands. Requires `typestyles` **^0.8.0**. Spec:
      `specs/type-motion-radius-scale-generation.md`.

## V3 — Component override contract

- [ ] **V3 — Adopt the classname-stability contract across `packages/core`
      recipes** — treat every `styles.component()` semantic class name as public
      API once published; audit recipes for anything themeable that isn't
      already exposed as a component-scoped CSS variable (the `c.vars()` pattern
      `button.ts` already uses) and expose it; commit classname snapshot + lint
      rule. Requires `typestyles` **^0.8.0** and `@typestyles/eslint-plugin`.
      Spec: `specs/component-override-contract.md`.

## V4 — Surface tone overrides

- [ ] **V4 — `surfaces` config + `SURFACE_ATTRIBUTE` convention** — let a
      theme define fixed light/dark faces for a marked subtree (an always-dark
      toast on a light page, etc.), and roll it out to all 8 built-in themes.
      Requires `typestyles` **^0.8.0** (`descendant` scope). Spec:
      `specs/surface-tone-override.md`.

## V5 — Theme gallery, packaging, and the var-ui.com site

- [ ] **V5 — Public theme gallery + packaging decision + var-ui.com site** —
      compare all 8 built-in themes side by side (light/dark faces together, once
      V4 lands), decide on standalone `@var-ui/theme-*` packages now that
      publishing is real, and build the actual var-ui.com site this lives on
      (separate from TypeStyles' own docs site — nothing here can reuse that
      site's `LiveDemo` component directly). Spec: `specs/theme-gallery.md`.

## V6 — Component breadth (Astryx core parity)

- [ ] **V6 — Grow `@var-ui/core` from ~22 recipes to ~95 module families**
      (matching Astryx core scope, excluding lab/charts). Phased plan:
      infrastructure (Field, LayerProvider, layout primitives,
      `@var-ui/icons` + `IconProvider`), then
      feedback/content, forms/menus, overlays, tables/lists, navigation,
      layout polish, and chat. Spec: `specs/component-breadth.md`.
  - Can proceed in parallel with V3 (`c.vars()` audit on existing recipes).
  - `@var-ui/lab` (charts, Schedule, Stepper, etc.) is a separate track —
    see spec's Lab tier section.

## Future (unscheduled)

- Per-recipe structured docs for human + AI-agent discovery (colocated
  `.doc.ts` files per component, a CLI or editor-integration delivery
  vehicle). Originally scoped as TypeStyles P5.8; moved here since it's about
  documenting var-ui's own components. Not yet speced in detail.
