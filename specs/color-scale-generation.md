# `createColorTheme` — Design-System Layer Spec (V1)

Implements `ROADMAP.md` V1. This covers the design-system-layer half only —
the generic color math (`parseColor`, `generateRamp`, `contrastRatio`) lives
in TypeStyles core as the `typestyles/color-scale` subpath; see that
project's `specs/color-scale-generation.md` for the engine-side design. This
document is the opinionated layer on top: which ramp step means which
`DesignColorValues` slot, which hue means "danger," and so on.

**Status: shipped.** This is a historical record of the design as
implemented (`packages/core/src/tokens/create-color-theme.ts`), not an open
task.

---

## Why this lives here, not in TypeStyles

Core (`typestyles/color-scale`) never sees the concept of "background.app" or
"danger" — it only does color math: parse a color, build a ramp, measure
contrast. The step→slot mapping (which ramp step is `background.app`, which
hue means "danger") is a design-system's own vocabulary, and var-ui is the
design system now. This is the intentional split established while this was
still part of TypeStyles' own `examples/design-system`: reuse the generic
primitive, own the opinion.

---

## `packages/core/src/tokens/create-color-theme.ts`

```ts
export type NeutralStyle = 'neutral' | 'cool' | 'warm';
export type ColorContrast = 'standard' | 'high';

export type CreateColorThemeInput = {
  accent: string; // hex
  neutralStyle?: NeutralStyle; // default 'neutral'
  contrast?: ColorContrast; // default 'standard'
};

export type CreateColorThemeResult = {
  light: DesignColorValues;
  dark: DesignColorValues;
};

export function createColorTheme(input: CreateColorThemeInput): CreateColorThemeResult;
```

Each `light` / `dark` map includes **`syntax`** (`defaultLightSyntaxValues` /
`defaultDarkSyntaxValues` for this pass — no accent-tinted syntax generation yet).

### Consumption via `createDesignTheme`

Primary path — pass the result straight into `colorMode` (same `{ light, dark }`
shape as `DesignThemeConfig.colorMode`):

```ts
import { createColorTheme, createDesignTheme } from '@var-ui/core';

export const acme = createDesignTheme({
  name: 'acme',
  colorMode: createColorTheme({ accent: '#7c3aed' }),
});
```

Optional: start from a pack (`from: forestTokens`) and/or append fixed-tone
`modes` with `SURFACE_ATTRIBUTE`. See `packages/core/README.md` and
`docs/superpowers/specs/2026-07-21-theming-dx-design.md`.

### Algorithm

1. `accentOklch = parseColor(input.accent)` (from `typestyles/color-scale`).
2. Resolve `neutralHue`: `neutral` → `accentOklch.h`; `cool` → fixed `250`;
   `warm` → fixed `70`.
3. Resolve `lightnessRange`: `standard` → `[22, 97]`; `high` → `[12, 99]`.
4. `neutralRamp = generateRamp({ hue: neutralHue, chroma: 0.015, lightnessRange })`.
5. `accentRamp = generateRamp({ hue: accentOklch.h, chroma: max(accentOklch.c,
0.08), lightnessRange })` — chroma clamped to a visible minimum so a
   near-gray input accent doesn't produce a washed-out ramp.
6. Status ramps import hue/chroma directly from `palette.ts`'s `FAMILY_SPECS`
   (not re-hardcoded), so they stay in sync if those tuned values ever
   change: `danger` ← `FAMILY_SPECS.red`, `success` ← `FAMILY_SPECS.green`,
   `warning` ← `FAMILY_SPECS.amber`, `info` ← `FAMILY_SPECS.violet`.
7. Ramps map to `DesignColorValues` slots (see
   `create-color-theme.ts`/`create-color-theme.test.ts` for the exact,
   calibrated step indices — tuned against the original `default.ts` values
   for visual continuity when this was first built).
8. Dark mode reads the same four ramps in the mirrored direction.
9. Dev-mode-only contrast validation (`console.warn`, never throws) on the
   load-bearing pairs: `text.primary`/`background.app`,
   `text.secondary`/`background.app`, `text.onAccent`/`accent.default`,
   `text.onDanger`/`danger.solid`.

---

## Testing

`create-color-theme.test.ts` (with a committed snapshot in `__snapshots__/`)
covers: full `light`/`dark` output for representative accents (the current
default theme's accent, a highly saturated pink, a near-gray custom accent
exercising the chroma clamp); `DesignColorValues` shape assertions; contrast
warnings firing/staying silent per case.

---

## Explicitly out of scope

- Non-hex accent input.
- Migrating any _other_ built-in theme (`forest`, `rose`, `amber`, …) to
  `createColorTheme` wholesale — each theme's hand-authored values stay
  unless there's a specific reason to regenerate them.
- Any change to the underlying `typestyles/color-scale` math — that's
  TypeStyles' own repo.
