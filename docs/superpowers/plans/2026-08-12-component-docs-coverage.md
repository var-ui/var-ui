# Component Docs Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lean docs page for every missing public Var UI component family, plus `LEAN.md` tracking.

**Architecture:** Reuse the existing docs pipeline (`componentRegistry` → MDX under `docs/content/components/` → `<Demo>` / `<PropsTable>`). Extend the demo completeness gate so React-only demos are valid when Astro/HTML bindings are absent. Ship pages in category batches so each batch is reviewable.

**Tech Stack:** Astro content MDX, existing demo maps (`types.ts`, `registry.ts`, `reactDemoMap.ts`, `astroDemoMap.ts`, `htmlDemoMap.ts`), `@var-ui/react` / `@var-ui/astro`, Vitest via vite-plus.

## Global Constraints

- Family pages only (no separate pages for subcomponents listed in the design spec).
- Lean MDX only: title/description frontmatter, H1, short intro, `## Examples` / `### Default` / `<Demo>`, `## Props` / `<PropsTable>`.
- React demo required for every new page.
- Astro/HTML demos only when bindings/recipes exist; otherwise mark demo React-only.
- Exclude internals: `ChatListContext`, `ChatMessageContext`, `APP_SHELL_MAIN_ID`.
- Do not commit unless the user explicitly asks.
- Follow existing demo file layout: `docs/src/demos/<slug>/default/{react.tsx,snippets.ts[,astro.astro,html.ts]}`.

---

### Task 1: React-only demo infrastructure

**Files:**

- Modify: `docs/src/demos/types.ts`
- Modify: `docs/src/demos/astroDemoMap.ts`
- Modify: `docs/src/demos/htmlDemoMap.ts`
- Modify: `docs/src/demos/completeness.test.ts`
- Create: `docs/src/demos/reactOnlyDemoIds.ts`
- Test: `docs/src/demos/completeness.test.ts`

**Interfaces:**

- Produces: `REACT_ONLY_DEMO_IDS: ReadonlySet<DemoId>` (or `readonly DemoId[]`) listing demos that intentionally omit Astro/HTML maps
- Produces: `astroDemoMap` / `htmlDemoMap` typed as `Partial<Record<DemoId, ...>>` **or** keep full records but completeness skips Astro/HTML asserts for ids in `REACT_ONLY_DEMO_IDS`
- Consumes: existing `DemoId`, `DEMO_IDS`, `collectMdxDemoIds()`

- [x] **Step 1: Write the failing test extension**

Add to `docs/src/demos/completeness.test.ts`:

```ts
import { REACT_ONLY_DEMO_IDS } from './reactOnlyDemoIds';

// Inside the existing loop, replace unconditional Astro/HTML asserts with:
expect(demoSnippets[id as keyof typeof demoSnippets].react.length).toBeGreaterThan(0);
expect(reactDemoLoaders[id as keyof typeof reactDemoLoaders]).toBeTypeOf('function');

if (REACT_ONLY_DEMO_IDS.has(id as DemoId)) {
  // React-only: Astro/HTML snippets may be empty placeholders; maps may omit the id.
  continue;
}

expect(demoSnippets[id as keyof typeof demoSnippets].astro.length).toBeGreaterThan(0);
expect(demoSnippets[id as keyof typeof demoSnippets].html.length).toBeGreaterThan(0);
expect(astroDemoIds).toContain(id);
expect(htmlDemoIds).toContain(id);
```

Also assert: every id in `REACT_ONLY_DEMO_IDS` is present in `DEMO_IDS`.

- [ ] **Step 2: Run test to verify current suite still passes**

Run: `vp test docs/src/demos/completeness.test.ts`

Expected: PASS (empty `REACT_ONLY_DEMO_IDS` behaves like today)

- [ ] **Step 3: Implement `reactOnlyDemoIds.ts` and map typing**

```ts
// docs/src/demos/reactOnlyDemoIds.ts
import type { DemoId } from './types';

/** Demos that ship React previews only until Astro/HTML bindings exist. */
export const REACT_ONLY_DEMO_IDS = new Set<DemoId>([
  // populated as React-only pages are added
]);
```

Change `astroDemoMap` / `htmlDemoMap` to `satisfies Partial<Record<DemoId, ...>>` if needed so omitted React-only ids typecheck. Update `DemoHost.astro` only if lookups need narrowing (it already guards missing previews).

For React-only `snippets.ts`, still satisfy `DemoSnippets` with non-empty strings, e.g.:

