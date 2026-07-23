# Token Tree Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend Var UI’s `DesignTokens` tree with layout, size, and semantic color tokens identified in the landscape gap analysis — without introducing component-token namespaces.

**Architecture:** Expand `types.ts` as the single taxonomy source; add primitive tables in `primitive.ts` + registrations in `primitives.ts` / `register.ts`; extend semantic `color.*` via TypeStyles `tokens.declare()` (typed refs + `@property` declarations for the full shape) and a **complete** default color registration that uses those refs for derived values. Theme packs supply authored light/dark overrides only — no `buildColorRegistrationValues()` merge step. Recipes may consume new tokens in a later adoption pass — that is not the same as `tokens.components.*`.

**Tech Stack:** TypeStyles token registration, `@var-ui/core`, Vite+ (`vp check`, `vp test`).

**Research:** `docs/superpowers/specs/2026-07-23-design-system-theming-landscape.md` (Var UI gap analysis)  
**Related:** `docs/superpowers/specs/2026-07-21-theming-dx-design.md` (token shape, no component tokens)

## Global Constraints

- **No component token namespaces** — do not add `tokens.components`, per-component token maps, or Amplify-style `--var-ui-components-*` layers.
- **Single taxonomy** — every new namespace must appear in `DesignTokens` (`types.ts`) and register via `tokens.create`.
- **Theme-overridable vs fixed** — primitives (`palette`, `stroke`) stay fixed; new primitives follow existing pattern (mode-invariant unless explicitly color).
- **Dark mode** — only `color.*` leaves vary by mode; new layout/size/breakpoint tokens are mode-invariant.
- **Derived colors** — declare the full `color` shape with `tokens.declare<DesignTokens['color']>('color')`; define every leaf in the default registration using `color.*` refs for derived semantics (`color-mix`, sibling refs). Theme packs stay partial (authored leaves only); derived leaves resolve at registration time via `var(--…)` refs.
- **Minimal theme churn** — default/brutalist themes keep current visuals; new tokens get sensible defaults mapped from existing values.
- **Validation:** `vp test packages/core` and `vp check` after each task touching code.
- **Commits:** conventional, one per task when the plan says to commit.

---

## Target token tree (delta)

Current tree: `packages/core/src/tokens/types.ts`. Below is **what we add** (not the full tree).

### Phase A — Layout & density primitives

| Namespace       | New keys                                                                   | Default values (indicative)                         | Rationale                                               |
| --------------- | -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `space`         | `0`, `7`, `9`, `10`, `11`, `16`, `20`                                      | `0`, `28px`, `36px`, `40px`, `44px`, `64px`, `80px` | Close gaps vs Astryx/Radix without Tailwind-scale bloat |
| `size.control`  | `sm`, `md`, `lg`                                                           | `28px`, `32px`, `36px`                              | Astryx element heights; unify button/input targets      |
| `size.icon`     | `sm`, `md`, `lg`                                                           | `14px`, `16px`, `20px`                              | Replace hardcoded icon recipe sizes                     |
| `breakpoint`    | `sm`, `md`, `lg`, `xl`                                                     | `640px`, `768px`, `1024px`, `1280px`                | Replace magic media queries                             |
| `zIndex`        | `base`, `raised`, `sticky`, `dropdown`, `overlay`, `toast`, `modal`, `max` | `0`, `1`, `10`, `100`, `400`, `500`, `1000`, `9999` | Map existing recipe stacks                              |
| `opacity`       | `disabled`, `muted`                                                        | `0.5`, `0.6`                                        | Match current disabled/hint usage                       |
| `letterSpacing` | `tight`, `normal`, `wide`, `caps`                                          | `-0.015em`, `0`, `0.025em`, `0.06em`                | Typography/prose/sideNav                                |
| `borderWidth`   | differentiate `thick`                                                      | `thin/default: 1px`, `thick: 2px`                   | Real scale for non-brutalist themes                     |

### Phase B — Semantic color expansion

