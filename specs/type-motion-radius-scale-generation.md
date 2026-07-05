# Generative Primitive Scales — Design-System Layer Spec (V2)

Implements `ROADMAP.md` V2. The generic numeric generators live in TypeStyles
core as the `typestyles/token-scale` subpath (`generateGeometricScale`,
`generateLinearScale`, `expandDurationBand` — shipped in **typestyles 0.8.0**,
TypeStyles P5.2); see that project's
`specs/type-motion-radius-scale-generation.md` for the engine-side design. This
document is the consumer-side wiring: which named steps map to which generated
numbers, calibrating the generated ladder against `packages/core`'s existing
hand-picked values, and the tests that lock the result.

**Status: ready to implement** — dependency unblocked. Bump the workspace
`typestyles` catalog entry to `^0.8.0` before starting.

---

## Prerequisite

```yaml
# pnpm-workspace.yaml catalog
typestyles: ^0.8.0
```

Run `vp install` after the bump. Confirm the subpath resolves:

```ts
import {
  generateGeometricScale,
  generateLinearScale,
  expandDurationBand,
} from 'typestyles/token-scale';
```

---

## Why this lives here, not in TypeStyles

Core returns unitless number arrays with zero naming opinions — same split as
P5.1 (`typestyles/color-scale` vs var-ui's `createColorTheme`). Which offset
means `fontSize.md`, which anchor is `duration.fast`, and how closely the new
ladder must match today's hand-picked brutalist defaults are var-ui decisions.

---

## `packages/core/src/tokens/primitive.ts`

The exported shapes (`fontSizeValues`, `radiusValues`, `durationValues` plus
new min/max keys) stay unchanged in _type_ at the call-site level — same keys,
same consumers, same `tokens.create()` registrations in this package. Only how
the literals are produced changes.

### Step → name mapping

| Generator                | `steps` input                             | Named keys (in order)                                       |
| ------------------------ | ----------------------------------------- | ----------------------------------------------------------- |
| `generateGeometricScale` | `[-2, -1, 0, 1, 2, 3, 4]`                 | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`                  |
| `generateLinearScale`    | `[1, 2, 3, 4]`                            | `sm`, `md`, `lg`, `xl`                                      |
| _(hardcoded)_            | —                                         | `none`, `full` on `radiusValues`                            |
| `expandDurationBand` ×3  | `{ base: 80 \| 140 \| 220, ratio: 0.75 }` | `fast`, `medium`, `slow` anchors + six `*-min`/`*-max` keys |

Zip arrays onto names with a small local helper (keep it in `primitive.ts`,
don't export it):

```ts
function zipPx<T extends string>(names: readonly T[], values: number[]): Record<T, `${number}px`> {
  return Object.fromEntries(names.map((name, index) => [name, `${values[index]}px`])) as Record<
    T,
    `${number}px`
  >;
}
```

### `fontSizeValues`

```ts
const FONT_SIZE_STEPS = [-2, -1, 0, 1, 2, 3, 4] as const;
const FONT_SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

const fontSizeScale = generateGeometricScale({
  base: 14, // 'md' anchor — matches today's value exactly
  ratio: 1.2, // starting guess, tune during calibration
  steps: [...FONT_SIZE_STEPS],
});

export const fontSizeValues = zipPx(FONT_SIZE_NAMES, fontSizeScale);
```

Today's hand-picked ladder (`11/13/14/16/20/24/30`) isn't a clean single
ratio, so the generated ladder won't reproduce it exactly — that's expected;
it's a replacement, not a lossless re-encoding. Calibration (below) picks the
final `base`/`ratio` pair by eye.

### `radiusValues`

```ts
const RADIUS_STEPS = [1, 2, 3, 4] as const;
const RADIUS_NAMES = ['sm', 'md', 'lg', 'xl'] as const;

const radiusScale = generateLinearScale({
  base: 4,
  multiplier: 0, // brutalist default — sharp corners everywhere
  steps: [...RADIUS_STEPS],
});

export const radiusValues = {
  none: '0',
  ...zipPx(RADIUS_NAMES, radiusScale),
  full: '0',
} as const;
```

`multiplier: 0` should reproduce today's all-zero values exactly — a good
sanity check that the generator is wired correctly before trusting it for
`fontSizeValues`. Individual themes that want rounded corners can still override
`--radius-*` token values via `createDesignTheme`; this generator only sets
the default ladder.

### `durationValues` (additive)

```ts
const fastBand = expandDurationBand({ base: 80, ratio: 0.75 });
const mediumBand = expandDurationBand({ base: 140, ratio: 0.75 });
const slowBand = expandDurationBand({ base: 220, ratio: 0.75 });

export const durationValues = {
  fast: '80ms',
  medium: '140ms',
  slow: '220ms', // flat anchors unchanged
  'fast-min': `${fastBand.min}ms`,
  'fast-max': `${fastBand.max}ms`,
  'medium-min': `${mediumBand.min}ms`,
  'medium-max': `${mediumBand.max}ms`,
  'slow-min': `${slowBand.min}ms`,
  'slow-max': `${slowBand.max}ms`,
} as const;
```

Additive — nothing that currently references `var(--duration-fast)` etc.
needs to change. The min/max bands are for future motion recipes (e.g. a
transition that should feel "fast-ish" without hard-coding a single ms value)
and for documentation; no existing `transitionValues` entry needs rewriting in
this PR unless calibration reveals a better fit.

Update `DesignDurationValues` in the same file if TypeScript narrows the
`as const` object — the six new keys must appear on the exported type.

---

## Calibration

Tune by eye, record final constants in code comments above each generator call.

| Scale                | Starting inputs                     | Acceptance criteria                                                                                                                                                                                                            |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fontSizeValues`     | `base: 14`, `ratio: 1.2`            | `md` stays `14px` exactly (offset `0` → `base`). Full ladder reads as a coherent editorial monospace scale — no step jumps so large they break layout in the vite-app demo. Exact match to today's ladder is **not** required. |
| `radiusValues`       | `base: 4`, `multiplier: 0`          | All generated steps are `0px`; matches current brutalist default exactly.                                                                                                                                                      |
| `expandDurationBand` | `ratio: 0.75`, default `roundTo: 5` | With anchors 80/140/220, bands are `{60,80,105}`, `{105,140,185}`, `{165,220,295}` ms respectively. Adjust `ratio` only if a band feels too tight/loose against existing `transitionValues` when mentally substituted.         |

---

## Testing

`packages/core/src/tokens/primitive.test.ts` (new file):

- Snapshot `fontSizeValues`, `radiusValues`, and all twelve `durationValues`
  keys against their calibrated output — a future change to the generator,
  its inputs, or the TypeStyles dependency shows up as an intentional snapshot
  update, not silent drift.
- Assert `fontSizeValues.md === '14px'` and every `radiusValues` entry except
  none/full is `'0'` (sanity checks independent of the snapshot).
- Assert duration band ordering: for each band, `min < base < max` when parsed
  as integers.

---

## Explicitly out of scope

- Semantic type-role tokens (`heading-N`/`body`/`display-N`) — a new token
  layer, not something this generator produces. Future work if wanted.
- `lineHeight`/`fontWeight` scaling — both small fixed enums today with no
  ladder relationship to `fontSize`. Leave as hand-written literals.
- Per-theme scale overrides via `createDesignTheme` config hooks — no such
  hook exists today; a theme wanting different radii can already override
  individual `--radius-*` values directly. Revisit only if a concrete theme
  needs generator-level config.
- Any change to the underlying `typestyles/token-scale` math — TypeStyles' own
  repo.

---

## Implementation Tasks

### Task 0 — Bump TypeStyles

Raise the workspace catalog to `typestyles: ^0.8.0`, run `vp install`.

**Done when:** `import … from 'typestyles/token-scale'` resolves in
`packages/core`.

### Task 1 — Wire the three generators into `primitive.ts`

Replace hand-written `fontSizeValues`/`radiusValues` literals and add the six
new duration-band keys per the code above.

**Done when:** `primitive.ts` compiles; no leftover hand-typed duplicate values
for the affected keys; `DesignDurationValues` includes the new keys.

### Task 2 — Calibrate

Tune `base`/`ratio` for `fontSizeValues` until the generated ladder is an
acceptable replacement. Confirm `radiusValues` reproduces today's all-zero
values exactly. Record final constants in comments.

**Done when:** calibration comments are in code and the Task 3 snapshot reflects
final tuned values.

### Task 3 — Tests

Write `primitive.test.ts` as described above.

**Done when:** `vp test` passes with the new suite.

### Task 4 — Mark shipped

Check off V2 in `ROADMAP.md` with the PR link; update the TypeStyles dependency
status row to **Shipped**.
