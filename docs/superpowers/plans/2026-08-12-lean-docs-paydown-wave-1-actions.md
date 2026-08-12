# Lean Docs Paydown Wave 1 — Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Wave 1 action component docs (icon-button, button-group, copy-button, toggle-button, segmented-control, color-mode-toggle, toolbar) from lean stubs to Select-floor / Button-ceiling quality and remove them from `LEAN.md`.

**Architecture:** Extend existing MDX + demo folders under `docs/`. Add one secondary demo id per component (e.g. `icon-button.sizes`), wire through `types.ts` / `registry.ts` / `reactDemoMap.ts`, keep React-only ids in `REACT_ONLY_DEMO_IDS`. Follow `docs/content/components/button.mdx` and `select.mdx` for structure.

**Tech Stack:** Astro MDX docs site, existing demo maps, `@var-ui/react`, Vitest via `vp test`.

## Global Constraints

- Quality bar from `docs/superpowers/specs/2026-08-12-lean-docs-paydown-batch-a-design.md`
- At least two explained example sections per page (default + secondary)
- Component-specific Accessibility section
- HTML section only if recipe/Astro exists (Wave 1 are React-only — skip HTML)
- Do not commit unless the user asks
- Remove upgraded slugs from `docs/content/components/LEAN.md`

---

### Task 1: IconButton + ButtonGroup

**Files:**

- Modify: `docs/content/components/icon-button.mdx`, `docs/content/components/button-group.mdx`
- Create: `docs/src/demos/icon-button/sizes/{react.tsx,snippets.ts}`
- Create: `docs/src/demos/button-group/attached/{react.tsx,snippets.ts}` (or `variants` — use `attached` if showing connected group; default already shows group)
- Modify: `docs/src/demos/types.ts`, `registry.ts`, `reactDemoMap.ts`, `reactOnlyDemoIds.ts`, `LEAN.md`

**Interfaces:**

- Produces demo ids: `icon-button.sizes`, `button-group.intents` (secondary: mixed intents / with IconButton)
- Consumes: `IconButton`, `Button`, `ButtonGroup`, `HStack` from `@var-ui/react`

- [ ] **Step 1: Expand icon-button.mdx** with Default (explained) + Sizes/intents demo + Props + Accessibility (`aria-label` required)
- [ ] **Step 2: Add `icon-button.sizes` demo** — `HStack` of sm/md/lg and a couple intents
- [ ] **Step 3: Expand button-group.mdx** — Default + secondary showing IconButtons or intent mix inside the group
- [ ] **Step 4: Wire DemoIds/maps; add new ids to REACT_ONLY_DEMO_IDS; remove both slugs from LEAN.md**
- [ ] **Step 5: Run `vp test docs/src/demos/completeness.test.ts` — expect PASS**

---

### Task 2: CopyButton + ToggleButton

**Files:**

- Modify: `docs/content/components/copy-button.mdx`, `docs/content/components/toggle-button.mdx`
- Create: `docs/src/demos/copy-button/labels/{react.tsx,snippets.ts}`
- Create: `docs/src/demos/toggle-button/pressed/{react.tsx,snippets.ts}`
- Modify: demo wiring files + `LEAN.md`

**Interfaces:**

- Produces: `copy-button.labels`, `toggle-button.pressed`
- CopyButton uses `copyLabel` / `copiedLabel`; ToggleButton uses `isSelected` / `defaultSelected` from RAC

- [ ] **Step 1–4:** Same pattern as Task 1 for these two components
- [ ] **Step 5: Completeness test PASS**

---

### Task 3: SegmentedControl + ColorModeToggle + Toolbar

**Files:**

- Modify: MDX for `segmented-control`, `color-mode-toggle`, `toolbar`
- Create: `segmented-control/controlled/`, `color-mode-toggle/appearance/`, `toolbar/slots/` demos
- Modify: wiring + `LEAN.md`

**Interfaces:**

- Produces: `segmented-control.controlled`, `color-mode-toggle.appearance`, `toolbar.slots`
- SegmentedControl: controlled `selectedKeys` + `onSelectionChange`
- ColorModeToggle: `appearance="labels"` / `iconsAndLabels` and `includeSystem`
- Toolbar: `startContent` + `endContent` with Buttons/IconButtons; required `label`

- [ ] **Step 1–4:** Upgrade all three
- [ ] **Step 5: Completeness test PASS; confirm Wave 1 slugs absent from LEAN.md**
- [ ] **Step 6: `vp check` in docs (or repo) for touched files — expect clean**

---

## Self-review

- Spec Wave 1 table fully covered by Tasks 1–3
- No Wave 2/3 work in this plan
- React-only placeholders remain for new demo snippets