| Namespace          | New keys                           | Authored in pack?                            | Derived via `color.*` declare ref?                 |
| ------------------ | ---------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| `color.background` | `popover`, `muted`                 | Yes (or ref sibling in default registration) | Optional (`popover` → `color.background.elevated`) |
| `color.overlay`    | `panel`, `hover`, `pressed`        | `panel` yes                                  | `hover`, `pressed`, `backdrop` via declare refs    |
| `color.link`       | `default`, `hover`                 | Optional (default → accent)                  | Optional (`color.accent.*` refs)                   |
| `color.ring`       | `default`                          | —                                            | Yes (`color-mix` from `color.accent.default`)      |
| `color.text`       | `onSuccess`, `onWarning`, `onInfo` | Yes in packs / generator                     | —                                                  |
| `color.skeleton`   | `default`                          | —                                            | Yes (mix from `color.background.subtle`)           |
| `color.track`      | `default`                          | —                                            | Yes (mix for progress/slider track)                |

**Default mapping (light brutalist pack):**

- `background.popover` → same as `background.elevated`
- `background.muted` → same as `background.subtle`
- `overlay.panel` → same as `background.elevated`
- `link.default` → `accent.default`; `link.hover` → `accent.hover`
- `text.onSuccess` / `onWarning` / `onInfo` → replace `#ffffff` hardcodes in `semanticTone.ts`

### Phase C — Elevation shadows (optional, same PR as B or follow-up)

| Namespace          | New keys             | Notes                                                                                  |
| ------------------ | -------------------- | -------------------------------------------------------------------------------------- |
| `shadow.elevation` | `low`, `med`, `high` | Soft box-shadows for non-brutalist themes; keep existing `shadow.xs`–`xl` offset style |
| `color.shadow`     | `color`              | Shadow tint separate from brutalist `offset`                                           |

### Explicitly out of scope (future specs)

- `tokens.components.*` / per-component token files
- Astryx-style communication hue table (`color.background-blue`, …)
- Chart / data visualization tokens (`chart-1`, `data-*`)
- HeroUI-style `field.*` isolated form namespace
- Composed `textStyles` / semantic heading bundles (H1–H6 objects)
- `aspectRatio` token namespace
- Keyframe / animation token namespace beyond existing `transition.*`

### File map

| Area                                 | Files                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Taxonomy                             | `packages/core/src/tokens/types.ts`                                                                   |
| Primitive values                     | `packages/core/src/tokens/primitive.ts`, `primitive.test.ts`                                          |
| Registration                         | `packages/core/src/tokens/primitives.ts`, `register.ts`, `index.ts`                                   |
| Color declare + default registration | `packages/core/src/tokens/color.ts`, `default-color-values.ts`, `register.ts`                         |
| Color generator                      | `packages/core/src/tokens/create-color-theme.ts`, `create-color-theme.test.ts`, snapshots             |
| Theme pack faces (authored only)     | `packages/core/src/themes/default-values.ts`, `default-pack.ts`                                       |
| Gallery themes                       | `forest.ts`, `rose.ts`, `amber.ts`, `ai-glow.ts`, `new-wave.ts`, `windows-95.ts`, `classic-system.ts` |
| Semantic tone helper                 | `packages/core/src/components/semanticTone.ts`                                                        |
| Recipe adoption (Phase D)            | `icon.ts`, `commandPalette.ts`, `toast.ts`, `appShell.ts`, `proseContent.ts`, `card.ts`, …            |
| Docs                                 | `packages/core/README.md`, landscape spec cross-link                                                  |

### PR grouping

1. **Phase A primitives** — Tasks 1–2
2. **Phase B semantic colors** — Tasks 3–4
3. **Phase C elevation (optional)** — Task 5
4. **Phase D recipe adoption** — Task 6
5. **Docs** — Task 7

---

### Task 1: Extend primitive scales (space, size, opacity, letterSpacing, borderWidth)

**Files:**

- Modify: `packages/core/src/tokens/types.ts`
- Modify: `packages/core/src/tokens/primitive.ts`
- Modify: `packages/core/src/tokens/primitives.ts`
- Modify: `packages/core/src/tokens/register.ts`
- Modify: `packages/core/src/tokens/index.ts`
- Test: `packages/core/src/tokens/primitive.test.ts`

**Interfaces:**

- Produces: `sizeValues`, `opacityValues`, `letterSpacingValues`; expanded `spaceValues`, `borderWidthValues`
- Produces registrations: `sizeTokens`, `opacityTokens`, `letterSpacingTokens` on `designTokens`

- [ ] **Step 1: Add types to `DesignTokens`**

```ts
// types.ts — add alongside existing namespaces
size: WidenLeaves<typeof sizeValues>;
opacity: WidenLeaves<typeof opacityValues>;
letterSpacing: WidenLeaves<typeof letterSpacingValues>;
// extend spaceValues / borderWidthValues in primitive.ts first
```

