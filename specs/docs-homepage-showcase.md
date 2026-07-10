# Docs homepage: theme-switchable component showcase

## Problem

The docs site homepage (`docs/src/routes/index.tsx`) currently opens with a
title, a paragraph, and a single `<Button>` demo before dropping into the
component catalog table. It doesn't communicate what var-ui actually looks
like or how dramatically it can be re-themed — the thing that most
differentiates it from other component libraries (8 built-in themes ranging
from a neutral default to Windows 95 and AI Glow, not just light/dark).

This is a docs-site-only feature: a fuller live showcase near the top of the
homepage, with a switcher above it that re-themes the showcase across all 8
built-in themes.

**Relationship to `specs/theme-gallery.md` (ROADMAP V5):** that spec plans a
separate, small theme-comparison page (one card + one button per theme,
light/dark shown side by side) for a future, not-yet-started `var-ui.com`
marketing site. This is different in both location (docs site, not
var-ui.com) and shape (one broad live showcase re-themed in place, not a
per-theme sample grid). The two are being kept fully separate — this doc
doesn't change V5's scope or plans.

## Design

### Layout changes to the homepage

`docs/src/routes/index.tsx` keeps its `<h1>`/tagline, drops the standalone
`IndexButtonDemo`, and gains two new pieces directly below the intro
paragraph:

1. `ThemeShowcaseSwitcher` — a row of theme pills.
2. `BentoShowcase` — the live, re-themeable component grid.

The existing "Explore" links and `ComponentIndex` catalog stay unchanged
below it.

### Theme switcher

`ThemeShowcaseSwitcher` holds `selectedThemeId` state, defaulting to
`'default'` on every load (no persistence — avoids SSR/hydration mismatch).
One pill per theme, sourced directly from `@var-ui/core`'s
`designPaletteList`/`designStyleList` theme set (the same 8 underlying theme
objects: `default`, `forest`, `rose`, `amber`, `ai-glow`, `new-wave`,
`windows-95`, `classic-system` — these are two label sets over one set of
themes, not a combinable matrix; see `theme-gallery.md`). Display labels:
Default, Forest, Rose, Amber, AI Glow, New Wave, Windows 95, Classic System.

Light/dark mode is **not** part of this switcher — it's already handled by
the existing global `ThemeToggleIcon` in the docs header
(`docs/src/components/DocsHeaderActions.tsx`), which controls
`useDesignSystemTheme()`'s `theme`/`data-mode` for the whole site. The bento
showcase reads that same global mode and combines it with whichever named
theme is locally selected, so flipping the header's light/dark toggle also
flips the showcase, whatever theme is active there.

### Bento showcase

`BentoShowcase` renders a container div with:

- `className={selectedTheme.className}` (the chosen named theme's class)
- `data-mode={mode}` (from the existing global light/dark context)

Inside it, a responsive CSS grid (new `docs/src/styles/homeBento.ts`
typestyles module, registered in `docs/typestyles-entry.ts` exactly like
`docsShell` is today, so its CSS is captured by the existing build-time
extraction and doesn't FOUC): 4 columns on desktop with tiles spanning 1–2
columns/rows in a bento pattern, collapsing to a single column on narrow
viewports.

**Overlay portal scoping:** `Dialog` and `Select` render their modal/dropdown
into a portal at `document.body` by default, which would visually sit outside
the chosen theme (and show the page's ambient theme instead) once a
non-default theme is selected. `BentoShowcase` takes a ref to its container
and uses react-aria-components' portal-container API to point overlay
portals (Modal/Popover/Tooltip) at a node inside that themed container
instead of `document.body`. The exact current API shape (a context provider
vs. a per-component prop) isn't used anywhere else in this codebase yet and
needs confirming against the installed `react-aria-components` version
during implementation — call this out explicitly as the one open
implementation-time verification in this design.

### Tiles

One small, self-contained file per tile under
`docs/src/components/homepage/bentoTiles/`, composed into the grid by
`BentoShowcase`. Each is a plausible small UI moment, not a fabricated shared
product — no invented brand or cross-tile narrative.

| Tile                       | Components exercised                                       | Scenario                                                         |
| -------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Quick actions              | Button, TextField, Select, Field                           | Small form with a button row                                     |
| Status & feedback          | Alert, Badge, ProgressBar, Spinner, Divider                | Status panel                                                     |
| Settings form              | Field, Switch, Checkbox, RadioGroup, Button                | Preferences form                                                 |
| Empty state → dialog       | EmptyState, Dialog                                         | Empty list whose action opens a modal (exercises portal scoping) |
| Content sample             | Heading, Text, Timestamp, CodeBlock, Link                  | Small doc/article excerpt                                        |
| Identity & cards           | Card, ClickableCard, Avatar, AvatarGroup, Thumbnail, Badge | Team/file list                                                   |
| Carousel strip (wide tile) | Carousel, Card, AspectRatio                                | Horizontal scroll strip                                          |
| Layout tabs                | Section, Tabs, Grid, Stack, Center                         | Tabbed panel switching layouts                                   |
| Banner (full-width tile)   | Banner, Button                                             | Bottom CTA strip                                                 |

Together these cover effectively all exported components in
`docs/src/data/components.ts`'s registry, without claiming to be an
exhaustive per-component audit (that's what the individual `/components/*`
pages are for).

### File map

| File                                                     | Responsibility                                                 |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| `docs/src/routes/index.tsx`                              | Insert switcher + showcase below intro; drop `IndexButtonDemo` |
| `docs/src/components/homepage/ThemeShowcaseSwitcher.tsx` | Theme-pill row, selection state                                |
| `docs/src/components/homepage/BentoShowcase.tsx`         | Themed container, portal scoping, grid composition             |
| `docs/src/components/homepage/bentoTiles/*.tsx`          | One file per tile (9 files, see table above)                   |
| `docs/src/styles/homeBento.ts`                           | Grid + pill layout (typestyles)                                |
| `docs/typestyles-entry.ts`                               | Add side-effect import of `homeBento`                          |

## Testing

- Component-level render tests for `ThemeShowcaseSwitcher` (selecting a pill
  updates the showcase container's class) and `BentoShowcase` (renders all 9
  tiles; container reflects selected theme + global mode).
- A test asserting the switcher's theme list has exactly the 8 real themes
  from `@var-ui/core`'s `themes/index.ts` (same intent as the equivalent test
  called for in `theme-gallery.md`) — so a 9th theme added later doesn't
  silently go unlisted here either.
- Manual verification (per this repo's `verify` skill): load the homepage,
  cycle through all 8 theme pills, toggle the header's light/dark switch at
  a couple of theme selections, open the Dialog and Select tiles at a
  non-default theme to confirm overlay portal scoping actually works.

## Explicitly out of scope

- Any change to `specs/theme-gallery.md` / ROADMAP V5's planned var-ui.com
  gallery page — fully separate effort, untouched by this.
- Persisting the selected showcase theme across reloads.
- A literal per-component audit (all components × 8 themes individually
  browsable) — the bento tiles are a curated, illustrative sample, not
  exhaustive coverage tracking.
- Combining palette/style labelings into a combinable matrix — same reasoning
  as `theme-gallery.md`.
