# Docs site: light / dark / system color mode switcher

## Problem

The docs site header has a `ThemeToggleIcon` that only toggles between light
and dark, holds no persisted preference (resets to light on every reload),
and has no FOUC protection — since the docs site is SSR'd (TanStack Start),
the server always renders light, and any client-side correction happens
after hydration, producing a visible flash on repeat visits or when the
visitor's OS is in dark mode.

This spec adds a three-way light/dark/system switcher to the header, backed
by `localStorage`, with zero-flash first paint.

## Design

### Shared library: `packages/react/src/color-mode.tsx` + `DesignSystemProvider.tsx`

- `ColorMode` widens from `'light' | 'dark'` to `'light' | 'dark' | 'system'`.
- `useColorMode()` returns `{ colorMode, resolvedColorMode, setColorMode, toggleColorMode }`:
  - `colorMode` — the raw preference, including `'system'`.
  - `resolvedColorMode: 'light' | 'dark'` — what `'system'` currently resolves
    to. Tracked via a `matchMedia('(prefers-color-scheme: dark)')`
    listener so it updates live if the OS preference changes while the tab
    is open.
  - `toggleColorMode` cycles `light → dark → system → light`, kept for
    back-compat. The docs switcher does not use it — each of its three
    buttons calls `setColorMode` directly.
- New optional `DesignSystemProviderProps.storageKey?: string`. When set,
  and the provider is uncontrolled (no `colorMode` prop passed in), the
  provider:
  - reads `localStorage[storageKey]` on mount as the initial color mode
    (falling back to `defaultColorMode` if unset or invalid),
  - writes to `localStorage[storageKey]` on every `setColorMode` call.
  - Opt-in only — omitting `storageKey` leaves existing consumers'
    behavior unchanged.
- `data-mode` is written as the literal preference value, including
  `data-mode="system"`. This requires no new CSS: `createDesignTheme`'s
  existing `systemWithLightDarkOverride` pattern
  (`packages/core/src/create-theme.ts`) already generates a bare
  `@media (prefers-color-scheme: dark)` rule with no attribute condition,
  plus separate `[data-mode="dark"]` and
  `@media (prefers-color-scheme: dark) AND [data-mode="light"]` override
  rules. `data-mode="system"` matches neither override rule, so the plain
  media-query rule governs — exactly the desired system behavior.
- When `applyToDocument` is `true` (the docs case), the provider
  no longer has a wrapper `div` to carry `data-mode`. It instead gains a
  `useEffect` that imperatively sets `document.documentElement`'s
  `data-mode` attribute and `style.colorScheme` (`'light'`, `'dark'`, or
  cleared for `'system'`, letting the static `color-scheme: light dark` in
  `root.css` govern) on every `colorMode`/`resolvedColorMode` change.
- New exported `getColorModeInitScript({ storageKey, defaultColorMode })` returns a
  plain JS string (no React, no imports) implementing the identical
  resolution logic used by the provider's mount effect: read
  `localStorage[storageKey]`, fall back to `defaultColorMode`, resolve
  `'system'` via `matchMedia`, then set `document.documentElement`'s
  `data-mode` and `style.colorScheme`. Both the provider and this function
  call one shared internal resolver so they cannot drift apart.

### FOUC prevention: docs wiring

- `docs/src/routes/__root.tsx`'s `RootDocument` renders
  `<script dangerouslySetInnerHTML={{ __html: getColorModeInitScript({ storageKey: 'var-ui-docs-color-mode', defaultColorMode: 'system' }) }} />`
  as the **first child of `<head>`**, before `<HeadContent />`. Being
  inline and early, it runs synchronously while `<html>` is still being
  parsed — before first paint — so the correct `data-mode`/`color-scheme`
  is already on the DOM before React hydrates.
- Because JSX never renders `data-mode` on the `<html>` element itself
  (it's set imperatively by the bootstrap script and, post-hydration, by
  the provider's effect), there is nothing for React to reconcile a
  mismatch against — no hydration warnings.
- `docs/src/layouts/DocsProviders.tsx` passes
  `storageKey="var-ui-docs-color-mode"`, `defaultColorMode="system"`, and
  `applyToDocument` to `DesignSystemProvider` (the last of these
  previously unused in docs), so the provider manages `<html>`'s
  `data-mode` instead of a wrapper `div`, matching what the bootstrap
  script targets.
- `docs/src/styles/root.css`'s existing `:root { color-scheme: light dark }`
  remains as the static fallback covering system mode and any
  pre-hydration edge case.
- First-time visitors (nothing in `localStorage` yet) default to
  `'system'` — the site follows the OS preference until the visitor makes
  an explicit choice.

### Header switcher UI

- `docs/src/components/ThemeToggleIcon.tsx` is replaced by
  `docs/src/components/ColorModeSwitcher.tsx`: a segmented group of three
  `HeaderIconButton`s (Sun / Moon / Monitor), each calling
  `setColorMode('light' | 'dark' | 'system')` directly. The button matching
  the current `colorMode` (the raw preference, not `resolvedColorMode`) gets
  `aria-pressed="true"` and an active style.
- `docsShell.ts` gains a small active-state style for the segmented group,
  extending the existing `headerIconButton`, plus a shared
  background/border wrapper so the three buttons read as one control
  (mirroring the existing `headerNavLink`/`headerNavLinkActive` pattern
  used for the top nav).
- `docs/src/components/DocsHeaderActions.tsx` swaps `<ThemeToggleIcon />`
  for `<ColorModeSwitcher />`.
- `docs/src/components/homepage/BentoShowcase.tsx` keeps using
  `useColorMode().colorMode` for its own `data-mode` (now potentially
  `'system'`) — correct per the CSS fallback behavior above, no logic
  change needed beyond the widened type.

## Files touched

- `packages/react/src/color-mode.tsx` — `ColorMode`, `storageKey` helpers,
  `resolvedColorMode`, `getColorModeInitScript`.
- `packages/react/src/DesignSystemProvider.tsx` — provider + `applyToDocument` sync
  effect.
- `packages/core/src/create-theme.test.ts` — add a test confirming
  `data-mode="system"` falls through to the plain media-query rule (no
  change expected in `create-theme.ts` itself).
- `docs/src/routes/__root.tsx` — inline bootstrap script.
- `docs/src/layouts/DocsProviders.tsx` — `storageKey`,
  `defaultColorMode="system"`, `applyToDocument`.
- `docs/src/components/ColorModeSwitcher.tsx` — new, replaces
  `ThemeToggleIcon.tsx`.
- `docs/src/components/DocsHeaderActions.tsx`
- `docs/src/styles/docsShell.ts`
- `docs/src/components/homepage/BentoShowcase.tsx` and
  `BentoShowcase.test.tsx` — type widening, assert the `'system'` case.

## Testing

- Unit tests for `getColorModeInitScript`'s resolution logic: stored light,
  stored dark, stored system, missing key (defaults to system), invalid
  value, `matchMedia` mocked both ways.
- Unit tests for the provider's `resolvedColorMode` tracking, including a
  simulated `matchMedia` `change` event while `colorMode === 'system'`.
- A docs-level test that `ColorModeSwitcher` writes the clicked preference
  to `localStorage` and updates `document.documentElement`'s `data-mode`.
- Existing `BentoShowcase.test.tsx` gains a `'system'` case alongside its
  current `'light'` assertion.