- [ ] **Step 2: Define values in `primitive.ts`**

```ts
export const sizeValues = {
  control: { sm: '28px', md: '32px', lg: '36px' },
  icon: { sm: '14px', md: '16px', lg: '20px' },
} as const;

export const opacityValues = {
  disabled: '0.5',
  muted: '0.6',
} as const;

export const letterSpacingValues = {
  tight: '-0.015em',
  normal: '0',
  wide: '0.025em',
  caps: '0.06em',
} as const;

export const spaceValues = {
  0: '0px',
  1: '4px',
  // … existing 2–6, 8, 12 …
  7: '28px',
  9: '36px',
  10: '40px',
  11: '44px',
  16: '64px',
  20: '80px',
} as const;

export const borderWidthValues = {
  thin: '1px',
  default: '1px',
  thick: '2px',
} as const;
```

- [ ] **Step 3: Register in `primitives.ts` + `register.ts` + export from `index.ts`**

- [ ] **Step 4: Add snapshot tests in `primitive.test.ts`**

```ts
it('includes expanded space scale', () => {
  expect(spaceValues[0]).toBe('0px');
  expect(spaceValues[7]).toBe('28px');
  expect(spaceValues[20]).toBe('80px');
});

it('matches sizeValues snapshot', () => {
  expect(sizeValues).toMatchInlineSnapshot(/* … */);
});
```

- [ ] **Step 5: Run tests and check**

Run: `vp test packages/core/src/tokens/primitive.test.ts`  
Run: `vp check`

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/tokens/
git commit -m "feat(core): add size, opacity, letterSpacing tokens and expand space scale"
```

---

### Task 2: Breakpoint and z-index namespaces

**Files:**

- Modify: `packages/core/src/tokens/types.ts`
- Create: `packages/core/src/tokens/layout.ts` (breakpoint + zIndex values — keeps `primitive.ts` focused)
- Modify: `packages/core/src/tokens/primitives.ts`, `register.ts`, `index.ts`
- Create: `packages/core/src/tokens/layout.test.ts`

**Interfaces:**

- Produces: `breakpointValues`, `zIndexValues`, `breakpointTokens`, `zIndexTokens`

- [ ] **Step 1: Write failing layout tests**

```ts
// layout.test.ts
import { breakpointValues, zIndexValues } from './layout';

it('defines breakpoint sm/md/lg/xl in px', () => {
  expect(breakpointValues.md).toBe('768px');
});

it('maps overlay/toast/modal z-index stack', () => {
  expect(zIndexValues.overlay).toBeLessThan(zIndexValues.toast);
  expect(zIndexValues.toast).toBeLessThan(zIndexValues.modal);
});
```

- [ ] **Step 2: Implement `layout.ts`**

```ts
export const breakpointValues = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const zIndexValues = {
  base: 0,
  raised: 1,
  sticky: 10,
  dropdown: 100,
  overlay: 400,
  toast: 500,
  modal: 1000,
  max: 9999,
} as const;
```

Note: `zIndex` leaves are numbers (valid `TokenLeaf`); CSS emits as unitless numbers.

- [ ] **Step 3: Wire into `DesignTokens`, register, export**

- [ ] **Step 4: Run tests + check + commit**

```bash
git commit -m "feat(core): add breakpoint and zIndex token namespaces"
```

---

### Task 3: Extend semantic color shape + declare-first registration

**Files:**

- Modify: `packages/core/src/tokens/types.ts` (`color.*` branches)
- Modify: `packages/core/src/tokens/color.ts` — **replace** `buildColorRegistrationValues()` with `tokens.declare()` export
- Create: `packages/core/src/tokens/default-color-values.ts` — complete default registration using `color.*` refs
- Modify: `packages/core/src/tokens/register.ts`
- Modify: `packages/core/src/themes/default-values.ts` (authored pack faces only)
- Modify: `packages/core/src/components/semanticTone.ts`
- Test: add `packages/core/src/tokens/color.test.ts` (or extend existing if present)

**Interfaces:**

- Consumes: Task 1–2 registrations unchanged
- Produces: expanded `DesignTokens['color']`; `color` declare handle; `defaultColorTokenValues` passed to `tokens.create('color', …)`

**Color registration model (replaces `buildColorRegistrationValues`):**

```ts
// color.ts
import { tokens } from '../runtime';
import type { DesignTokens } from './types';

