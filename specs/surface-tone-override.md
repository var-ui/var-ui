# Fixed-Tone Surface Overrides — Design-System Layer Spec (V4)

Implements `ROADMAP.md` V4. The `'descendant'` scope on TypeStyles' theme
condition engine (compiling `.theme-name [data-surface="dark"]`) shipped in
**typestyles 0.8.0** (P5.4); see TypeStyles'
`specs/surface-tone-override.md` for the engine-side design. This document is
the consumer-side convention: the attribute name, the tone values, wiring through
`createDesignTheme`, and rolling it out across all 8 built-in themes.

**Status: ready to implement** — bump the workspace `typestyles` catalog entry
to `^0.8.0` before starting (same prerequisite as V2/V3).

---

## Prerequisite

```yaml
# pnpm-workspace.yaml catalog
typestyles: ^0.8.0
```

Confirm descendant scope is available on the runtime `tokens` export:

```ts
tokens.when.attr('data-surface', 'dark', { scope: 'descendant' });
```

---

## Why this lives here, not in TypeStyles

Core compiles a descendant-combinator selector suffix — it has no opinion about
which attribute name, tone vocabulary, or token values a design system uses.
var-ui standardizes on `data-surface="light"|"dark"` and reuses each theme's
existing light/dark override objects as the fixed-tone faces.

---

## The problem (var-ui framing)

Ambient light/dark mode follows `data-mode` on the theme root (via
`tokens.colorMode.systemWithLightDarkOverride`). Sometimes a subtree needs a
**fixed** face regardless of ambient mode — an always-dark toast on a light
page, a code block that stays dark in light mode, a promotional banner.

Mark the subtree:

```html
<div class="theme-default" data-mode="light">
  <div data-surface="dark">
    <!-- uses dark color tokens even though the page is in light mode -->
  </div>
</div>
```

The engine applies dark token overrides when `[data-surface="dark"]` appears
anywhere **inside** the themed subtree (descendant scope), independent of
`data-mode` / `prefers-color-scheme`.

---

## Public API

### `SURFACE_ATTRIBUTE`

Export a single canonical constant from `@var-ui/core` (re-export from
`create-theme.ts` or `types.ts`):

```ts
export const SURFACE_ATTRIBUTE = 'data-surface';
```

Consumers use `data-surface="light"` or `data-surface="dark"`. No other tone
values in v1.

### `DesignThemeConfig.surfaces`

Extend `DesignThemeConfig` (`packages/core/src/types.ts`):

```ts
export type DesignThemeConfig = {
  name: string;
  light: ThemeOverrides;
  dark: ThemeOverrides;
  /** Fixed-tone overrides for elements marked with SURFACE_ATTRIBUTE,
   *  regardless of the page's ambient light/dark mode. */
  surfaces?: {
    light?: ThemeOverrides;
    dark?: ThemeOverrides;
  };
};
```

Both `surfaces.light` and `surfaces.dark` are optional — omit either if a theme
doesn't need that fixed face. For the built-in rollout (Task 2), set both.

---

## `createDesignTheme` wiring

Today `createDesignTheme` passes `colorMode`:
`tokens.colorMode.systemWithLightDarkOverride(...)`. TypeStyles treats `modes`
and `colorMode` as **mutually exclusive**, but
`systemWithLightDarkOverride` returns a `ThemeModeDefinition[]` that can be
spread into `modes` alongside hand-written descendant-scoped entries.

Refactor `packages/core/src/create-theme.ts`:

```ts
import { tokens } from './runtime';
import type { DesignTheme, DesignThemeConfig } from './types';

export const SURFACE_ATTRIBUTE = 'data-surface';

export function createDesignTheme(config: DesignThemeConfig): DesignTheme {
  const { light, dark, surfaces } = config;

  const ambientModes = tokens.colorMode.systemWithLightDarkOverride({
    attribute: 'data-mode',
    values: { light: 'light', dark: 'dark' },
    scope: 'self',
    light,
    dark,
  });

  const surfaceModes = [
    surfaces?.dark && {
      id: 'surface-dark',
      overrides: surfaces.dark,
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    },
    surfaces?.light && {
      id: 'surface-light',
      overrides: surfaces.light,
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    },
  ].filter(Boolean);

  return tokens.createTheme(config.name, {
    base: light,
    modes: [...ambientModes, ...surfaceModes],
  });
}
```

**Backward compatible:** themes that omit `surfaces` behave exactly as today —
only ambient light/dark/system modes, no extra CSS rules.

