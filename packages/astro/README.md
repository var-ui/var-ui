# @var-ui/astro

Astro components for the var-ui design system — same visual system as
`@var-ui/react`, **no React runtime**. Components ship as source `.astro` and
`.ts` files; your Astro app compiles them with TypeStyles.

See the full design spec:
[`docs/superpowers/specs/2026-07-18-var-ui-astro-design.md`](../../docs/superpowers/specs/2026-07-18-var-ui-astro-design.md).

## Install

```bash
pnpm add @var-ui/astro @var-ui/core astro
```

**Peer dependencies:** `astro`, `@var-ui/core`. No `react`, `react-aria-components`,
or `@var-ui/react`.

## TypeStyles setup

Recipe CSS must be extracted at build time with
[`@typestyles/vite`](https://github.com/type-styles/typestyles). Add a side-effect
entry that imports `@var-ui/core`, then point the plugin at it:

```ts
// typestyles-entry.ts
import '@var-ui/core';
```

```js
// astro.config.mjs
import typestylesVite from '@typestyles/vite';

export default defineConfig({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
  },
});
```

Link the generated stylesheet in your layout (path depends on your build output):

```astro
<link rel="stylesheet" href="/typestyles.css" />
```

See [`examples/astro-app`](../../examples/astro-app) for a working workspace setup.

## ThemeScript

Add `ThemeScript` in `<head>` before styles to avoid a flash of unstyled content
when restoring color mode from `localStorage`:

```astro
---
import ThemeScript from '@var-ui/astro/ThemeScript';
// or: import { ThemeScript } from '@var-ui/astro';
import { defaultTheme } from '@var-ui/core';
---
<html class={defaultTheme.className}>
  <head>
    <ThemeScript themeClass={defaultTheme.className} />
  </head>
  <body>...</body>
</html>
```

Props:

- `themeClass` (required) — theme class from `@var-ui/core` (e.g. `defaultTheme.className`)
- `storageKey` (optional) — `localStorage` key; defaults to `'theme-mode'`

The inline boot script matches the Astro snippet in `@var-ui/core` README: it reads
stored mode, falls back to `prefers-color-scheme`, adds the theme class, and sets or
clears `data-mode` on `<html>`.

## ColorModeToggle

Self-contained segmented control for light/dark (and optionally system) mode. No React
context required.

```astro
---
import ColorModeToggle from '@var-ui/astro/ColorModeToggle';
// or: import { ColorModeToggle } from '@var-ui/astro';
---
<ColorModeToggle />
<ColorModeToggle includeSystem appearance="labels" size="sm" />
```

Props match the React `ColorModeToggle`: `includeSystem`, `appearance`
(`'icons' | 'labels' | 'iconsAndLabels'`), `size`, `className`, `aria-label`, and
optional `storageKey` (default `'theme-mode'`).

Use the same `storageKey` on `ThemeScript` and `ColorModeToggle` so boot and toggle
stay in sync.

## Components

Import from the package barrel:

```astro
---
import { Button, Alert, Stack, Tabs } from '@var-ui/astro';
---
```

v0.1 ships a docs/content kit: layout primitives, feedback atoms, and content-site
components (`Button`, `Link`, `CodeBlock`, `Steps`, `Breadcrumbs`, `Tabs`,
`Collapsible`, …). Prop and variant names match `@var-ui/react` where an equivalent
exists; use **named slots** instead of React `children` for structured regions.

## Tabs

Tabbed panels with a small vanilla controller for click and keyboard selection
(ArrowLeft/Right, Home/End). No React Aria.

The first tab panel is visible without JavaScript via the native `hidden` attribute;
other panels start hidden.

```astro
---
import { Tabs } from '@var-ui/astro';
---
<Tabs tabs={[{ id: 'overview', label: 'Overview' }, { id: 'api', label: 'API' }]}>
  <Fragment slot="overview">
    <p>Overview content</p>
  </Fragment>
  <Fragment slot="api">
    <p>API reference</p>
  </Fragment>
</Tabs>
```

Props:

- `tabs` (required) — `{ id: string; label: string }[]`
- `defaultSelectedId` (optional) — tab `id` selected on load; defaults to the first tab
- `className` (optional)

Panel content uses **named slots** matching each tab `id` (e.g. `slot="overview"`).
Pass `defaultSelectedId` to change which panel is shown before the client script runs.

## Collapsible

Expand/collapse panel built on native `<details>` / `<summary>` (no React Aria).

```astro
---
import { Collapsible } from '@var-ui/astro';
---
<Collapsible title="Show code" defaultExpanded={false}>
  <pre>…</pre>
</Collapsible>
```

v0.1 omits controlled `isExpanded` / `onExpandedChange` and `CollapsibleGroup`; use
multiple standalone `Collapsible` instances or add client-side state in your app if you
need accordion behavior.

## Interactivity ladder

Components climb only as far as needed — no React, no React Aria:

1. **Zero JS** — styled markup + recipes.
2. **Native platform** — `<button>`/`<a>`, `<details>`, semantic lists.
3. **Small vanilla TS** — color mode, Tabs selection/keyboard; scripts enhance SSR
   markup.
4. **Zag.js (post–v0.1)** — Dialog, Menu, Select, complex overlays.

## Utilities

```ts
import { recipeProps, recipeClassName, cx } from '@var-ui/astro';
```

See `@var-ui/core` for theme tokens and component recipes used by Astro components.
