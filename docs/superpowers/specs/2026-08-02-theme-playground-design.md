# Theme Playground — docs site theme editor

**Date:** 2026-08-02  
**Status:** Approved  
**Goal:** Ship exploration first, grow into full theme authoring with live preview and code export.

## Summary

Add a `/theming/playground` page to the docs site: a split-panel editor where users pick
from pre-built showcase themes, preview components live via `BentoShowcase`, and export
theme code. Phase 1 is preset exploration; Phase 2 adds token editing with CSS variable
overrides and `createDesignTheme()` code generation.

Mirrors the Button component playground pattern (`ComponentConfigurator`) and the homepage
theme switcher (`ThemeShowcaseSwitcher` + `BentoShowcase`).

## Decisions

| Topic             | Decision                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| Primary goal      | Both exploration + authoring (phased)                                            |
| Preview (v1)      | Reuse `BentoShowcase` (homepage tiles)                                           |
| Theme application | Hybrid: preset `className` + CSS var overrides on preview root                   |
| Layout            | Controls sidebar left, preview right (matches reference screenshot)              |
| Color mode        | Sync with site `ColorModeToggle` via `theme-mode` storage + `data-mode` observer |
| Code export (v1)  | Static preset import / minimal `createDesignTheme({ from })` stub                |
| Code export (v2)  | Full `generateThemeCode()` from accumulated token patches                        |
| Page width        | Full-width layout (like Colors page)                                             |
| Delivery          | 2 PRs: (1) v1 exploration shell, (2) v2 token editors + export                   |

## Architecture

### Page route

- **MDX:** `docs/content/theming/playground.mdx`
- **Astro:** existing `docs/src/pages/theming/[slug].astro` — add `playground` slug handling for full-width layout
- **Nav:** add "Playground" to `themingSidebarSections` in `docs/src/data/navigation.ts`

### React island

```
docs/src/components/theme-playground/
  ThemePlayground.tsx           # Main island (client:load)
  ThemePlaygroundProvider.tsx   # State + color mode sync
  ThemePresetPicker.tsx         # Adapted from ThemeShowcaseSwitcher
  ThemePreview.tsx              # Wraps BentoShowcase with theme class + CSS overrides
  ThemePlaygroundControls.tsx   # v1: presets + viewport; v2: token editors
  generateThemeCode.ts          # State → TypeScript (v1 stub, v2 full)
  themePlaygroundState.ts       # Shared state types + defaults
docs/src/styles/themePlayground.ts
docs/src/components/ThemePlayground.astro  # Astro wrapper (like ButtonConfigurator.astro)
```

### State model

```ts
type ThemePlaygroundState = {
  presetId: ShowcaseThemeId;
  viewport: 'desktop' | 'mobile';
  // v2:
  tokenOverrides: Record<string, string>; // cssVar → value
  colorModePatches?: Partial<DesignColorValues>; // for export only
};
```

### Data flow

1. User selects preset → `SHOWCASE_THEMES[presetId].className` applied to preview root
2. User edits token (v2) → CSS custom property set on preview root inline style
3. Color mode → inherited from `DesignSystemProvider` synced with site header toggle
4. Export → `generateThemeCode(state)` → `HighlightedCodeBlock`

### Provider stack

Same as `HomepageIsland`:

```tsx
<DesignSystemProvider colorMode={colorMode} storageKey="theme-mode" ...>
  <IconProvider icons={defaultIcons}>
    <LayerProvider>
      <ThemePlayground />
    </LayerProvider>
  </IconProvider>
</DesignSystemProvider>
```

`BentoShowcase` receives `themeId` from state. Theme class is applied on the showcase
container (existing pattern). `colorScheme: inherit` preserved so site dark mode drives
preview.

## Phase 1 — Exploration (v1)

### UI

```
┌─────────────────────────────────────────────────────────────┐
│  Theme Playground                              [Export]     │
├──────────────┬──────────────────────────────────────────────┤
│  Presets     │  BentoShowcase                               │
│  (swatches)  │                                              │
│              │  [Desktop | Mobile]                          │
├──────────────┴──────────────────────────────────────────────┤
│  Generated code (preset import)                             │
└─────────────────────────────────────────────────────────────┘
```

### Controls (v1)

| Control             | Behavior                                                     |
| ------------------- | ------------------------------------------------------------ |
| Theme preset picker | Radio swatch grid from `SHOWCASE_THEMES` (8 themes)          |
| Viewport toggle     | `desktop` = full width; `mobile` = max-width ~390px centered |
| Export button       | Copies generated code to clipboard                           |

### Code export (v1)

```ts
// generateThemeCode.ts — v1 output example
import { forestTheme } from '@/themes/forest';

export default forestTheme;
// or:
import { createDesignTheme } from '@var-ui/core';
import { forestPreset } from '@/themes/forest';

export const myTheme = createDesignTheme({
  name: 'my-theme',
  from: forestPreset,
});
```