```ts
astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
html: `<!-- No HTML demo yet — use @var-ui/react -->`,
```

(Completeness skips length checks for Astro/HTML on React-only ids, but keeping placeholders avoids undefined snippet access in DemoHost.)

- [ ] **Step 4: Re-run completeness test**

Run: `vp test docs/src/demos/completeness.test.ts`  
Expected: PASS

---

### Task 2: LEAN.md scaffold + registry helper pattern

**Files:**

- Create: `docs/content/components/LEAN.md`
- Modify: `docs/src/data/components.ts` (only when adding entries in later tasks; this task documents the entry shape)

**Interfaces:**

- Produces: `LEAN.md` checklist format used by all later tasks
- Produces: `ComponentEntry` shape reminder:

```ts
{
  slug: 'drawer',
  name: 'Drawer',
  category: 'overlay', // action | data-input | feedback | overlay | layout | content | container | chat
  description: 'Slide-over panel for secondary flows.',
  importLine: "import { Drawer } from '@var-ui/react';",
}
```

- [ ] **Step 1: Create LEAN.md**

```md
# Lean component docs

Pages below ship with a single default demo and props table. Remove a slug when the page reaches full parity (multiple examples + accessibility notes).

## Lean pages

<!-- Batches append `- [ ] slug` entries here -->
```

- [ ] **Step 2: Verify file is present**

Run: `test -f docs/content/components/LEAN.md && echo ok`  
Expected: `ok`

---

### Task 3: Shared lean page recipe (reference implementation — Kbd)

Use **Kbd** as the template for all later batches (has Astro + simple React).

**Files:**

- Modify: `docs/src/data/components.ts`
- Create: `docs/content/components/kbd.mdx`
- Create: `docs/src/demos/kbd/default/react.tsx`
- Create: `docs/src/demos/kbd/default/astro.astro`
- Create: `docs/src/demos/kbd/default/html.ts`
- Create: `docs/src/demos/kbd/default/snippets.ts`
- Modify: `docs/src/demos/types.ts` (add `'kbd.default'`)
- Modify: `docs/src/demos/registry.ts`
- Modify: `docs/src/demos/reactDemoMap.ts`
- Modify: `docs/src/demos/astroDemoMap.ts`
- Modify: `docs/src/demos/htmlDemoMap.ts`
- Modify: `docs/content/components/LEAN.md`

**Interfaces:**

- Produces: working `/components/kbd` page pattern copied by later tasks
- Consumes: Task 1 React-only infra (not needed for Kbd)

- [ ] **Step 1: Add registry entry**

```ts
{
  slug: 'kbd',
  name: 'Kbd',
  category: 'content',
  description: 'Keyboard key cap for shortcut hints.',
  importLine: "import { Kbd } from '@var-ui/react';",
},
```

- [ ] **Step 2: Create MDX + demos**

`docs/content/components/kbd.mdx`:

```mdx
---
title: Kbd
description: Keyboard key cap for shortcut hints.
---

# Kbd

Keyboard key cap for shortcut hints.

## Examples

### Default

<Demo id="kbd.default" />

## Props

<PropsTable slug="kbd" />
```

`react.tsx`:

```tsx
import { Kbd } from '@var-ui/react';

export default function Preview() {
  return (
    <span>
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
    </span>
  );
}
```

`astro.astro`:

```astro
---
import { Kbd } from '@var-ui/astro';
---
<span>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd></span>
```

`html.ts` — render equivalent markup using `kbd()` from `@var-ui/core` / class names matching existing HTML demos.

`snippets.ts` — mirror the three frameworks.

- [ ] **Step 3: Wire DemoId + maps + LEAN.md `- [ ] kbd`**

- [ ] **Step 4: Test**

Run: `vp test docs/src/demos/completeness.test.ts docs/src/data/navigation.test.ts`  
Expected: PASS

Manual: open `/components/kbd` in docs dev server.

---

### Task 4: Feedback + content batch (Astro where available)

**Slugs:** `skeleton`, `status-dot`, `steps`, `loading-overlay`, `list`, `description-list`, `outline`, `toc`, `breadcrumbs`

**Files per slug:** same pattern as Task 3.  
`loading-overlay`, `list`, `description-list`, `outline` are React-only → add `*.default` to `REACT_ONLY_DEMO_IDS`.  
`skeleton`, `status-dot`, `steps`, `toc`, `breadcrumbs` have Astro → full three-framework demos.

