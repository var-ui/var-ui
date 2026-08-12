# Lean Docs Paydown — Batch A (Actions + Overlays)

**Date:** 2026-08-12  
**Status:** Approved  
**Parent:** `2026-08-12-component-docs-coverage-design.md`

## Goal

Upgrade lean **action** and **overlay** docs pages from single-demo stubs to Select-floor / Button-ceiling quality, removing each slug from `docs/content/components/LEAN.md` as it ships.

## Quality bar

Every upgraded page must include:

1. Intro naming the primary API and related family pieces
2. `## Examples` with explained demos — **at least two** unless the API is truly tiny (still prefer a second usage note)
3. `## Props` / `<PropsTable>`
4. `## Accessibility` with **component-specific** notes (not only a generic RAC line)
5. `## HTML` when a core recipe and/or Astro binding exists; omit for React-only families
6. New demos wired into `DemoId`, `registry`, and demo maps; React-only demos stay in `REACT_ONLY_DEMO_IDS`
7. Slug removed from `LEAN.md`

Depth is **best-effort by API richness** (option C), with a floor of Select-level (default + one secondary example + props + a11y).

## Scope — Batch A only

### Wave 1 — Actions

| Slug              | Example themes                |
| ----------------- | ----------------------------- |
| icon-button       | default; intents/sizes        |
| button-group      | default; attached variants    |
| copy-button       | default; custom copied label  |
| toggle-button     | default; selected/pressed     |
| segmented-control | default; controlled selection |
| color-mode-toggle | default; appearance variants  |
| toolbar           | default; with grouped actions |

### Wave 2 — Menus

| Slug          | Example themes                                |
| ------------- | --------------------------------------------- |
| dropdown-menu | default; sections/destructive (`MenuContent`) |
| context-menu  | default; on a target surface                  |
| more-menu     | default; overflow item set                    |

### Wave 3 — Overlays

| Slug            | Example themes                                   |
| --------------- | ------------------------------------------------ |
| alert-dialog    | default; confirm/cancel                          |
| drawer          | default; placement                               |
| tooltip         | default; placement/delay note                    |
| popover         | default; with actions                            |
| hover-card      | default; rich content                            |
| command-palette | default; grouped items (+ Astro/HTML if present) |

## Out of scope (this batch)

- Other `LEAN.md` categories (inputs, nav chrome, data display, …)
- New Astro bindings
- Playground tabs

## Process

- Implement **one wave at a time**
- After each wave: completeness tests green; wave slugs gone from `LEAN.md`
- Later batches (B/C/…) get their own plan when Batch A is done

## Success criteria

1. All Batch A slugs upgraded and removed from `LEAN.md`
2. Docs demo completeness + coverage tests still pass
3. `vp check` clean for touched docs files
