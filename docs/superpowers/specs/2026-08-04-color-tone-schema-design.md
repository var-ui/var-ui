# Color tone schema — unified semantic colors

**Date:** 2026-08-04  
**Status:** Approved  
**Goal:** Replace fragmented semantic color tokens (`accent`, `success`, `text.on*`, `background.info`, …) with a cohesive `color.tone` namespace where every chromatic tone shares the same shape and interaction states are derived systematically from OKLCH ramps.

## Summary

var-ui currently has three parallel naming systems for chromatic semantics:

1. **Per-channel tokens** (`color.accent.default`, `color.success.solid`, `color.warning.onSolid`, …) with inconsistent keys
2. **Cross-namespace text tokens** (`text.onAccent`, `text.onSuccess`, …) for filled-surface foreground
3. **Runtime color-mix helpers** (`subtleBackgroundColor`, `subtleBorderColor`, `filledHoverColor`) that recompute values components already define as unused tokens (`success.subtle`, `success.border`)

Components bridge these via `semanticTone.ts` (`semantic` / `solidBg` / `solidFg` channel vars). The new schema makes that internal model the public token contract.

## Decisions

| Topic                           | Decision                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Namespace                       | `color.tone.[accent\|success\|warning\|danger\|info]`                              |
| Tone shape                      | Four authored tokens per tone (see below)                                          |
| Filled foreground               | Derived via contrast resolution on `background` — not an authored token            |
| Hover / focus / active          | Derived-only interaction recipes; per-tone overrides deferred                      |
| `background.info` / `text.info` | Fold into `tone.info.subtleBackground` / `tone.info.foreground`                    |
| Neutral controls                | Stay outside `color.tone`; use structural `background` / `text` / `border` tokens  |
| Accent special role             | Same schema as other tones; wired as default for link, focus ring, primary actions |
| `accent.test`                   | Remove                                                                             |

## Schema

### Tone face (every chromatic tone)

```ts
type ToneFace = {
  /** Filled surfaces — buttons, solid alerts, badges */
  background: ColorToken;
  /** Chromatic foreground — outline/subtle/ghost text, icons, borders */
  foreground: ColorToken;
  /** Tinted surfaces — subtle buttons, subtle alerts, nav selection */
  subtleBackground: ColorToken;
  /** Borders on subtle surfaces and outline variants */
  border: ColorToken;
};

color.tone = {
  accent: ToneFace,
  success: ToneFace,
  warning: ToneFace,
  danger: ToneFace,
  info: ToneFace,
} satisfies TokenSchema;
```

### Structural tokens (unchanged scope, trimmed keys)

```ts
color.background = {
  app, surface, subtle, elevated, popover, muted, secondary, tertiary,
  // `info` removed — use tone.info.subtleBackground
};

color.text = {
  primary, secondary, disabled, placeholder,
  // `info` removed — use tone.info.foreground
  // `onAccent`, `onSuccess`, `onDanger`, `onWarning`, `onInfo` removed — derived
};

color.border = { default, strong, focus, subtle };
```

### Aliases

```ts
color.link = {
  default: tone.accent.foreground,
  hover: accent ramp step +1 (or existing hover derivation),
};

color.border.focus → derived from tone.accent.foreground (or alpha thereof)
```

## Appearance → token mapping

Components with a `tone` + `appearance` axis resolve paint as follows:

| Appearance  | `background-color`      | `color`                         | `border-color`    |
| ----------- | ----------------------- | ------------------------------- | ----------------- |
| **filled**  | `tone.background`       | `onBackground(tone.background)` | `tone.background` |
| **subtle**  | `tone.subtleBackground` | `tone.foreground`               | `tone.border`     |
| **outline** | `transparent`           | `tone.foreground`               | `tone.foreground` |
| **ghost**   | `transparent`           | `tone.foreground`               | `transparent`     |

Multi-slot surfaces (alert, banner, toast) use the same mapping via `appearanceSurface`.

### Derived values (not authored tokens)

#### `onBackground(background)`

Used for filled-variant text. Resolved at theme generation time:

```ts
function onBackground(background: string, neutralRamp: Ramp): string {
  return contrastRatio(WHITE, background) >= 4.5 ? WHITE : rampAt(neutralRamp, 10);
}
```

Already implemented as `resolveOnAccent` in `generate-colors.ts`; generalize for all tones.

#### Interaction recipes (system constants)

| State            | filled                                     | subtle                          | outline            | ghost              |
| ---------------- | ------------------------------------------ | ------------------------------- | ------------------ | ------------------ |
| **hover bg**     | `oklch-mix(background, black, 12%)`        | `mix(foreground, surface, 18%)` | `subtleBackground` | `subtleBackground` |
| **hover border** | same as hover bg                           | unchanged                       | unchanged          | —                  |
| **active**       | `translateY(1px)` (existing button recipe) | optional deeper mix             | —                  | —                  |
| **focus**        | global `color.border.focus`                | same                            | same               | same               |