- [ ] **Step 1: Add all registry entries with accurate descriptions/importLines**
- [ ] **Step 2: Create MDX + default demos for each slug**
- [ ] **Step 3: Wire types/registry/maps; update LEAN.md**
- [ ] **Step 4: Run `vp test docs/src/demos/completeness.test.ts` — expect PASS**

**Demo hints:**

- `Skeleton`: `<Skeleton width={120} height={16} />` (check real props)
- `StatusDot`: tone prop if available
- `Steps`: minimal steps array/items per component API
- `LoadingOverlay`: wrap a sized box
- `List` / `DescriptionList` / `Outline` / `Toc` / `Breadcrumbs`: small static item lists

---

### Task 5: Layout / nav chrome batch

**Slugs:** `app-shell`, `simple-grid`, `scroll-area`, `overflow-list`, `resize-handle`, `pagination`, `side-nav`, `top-nav`, `top-nav-mega-menu`, `mobile-nav`, `tab-list`

Astro available for many (`app-shell`, `scroll-area`, `resize-handle`, `side-nav`, `top-nav`, `mobile-nav`). React-only: `simple-grid`, `overflow-list`, `pagination`, `top-nav-mega-menu`, `tab-list`.

- [ ] **Step 1: Registry entries**
- [ ] **Step 2: Lean MDX + demos (keep shells compact — fixed height containers)**
- [ ] **Step 3: Wire maps + LEAN.md + REACT_ONLY_DEMO_IDS**
- [ ] **Step 4: Completeness test PASS**

---

### Task 6: Overlay batch

**Slugs:** `alert-dialog`, `drawer`, `tooltip`, `popover`, `hover-card`, `command-palette`

`command-palette` has Astro; others React-only.

- [ ] **Step 1: Registry + MDX + demos**
- [ ] **Step 2: For dialogs/drawers, use controlled `isOpen` default-open or a Button trigger — match existing `dialog.default` pattern**
- [ ] **Step 3: Wire maps + LEAN + React-only set**
- [ ] **Step 4: Completeness test PASS**

---

### Task 7: Action batch

**Slugs:** `icon-button`, `button-group`, `copy-button`, `toggle-button`, `segmented-control`, `color-mode-toggle`, `dropdown-menu`, `context-menu`, `more-menu`, `toolbar`

All React-only unless an Astro file appears.

- [ ] **Step 1–4:** same recipe as Task 4

**Family notes:**

- `dropdown-menu`: document `MenuContent` in intro
- `segmented-control` page may mention `ToggleButton` if it shares the module; if `ToggleButton` is a separate primary export used alone, keep `toggle-button` as its own page (per inventory)

---

### Task 8: Data input batch

**Slugs:** `number-input`, `password-input`, `search-input`, `file-input`, `input-group`, `checkbox-group`, `calendar`, `date-input`, `date-range-input`, `date-time-input`, `time-input`, `tokenizer`, `multi-selector`, `color-input`, `color-picker`

`search-input` has Astro; most others React-only.

- [ ] **Step 1–4:** same recipe
- [ ] **Family notes:** `input-group` covers InputGroupInput + InputGroupText; `color-picker` covers ColorSwatch

---

### Task 9: Data display batch

**Slugs:** `table`, `tree`, `file-tree`

All React-only lean demos with small static datasets.

- [ ] **Step 1–4:** same recipe

---

### Task 10: Coverage verification

**Files:**

- Create: `docs/src/data/component-docs-coverage.test.ts` (optional but recommended)
- Modify: `docs/content/components/LEAN.md` (ensure complete)

**Interfaces:**

- Produces: test that every in-scope public family slug from a frozen allowlist (copy from the design spec) exists in `componentRegistry` and has `docs/content/components/<slug>.mdx`
- Produces: test that every LEAN.md checklist slug exists in the registry

- [ ] **Step 1: Write coverage test with the exact slug list from the design spec**
- [ ] **Step 2: Run `vp test docs/src/data/component-docs-coverage.test.ts docs/src/demos/completeness.test.ts docs/src/data/navigation.test.ts`**
- [ ] **Step 3: Spot-check a React-only page and an Astro page in the docs dev server**
- [ ] **Step 4: Confirm LEAN.md lists every newly added slug**

---

## Self-review notes

- Spec coverage: infra (Task 1), LEAN (Task 2), template (Task 3), all inventory categories (Tasks 4–9), success criteria (Task 10).
- React-only gate change is required by approved decision A.
- No commits in this plan unless the user requests them.
