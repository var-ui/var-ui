# `@var-ui/astro` — design

Astro bindings for the var-ui design system: same visual system as
`@var-ui/react`, no React runtime, progressive interactivity.

**Date:** 2026-07-18  
**Status:** Approved  
**Parent:** packaging / multi-framework surface (adjacent to ROADMAP V5)

---

## Goals

- Ship `@var-ui/astro` as a publishable package of Astro components backed by
  `@var-ui/core` recipes.
- Match `@var-ui/react` prop and variant names where an equivalent exists
  (slots replace `children` where Astro needs it).
- Keep the package free of React / React Aria; use plain HTML and TypeScript
  for behavior.
- Prove the stack with `examples/astro-app` (TypeStyles extract, theme, color
  mode, content-kit components).

## Non-goals (v0.1)

- Full parity with every `@var-ui/react` component.
- Zag.js (or other headless machine) adoption — reserved for later interactive
  surfaces (Dialog, Menu, Select, date pickers, etc.).
- React islands or optional `@var-ui/react` peer.
- Vocs docs “Getting started with Astro” page (example app is the playground).
- Framework-agnostic rewrite of `@var-ui/icons` (React `ReactNode` glyphs today);
  Astro components use slots / inline SVG for icons in v0.1.
- A formal Astro integration (`astro:config` plugin) — defer until setup
  friction justifies it.

## Locked decisions

| Topic              | Choice                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| End-state ambition | Full React surface parity, without React                                   |
| Interactivity      | Native HTML / small TS first; Zag.js when a component outgrows that        |
| v0.1 scope         | Docs/content kit (below)                                                   |
| API alignment      | Same prop/variant names as `@var-ui/react`                                 |
| Companions         | Package + `examples/astro-app`                                             |
| Packaging          | Source-shipped `.astro` + `.ts` (Astro publish-to-npm model; no `vp pack`) |
| Icons              | Slots / inline SVG until icons are framework-agnostic                      |

---

## Approaches considered

1. **Source-shipped Astro components (chosen)** — Ship `.astro`/`.ts`; consumer
   Astro + TypeStyles compile them. Matches Astro norms; simplest DX.
2. **Prebuilt dual pipeline** — `vp pack` helpers + ship `.astro`. Extra
   complexity for little gain.
3. **Astro integration package** — Config integration + components. Overkill
   for v0.1; couples setup to the component surface.

---

## Architecture

```
@var-ui/core          recipes, tokens, themes
       ▲
       │ peer
@var-ui/astro         .astro components + TS helpers/scripts
       ▲
       │ workspace
examples/astro-app    Astro + @typestyles/vite playground
```

### Package layout

```
packages/astro/
  package.json
  README.md
  index.ts                 # public barrel
  src/
    utils.ts               # recipeProps / recipeClassName (no React types)
    theme/
      ThemeScript.astro    # FOUC-safe theme class + data-mode
      ColorModeToggle.astro
    components/
      Button.astro
      Alert.astro
      …
    scripts/               # client TS when native HTML is insufficient
      tabs.ts
      colorMode.ts
examples/astro-app/
  …                        # minimal Astro app importing @var-ui/astro
```

### Shipping & peers

- **Publish:** source files listed in `files` / `exports` (no component build
  step). Keywords include `astro-component` and `withastro`.
- **Peers:** `astro`, `@var-ui/core` (required). No `react`,
  `react-aria-components`, or `@var-ui/react`.
- **Optional later:** `@var-ui/icons` once glyphs are not React-only.

### Consumer pattern

```astro
---
import { Button, Alert, ThemeScript } from '@var-ui/astro';
import { defaultTheme } from '@var-ui/core';
---
<html class={defaultTheme.className}>
  <head>
    <ThemeScript themeClass={defaultTheme.className} />
  </head>
  <body>
    <Button intent="primary" size="md">Save</Button>
    <Alert variant="info" title="Heads up">Body via default slot</Alert>
  </body>
</html>
```

Consumers must configure TypeStyles (e.g. `@typestyles/vite`) the same way
Vite/React apps do so recipe CSS is extracted.

