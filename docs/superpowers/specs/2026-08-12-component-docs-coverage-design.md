# Component Docs Coverage Design

**Date:** 2026-08-12  
**Status:** Approved for implementation

## Goal

Every public Var UI **component family** has a documentation page. New pages ship **lean** (intro + one default demo + props table). Maintain an explicit inventory of lean pages until they are upgraded to full parity.

## Decisions

| Decision               | Choice                                                                 |
| ---------------------- | ---------------------------------------------------------------------- |
| Page granularity       | One page per primary component family; related APIs live on that page  |
| Depth for new pages    | Lean: description, one default `<Demo>`, `<PropsTable>`                |
| Missing Astro bindings | React-only demos are allowed; Astro/HTML optional until bindings exist |
| Tracking               | `docs/content/components/LEAN.md` lists every lean slug                |

## Out of scope

- Full multi-example / accessibility polish (tracked via LEAN.md)
- New Astro component bindings
- Internal-only exports (`ChatListContext`, `ChatMessageContext`, `APP_SHELL_MAIN_ID`)
- Hooks and non-component providers as first-class docs pages

## Family rule

One registry slug / MDX page per primary export. Document compound pieces on the same page:

- `Chip` already covers `ChipGroup` / `Pill`
- `Stack` covers `HStack` / `VStack`
- `Layout` / `LayoutPanel` already split as today
- New: `DropdownMenu` + `MenuContent`; `SideNav` + section/item helpers; `Table` + row/cell parts; `InputGroup` + `InputGroupInput` / `InputGroupText`; `ColorPicker` + `ColorSwatch`; `Toc` + `TocItem`; etc.

## New lean pages

### Action

- icon-button
- button-group
- copy-button
- toggle-button
- segmented-control
- color-mode-toggle
- dropdown-menu
- context-menu
- more-menu
- toolbar

### Data input

- number-input
- password-input
- search-input
- file-input
- input-group (includes InputGroupInput, InputGroupText)
- checkbox-group
- calendar
- date-input
- date-range-input
- date-time-input
- time-input
- tokenizer
- multi-selector
- color-input
- color-picker (includes ColorSwatch)

### Feedback

- skeleton
- status-dot
- loading-overlay
- steps

### Overlay

- alert-dialog
- drawer
- tooltip
- popover
- hover-card
- command-palette

### Layout / nav

- app-shell
- simple-grid
- scroll-area
- overflow-list
- resize-handle
- breadcrumbs
- pagination
- toc
- side-nav
- top-nav
- top-nav-mega-menu
- mobile-nav
- tab-list

### Content / data

- kbd
- list
- description-list
- outline
- table
- tree
- file-tree

## Lean MDX template

```mdx
---
title: Drawer
description: Slide-over panel for secondary flows.
---

# Drawer

Slide-over panel for secondary flows.

## Examples

### Default

<Demo id="drawer.default" />

## Props

<PropsTable slug="drawer" />
```

No Accessibility section required for lean pages. Related family members may be mentioned in the intro paragraph.

## Lean manifest

File: `docs/content/components/LEAN.md`

- Checklist of every lean slug (all new pages above at ship time)
- Remove a slug when the page reaches full parity (multiple examples + accessibility notes, matching existing rich pages like Button)
- Existing pages that already match lean shape may be added optionally; this project focuses on newly created pages

## Demo wiring

For each new slug `foo`:

1. `docs/src/demos/foo/default/react.tsx` — minimal working preview
2. `docs/src/demos/foo/default/snippets.ts` — at least a React snippet; Astro/HTML when bindings or HTML recipes exist
3. Register `foo.default` in `DemoId`, `DEMO_IDS`, `demoSnippets`, `reactDemoLoaders` / `reactDemoMap`
4. When Astro binding exists: `astro.astro` + `astroDemoMap` + Astro snippet
5. When HTML recipe demo is practical: `html.ts` + `htmlDemoMap` + HTML snippet
6. React-only: completeness gate must allow missing Astro/HTML maps (update `completeness.test.ts` and map typing as needed). DemoHost already tolerates missing Astro/HTML previews.

## Registry / navigation

- Add one `ComponentEntry` per family in `docs/src/data/components.ts`
- Sidebar and search index consume the registry automatically
- Props extraction continues to resolve `NameProps` from React sources via existing slug → component name mapping

## Success criteria

1. Every in-scope family has registry entry + MDX + at least one React demo
2. `LEAN.md` lists all lean slugs created by this work
3. Docs demo completeness tests pass with React-only support
4. Existing documented pages remain green under docs tests / `vp check` where applicable

## Non-goals for demos

- Interactive playgrounds
- Exhaustive variant matrices
- Pixel-perfect composition showcases