**Reuse existing value objects:** `surfaces.dark` can be the theme's existing
`*DarkValues` export (e.g. `defaultDarkValues`). No new token authoring for the
common case.

---

## Usage patterns

### HTML / any framework

```html
<div class="theme-default" data-mode="light">
  <article data-surface="dark" class="card-root">
    <!-- dark card on a light page -->
  </article>
</div>
```

### React (optional sugar — out of scope for v1, documented for later)

A future `@var-ui/react` `<Surface tone="dark">` wrapper would set
`data-surface="dark"` on a div. Not required for the primitive to work.

### Code blocks

`codeBlock` recipes that should stay dark in light mode wrap content in
`data-surface="dark"` rather than hard-coding dark syntax colors outside the
token system.

---

## Known limitations (document for var-ui users)

Inherited from the engine and ordinary CSS selector matching — not bugs:

- **No "reset to ambient mode" tone.** Once inside `[data-surface="dark"]`, a
  nested child can't fall back to following the page's ambient mode. Keep
  fixed-tone wrappers scoped tightly to the subtree that needs them.
- **Nesting the same tone is a no-op**, not a toggle.
- **`when.not()` on descendant-scoped conditions is unsupported** — TypeStyles
  logs a dev warning and emits no rule. Don't try to negate surface conditions.
- **`windows-95` and `classic-system` are deliberate pastiches.** Whatever
  their existing `dark` config contains becomes their fixed-dark face — verify
  visually during rollout rather than assuming it looks intentional.

---

## Testing

New file `packages/core/src/create-theme.test.ts` (or extend if one exists):

1. **`createDesignTheme` with `surfaces.dark`** — registered CSS includes a
   rule whose selector matches `.theme-<name> [data-surface="dark"]` with
   expected `--color-*` declarations from the dark override object.
2. **Omitting `surfaces`** — no surface-mode rules; ambient modes unchanged
   (backward compatible with existing theme definitions).
3. **Both `surfaces.dark` and `surfaces.light`** — two independent descendant
   rules, each with the correct override declarations.

Inspect emitted CSS via TypeStyles' `getRegisteredCss()` in test setup (same
pattern as TypeStyles' own `theme.test.ts`).

---

## Rollout: all 8 built-in themes

For each theme in `packages/core/src/themes/` — `default`, `forest`, `rose`,
`amber`, `ai-glow`, `new-wave`, `windows-95`, `classic-system` — add:

```ts
createDesignTheme({
  name: '…',
  light: …LightValues,
  dark: …DarkValues,
  surfaces: {
    light: …LightValues,
    dark: …DarkValues,
  },
});
```

Reusing the same `*LightValues`/`*DarkValues` objects already exported from
each theme file. No duplicate token authoring.

**Done when:** every theme in `themes/index.ts` exports with both
`surfaces.light` and `surfaces.dark` set; vite-app demo includes at least one
`data-surface="dark"` example on a light page.

---

## Explicitly out of scope

- Anything in the theme condition engine itself — TypeStyles' repo.
- A purpose-tuned floating-surface token set distinct from each theme's
  existing dark/light values.
- `@var-ui/react` `<Surface>` component — optional follow-up.
- V5 theme gallery side-by-side comparisons — depends on V4 landing but is
  tracked separately in `specs/theme-gallery.md`.

---

## Implementation Tasks

### Task 0 — Bump TypeStyles

Raise catalog to `typestyles: ^0.8.0`, run `vp install`.

**Done when:** `tokens.when.attr(..., { scope: 'descendant' })` type-checks.

### Task 1 — `SURFACE_ATTRIBUTE` + `DesignThemeConfig.surfaces`

Extend types; refactor `createDesignTheme` per the wiring above.

**Done when:** tests from Testing pass; existing themes compile unmodified
(`surfaces` optional).

### Task 2 — Roll `surfaces` out to all 8 themes

Add `surfaces: { light, dark }` to every built-in theme, reusing existing value
exports.

**Done when:** all themes in `themes/index.ts` have both surface faces set.

### Task 3 — Demo + docs

Add a fixed-tone example to `examples/vite-app` (dark toast/card on light page).
Document the pattern in `packages/core/README.md` (Theme surfaces section).

**Done when:** demo renders correctly; README explains `SURFACE_ATTRIBUTE`.

### Task 4 — Mark shipped

Check off V4 in `ROADMAP.md` with the PR link.