/** Typed refs for every `color.*` leaf; emits matching `@property` declarations. */
export const color = tokens.declare<DesignTokens['color']>('color');
```

```ts
// default-color-values.ts (or bottom of color.ts) — complete tree, no merge helper
import { color } from './color';
import { paletteTokens } from './primitives';
// … literals from default-values where themes share authored sources

export const defaultColorTokenValues = {
  background: {
    app: '#F5F1E9',
    surface: '#FAF8F2',
    subtle: paletteTokens['sand-2'],
    elevated: '#FFFCF6',
    popover: color.background.elevated,
    muted: color.background.subtle,
  },
  text: {
    primary: '#14110D',
    secondary: paletteTokens['stone-8'],
    disabled: `color-mix(in oklch, ${color.text.secondary} 45%, transparent)`,
    placeholder: `color-mix(in oklch, ${color.text.secondary} 55%, transparent)`,
    // … every leaf
  },
  accent: {
    default: paletteTokens['sky-7'],
    hover: paletteTokens['sky-8'],
    subtle: `color-mix(in oklch, ${color.accent.default} 24%, ${color.background.app})`,
  },
  // … all namespaces through syntax
} satisfies DesignTokens['color'];
```

```ts
// register.ts
import { defaultColorTokenValues } from './default-color-values';

export const colorTokens = tokens.create('color', defaultColorTokenValues);
```

**Notes:**

- Delete `buildColorRegistrationValues()` — do not replace it with a similarly named merge helper.
- `default-values.ts` keeps **partial** light/dark faces for `createDesignTheme` / `colorMode` overrides (authored leaves themes swap); the **registered** default tree is the complete `defaultColorTokenValues` object above.
- Derived values use `${color.*}` refs so registration emits `var(--var-ui-color-…)` and cascades when themes override base leaves.
- Export `color` from `tokens/index.ts` if recipes/helpers need typed refs.

- [ ] **Step 1: Extend `color` type in `types.ts`**

```ts
background: {
  app: string;
  surface: string;
  subtle: string;
  elevated: string;
  popover: string;
  muted: string;
};
text: {
  // existing…
  onSuccess: string;
  onWarning: string;
  onInfo: string;
};
link: { default: string; hover: string };
ring: { default: string };
overlay: {
  default: string;
  backdrop: string;
  panel: string;
  hover: string;
  pressed: string;
};
skeleton: { default: string };
track: { default: string };
```

- [ ] **Step 2: Update `default-values.ts` authored faces**

Add new **authored** leaves only (derived leaves stay out of pack source):

```ts
background: {
  // existing…
  popover: '#FFFCF6', // same as elevated initially
  muted: defaultLightSubtle,
},
text: {
  // existing…
  onSuccess: paletteTokens['neutral-1'],
  onWarning: paletteTokens['stone-10'],
  onInfo: paletteTokens['neutral-1'],
},
link: {
  default: paletteTokens['sky-7'],
  hover: paletteTokens['sky-8'],
},
overlay: {
  default: color.alpha(paletteTokens['slate-10'], 0.55, 'oklch'),
  panel: '#FFFCF6', // authored; hover/pressed/backdrop in default registration
},
```

Mirror dark face in `defaultDarkColorValues`.

- [ ] **Step 3: Refactor `color.ts` + add complete `defaultColorTokenValues`**

Remove `buildColorRegistrationValues()`. Keep `color.ts` as the declare export; add `default-color-values.ts` (or co-locate) with the **full** registration object — every leaf defined inline using literals and `${color.*}` refs:

```ts
overlay: {
  default: color.alpha(paletteTokens['slate-10'], 0.55, 'oklch'),
  panel: color.background.elevated,
  backdrop: `color-mix(in oklch, ${color.overlay.default} 60%, transparent)`,
  hover: `color-mix(in oklch, ${color.text.primary} 8%, transparent)`,
  pressed: `color-mix(in oklch, ${color.text.primary} 14%, transparent)`,
},
ring: {
  default: `color-mix(in oklch, ${color.accent.default} 45%, transparent)`,
},
skeleton: {
  default: `color-mix(in oklch, ${color.background.subtle} 80%, ${color.border.default})`,
},
track: {
  default: `color-mix(in oklch, ${color.background.subtle} 65%, ${color.border.default})`,
},
link: {
  default: color.accent.default,
  hover: color.accent.hover,
},
// retain existing derived status/accent/text slots from current color.ts
```

Wire `register.ts` to `tokens.create('color', defaultColorTokenValues)`.

- [ ] **Step 4: Update `semanticTone.ts` to use token refs**

```ts
success: {
  solidFg: t.color.text.onSuccess,
},
danger: {
  solidFg: t.color.text.onDanger, // already typed; stop using '#ffffff'
},
warning: {
  solidFg: t.color.text.onWarning,
},
info: {
  solidFg: t.color.text.onInfo,
},
```

- [ ] **Step 5: Tests — declare handle + complete registration**

```ts
import { color } from './color';
import { colorTokens } from './register';
import { defaultColorTokenValues } from './default-color-values';

