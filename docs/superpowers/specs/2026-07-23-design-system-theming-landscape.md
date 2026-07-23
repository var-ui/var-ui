# Open Source Design System Theming Landscape

Research into how popular open source design systems structure design tokens, expose theming APIs, and optimize developer experience (DX).

**Date:** 2026-07-23  
**Purpose:** Inform Var UI theming architecture decisions; includes landscape survey, Var UI gap analysis, and full Astryx color token reference  
**Related:** `docs/superpowers/specs/2026-07-21-theming-dx-design.md`  
**Implementation:** `docs/superpowers/plans/2026-07-23-token-tree-expansion.md` (executed on branch `feat/token-tree-expansion`)

### Changelog (2026-07-23)

Addressed Tier 1–2 gaps from the Var UI gap analysis below: expanded `space`, added `size`, `breakpoint`, `zIndex`, `opacity`, `letterSpacing`; expanded semantic `color.*` (`popover`, `muted`, `link`, `ring`, `overlay.panel`, `text.onSuccess/onWarning/onInfo`, `skeleton`, `track`); added `shadow.elevation` and `color.shadow.color`. Color registration uses `tokens.declare('color')` + complete `defaultColorTokenValues` (no `buildColorRegistrationValues` merge helper).

---

## Executive Summary

| System                              | Token layers                      | Primary theming surface           | Component tokens?            | Light/dark                             | Scale generation                       |
| ----------------------------------- | --------------------------------- | --------------------------------- | ---------------------------- | -------------------------------------- | -------------------------------------- |
| [Astryx](#astryx)                   | Scale configs → semantic CSS vars | `defineTheme()` + `<Theme>`       | Yes (`components` map)       | `[light, dark]` tuples                 | Built-in (color, type, radius, motion) |
| [Chakra UI v3](#chakra-ui-v3)       | Primitive → semantic → recipes    | `defineConfig` + `createSystem`   | Yes (recipes / slot recipes) | Semantic token conditions              | Manual + CLI typegen                   |
| [shadcn/ui](#shadcnui)              | CSS vars → Tailwind bridge        | Global CSS (`:root`, `.dark`)     | Via component classes        | Class toggle (`.dark`)                 | Derived radius scale from `--radius`   |
| [HeroUI v3](#heroui-v3)             | Primitive → semantic → calculated | CSS import + overrides            | BEM class overrides          | `class` / `data-theme`                 | `color-mix()` calculated colors        |
| [Tailwind CSS v4](#tailwind-css-v4) | Primitive utilities only          | `@theme` in CSS                   | No (utility framework)       | Custom variants                        | Multiplier-based spacing               |
| [MUI v9](#mui-v9)                   | Palette → theme object → CSS vars | `createTheme()` + `ThemeProvider` | Yes (`components.*`)         | `colorSchemes`                         | Algorithmic (tonal offset)             |
| [Ant Design 5/6](#ant-design-56)    | Seed → Map → Alias (+ component)  | `ConfigProvider theme`            | Yes (per-component tokens)   | `darkAlgorithm`                        | Algorithm-driven                       |
| [Mantine v7](#mantine-v7)           | Theme object → CSS variables      | `createTheme()` + provider        | Variant resolver (implicit)  | `colorScheme` + virtual colors         | 10-shade generator tool                |
| [Radix Themes](#radix-themes)       | 12-step scales → CSS vars         | `<Theme>` props                   | Limited (component props)    | `appearance` prop                      | Fixed Radix Colors scales              |
| [Carbon v11](#carbon-v11)           | Role tokens → theme values        | Sass tokens + CSS custom props    | Baked into components        | Theme packages (white, g10, g90, g100) | Fixed spacing scale                    |
| [Amplify UI](#amplify-ui)           | Primitive → semantic → component  | `Theme` object + `ThemeProvider`  | Yes (`tokens.components.*`)  | `overrides[]` + `colorMode`            | Reference-heavy semantic layer         |

**Broad patterns:**

1. **CSS variables are the runtime contract** — even JS-first systems (MUI, Chakra, Mantine) emit `--*` vars for styling.
2. **Semantic tokens dominate product-facing APIs** — raw palettes are increasingly hidden behind roles like `background`, `accent`, `border`.
3. **Component styling splits two ways:** explicit component token namespaces (Astryx, Ant Design, MUI) vs. recipes/CVA that compose semantic tokens (Chakra, shadcn patterns).
4. **Scale generation beats hand-authoring** — accent-in → full palette-out is table stakes (Astryx, Ant Design algorithms, Mantine generator, MUI augmentColor).
5. **Type safety requires tooling** — Chakra CLI typegen, Astryx theme build augmentations, MUI module augmentation.

---

## Comparison: Token Scale Counts

Approximate default scales (before customization). Counts vary by version and import strategy.

| System         | Base/primitive colors       | Shades per hue               | Semantic color roles                        | Spacing steps                     | Font sizes                         | Radius steps              |
| -------------- | --------------------------- | ---------------------------- | ------------------------------------------- | --------------------------------- | ---------------------------------- | ------------------------- |
| Astryx         | 1 accent (+ neutral style)  | Generated                    | 149 `--color-*` (104 UI + 45 chart steps)   | 13 (0–12)                         | 12 (4xs–5xl) + type scale          | 7                         |
| Chakra v3      | 11 hue families             | 11 (50–950)                  | ~30 semantic + 9×8 palette semantics        | 35                                | 13 (2xs–9xl)                       | (see radii docs)          |
| shadcn/ui      | 7 base palettes at init     | Tailwind 11-step if used     | ~25 semantic pairs                          | Tailwind 35                       | Tailwind 13                        | 7 derived from `--radius` |
| HeroUI v3      | Minimal (accent + status)   | Calculated via `color-mix`   | ~20 semantic roles                          | Tailwind-based (`--spacing` unit) | Tailwind bridge                    | Derived from `--radius`   |
| Tailwind v4    | 24 families + specials      | 11 (50–950)                  | None (primitives only)                      | 35                                | 13 (xs–9xl)                        | 9                         |
| MUI v9         | 6 palette colors (+ custom) | 4 (main/light/dark/contrast) | Palette + `theme.palette.*`                 | Continuous (8px × n)              | Typography variants                | Shape.borderRadius        |
| Ant Design 5/6 | ~10 seed colors             | ~10 generated per seed       | 100+ alias/map tokens                       | ~20 size tokens                   | 5 heading + sm/lg/xl               | 5 (xs–lg + outer)         |
| Mantine v7     | ~15 open-color hues         | 10 (index 0–9)               | Variant-derived per component               | 5 (xs–xl)                         | Heading sizes + defaults           | sm/md/lg/xl + defaults    |
| Radix Themes   | 30 accent + 6 gray          | 12 per scale                 | Functional (--accent-9, etc.)               | 9                                 | Theme typography scale             | 5 (none–full)             |
| Carbon v11     | IBM color palette           | Theme-mapped                 | ~52 universal + grouped core                | 13 ($spacing-01–13)               | Type scale (productive/expressive) | Component-specific        |
| Amplify UI     | 10 hues + primary/secondary | 7 steps (10–100)             | ~45 semantic + 70 palette + 1000+ component | 10 (+ relative)                   | 10 (xxxs–xxxxl)                    | 7                         |
| Var UI         | 39 palette families         | 10 (1–10)                    | ~51 semantic (+ 390 palette)                | 8                                 | 7 (xs–3xl)                         | 6                         |

---

## Astryx

Docs: [Theme System](https://astryx.atmeta.com/docs/theme), [All Tokens](https://astryx.atmeta.com/docs/tokens)

### Architecture

Three-layer model:

1. **Scale configs** — high-level inputs (`color`, `typography`, `radius`, `motion`) that _generate_ tokens.
2. **Semantic CSS variables** — flat `--color-*`, `--spacing-*`, etc., consumed by components and StyleX.
3. **Component overrides** — semantic keys (`button`, `card`) with `base`, `variant:*`, `state:*` style maps.

Themes ship as npm packages (`@astryxdesign/theme-{name}`) with runtime injection or pre-built CSS for SSR.

### Developer experience

**Strengths:**

- `defineTheme({ extends: neutralTheme, tokens: { … } })` — shallow/deep merge rules are documented.
- Only override what differs; scale configs fill the rest.
- `astryx theme` CLI scaffolds themes; `astryx theme build` emits `.css`, `.js`, `.d.ts`, and optional variant augmentations.
- Light/dark via `[lightValue, darkValue]` tuples — no separate theme trees.
- `tokenVar()` / `resolveThemeTokens()` for non-React styling libraries.
- `useTheme()` for JS access (charts, canvas).

**Trade-offs:**

- Component overrides in runtime mode flash on SSR hydration unless using `/built` + CSS.
- Scale config categories (typography, color) _replace_ base entirely on extend — not additive.

### Token structure

**Colors (149 `--color-*` tokens in the default neutral theme):**

| Group               | Count   | Purpose                                                                              |
| ------------------- | ------- | ------------------------------------------------------------------------------------ |
| Core UI semantic    | 39      | Accent, surfaces, text, icons, status, borders, overlay, chrome                      |
| Communication hues  | 40      | 10 hues × 4 roles (background, border, icon, text) for tags/badges                   |
| Syntax highlighting | 14      | Code / monospace surfaces                                                            |
| Data visualization  | 56      | 10 categorical series + 1 neutral + 9 ramps × 5 steps + brand slot                   |
| **Total**           | **149** | See [Appendix: Astryx semantic color tokens](#appendix-astryx-semantic-color-tokens) |

Roughly **104 tokens** are general UI semantics (core + communication + syntax + categorical data); the remaining **45** are stepped chart ramps (`--color-data-{hue}-1` … `-5`).

**Spacing:** 13 steps — `0`, `0.5` (2px) through `12` (48px), 4px base grid with half-steps.

**Typography:**

- 12 font sizes (4xs–5xl), geometric scale `round(14 × 1.2^step)`.
- 4 weights; 3 font families (body, heading, code).
- Semantic type scale (H1–H6, Display 1–3, Body, Label, Code, Supporting).

**Radius:** 7 tokens — none, inner, element, container, page, chat, full. Generated from `{ base, multiplier }` config.

**Motion:** 9 duration tokens (fast/medium/slow × min/base/max) + 1 easing.

**Size:** 3 control heights (sm/md/lg).

**Component tokens:** Yes — `components: { button: { base: {}, 'variant:primary': {} } }`. Supports custom variant type augmentation on build.

---

## Chakra UI v3

Docs: [Theming Overview](https://chakra-ui.com/docs/theming/overview), [Tokens](https://chakra-ui.com/docs/theming/tokens), [Colors](https://chakra-ui.com/docs/theming/colors), [Spacing](https://chakra-ui.com/docs/theming/spacing)

### Architecture

Built on **Panda CSS** API:

```
defineConfig → createSystem(defaultConfig, config) → ChakraProvider
```

Token categories:

- **`tokens`** — primitives (W3C-inspired `{ value: "..." }` shape).
- **`semanticTokens`** — role-based, mode-aware (`{ value: { _light: "...", _dark: "..." } }`).
- **`recipes` / `slotRecipes`** — component multi-variant styles (CVA-like).
- **`textStyles` / `layerStyles`** — composed typography and surface presets.

### Developer experience

**Strengths:**

- Familiar Panda-style `cva` / `sva` on the system object.
- `@chakra-ui/cli typegen` generates token typings; `strictTokens` enforces usage.
- Token reference syntax in composite values: `border="1px solid {colors.red.300}"`.
- Semantic tokens recommended over raw palette in docs.

**Trade-offs:**

- More setup than CSS-only systems (config + system + provider + typegen).
- Default color palette is large — cognitive load for custom themes.

### Token structure

**Primitive colors:** 11 hue families (gray, red, pink, purple, cyan, blue, teal, green, yellow, orange) × **11 shades** (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) = **121 swatches**.

**Semantic colors:**

- Global: `bg.*`, `border.*`, `fg.*` (8–9 variants each).
- Per-palette: 8 tokens per hue (contrast, fg, subtle, muted, emphasized, solid, focusRing, border) × 11 hues.

**Spacing:** **35 steps** — 0.5 (2px) through 96 (384px), 4px-ish grid with fractional steps.

**Typography:**

- 3 font families (heading, body, mono).
- 13 font sizes (2xs–9xl).
- 9 font weights (thin–black).
- 5 line heights, 5 letter spacings.

**Component tokens:** Via **recipes** (not separate token namespace). Recipes reference semantic tokens like `bg.muted`, `colorPalette.solid`. Slot recipes for multi-part components (alert title/description/icon).

---

## shadcn/ui

Docs: [Theming](https://ui.shadcn.com/docs/theming)

### Architecture

Not a traditional component library — a **registry of copy-paste components** themed via **CSS variables** bridged to Tailwind v4 through `@theme inline`.

Layers:

1. **Semantic CSS vars** in `:root` and `.dark` (`--background`, `--primary`, etc.).
2. **Tailwind color bridge** (`--color-background: var(--background)`).
3. **Component classes** using utilities (`bg-background`, `text-primary-foreground`).

### Developer experience

**Strengths:**

- Lowest ceremony: edit CSS, see results.
- `shadcn/create` visual theme builder with preset export.
- Background/foreground pairing convention is easy to learn.
- `tailwind.baseColor` at init picks from 7 neutral bases (Neutral, Stone, Zinc, Mauve, Olive, Mist, Taupe).

**Trade-offs:**

- No runtime theme object — switching themes means CSS class or alternate stylesheet.
- No built-in component token layer; customization is Tailwind classes + CSS vars.
- Re-install required to switch from CSS variables to inline Tailwind colors.

### Token structure

**Semantic colors (~25 role pairs + chart/sidebar):**

| Category  | Tokens                                                                                 |
| --------- | -------------------------------------------------------------------------------------- |
| Surfaces  | background, card, popover, muted, accent, secondary, primary, destructive              |
| Text      | \*-foreground variants for each surface                                                |
| UI chrome | border, input, ring                                                                    |
| Charts    | chart-1 … chart-5                                                                      |
| Sidebar   | sidebar, sidebar-primary, sidebar-accent, sidebar-border, sidebar-ring (+ foregrounds) |

**Radius:** 1 base `--radius` → 7 derived tokens (sm through 4xl via multipliers 0.6–2.6×).

**Spacing / typography:** Inherits **Tailwind defaults** (35 spacing, 13 font sizes) unless customized in `@theme`.

**Component tokens:** No dedicated namespace. Components use semantic Tailwind utilities.

**Dark mode:** `.dark` selector overrides same token names.

---

## HeroUI v3

Docs: [Theming](https://heroui.com/en/docs/react/getting-started/theming), [Colors](https://heroui.com/docs/react/getting-started/colors)

### Architecture

CSS-first on **Tailwind v4**:

- `@import "@heroui/styles"` brings base, theme, components, utilities layers.
- Three variable classes: **Base** (mode-agnostic), **Theme** (light/dark), **Calculated** (`color-mix()` derivatives).

Semantic naming: unsuffixed = background (`--accent`), `-foreground` = text on that surface.

### Developer experience

**Strengths:**

- Override any token in CSS — no JS config required.
- Theme Builder for visual customization + export.
- `data-theme="ocean"` supports multiple custom theme files.
- BEM classes (`.button--primary`) for component-level overrides without touching source.
- Headless import path for full custom styling.

**Trade-offs:**

- Calculated colors (hover, soft variants) are opaque unless you read `variables.css`.
- Tight coupling to Tailwind v4 layer/import strategy.

### Token structure

**Semantic color roles (~20+):**

- accent, default (neutral), success, warning, danger
- background, foreground, surface, overlay, muted
- form field (`--field-*`: background, foreground, placeholder, border, hover, focus)
- separator, border, focus, link, backdrop
- component-specific: segment
- soft variants auto-calculated (or vibrant palette via `data-vibrant-palette`)

**Primitives:** `--white`, `--black`, `--snow`, `--eclipse` (mode-agnostic).

**Spacing:** Single unit `--spacing: 0.25rem` (Tailwind-compatible 4px grid); uses Tailwind spacing utilities.

**Radius:** `--radius` base + `--field-radius: calc(var(--radius) * 1.5)`.

**Component tokens:** Implicit via BEM + `--field-*`, `--segment-*`, shadow tokens (`--surface-shadow`, `--overlay-shadow`, `--field-shadow`). No JS theme object for components.

---

## Tailwind CSS v4

Docs: [Theme customization](https://tailwindcss.com/docs/theme), default theme in package

### Architecture

**Utility-first, primitive-only** — no semantic layer built in. v4 moves config from `tailwind.config.js` to CSS:

```css
@theme {
  --color-primary: oklch(…);
  --spacing-18: 4.5rem;
}
```

Namespace → utility mapping: `--color-*` → `bg-*`/`text-*`, `--spacing-*` → `p-*`/`m-*`/`gap-*`, etc.

### Developer experience

**Strengths:**

- Zero JS runtime for theming.
- `@theme inline` bridges semantic app vars to utilities (pattern used by shadcn, HeroUI).
- Arbitrary values + `@utility` for extensions.
- OKLCH default palette in v4.

**Trade-offs:**

- No semantic token conventions — teams must define their own.
- No component recipes, dark mode, or theme provider — all DIY.

### Token structure

**Colors:** **24 hue families** (slate, gray, zinc, neutral, stone, mauve, olive, mist, taupe, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) + black, white, inherit, current, transparent.

- **11 shades each:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.
- Total: **~264 chromatic swatches** + neutrals/specials.

**Spacing:** **35 values** — px, 0, 0.5–12 (0.125rem–3rem), then 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96. Based on **0.25rem (4px) multiplier**.

**Typography:**

- 13 font sizes: xs, sm, base, lg, xl, 2xl–9xl (each with optional line-height/letter-spacing sub-keys).
- 9 font weights: thin through black.

**Border radius:** 9 — none, sm, DEFAULT, md, lg, xl, 2xl, 3xl, full.

**Shadows:** 7 — sm, DEFAULT, md, lg, xl, 2xl, inner, none.

**Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).

**Component tokens:** None — by design.

---

## MUI v9

Docs: [Theming](https://mui.com/material-ui/customization/theming/), [Palette](https://mui.com/material-ui/customization/palette/), [Spacing](https://mui.com/material-ui/customization/spacing/)

### Architecture

JS theme object via `createTheme()`:

- `palette` — color roles with algorithmic light/dark/contrast derivation.
- `typography`, `spacing`, `shape`, `breakpoints`, `shadows`, `transitions`, `zIndex`.
- `components` — per-component `styleOverrides`, `defaultProps`, `variants`.
- Optional `cssVariables: true` emits `--mui-palette-*` globals.
- `colorSchemes: { light: true, dark: true }` for built-in dual schemes.

### Developer experience

**Strengths:**

- Mature `createTheme(deepmerge(a, b))` composition.
- `theme.spacing(n)` helper — 8px grid by default, configurable.
- `augmentColor()` generates light/dark/contrastText from a single main color.
- Nested `ThemeProvider` with function themes for extension.
- `useTheme()` hook; TypeScript module augmentation documented.

**Trade-offs:**

- Verbose theme object; easy to fight defaults.
- Component overrides use MUI-specific keys (`MuiButton`), not semantic variant names.

### Token structure

**Palette colors:** 6 defaults — primary, secondary, error, warning, info, success.

- **4 tokens each:** main, light, dark, contrastText (light/dark calculated via `tonalOffset`, default 0.2).
- Full `@mui/material/colors` import provides **10 shades** (50–900 + A100–A700) per Material hue for customization.

**Spacing:** **Continuous** — `theme.spacing(factor)` = `8px × factor` (default). Can be number, function, or array.

**Typography:** Variant-based (h1–h6, body1/2, subtitle1/2, button, caption, overline) — each with fontSize, fontWeight, lineHeight, letterSpacing.

**Shape:** `borderRadius` default 4px; components reference theme.shape.

**Component tokens:** Yes — `theme.components.MuiButton.styleOverrides.root`, etc. `defaultProps` and custom `variants` arrays.

---

## Ant Design 5/6

Docs: [Customize Theme](https://ant.design/docs/react/customize-theme)

### Architecture

**Three-layer Design Token model:**

1. **Seed Token** — origin values (`colorPrimary`, `borderRadius`, `fontSize`, …).
2. **Map Token** — algorithmically derived gradients (`colorPrimaryBg`, `colorPrimaryHover`, …).
3. **Alias Token** — semantic aliases for batch styling (`colorLink`, `colorText`, …).

Plus **Component Token** per component (`Button`, `Input`, …) — isolated from global tokens.

Algorithms: `defaultAlgorithm`, `darkAlgorithm`, `compactAlgorithm` — composable array.

### Developer experience

**Strengths:**

- Change `colorPrimary` → entire palette recalculates.
- Component-level tokens without affecting globals.
- `useToken()` hook; `getDesignToken()` for static/SSR.
- Theme Editor visual tool.
- v6 `zeroRuntime` mode for pre-extracted CSS.

**Trade-offs:**

- Token surface area is enormous — steep learning curve.
- Component tokens don't derive from seed by default (must opt into `algorithm: true` per component since 5.8).

### Token structure

**Seed tokens (~25+):** colorPrimary, colorSuccess, colorWarning, colorError, colorInfo, colorBgBase, colorTextBase, borderRadius (xs/sm/lg), fontSize, fontFamily, lineHeight, controlHeight, motion, wireframe, etc.

**Map/Alias tokens (100+):** Full generated palette per seed color — bg, bgHover, border, borderHover, text, textHover, active states; neutral text/bg/border hierarchy; size tokens (padding, margin, control heights).

**Spacing/sizing:** Discrete tokens — `padding`, `paddingSM`, `paddingLG`, `margin`, `marginSM`, `marginLG`, `paddingContentHorizontal`, `controlPaddingHorizontal`, etc. (~20+). Compact algorithm reduces these.

**Typography:** Base `fontSize` 14px with derived `fontSizeSM` (12), `fontSizeLG` (16), `fontSizeXL` (20), heading 1–5 (38, 30, 24, 20, 16).

**Border radius:** 5 — xs (2), sm (4), default (6), lg (8), outer (4).

**Component tokens:** Yes — extensive per-component overrides in `theme.components`.

---

## Mantine v7

Docs: [Theme object](https://mantine.dev/theming/theme-object/), [Colors](https://mantine.dev/theming/colors/), [CSS variables](https://v7.mantine.dev/styles/css-variables)

### Architecture

Single `theme` object → auto-generated `--mantine-*` CSS variables.

- `theme.colors` — named arrays of shades.
- `theme.primaryColor` + `theme.primaryShade` drive primary CSS vars.
- `theme.spacing`, `theme.radius`, `theme.fontSizes`, `theme.shadows`, etc.
- `virtualColor` — different physical colors per color scheme.
- `cssVariablesResolver` for custom var injection.

### Developer experience

**Strengths:**

- Style props map directly to tokens (`mt="md"`, `color="blue.6"`).
- `generateColors()` utility creates 10 shades from one hex.
- `createTheme()` partial overrides with deep merge.
- Colors support CSS values on `color` prop for escape hatch.

**Trade-offs:**

- 10 shades per color required (TypeScript enforced).
- Component variant colors are computed, not directly authored.

### Token structure

**Colors:** ~15 default hues from open-color (blue, cyan, dark, grape, gray, green, indigo, lime, orange, pink, red, teal, violet, yellow, …).

- **10 shades each** (index 0–9, 0 = lightest).
- Minimum 10 required; can add more (index 10+).

**Spacing:** **5 steps** — xs (10px), sm (12px), md (16px), lg (20px), xl (32px). Compact compared to peers.

**Typography:** fontSizes (xs–xl), headings with per-level sizes, fontFamily, lineHeights.

**Radius:** xs, sm, md, lg, xl defaults.

**Shadows:** xs, sm, md, lg, xl.

**Component tokens:** Implicit — variant color resolver generates `--button-*` vars from theme.colors + colorScheme. `theme.components` for defaultProps/classNames/styles per component.

---

## Radix Themes

Docs: [Color](https://www.radix-ui.com/themes/docs/theme/color), [Spacing](https://www.radix-ui.com/themes/docs/theme/spacing), [Theme component](https://www.radix-ui.com/themes/docs/components/theme)

### Architecture

Opinionated wrapper over **Radix Colors**:

- 12-step accent scales with functional roles (1–2 bg, 3–5 interactive, 6–8 borders, 9–10 solid, 11–12 text).
- `<Theme accentColor="indigo" grayColor="slate" radius="medium" scaling="100%">` props.
- CSS variables: `--accent-1` … `--accent-12`, `--gray-1` … `--gray-12`.

### Developer experience

**Strengths:**

- Extremely predictable 12-step semantics — great for custom components.
- `scaling` prop uniformly adjusts density (90%–110%).
- Nested themes for local overrides.

**Trade-offs:**

- Limited spacing scale (9 steps).
- Component customization mostly via props, not a theme file.

### Token structure

**Accent colors:** **30 hues** (gray, gold, bronze, brown, yellow, amber, orange, tomato, red, ruby, crimson, pink, plum, purple, violet, iris, indigo, blue, cyan, teal, jade, green, grass, lime, mint, sky, …).

- **12 steps each** + functional tokens (surface, indicator, track, contrast).
- **6 gray variants:** gray, mauve, slate, sage, olive, sand.

**Spacing:** **9 steps** — 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px. Scaled by `--scaling`.

**Radius:** 5 presets — none, small, medium, large, full.

**Component tokens:** Minimal — `<Theme>` props + per-component variant props, not a separate token file.

---

## Carbon Design System v11

Docs: [Color overview](https://carbondesignsystem.com/elements/color/overview/), [Spacing](https://carbondesignsystem.com/elements/spacing/overview/)

### Architecture

Enterprise **role-based tokens** with theme packages:

- Token = role (e.g. `$text-primary`, `$layer-01`, `$border-subtle`).
- Theme = value assignment (White, Gray 10, Gray 90, Gray 100).
- **Layering model** — contextual `$layer` vs explicit `$layer-01`, `$layer-02`, `$layer-03`.
- Sass-first (`@use '@carbon/layout'`) with CSS custom properties in components.

### Developer experience

**Strengths:**

- Tokens describe _purpose_, not appearance — excellent for multi-theme IBM products.
- Unified spacing scale (v11 merged layout + spacing).
- Strong documentation on when to use contextual vs explicit layer tokens.

**Trade-offs:**

- Heavy Sass/package import setup.
- Not designed for quick accent-swap theming — themes are pre-built packages.

### Token structure

**Colors:** ~52 universal variables per theme + grouped core tokens (text, background, border, link, support, focus, interactive, layer, field, …). Values map to IBM Design Language palette.

**Spacing:** **13 steps** ($spacing-01–13): 2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 160px. Multiples of 2/4/8.

**Typography:** Productive and expressive type scales (separate token sets).

**Component tokens:** Baked into component source — not a separate override API like MUI. Customization via token overrides in Sass.

---

## Amplify UI

Docs: [Theming overview](https://ui.docs.amplify.aws/react/theming), [Default theme](https://ui.docs.amplify.aws/react/theming/default-theme), [Colors](https://ui.docs.amplify.aws/react/theming/default-theme/colors), [ThemeProvider](https://ui.docs.amplify.aws/react/theming/theme-provider), [CSS variables](https://ui.docs.amplify.aws/react/theming/css-variables)

### Architecture

Three-layer model aligned with the [W3C Design Tokens format](https://design-tokens.github.io/community-group/format/):

1. **Primitive tokens** — hue palettes (`colors.neutral[10]` … `[100]`), `space.*`, `fontSizes.*`, etc. All leaves use `{ value: '…' }` and can **reference** other tokens: `{ value: '{colors.neutral.100.value}' }`.
2. **Semantic tokens** — grouped under `colors.font`, `colors.background`, `colors.border`, `colors.shadow`, `colors.overlay`; most reference primitives.
3. **Component tokens** — `tokens.components.{component}` with nested modifiers, states, and child slots; compiled to `--amplify-components-*` CSS variables via Style Dictionary.

Runtime flow:

```
Theme object → ThemeProvider → injected <style> → --amplify-* CSS variables → components
```

Plain CSS override path: `:root, [data-amplify-theme] { --amplify-colors-font-primary: … }`.

### Developer experience

**Strengths:**

- **Dual theming surfaces** — JS theme object _or_ CSS variables; components are plain CSS (`.amplify-button`) for escape hatches.
- **`createTheme()`** deep-merges with `defaultTheme`; multi-brand via chained extension.
- **`useTheme()`** exposes resolved `tokens` for charts, canvas, and inline styles.
- **Style props** accept token paths directly (`marginBottom="space.small"`, `color="purple.80"`).
- **Token references** make global re-theming cheap — change a few primitives, semantics and components follow.
- **`overrides[]`** — declarative dark mode and breakpoint-specific token swaps without duplicating full themes.
- **Unstyled mode** — skip CSS import for full custom styling.

**Trade-offs:**

- **Runtime `<style>` injection** from `ThemeProvider` (CSP requires `nonce` prop).
- **Breakpoints not CSS-variable-driven** — media queries cannot use token vars; breakpoint overrides are compile-time in the theme object.
- **Massive component token surface** — thousands of `--amplify-components-*` vars; discoverable but verbose.
- **HSL-only palette** — all default colors use `hsl()` notation.

### Token structure

#### Color primitives

**10 hue families**, each with **7 lightness steps** (10, 20, 40, 60, 80, 90, 100): neutral, red, orange, yellow, green, teal, blue, purple, pink — plus `black`, `white`, `transparent`.

**Brand aliases:** `primary[*]` → teal ramp, `secondary[*]` → purple ramp (7 steps each).

Total palette leaves: ~70 hue steps + 14 brand aliases + 3 specials ≈ **87 primitive color tokens**.

#### Semantic colors (~45)

From [Default theme colors](https://ui.docs.amplify.aws/react/theming/default-theme/colors):

| Group          | Count | Examples                                                                                                                                                                                                     |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Font**       | 13    | `font.primary`, `font.secondary`, `font.tertiary`, `font.disabled`, `font.inverse`, `font.interactive`, `font.hover`, `font.focus`, `font.active`, `font.info`, `font.warning`, `font.error`, `font.success` |
| **Background** | 9     | `background.primary` … `quaternary`, `disabled`, `info`, `warning`, `error`, `success`                                                                                                                       |
| **Border**     | 11    | `border.primary` … `tertiary`, `disabled`, `pressed`, `focus`, `error`, `info`, `success`, `warning`                                                                                                         |
| **Shadow**     | 3     | `shadow.primary`, `secondary`, `tertiary`                                                                                                                                                                    |
| **Overlay**    | 9     | `overlay[5]` … `overlay[90]` (alpha steps)                                                                                                                                                                   |

Most semantics reference palette steps (e.g. `font.primary` → `neutral[100]`, `background.secondary` → `neutral[10]`).

#### Spacing

**10 absolute steps** + `zero`: `xxxs` (0.25rem), `xxs`, `xs`, `small` (0.75rem), `medium` (1rem), `large`, `xl`, `xxl`, `xxxl` (4.5rem).

**10 relative steps** (em-based): `relative-xxxs` … `relative-xxxl`, `relative-full`.

#### Typography

- **Font sizes:** 10 — `xxxs` (0.375rem) through `xxxxl` (3rem).
- **Font families:** `fonts.default.variable` / `.static` stacks.
- **Weights, line heights:** separate namespaces in default theme.

#### Radius, shadow, motion

- **Radii:** 7 — `xs` (0.125rem) through `xxxl` (8rem).
- **Shadows, border widths, time/duration, transforms:** separate token namespaces.
- **Breakpoints:** `base` 0, `small` 480, `medium` 768, `large` 992, `xl` 1280, `xxl` 1536 (px).

#### Component tokens

Explicit namespace: `tokens.components.{name}`.

Naming convention documented in [Theming overview](https://ui.docs.amplify.aws/react/theming):

```text
component[modifier][_state][child]
```

Example for Button — default tokens plus `_hover`, `_focus`, `_loading`, `_disabled`, and the same states under `primary`, plus `small` / `large` size modifiers. Compiled to CSS vars like:

```css
--amplify-components-button-primary-hover-background-color: …;
--amplify-components-button-small-font-size: …;
```

The [CSS variables reference](https://ui.docs.amplify.aws/react/theming/css-variables) lists **1000+** `--amplify-components-*` tokens (per-component padding, colors, sizes, etc.).

### Theming API highlights

**Custom theme:**

```javascript
const theme = {
  name: 'my-theme',
  tokens: {
    colors: {
      font: { primary: { value: '#008080' } },
    },
    components: {
      card: {
        padding: { value: '{space.small}' },
        backgroundColor: { value: '{colors.background.secondary}' },
      },
    },
  },
};
```

**Overrides (dark mode + responsive):**

```javascript
overrides: [
  {
    colorMode: 'dark',
    tokens: {
      colors: {
        neutral: {
          10: { value: '{colors.neutral.100.value}' }, // invert ramp
          // …
        },
      },
    },
  },
  {
    breakpoint: 'large',
    tokens: { space: { small: { value: '1rem' } } },
  },
],
```

**Merge themes:** `createTheme(partialTheme, baseTheme)` — second arg defaults to `defaultTheme`.

**Dark mode:** `ThemeProvider colorMode="light" | "dark" | "system"`.

### Comparison to Var UI

| Aspect               | Amplify UI                                      | Var UI                                                                           |
| -------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| Token leaf shape     | `{ value: string }` with `{path.to.token}` refs | Raw strings / `var(--…)` refs                                                    |
| CSS output prefix    | `--amplify-*`                                   | `--var-ui-*` (TypeStyles)                                                        |
| Component tokens     | Large `tokens.components` tree                  | None — recipes read `color.*`                                                    |
| Dark mode            | `overrides[]` + `colorMode`                     | `colorMode` color tree + `data-mode`                                             |
| Breakpoints          | Theme `breakpoints.values` + override entries   | Not tokenized (hardcoded in recipes)                                             |
| Semantic color count | ~45 + massive component layer                   | ~51 semantic leaves                                                              |
| Overrides array      | First-class `overrides[]`                       | Explicitly rejected — use TypeStyles `modes` (`2026-07-21-theming-dx-design.md`) |

Amplify is the closest peer to Var UI’s **typed theme object + CSS variables** story, but with a much heavier component-token layer and the **`overrides[]`** pattern Var UI replaced with TypeStyles mode conditions.

---

## Cross-Cutting Themes

### 1. Primitive → semantic → component

| Approach                            | Examples                                                      |
| ----------------------------------- | ------------------------------------------------------------- |
| **Generated semantic from seed**    | Astryx scale configs, Ant Design algorithms, MUI augmentColor |
| **Hand-authored semantic**          | shadcn, HeroUI, Carbon                                        |
| **Semantic references primitives**  | Chakra semanticTokens → colors.red.500                        |
| **Skip semantics (utilities only)** | Tailwind                                                      |

### 2. Light/dark strategies

| Strategy                                 | Examples                                            |
| ---------------------------------------- | --------------------------------------------------- |
| Tuple values `[light, dark]`             | Astryx                                              |
| Duplicate CSS blocks (`:root` / `.dark`) | shadcn, HeroUI                                      |
| Semantic token conditions                | Chakra `_light` / `_dark`                           |
| Separate algorithms                      | Ant Design `darkAlgorithm`                          |
| Color schemes object                     | MUI `colorSchemes`                                  |
| Theme prop                               | Radix `appearance`, Mantine `colorScheme`           |
| **`overrides[]` array**                  | **Amplify UI** (`colorMode` + `breakpoint` entries) |

### 3. Component customization surfaces

| Surface              | Examples                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Named component maps | Astryx `components.button`, MUI `components.MuiButton`, Ant Design `components.Button`, **Amplify `tokens.components.button`** |
| Recipes / CVA        | Chakra recipes, slotRecipes                                                                                                    |
| CSS/BEM overrides    | HeroUI `.button--primary`                                                                                                      |
| Copy-paste source    | shadcn (edit component file)                                                                                                   |
| Sass token override  | Carbon                                                                                                                         |

### 4. SSR / production theming

| Pattern              | Examples                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| Pre-built CSS + flag | Astryx `__built: true` + `.css`                                                |
| CSS variables only   | shadcn, HeroUI, Radix                                                          |
| Static extraction    | Ant Design `zeroRuntime`, `@ant-design/static-style-extract`                   |
| Runtime injection    | Astryx runtime, Chakra useInsertionEffect, **Amplify ThemeProvider `<style>`** |

### 5. DX friction ranking (subjective)

**Easiest to theme (minimal setup):**

1. shadcn / HeroUI — edit CSS variables
2. Tailwind — edit `@theme`
3. Radix — `<Theme>` props

**Most powerful (structured systems):**

1. Astryx — scale generation + component overrides + build pipeline
2. Ant Design — algorithm + component tokens
3. Chakra — semantic tokens + recipes + typegen
4. Amplify UI — W3C token refs + component token tree + overrides

**Most enterprise-rigid:**

1. Carbon — role tokens, theme packages
2. MUI — mature but verbose component override API

---

## Var UI token gap analysis

Comparison of Var UI’s current token tree (`packages/core/src/tokens/types.ts`) against the landscape above and Astryx’s ~150-token color surface. Related: `2026-07-21-theming-dx-design.md`.

**Implementation plan (no component tokens):** `docs/superpowers/plans/2026-07-23-token-tree-expansion.md`

### What Var UI already covers well

Var UI’s canonical `DesignTokens` type is **lean but coherent** — strong on primitives and core semantics, thinner on layout/density scales and some surface-specific color roles.

| Area                    | Var UI today                                                                  | vs peers                                                       |
| ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Primitive palette**   | 39 families × 10 steps (`palette.ts`)                                         | More raw color than Chakra (11×11) or Tailwind semantic layers |
| **Semantic color core** | `background`, `text`, `accent`, `border`, status, `overlay`, `syntax`         | ~45 authored + derived leaves vs Astryx’s 104 UI semantics     |
| **Derived semantics**   | `tokens.declare('color')` + complete default registration with `color.*` refs | Similar to HeroUI `color-mix()` calculated colors              |
| **Syntax**              | 16 tokens under `color.syntax`                                                | Richer token count than Astryx (14)                            |
| **Motion**              | fast/medium/slow + min/max bands                                              | Comparable to Astryx duration bands                            |
| **Component tokens**    | Removed — recipes compose `color.*`                                           | Opposite of Astryx/MUI/Ant Design; intentional per DX spec     |

### Var UI semantic color inventory (for comparison)

Authored in theme pack faces; derived leaves in the complete default color registration via `tokens.declare('color')` refs:

| Namespace                 | Leaves  | Notes                                                                       |
| ------------------------- | ------- | --------------------------------------------------------------------------- |
| `color.background`        | 4       | `app`, `surface`, `subtle`, `elevated`                                      |
| `color.text`              | 6       | `primary`, `secondary`, `onAccent`, `onDanger`, `disabled`†, `placeholder`† |
| `color.accent`            | 3       | `default`, `hover`, `subtle`†                                               |
| `color.border`            | 3       | `default`, `strong`, `focus`                                                |
| `color.shadow`            | 1       | `offset` (neo-brutalist; not a shadow color)                                |
| `color.danger`            | 4       | `default`, `solid`, `subtle`†, `border`†                                    |
| `color.success`           | 4       | same shape                                                                  |
| `color.warning`           | 4       | includes `onSolid`                                                          |
| `color.info`              | 4       | includes `onSolid`                                                          |
| `color.overlay`           | 2       | `default`, `backdrop`†                                                      |
| `color.syntax`            | 16      | full highlight.js-style set                                                 |
| **Total semantic leaves** | **~51** | † = derived, not in pack source                                             |

Astryx exposes **~3×** as many UI-facing color variables before chart ramps; Var UI compensates with a large `palette` for escape hatches.

### Gaps worth considering

#### 1. Layout and stacking tokens (high impact — currently ad hoc)

Peers expose these as first-class tokens; Var UI hardcodes them in recipes:

| Missing                   | Where peers have it           | Var UI today                                                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| **Breakpoints**           | Tailwind, Chakra, MUI, Carbon | `@media (max-width: 768px)` in prose, `640px` in card, mobile logic in appShell |
| **z-index scale**         | Chakra, MUI, Ant Design       | Scattered: `450`, `500`, `9999` in commandPalette, toast, appShell              |
| **Container / max-width** | Tailwind, Carbon              | Hardcoded (`640px`, `72vh`)                                                     |

#### 2. Spacing scale (medium impact — undersized)

Var UI: **8 steps** (`1`–`6`, `8`, `12` → 4px–64px) in `primitive.ts`.

Peers: Chakra/Tailwind **35**, Astryx **13**, Radix **9**, Carbon **13**.

Missing in practice: `0`, mid-range (`7`, `9`–`11`, `10`), large layout (`16`, `20`, `24`), semantic aliases (`gutter`, `section`).

#### 3. Size / control-height tokens (medium impact)

Astryx: `--size-element-sm/md/lg` (28/32/36px). Mantine/Ant Design: control heights.

Var UI hardcodes per recipe (icon `14/16/20px`, spinner/thumbnail/avatar similar). No `size` or `control` namespace in `DesignTokens`.

#### 4. Color semantics — surface layering (medium impact)

| Peer token                        | Var UI equivalent                 | Gap                                                                      |
| --------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| shadcn `card` / `popover`         | `background.surface` / `elevated` | No dedicated **popover/overlay panel** fill                              |
| shadcn `muted` / HeroUI `default` | `background.subtle`               | No **muted fill** token for secondary surfaces (recipes use `color-mix`) |
| HeroUI `overlay` vs `surface`     | `overlay.backdrop` only           | No overlay **panel** surface color                                       |
| Astryx `background-inverted`      | —                                 | No inverted/high-contrast surface                                        |
| shadcn `ring`                     | `border.focus`                    | No semi-transparent **focus ring** separate from border                  |

`background` has four slots — sufficient for brutalist defaults, tight for dialog vs card vs popover theming.

#### 5. Color semantics — text and interactive (low–medium)

| Missing                                       | Notes                                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **`color.link`**                              | Links use `accent.default`; no visited/hover/muted link tokens                                      |
| **`text.onSuccess` / `onWarning` / `onInfo`** | Only `onAccent` / `onDanger` typed; `semanticTone.ts` hardcodes `#ffffff` for success/danger solids |
| **`color.icon.*`**                            | Icons use `currentColor` / text; Astryx has icon-primary/secondary/disabled                         |
| **Hover/pressed overlay tints**               | Astryx `overlay-hover/pressed`; Var UI uses recipe-level `background.subtle` or `color-mix`         |
| **`color.skeleton` / `color.track`**          | Skeleton/spinner/progress reuse `background.subtle` or inline mixes                                 |

#### 6. Data visualization and communication hues (low unless shipping charts)

Absent vs Astryx:

- Chart palette (`chart-1` … or categorical series colors)
- Per-hue communication sets (Astryx’s blue/green tag background + border + icon + text × 10 hues)

Badges/alerts work via `semanticTone` + `color-mix` today; theme authors cannot recolor “info badge blue” independently of `color.info`.

#### 7. Typography tokens (low–medium)

| Missing                     | Peers                          | Var UI                                       |
| --------------------------- | ------------------------------ | -------------------------------------------- |
| **Letter spacing scale**    | Chakra (5), Tailwind           | Hardcoded in typography, sideNav, prose      |
| **Semantic type scale**     | Astryx H1–H6 + body/label/code | `fontSize.*` only; heading styles in recipes |
| **Text style compositions** | Chakra `textStyles`            | No composed heading/body bundles             |
| **Extended font sizes**     | Tailwind/Chakra 2xs–9xl        | 7 sizes (xs–3xl)                             |

#### 8. Shadow and elevation (theme-dependent)

- Primitive `shadow.xs`–`xl` exist; default theme is neo-brutalist offset
- `color.shadow.offset` is brutalist-specific, not a general elevation model
- Missing vs Astryx: **low/med/high elevation**, **inset** shadows for input states

#### 9. Minor primitive gaps

| Token                   | Status                                     |
| ----------------------- | ------------------------------------------ |
| **Opacity scale**       | Hardcoded `0.5`, `0.6` in disabled states  |
| **Border width scale**  | `thin` / `default` / `thick` all `1px`     |
| **Aspect ratio tokens** | `aspectRatio` recipe exists; no token      |
| **Animation keyframes** | Transitions only; no named keyframe tokens |

#### 10. Form-field semantic namespace (optional)

HeroUI isolates `--field-*`. Var UI fields reuse global semantics (`background.surface`, `border.default`, derived `placeholder`) — works, but theming **all inputs** without affecting cards/buttons requires touching multiple recipes.

### Not missing (by design)

| Landscape pattern                  | Var UI choice                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| Component token namespaces         | Removed; recipes + `color.*` (`2026-07-21-theming-dx-design.md`)                              |
| Seed → map → alias layers          | `createColorTheme` + palette ramps instead                                                    |
| ~100+ flat semantic color vars     | Small semantic core + large `palette`                                                         |
| Amplify-style component token tree | Recipes + `color.*`; no `tokens.components`                                                   |
| `overrides[]` array                | Amplify `overrides[]` with `colorMode` / `breakpoint`; Var UI uses TypeStyles `modes` instead |
| Astryx communication hue table     | `semanticTone` + `color-mix` at recipe level                                                  |

### Recommended priority (if extending the token tree)

**Tier 1 — highest leverage**

1. Breakpoint + z-index tokens
2. Expand `space` (`0`, `7`, `9`, `10`, `16`, `20`, …)
3. `size` namespace (control heights + icon sizes)

**Tier 2 — semantic color completeness**

4. `background.popover` (or `overlay.surface`)
5. `color.link`
6. `text.onSuccess` / `onWarning` / `onInfo`

**Tier 3 — product-dependent**

7. Chart/data tokens
8. Semantic text styles
9. Dedicated `field` color group
10. Elevation shadow ladder (non-brutalist themes)

### Alignment with landscape patterns

| Pattern                                   | Var UI alignment                                             |
| ----------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Semantic CSS vars as contract             | ✅ TypeStyles + design token packs                           |
| `{ light, dark }` color trees only        | Similar to Astryx tuples / Chakra semantic approach          |
| `createColorTheme({ accent })` generation | Matches Astryx/Mantine/Ant Design seed→palette               |
| Remove component token namespaces         | Opposite of Astryx/MUI — recipes read semantic `color.*`     |
| `overrides[]` for dark/breakpoints        | Amplify `overrides[]`                                        | Var UI uses TypeStyles `modes` instead (explicit non-goal) |
| `from: forestTokens` packs                | Similar to Astryx `extends` / Amplify `createTheme(…, base)` |
| Raw `modes` for surfaces                  | Similar to HeroUI `data-surface` / Chakra conditions         |

**Differentiation opportunities:**

- Simpler component story than Astryx while keeping color generation
- Better typed token refs than CSS-only systems (shadcn/HeroUI)
- Lighter ceremony than Chakra/Ant Design (no CLI typegen, ~51 vs ~150 color leaves)

---

## Appendix: Astryx semantic color tokens

Complete reference from [Astryx All Tokens](https://astryx.atmeta.com/docs/tokens) (neutral default theme). Values use `light / dark` where modes differ; single values are mode-agnostic or use `light-dark()` internally.

**Summary:** 39 core + 40 communication + 14 syntax + 56 data = **149 tokens**.

### Core UI semantic (39)

#### Accent and brand chrome

| Token                  | Light / Dark                               |
| ---------------------- | ------------------------------------------ |
| `--color-accent`       | `#262626` / `#ebebeb`                      |
| `--color-accent-muted` | `#f1f1f1` / `#262626`                      |
| `--color-on-accent`    | `#ffffff` / `#171717`                      |
| `--color-neutral`      | `#0000000F` / `#FFFFFF1A`                  |
| `--color-brand`        | _(theme-specific; empty in default table)_ |

#### Backgrounds and surfaces

| Token                               | Light / Dark          |
| ----------------------------------- | --------------------- |
| `--color-background-body`           | `#f1f1f1` / `#1b1b1b` |
| `--color-background-surface`        | `#ffffff` / `#262626` |
| `--color-background-muted`          | `#f1f1f1` / `#1b1b1b` |
| `--color-background-card`           | `#ffffff` / `#1b1b1b` |
| `--color-background-popover`        | `#ffffff` / `#1b1b1b` |
| `--color-background-inverted`       | `#0A1317` / `#FFFFFF` |
| `--color-background-error-inverted` | `#AA071E` / `#E3193B` |

#### Overlay and interaction tints

| Token                     | Light / Dark              |
| ------------------------- | ------------------------- |
| `--color-overlay`         | `#00000080` / `#000000CC` |
| `--color-overlay-hover`   | `#0000000D` / `#FFFFFF0D` |
| `--color-overlay-pressed` | `#0000001A` / `#FFFFFF1A` |
| `--color-tint-hover`      | `black` / `white`         |

#### Text

| Token                    | Light / Dark          |
| ------------------------ | --------------------- |
| `--color-text-primary`   | `#171717` / `#fafafa` |
| `--color-text-secondary` | `#737373` / `#a3a3a3` |
| `--color-text-disabled`  | `#a3a3a3` / `#525252` |
| `--color-text-accent`    | `#262626` / `#ebebeb` |
| `--color-on-dark`        | `#ffffff`             |
| `--color-on-light`       | `#171717`             |

#### Icons

| Token                    | Light / Dark          |
| ------------------------ | --------------------- |
| `--color-icon-accent`    | `#262626` / `#ebebeb` |
| `--color-icon-primary`   | `#171717` / `#fafafa` |
| `--color-icon-secondary` | `#737373` / `#a3a3a3` |
| `--color-icon-disabled`  | `#a3a3a3` / `#525252` |

#### Status (success, error, warning)

| Token                   | Light / Dark            |
| ----------------------- | ----------------------- |
| `--color-success`       | `#007004` / `#9fe59b`   |
| `--color-success-muted` | `#c5e5c0` / `#84c9803D` |
| `--color-on-success`    | `#ffffff` / `#171717`   |
| `--color-error`         | `#a50c25` / `#ffc6c1`   |
| `--color-error-muted`   | `#facecb` / `#ff9e973D` |
| `--color-on-error`      | `#ffffff` / `#171717`   |
| `--color-warning`       | `#745b00` / `#fdcf4f`   |
| `--color-warning-muted` | `#f8da9d` / `#deb4333D` |
| `--color-on-warning`    | `#171717`               |

#### Borders and chrome

| Token                       | Light / Dark              |
| --------------------------- | ------------------------- |
| `--color-border`            | `#ebebeb` / `#FFFFFF1A`   |
| `--color-border-emphasized` | `#d4d4d4` / `#525252`     |
| `--color-skeleton`          | `#ebebeb` / `#525252`     |
| `--color-track`             | `#CCD3DB` / `#5A5E66`     |
| `--color-shadow`            | `#0000001A` / `#0000004D` |

### Communication hues (40)

Ten hues × four roles (`background`, `border`, `icon`, `text`) for tags, badges, and status chips.

#### Blue

| Token                     | Light / Dark            |
| ------------------------- | ----------------------- |
| `--color-background-blue` | `#c4ddfb` / `#9eb7ff3D` |
| `--color-border-blue`     | `#b1c9e7` / `#6d9cfe`   |
| `--color-icon-blue`       | `#00458c` / `#9eb7ff`   |
| `--color-text-blue`       | `#00458c` / `#c7d3ff`   |

#### Cyan

| Token                     | Light / Dark            |
| ------------------------- | ----------------------- |
| `--color-background-cyan` | `#a3e0ef` / `#83c2d43D` |
| `--color-border-cyan`     | `#91d3e3` / `#67a7b8`   |
| `--color-icon-cyan`       | `#00505f` / `#83c2d4`   |
| `--color-text-cyan`       | `#00505f` / `#9edef0`   |

#### Gray

| Token                     | Light / Dark                       |
| ------------------------- | ---------------------------------- |
| `--color-background-gray` | `#e5e5e5` / `var(--color-neutral)` |
| `--color-border-gray`     | `#d4d4d4` / `#262626`              |
| `--color-icon-gray`       | `#525252` / `#a3a3a3`              |
| `--color-text-gray`       | `#262626` / `#e5e5e5`              |

#### Green

| Token                      | Light / Dark            |
| -------------------------- | ----------------------- |
| `--color-background-green` | `#c5e5c0` / `#84c9803D` |
| `--color-border-green`     | `#b2d1ac` / `#69ad67`   |
| `--color-icon-green`       | `#0c5700` / `#84c980`   |
| `--color-text-green`       | `#0c5700` / `#9fe59b`   |

#### Orange

| Token                       | Light / Dark            |
| --------------------------- | ----------------------- |
| `--color-background-orange` | `#fad0b5` / `#ffa2583D` |
| `--color-border-orange`     | `#e6bda2` / `#e2883e`   |
| `--color-icon-orange`       | `#6e3500` / `#ffa258`   |
| `--color-text-orange`       | `#6e3500` / `#ffc9a2`   |

#### Pink

| Token                     | Light / Dark            |
| ------------------------- | ----------------------- |
| `--color-background-pink` | `#fccadc` / `#ff99c33D` |
| `--color-border-pink`     | `#e7b7c8` / `#f273aa`   |
| `--color-icon-pink`       | `#83004b` / `#ff99c3`   |
| `--color-text-pink`       | `#83004b` / `#ffc3da`   |

#### Purple

| Token                       | Light / Dark            |
| --------------------------- | ----------------------- |
| `--color-background-purple` | `#eccef3` / `#f297ff3D` |
| `--color-border-purple`     | `#d8bbdf` / `#dd74f0`   |
| `--color-icon-purple`       | `#700084` / `#f297ff`   |
| `--color-text-purple`       | `#700084` / `#fac1ff`   |

#### Red

| Token                    | Light / Dark            |
| ------------------------ | ----------------------- |
| `--color-background-red` | `#facecb` / `#ff9e973D` |
| `--color-border-red`     | `#e6bab8` / `#ff6f6c`   |
| `--color-icon-red`       | `#89001a` / `#ff9e97`   |
| `--color-text-red`       | `#89001a` / `#ffc6c1`   |

#### Teal

| Token                     | Light / Dark            |
| ------------------------- | ----------------------- |
| `--color-background-teal` | `#a5e3d6` / `#7ec6b83D` |
| `--color-border-teal`     | `#94d6c8` / `#63ab9d`   |
| `--color-icon-teal`       | `#005348` / `#7ec6b8`   |
| `--color-text-teal`       | `#005348` / `#99e2d3`   |

#### Yellow

| Token                       | Light / Dark            |
| --------------------------- | ----------------------- |
| `--color-background-yellow` | `#f8da9d` / `#deb4333D` |
| `--color-border-yellow`     | `#e4c279` / `#c0990e`   |
| `--color-icon-yellow`       | `#584400` / `#deb433`   |
| `--color-text-yellow`       | `#584400` / `#fdcf4f`   |

### Syntax highlighting (14)

| Token                        | Light / Dark          |
| ---------------------------- | --------------------- |
| `--color-syntax-background`  | `#fafafa` / `#0a0a0a` |
| `--color-syntax-keyword`     | `#700084` / `#efa8ff` |
| `--color-syntax-string`      | `#005600` / `#a6d2a2` |
| `--color-syntax-comment`     | `#737373` / `#a3a3a3` |
| `--color-syntax-number`      | `#6e3500` / `#ffb37f` |
| `--color-syntax-function`    | `#00458c` / `#a0caff` |
| `--color-syntax-type`        | `#700084` / `#efa8ff` |
| `--color-syntax-variable`    | `#171717` / `#e5e5e5` |
| `--color-syntax-operator`    | `#737373` / `#a3a3a3` |
| `--color-syntax-constant`    | `#6e3500` / `#ffb37f` |
| `--color-syntax-tag`         | `#89001a` / `#ffaeaa` |
| `--color-syntax-attribute`   | `#584400` / `#eec12f` |
| `--color-syntax-property`    | `#005348` / `#83dac9` |
| `--color-syntax-punctuation` | `#a3a3a3` / `#525252` |

### Data visualization (56)

#### Categorical series (mode-agnostic)

| Token                             | Value     |
| --------------------------------- | --------- |
| `--color-data-categorical-blue`   | `#0171E3` |
| `--color-data-categorical-orange` | `#EB6E00` |
| `--color-data-categorical-purple` | `#6B1EFD` |
| `--color-data-categorical-green`  | `#0B991F` |
| `--color-data-categorical-pink`   | `#F351C0` |
| `--color-data-categorical-cyan`   | `#0171A4` |
| `--color-data-categorical-red`    | `#F5394F` |
| `--color-data-categorical-teal`   | `#08A3A3` |
| `--color-data-categorical-brown`  | `#965E03` |
| `--color-data-categorical-indigo` | `#6F8AFF` |

#### Data neutral

| Token                  | Light / Dark          |
| ---------------------- | --------------------- |
| `--color-data-neutral` | `#8494A3` / `#8C939B` |

#### Stepped ramps (5 steps each; 1 = lightest tint, 5 = darkest)

| Hue          | Tokens                                                                   |
| ------------ | ------------------------------------------------------------------------ |
| **Blue**     | `--color-data-blue-1` `#DBECFF` … `-5` `#02165E`                         |
| **Shamrock** | `--color-data-shamrock-1` `#D6FEE4` … `-5` `#0B603D`                     |
| **Orange**   | `--color-data-orange-1` `#FFE6CF` … `-5` `#A13F04`                       |
| **Pink**     | `--color-data-pink-1` `#FCE3F4` … `-5` `#8E1073`                         |
| **Purple**   | `--color-data-purple-1` `#E8E8FB` … `-5` `#3E0697`                       |
| **Red**      | `--color-data-red-1` `#FEE4E6` … `-5` `#9D0519`                          |
| **Teal**     | `--color-data-teal-1` `#D7FCF8` … `-5` `#08767D`                         |
| **Yellow**   | `--color-data-yellow-1` `#FDF6BA` … `-5` `#8A5001`                       |
| **Gray**     | `--color-data-gray-1` `#F1F4F7` / `#F2F4F6` … `-5` `#25363F` / `#333338` |

Full stepped values (from docs):

| Token                     | Value                 |
| ------------------------- | --------------------- |
| `--color-data-blue-1`     | `#DBECFF`             |
| `--color-data-blue-2`     | `#78BEFF`             |
| `--color-data-blue-3`     | `#2694FE`             |
| `--color-data-blue-4`     | `#004CBC`             |
| `--color-data-blue-5`     | `#02165E`             |
| `--color-data-shamrock-1` | `#D6FEE4`             |
| `--color-data-shamrock-2` | `#8EF7AA`             |
| `--color-data-shamrock-3` | `#24BB5E`             |
| `--color-data-shamrock-4` | `#138546`             |
| `--color-data-shamrock-5` | `#0B603D`             |
| `--color-data-orange-1`   | `#FFE6CF`             |
| `--color-data-orange-2`   | `#FDB876`             |
| `--color-data-orange-3`   | `#FD9537`             |
| `--color-data-orange-4`   | `#D66100`             |
| `--color-data-orange-5`   | `#A13F04`             |
| `--color-data-pink-1`     | `#FCE3F4`             |
| `--color-data-pink-2`     | `#FEADE3`             |
| `--color-data-pink-3`     | `#F989D3`             |
| `--color-data-pink-4`     | `#D123A1`             |
| `--color-data-pink-5`     | `#8E1073`             |
| `--color-data-purple-1`   | `#E8E8FB`             |
| `--color-data-purple-2`   | `#B3B0FE`             |
| `--color-data-purple-3`   | `#9081FF`             |
| `--color-data-purple-4`   | `#6B1EFD`             |
| `--color-data-purple-5`   | `#3E0697`             |
| `--color-data-red-1`      | `#FEE4E6`             |
| `--color-data-red-2`      | `#FFB2B8`             |
| `--color-data-red-3`      | `#FB7D87`             |
| `--color-data-red-4`      | `#D31130`             |
| `--color-data-red-5`      | `#9D0519`             |
| `--color-data-teal-1`     | `#D7FCF8`             |
| `--color-data-teal-2`     | `#6CE6D8`             |
| `--color-data-teal-3`     | `#0DB7AF`             |
| `--color-data-teal-4`     | `#0C9293`             |
| `--color-data-teal-5`     | `#08767D`             |
| `--color-data-yellow-1`   | `#FDF6BA`             |
| `--color-data-yellow-2`   | `#FCEC85`             |
| `--color-data-yellow-3`   | `#FBCE03`             |
| `--color-data-yellow-4`   | `#D69804`             |
| `--color-data-yellow-5`   | `#8A5001`             |
| `--color-data-gray-1`     | `#F1F4F7` / `#F2F4F6` |
| `--color-data-gray-2`     | `#CCD3DB` / `#D0D3D6` |
| `--color-data-gray-3`     | `#AFB9C4` / `#B2B8BE` |
| `--color-data-gray-4`     | `#5D6C7B` / `#666A72` |
| `--color-data-gray-5`     | `#25363F` / `#333338` |

### Var UI ↔ Astryx semantic mapping (selected)

| Astryx                       | Var UI                                  | Match?                   |
| ---------------------------- | --------------------------------------- | ------------------------ |
| `--color-background-body`    | `color.background.app`                  | ≈                        |
| `--color-background-surface` | `color.background.surface`              | ✅                       |
| `--color-background-muted`   | `color.background.subtle`               | ≈                        |
| `--color-background-card`    | `color.background.elevated`             | ≈                        |
| `--color-background-popover` | —                                       | ❌                       |
| `--color-text-primary`       | `color.text.primary`                    | ✅                       |
| `--color-text-secondary`     | `color.text.secondary`                  | ✅                       |
| `--color-text-disabled`      | `color.text.disabled`                   | ✅ (derived)             |
| `--color-accent`             | `color.accent.default`                  | ✅                       |
| `--color-on-accent`          | `color.text.onAccent`                   | ✅                       |
| `--color-accent-muted`       | `color.accent.subtle`                   | ≈                        |
| `--color-border`             | `color.border.default`                  | ✅                       |
| `--color-border-emphasized`  | `color.border.strong`                   | ✅                       |
| `--color-error`              | `color.danger.default`                  | ✅                       |
| `--color-success`            | `color.success.default`                 | ✅                       |
| `--color-warning`            | `color.warning.default`                 | ✅                       |
| `--color-overlay`            | `color.overlay.default`                 | ✅                       |
| `--color-icon-primary`       | `color.text.primary` (via currentColor) | ≈                        |
| `--color-background-{hue}`   | — (uses `semanticTone` + mix)           | ❌                       |
| `--color-data-*`             | —                                       | ❌                       |
| `--color-syntax-*`           | `color.syntax.*`                        | ✅ (Var UI has 16 vs 14) |

---

## Sources

- [Astryx Theme System](https://astryx.atmeta.com/docs/theme)
- [Astryx All Tokens](https://astryx.atmeta.com/docs/tokens)
- [Chakra UI Theming Overview](https://chakra-ui.com/docs/theming/overview)
- [Chakra UI Tokens](https://chakra-ui.com/docs/theming/tokens)
- [Chakra UI Colors](https://chakra-ui.com/docs/theming/colors)
- [Chakra UI Spacing](https://chakra-ui.com/docs/theming/spacing)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [HeroUI Theming](https://heroui.com/en/docs/react/getting-started/theming)
- [HeroUI Colors](https://heroui.com/docs/react/getting-started/colors)
- [Tailwind CSS v4 Theme](https://tailwindcss.com/docs/theme)
- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [MUI Palette](https://mui.com/material-ui/customization/palette/)
- [MUI Spacing](https://mui.com/material-ui/customization/spacing/)
- [Ant Design Customize Theme](https://ant.design/docs/react/customize-theme)
- [Mantine Theme Object](https://mantine.dev/theming/theme-object/)
- [Mantine Colors](https://mantine.dev/theming/colors/)
- [Radix Themes Color](https://www.radix-ui.com/themes/docs/theme/color)
- [Radix Themes Spacing](https://www.radix-ui.com/themes/docs/theme/spacing)
- [Radix Colors Scales](https://www.radix-ui.com/colors/docs/palette-composition/scales)
- [Carbon Color Overview](https://carbondesignsystem.com/elements/color/overview/)
- [Carbon Spacing Overview](https://carbondesignsystem.com/elements/spacing/overview/)
- [Amplify UI Theming](https://ui.docs.amplify.aws/react/theming)
- [Amplify UI Default Theme](https://ui.docs.amplify.aws/react/theming/default-theme)
- [Amplify UI Colors](https://ui.docs.amplify.aws/react/theming/default-theme/colors)
- [Amplify UI ThemeProvider](https://ui.docs.amplify.aws/react/theming/theme-provider)
- [Amplify UI CSS Variables](https://ui.docs.amplify.aws/react/theming/css-variables)
