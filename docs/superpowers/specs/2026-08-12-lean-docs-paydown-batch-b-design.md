# Lean Docs Paydown — Batch B (Data Inputs)

**Date:** 2026-08-12  
**Status:** In progress (same quality bar as Batch A)  
**Parent:** `2026-08-12-lean-docs-paydown-batch-a-design.md`

## Goal

Upgrade lean **data input** docs pages to Select-floor / Button-ceiling quality; remove each slug from `LEAN.md` as it ships.

## Quality bar

Same as Batch A: ≥2 explained examples, Props, component-specific Accessibility, HTML only when recipe/Astro exists, React-only demos stay in `REACT_ONLY_DEMO_IDS`.

## Waves

### Wave 1 — Core fields

| Slug           | Secondary demo theme                  |
| -------------- | ------------------------------------- |
| number-input   | min/max/step                          |
| password-input | with description/error                |
| search-input   | controlled / clear                    |
| file-input     | multiple                              |
| input-group    | with InputGroupText / InputGroupInput |
| checkbox-group | horizontal / default values           |

### Wave 2 — Dates & time

| Slug             | Secondary demo theme          |
| ---------------- | ----------------------------- |
| calendar         | controlled value              |
| date-input       | with Field chrome / min value |
| date-range-input | range selection               |
| date-time-input  | default value                 |
| time-input       | 12h vs controlled             |

### Wave 3 — Tokens, multi, color

| Slug           | Secondary demo theme |
| -------------- | -------------------- |
| tokenizer      | with selected tags   |
| multi-selector | controlled selection |
| color-input    | controlled hex       |
| color-picker   | with ColorSwatch     |

## Process

One wave at a time; completeness + `vp check` green; commit per wave when asked (or after each wave when continuing).
