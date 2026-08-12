# Lean Docs Paydown Wave 2 — Menus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade dropdown-menu, context-menu, and more-menu docs from lean stubs to full quality; remove them from `LEAN.md`.

**Architecture:** Same docs/demo pipeline as Wave 1. All three are React-only.

**Tech Stack:** Astro MDX, demo maps, `@var-ui/react`

## Global Constraints

- Quality bar from `docs/superpowers/specs/2026-08-12-lean-docs-paydown-batch-a-design.md`
- At least two explained examples; component-specific Accessibility
- Skip HTML (React-only)
- Do not commit unless asked

---

### Task 1: DropdownMenu

**Files:**

- Modify: `docs/content/components/dropdown-menu.mdx`
- Create: `docs/src/demos/dropdown-menu/sections/{react.tsx,snippets.ts}`
- Wire: types, registry, reactDemoMap, reactOnlyDemoIds, LEAN.md

**Demo themes:**

- default: simple trigger + flat items (exists)
- sections: labeled sections, shortcuts, `danger: true` item; mention `MenuContent` in intro

- [ ] Expand MDX + add `dropdown-menu.sections` demo
- [ ] Wire + remove `dropdown-menu` from LEAN.md
- [ ] Completeness test PASS

### Task 2: ContextMenu

**Files:**

- Modify: `docs/content/components/context-menu.mdx`
- Create: `docs/src/demos/context-menu/sections/{react.tsx,snippets.ts}`

**Demo themes:**

- default: dashed target (exists)
- sections: richer target surface + sectioned items (Edit / Clipboard)

- [ ] Expand MDX + secondary demo
- [ ] Wire + remove from LEAN
- [ ] Completeness PASS

### Task 3: MoreMenu

**Files:**

- Modify: `docs/content/components/more-menu.mdx`
- Create: `docs/src/demos/more-menu/overflow/{react.tsx,snippets.ts}`

**Demo themes:**

- default: exists
- overflow: more items (share, duplicate, archive, delete danger) as a denser overflow set; note it wraps `DropdownMenu` + `IconButton`

- [ ] Expand MDX + secondary demo
- [ ] Wire + remove from LEAN
- [ ] `vp test docs/src/demos/completeness.test.ts` and `cd docs && vp check` PASS