Future per-tone overrides (e.g. `tone.success.backgroundHover`) would default to these derived values.

## Theme generation

Each tone maps to an OKLCH palette ramp. Light-mode slot mapping:

```ts
foreground: ramp[7];
background: ramp[8]; // step 7 where contrast allows (accent)
subtleBackground: alpha(ramp[7], 0.12, 'oklch');
border: alpha(ramp[7], 0.38, 'oklch'); // aligns with current subtleMix.border
```

Dark mode mirrors steps via `mirrorStep`, preserving existing exceptions:

- `danger.background` / `success.background` use ramp step 7 (not mirrored) to keep `onBackground` above 4.5:1

`generateColors()` becomes the single source for all five tone faces. Hand-authored defaults in `packages/core/src/tokens/defaults/color/` follow the same derivation rules.

## Migration map

| Removed                                                             | Replacement                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| `color.accent.{default,hover,subtle,test}`                          | `color.tone.accent.*`                                   |
| `color.success.{default,solid,subtle,border}`                       | `color.tone.success.*`                                  |
| `color.danger.{default,solid,subtle,border}`                        | `color.tone.danger.*`                                   |
| `color.warning.{default,onSolid,subtle,border}`                     | `color.tone.warning.*`                                  |
| `color.info.{default,onSolid,subtle,border}`                        | `color.tone.info.*`                                     |
| `text.onAccent` / `onSuccess` / `onDanger` / `onWarning` / `onInfo` | `onBackground(tone.*.background)`                       |
| `background.info`                                                   | `tone.info.subtleBackground`                            |
| `text.info`                                                         | `tone.info.foreground`                                  |
| `subtleBackgroundColor()` / `subtleBorderColor()` at runtime        | read `tone.*.subtleBackground` / `tone.*.border` tokens |
| `filledHoverColor()` at runtime                                     | interaction recipe on `tone.*.background`               |
| `semanticChannelAssignments()`                                      | direct `color.tone.[key]` references                    |

## Component layer

### `semanticTone.ts` refactor

Replace channel-var indirection with:

```ts
function tonePaint(tone: ToneKey, appearance: ToneAppearance): PaintRecipe;
function toneInteraction(
  tone: ToneKey,
  appearance: ToneAppearance,
  state: 'hover' | 'active',
): PaintRecipe;
function onBackground(tone: ToneKey): string; // reads derived value or computes from tone.background
```

`semanticTone` record and `semanticChannelAssignments` are removed. Components reference `designTokens.color.tone.[key]` directly.

### Affected components

Any file referencing `color.accent`, `color.success`, `color.danger`, `color.warning`, `color.info`, or `text.on*`:

- `button`, `badge`, `alert`, `banner`, `toast`
- `spinner`, `progressBar`, `toggleButton`
- `tabList`, `select`, `combobox`, `field`, `textField`, etc. (accent/danger for focus/error)
- `navItem` defaults (fold `background.info` / `text.info` → `tone.info`)
- `proseContent`, `commandPalette`, `avatar`, `fileInput`, `tree` (accent subtle backgrounds)
- `generate-colors.ts`, theme playground token editors, docs ColorSwatches

### Neutral tone

Unchanged: `button.tone.neutral` and `badge.tone.neutral` continue using structural tokens (`text.primary`, `background.surface`, `border.default`). Not part of `color.tone`.

## Docs & tooling

- Update `docs/content/theming/colors.mdx` and `tokens.mdx`
- Regroup ColorSwatches under `color.tone.*`
- Update theme playground editors to expose four fields per tone
- Update `generateThemeCode` output for new paths
- Snapshot / export tests for token schema changes

## Testing

- Contrast validation in `generateColors` for every `tone.*.foreground` on `background.app` and `onBackground(tone.*.background)` on `tone.*.background`
- Visual regression on button/badge/alert appearance matrix (5 tones × 4 appearances)
- `palette-contrast.test.ts` / `generate-colors.test.ts` updates
- Navigation item selected state with `tone.info`

## Out of scope (deferred)

- Per-tone hover/focus/active token overrides (schema extension with derived defaults)
- Renaming `navItem` to use tone tokens at the schema level (only default values change)
- Changing component `appearance` variant names (`filled` / `subtle` / `outline` / `ghost`)

## Implementation phases

1. **Schema + types** — add `color.tone` schema, defaults, `onBackground` helper
2. **Generation** — extend `generateColors` to emit full tone faces; remove old keys
3. **semanticTone refactor** — interaction recipes + `tonePaint`; delete runtime mix helpers
4. **Component migration** — update all token references
5. **Docs + playground** — swatches, MDX, theme editor fields
6. **Cleanup** — remove deprecated token files, update snapshots