### Layout styles

New `themePlayground.ts` typestyles recipe. Structure mirrors `configurator.ts` but
controls column on the **left** (`gridTemplateColumns: '15rem 1fr'`). Full-width page
container max ~90rem.

### Astro integration

`playground.mdx`:

```mdx
---
title: Playground
description: Explore and customize var-ui themes with live preview.
---

# Theme Playground

Pick a preset theme and preview how var-ui components respond.

<ThemePlayground />
```

`[slug].astro` update:

```ts
const isFullWidth = slug === 'colors' || slug === 'playground';
```

### Tests

| File                        | Coverage                                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| `generateThemeCode.test.ts` | v1 preset import output for each showcase theme                             |
| `ThemePlayground.test.tsx`  | Preset selection updates preview class; viewport toggle applies width class |

Reuse patterns from `buttonCode.test.ts` and `HomepageIsland.test.tsx`.

## Phase 2 — Authoring (v2)

### New sidebar tabs

| Tab             | Controls                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| **Base Styles** | Semantic color editors (accent, neutral, card, surface, body, muted, text primary) |
| **Components**  | Deferred — link to Customize docs + component override snippets                    |
| **Advanced**    | Deferred — `extend` namespaces, shadow/radius tokens                               |

### Base Styles controls

Each color row: swatch preview + hex input. Edits apply as CSS variables on preview root:

```ts
'--var-ui-color-accent-default': '#3b82f6'
```

Token list sourced from `getSemanticSwatches()` in `docs/src/lib/color-tokens.ts`
(filtered to high-impact semantic groups).

### Typography (v2, same tab or sub-section)

| Control              | Maps to                          |
| -------------------- | -------------------------------- |
| Heading font select  | `tokens.fontFamily.heading`      |
| Body font select     | `tokens.fontFamily.body`         |
| Type scale select    | ratio presets → `fontSize` scale |
| Base size (S/M/L/XL) | `tokens.fontSize.md`             |

### Spacing preset (v2)

Segmented control: Compact / Default / Comfortable / Gigantic → patches `space` token scale.

### Code export (v2)

Full `createDesignTheme()` output with only changed tokens:

```ts
export const myTheme = createDesignTheme({
  name: 'my-theme',
  from: forestPreset,
  tokens: {
    color: {
      accent: { default: '#3b82f6' },
    },
    fontSize: { md: '14px' },
  },
});
```

Only include namespaces with actual overrides (omit unchanged defaults).

## Phase 3 — Polish (v3+, out of initial scope)

- URL serialization (`?preset=forest&accent=3b82f6`)
- Import/export JSON theme config
- Components tab with per-recipe override editor
- Advanced tab for `extend` and mode-conditional overrides
- Alternative preview templates (full-page e-commerce, dashboard)

## File changes (v1)

| Action | Path                                                              |
| ------ | ----------------------------------------------------------------- |
| Add    | `docs/content/theming/playground.mdx`                             |
| Add    | `docs/src/components/theme-playground/*`                          |
| Add    | `docs/src/components/ThemePlayground.astro`                       |
| Add    | `docs/src/styles/themePlayground.ts`                              |
| Edit   | `docs/src/data/navigation.ts` — sidebar entry                     |
| Edit   | `docs/src/pages/theming/[slug].astro` — full-width for playground |
| Edit   | `docs/typestyles-entry.ts` — register `themePlayground` styles    |

## Non-goals (v1)

- Runtime `createDesignTheme()` recompilation in the browser
- Editing component-level `components` overrides in UI
- Font file upload / custom `@font-face` registration
- Sitewide docs chrome theme switching (preview is scoped only)

## Risks and mitigations

| Risk                                               | Mitigation                                               |
| -------------------------------------------------- | -------------------------------------------------------- |
| BentoShowcase bundle size on playground page       | Already shipped on homepage; same island                 |
| CSS var overrides don't match exported token paths | v2 export reads same override map used for preview       |
| Color mode mismatch between preview and export     | Single `DesignSystemProvider` + site sync pattern        |
| Duplicate theme switcher logic                     | Share `SHOWCASE_THEMES` + picker component with homepage |

## Success criteria

### v1

- [ ] `/theming/playground` loads with full-width layout
- [ ] All 8 showcase themes selectable with live BentoShowcase preview
- [ ] Desktop/mobile viewport toggle works
- [ ] Export copies valid TypeScript import to clipboard
- [ ] Color mode matches site header toggle
- [ ] Tests pass (`vp test`)

### v2

- [ ] Semantic color edits reflect instantly in preview
- [ ] Export generates accurate `createDesignTheme()` with only overrides
- [ ] Typography and spacing controls work with preview + export parity