### Component pattern

- Frontmatter `Props` mirror React (`intent`, `size`, `variant`, `appearance`,
  …).
- Default slot ≈ `children`; named slots for structured regions (`icon`,
  `title`, etc.) when React used nested nodes.
- Apply recipes via shared `recipeProps()` / `recipeClassName()`.
- Prefer semantic HTML elements that match the React/RAC output where
  practical (`button`, `a`, `ol`/`li`, `details`, …).

---

## v0.1 component kit

### Theme & chrome

| Component         | Notes                                                |
| ----------------- | ---------------------------------------------------- |
| `ThemeScript`     | Inline script from core README (class + `data-mode`) |
| `ColorModeToggle` | Client TS; light / dark / system                     |

### Layout

`Stack`, `HStack`, `VStack`, `Grid`, `Center`, `Section`, `Divider`,
`AspectRatio`

### Content / feedback

`Badge`, `Alert`, `Banner`, `Card`, `EmptyState`, `Kbd`, `Heading`, `Text`,
`Avatar`, `Spinner`, `Skeleton`, `ProgressBar`, `StatusDot`

### Docs / content site

`Button` (native `<button>`; link-styled actions use `Link` — same split as
React), `Link`, `CodeBlock`, `Steps`, `Breadcrumbs`, `Tabs`, `Collapsible`
(`<details>`/`<summary>`), prose helper re-export or thin wrapper around
`proseContent` from core

Exact prop types are copied from the corresponding `@var-ui/react` exports at
implementation time; drift is a bug.

---

## Interactivity ladder

Per component, climb only as far as needed:

1. **Zero JS** — styled markup + recipes.
2. **Native platform** — `<button>`/`<a>`, `<details>`, semantic lists.
3. **Small vanilla TS** — color mode, Tabs selection/keyboard; scripts enhance
   SSR markup.
4. **Zag.js (post–v0.1)** — Dialog, Menu, Select, complex overlays; wrap
   machines in `scripts/`, keep React-aligned props.

### Tabs (v0.1)

- SSR: tab list + panels with correct roles/ids and recipe classes.
- Client: `scripts/tabs.ts` for selection and keyboard.
- Without JS, the first tab’s panel is visible and others are hidden via
  HTML/`hidden` (or equivalent); the script upgrades to full selection +
  keyboard. Document this in the package README.

---

## Example app

`examples/astro-app` (`@var-ui/example-astro-app`):

- Astro app with `@typestyles/vite`, workspace `@var-ui/core` + `@var-ui/astro`.
- Pages that exercise the v0.1 kit and theme / color-mode switching.
- Scripts: `dev`, `build`, `check` (`astro check`).
- No React dependency.

---

## Testing & validation

- Vitest unit tests for pure TS (`utils`, tabs/color-mode controllers).
- `examples/astro-app`: `astro check` + `astro build` as the integration gate.
- No separate visual theme matrix in v0.1 (core recipes already covered in
  React/example surfaces).

---

## Monorepo wiring

- `packages/astro` under existing `packages/*` workspace glob.
- Root README packages table: add `@var-ui/astro`.
- Root `build` / `ready`: do not `vp pack` astro; optionally gate on example
  `astro check` / `astro build`.
- Changesets: include `@var-ui/astro` when publishing.
- ROADMAP: note Astro package (content-kit first; Zag phase later) under Future
  or adjacent to V5 packaging.

---

## Success criteria (v0.1)

1. A clean Astro app can import the kit from `@var-ui/astro` with **no React**.
2. Theme class + color mode work without FOUC (`ThemeScript`).
3. Shipped components use the same prop/variant names as React counterparts.
4. `examples/astro-app` builds successfully in the validation path.

---

## Follow-ups (explicitly later)

- Broad presentational parity (remaining non-interactive React counterparts).
- Zag.js for overlays / menus / selects / date controls.
- Framework-agnostic icons (or Astro-specific icon package).
- Optional Astro integration for one-line TypeStyles + theme setup.
- Vocs/docs page for Astro getting started.
- Full surface parity checklist vs `@var-ui/react` exports.