it('declares the full color namespace', () => {
  expect(color.text.primary).toMatch(/var\(--var-ui-color-text-primary\)/);
});

it('registers every color leaf', () => {
  expect(defaultColorTokenValues.overlay.hover).toMatch(/color-mix|var\(--/);
  expect(defaultColorTokenValues.ring.default).toBeTruthy();
  expect(colorTokens.overlay.hover).toBeTruthy();
});
```

- [ ] **Step 6: Run `vp test packages/core` + `vp check` + commit**

```bash
git commit -m "feat(core): expand semantic colors with declare-first registration"
```

---

### Task 4: Wire `createColorTheme` + gallery packs

**Files:**

- Modify: `packages/core/src/tokens/create-color-theme.ts`
- Modify: `packages/core/src/tokens/create-color-theme.test.ts`
- Modify: `packages/core/src/tokens/__snapshots__/create-color-theme.test.ts.snap`
- Modify: gallery theme files under `packages/core/src/themes/*.ts`

**Interfaces:**

- Consumes: Task 3 `DesignTokens['color']` shape + declare registration model
- Produces: generator output with new **authored** color leaves; derived leaves remain registration-time via `color.*` refs (not duplicated in generator output)

- [ ] **Step 1: Extend `RampMappedColor` / `LIGHT_SLOTS` for new authored fields**

Add slot maps for `background.popover`, `background.muted`, `overlay.panel`, `text.onSuccess`, etc. Use same ramp indices as sibling fields where sensible (popover → elevated slot, muted → subtle slot).

- [ ] **Step 2: Update test fixtures**

```ts
expect(result.light.background).toMatchObject({
  popover: expect.any(String),
  muted: expect.any(String),
});
expect(result.light.text).toMatchObject({
  onSuccess: expect.any(String),
  onWarning: expect.any(String),
  onInfo: expect.any(String),
});
```

- [ ] **Step 3: Update hand-authored gallery packs** (`forest`, `rose`, `amber`, style themes) with new **authored** leaves where themes differ. Do not duplicate derived leaves (`accent.subtle`, status `border`, etc.) — those resolve via the default declare registration when packs merge into themes.

- [ ] **Step 4: Run tests, update snapshots, check, commit**

```bash
git commit -m "feat(core): generate expanded color trees in createColorTheme"
```

---

### Task 5 (optional): Elevation shadow tokens

**Files:**

- Modify: `packages/core/src/tokens/types.ts`, `primitive.ts`, `primitives.ts`, `register.ts`
- Modify: `packages/core/src/themes/default-pack.ts` or style themes that use soft shadows

**Interfaces:**

- Produces: `shadow.elevation.low | med | high`; optional `color.shadow.color`

- [ ] **Step 1: Add elevation table (soft shadows for ai-glow / future themes)**

```ts
export const shadowElevationValues = {
  low: '0 1px 2px color-mix(in oklch, var(--var-ui-color-text-primary) 8%, transparent)',
  med: '0 4px 12px color-mix(in oklch, var(--var-ui-color-text-primary) 12%, transparent)',
  high: '0 12px 32px color-mix(in oklch, var(--var-ui-color-text-primary) 16%, transparent)',
} as const;
```

Nest under `shadow` in `DesignTokens` as `shadow.elevation.*` or flatten to `shadow.elevationLow` — **pick nested `shadow.elevation` for clarity**.

- [ ] \*_Step 2: Default brutalist pack keeps `shadow.xs`–`xl`; ai-glow pack overrides `shadow.elevation._`in`tokens.shadow` if needed.

- [ ] **Step 3: Tests + commit**

```bash
git commit -m "feat(core): add elevation shadow tokens"
```

Skip Task 5 in the first PR if timeboxed; brutalist default does not require it.

---

### Task 6: Adopt new tokens in recipes (not component tokens)

Replace hardcoded values with `designTokens` refs. **Do not** add new `c.vars()` component token layers — only swap literals for global tokens.

**Files (minimum set):**

- Modify: `packages/core/src/components/icon.ts` → `t.size.icon.*`
- Modify: `packages/core/src/components/commandPalette.ts` → `t.zIndex.overlay`
- Modify: `packages/core/src/components/toast.ts` → `t.zIndex.toast`
- Modify: `packages/core/src/components/appShell.ts` → `t.zIndex.modal` / `t.zIndex.max`
- Modify: `packages/core/src/components/proseContent.ts` → `t.breakpoint.md`, `t.letterSpacing.tight`
- Modify: `packages/core/src/components/card.ts` → `t.breakpoint.sm`
- Modify: disabled opacity usages in `list.ts`, `tree.ts`, `sideNav.ts` → `t.opacity.disabled`

**Helper (optional, inline-only):**

If repeated media-query boilerplate appears, add a tiny util in `packages/core/src/tokens/layout.ts`:

```ts
export function minWidth(bp: keyof typeof breakpointValues): string {
  return `@media (min-width: ${breakpointValues[bp]})`;
}
```

Do **not** add TypeStyles dependency from recipes to a heavy media-query builder in this pass.

- [ ] **Step 1: Migrate icon sizes**

- [ ] **Step 2: Migrate z-index stack**

- [ ] **Step 3: Migrate breakpoints in prose/card**

- [ ] **Step 4: Migrate opacity + letterSpacing hot spots**

- [ ] **Step 5: Run component CSS tests (`*.test.ts` that call `getRegisteredCss()`) + `vp test packages/core`**

- [ ] **Step 6: Commit**

```bash
git commit -m "refactor(core): use expanded layout tokens in recipes"
```

---

### Task 7: Documentation

**Files:**

- Modify: `packages/core/README.md` — token namespace reference table
- Modify: `docs/superpowers/specs/2026-07-23-design-system-theming-landscape.md` — mark gaps as addressed (brief changelog section at top or in gap analysis)
- Create: `docs/superpowers/specs/2026-07-23-token-tree-expansion-design.md` (optional one-pager summarizing final tree — only if README is insufficient)

- [ ] **Step 1: Document new namespaces with example overrides**

```ts
createDesignTheme({
  tokens: {
    size: { control: { md: '36px' } },
    zIndex: { toast: 600 },
    color: {
      background: { popover: designTokens.palette['sand-1'] },
    },
  },
});
```

- [ ] **Step 2: Note explicit non-goals (component tokens, chart palette)**

- [ ] **Step 3: Commit**

```bash
git commit -m "docs(core): document expanded design token tree"
```

---

## Self-review (spec coverage)

| Gap (landscape doc)                              | Task                    |
| ------------------------------------------------ | ----------------------- |
| Breakpoints                                      | Task 2, 6               |
| z-index scale                                    | Task 2, 6               |
| Spacing expansion                                | Task 1                  |
| Size / control heights                           | Task 1, 6               |
| Surface layering (popover, muted, overlay panel) | Task 3                  |
| Link / ring tokens                               | Task 3                  |
| onSuccess / onWarning / onInfo                   | Task 3, 4               |
| skeleton / track                                 | Task 3                  |
| Opacity / letterSpacing                          | Task 1, 6               |
| Border width scale                               | Task 1                  |
| Elevation shadows                                | Task 5 (optional)       |
| Chart / communication hues                       | Out of scope            |
| field.\* namespace                               | Out of scope            |
| Component token namespaces                       | Out of scope (explicit) |
| textStyles compositions                          | Out of scope            |

---

## Success criteria

- `DesignTokens` documents all new namespaces; `designTokens` object exposes them at runtime.
- Default theme visuals unchanged (or intentionally documented deltas).
- `tokens.declare('color')` emits `@property` for the full color shape; default registration defines every leaf.
- `createColorTheme({ accent })` produces complete **authored** color trees; derived semantics cascade via declare refs.
- At least icon, toast, command palette, and prose/card use breakpoint/z-index/size tokens instead of literals.
- `vp check` and `vp test packages/core` pass.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-23-token-tree-expansion.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks

**2. Inline Execution** — run tasks in this session with checkpoints after Tasks 2, 4, and 6

Which approach?
