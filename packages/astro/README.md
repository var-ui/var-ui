# @var-ui/astro

Astro components for the var-ui design system.

## ThemeScript

Add `ThemeScript` in `<head>` before styles to avoid a flash of unstyled content when restoring color mode from `localStorage`:

```astro
---
import ThemeScript from '@var-ui/astro/ThemeScript';
// or: import { ThemeScript } from '@var-ui/astro';
import { defaultTheme } from '@var-ui/core';
---
<html>
  <head>
    <ThemeScript themeClass={defaultTheme.className} />
  </head>
  <body>...</body>
</html>
```

Props:

- `themeClass` (required) — theme class from `@var-ui/core` (e.g. `defaultTheme.className`)
- `storageKey` (optional) — `localStorage` key; defaults to `'theme-mode'`

The inline boot script matches the Astro snippet in `@var-ui/core` README: it reads stored mode, falls back to `prefers-color-scheme`, adds the theme class, and sets or clears `data-mode` on `<html>`.

## ColorModeToggle

Self-contained segmented control for light/dark (and optionally system) mode. No React context required.

```astro
---
import ColorModeToggle from '@var-ui/astro/ColorModeToggle';
// or: import { ColorModeToggle } from '@var-ui/astro';
---
<ColorModeToggle />
<ColorModeToggle includeSystem appearance="labels" size="sm" />
```

Props match the React `ColorModeToggle`: `includeSystem`, `appearance` (`'icons' | 'labels' | 'iconsAndLabels'`), `size`, `className`, `aria-label`, and optional `storageKey` (default `'theme-mode'`).

Use the same `storageKey` on `ThemeScript` and `ColorModeToggle` so boot and toggle stay in sync.

## Utilities

```ts
import { recipeProps, recipeClassName, cx } from '@var-ui/astro';
```

See `@var-ui/core` for theme tokens and component recipes used by Astro components.

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

v0.1 omits controlled `isExpanded` / `onExpandedChange` and `CollapsibleGroup`; use multiple standalone `Collapsible` instances or add client-side state in your app if you need accordion behavior.
