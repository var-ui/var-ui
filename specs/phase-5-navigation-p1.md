# Phase 5 P1 — Breadcrumbs and Pagination

Design for the P1 slice of V6 Phase 5 from `specs/component-breadth.md` /
`ROADMAP.md`. Ships the two standalone navigation primitives; defers Phase 5
P2 (`SideNav`, `TopNav`, `MobileNav`, Tabs-merge evaluation) and Phase 5 P3
(`Outline`, `AppShell`, `NavIcon`/`NavMenu`) to their own specs.

**Date:** 2026-07-15  
**Status:** Approved for planning  
**Parent:** `specs/component-breadth.md` § Phase 5

---

## Goals

- Ship `Breadcrumbs` and `Pagination` as two separately reviewable PRs.
- Stay RAC-first (`react-aria-components`) — no new positioning/menu
  infrastructure required for either component.
- Reuse existing recipes (`button`, `IconButton`, `Select`) for page controls
  instead of inventing new button-like chrome.
- Make both usable in the example app.

## Non-goals

- Phase 5 P2/P3: `SideNav`, `TopNav`, `MobileNav`, `Outline`, `AppShell`,
  `NavIcon`/`NavMenu`, and the `TabList`/`Tab`/`TabMenu` vs. existing `Tabs`
  merge decision.
- Icon-node breadcrumb separators (string separator only in v1).
- Collapse-via-menu for breadcrumbs (click-to-expand only — see Decisions).
- Astryx's optimistic-transition / live-announce pagination plumbing (see
  Decisions).
- Full V3 classname snapshot / lint-rule audit.
- Per-recipe `.doc.ts` structured docs.

## Decisions (locked)

| Topic                     | Choice                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Scope                     | Phase 5 **P1 only**                                                                        |
| Shipping                  | **One PR per family**                                                                      |
| Breadcrumbs API           | `items` array prop (not JSX children) — enables programmatic collapse                      |
| Breadcrumbs collapse      | Middle items collapse to one **click-to-expand** `…` item — no menu/popover                |
| Breadcrumbs separator     | CSS-only string (`c.vars()`, default `'/'`) via `::after` — no icon separators             |
| Pagination variant scope  | **Full set**: `pages` \| `count` \| `compact` \| `dots` \| `none`, + page-size selector    |
| Pagination controls       | Reuse existing `button`/`IconButton`/`Select` recipes — no new button chrome               |
| Pagination async plumbing | **Dropped** — plain controlled component, no `useOptimistic`/`useTransition`/announce hook |

## Suggested PR order

1. Breadcrumbs
2. Pagination

No cross-dependency between the two; Breadcrumbs first only because it's the
smaller surface.

---

## Shared conventions

Copied / aligned with prior component-breadth work (Phase 3 P1):

- Core: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })`
  with themeable values via `c.vars()`.
- React: RAC for focus, keyboard, ARIA; hand-rolled DOM only for static chrome
  (ellipsis text, dots).
- Icons only through `IconProvider` / `<Icon>` — no new icon names needed;
  `chevronLeft`/`chevronRight` already exist in `iconNameList` for
  Pagination's prev/next buttons.
- Exports: core recipes from `packages/core/src/components/index.ts`; React
  components + types from `packages/react/src/components/index.ts` and
  `packages/react/src/index.ts`.
- Validation: `vp check`, `vp test`, build core + react before finishing a PR.
- Example-app demo section for each family under the current gallery pattern.

---

## 1. Breadcrumbs

### Core

New `breadcrumbs` recipe, slots:

- `root` — `<nav>` landmark
- `list` — `<ol>`, flex + wrap, gap via token
- `item` — `<li>`; separator rendered via `li:not(:last-child)::after` using a
  `c.vars()` string var (`separator`, default `'/'`)
- `ellipsisItem` — the collapsed-marker `<li>`; plain button styling (not a
  link), same inline metrics as `item`

### React

Built directly on RAC `Breadcrumbs` / `Breadcrumb` / `Link` — item-array API,
not raw JSX children, so collapse can be computed before render:

```tsx
<Breadcrumbs
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'current', label: 'My Project' },
  ]}
  maxItems={4}
  itemsBeforeCollapse={1}
  itemsAfterCollapse={1}
  separator="/"
  label="Breadcrumb"
/>
```

Props:

- `items: { id: string; label: ReactNode; href?: string }[]` (required)
- `maxItems?: number` — collapse once `items.length` exceeds this
- `itemsBeforeCollapse?: number` (default `1`), `itemsAfterCollapse?: number`
  (default `1`)
- `separator?: string` (default `'/'`)
- `label?: string` — nav `aria-label` (default `'Breadcrumb'`)

### Behavior

- RAC's `Breadcrumb` already marks the **last item as current**
  (`node.nextKey == null` → `aria-current="page"`, non-interactive, no
  `onAction`) — not reimplemented here.
- When `items.length > maxItems`: render `itemsBeforeCollapse` leading items,
  one ellipsis pseudo-item, `itemsAfterCollapse` trailing items (always
  including the real last/current item). Clicking the ellipsis swaps to
  rendering the full `items` list in local component state — no menu,
  no popover.
- Items without `href` still render via `Link`/`onAction` passthrough (RAC
  native); `onAction` fires with the item's `id`.

### Tests

- Renders full trail with separators when under `maxItems`.
- Last item gets `aria-current="page"` and is not a link/interactive.
- Collapses to leading + ellipsis + trailing when over `maxItems`; clicking
  the ellipsis expands to the full trail.
- `onAction` fires with the correct `id` for a non-current item.

---

## 2. Pagination

### Core

New `pagination` recipe, slots:

- `root` — flex row, `justify-content: space-between`
- `controls` — flex row holding prev/next + indicator
- `ellipsis` — `…` text between page-number gaps (`pages` variant), sm/md
  sized
- `infoText` — `"X–Y of Z"` / `"Page X of Y"` text (`count`/`compact`
  variants)
- `dotsContainer`, `dot`, `dotActive` — dot indicators (`dots` variant)
- `pageSizeGroup` — wraps the optional page-size `Select`

Page-number buttons and prev/next reuse the **existing** `button` (ghost
intent, ellipsis text) / `IconButton` (`chevronLeft`/`chevronRight`) recipes —
no new button-like slots.

### React

```ts
type PaginationProps = {
  page: number;
  onChange: (page: number) => void;
  totalItems?: number;
  totalPages?: number;
  hasMore?: boolean; // cursor-based, when totalPages/totalItems unknown
  pageSize?: number; // default 10
  pageSizeOptions?: number[]; // shows page-size Select when provided
  onPageSizeChange?: (size: number) => void;
  variant?: 'pages' | 'count' | 'compact' | 'dots' | 'none'; // default 'pages'
  siblingCount?: number; // default 1, 'pages' variant only
  size?: 'sm' | 'md'; // default 'md'
  isDisabled?: boolean;
  label?: string; // nav aria-label, default 'Pagination'
};
```

`generatePageRange(currentPage, totalPages, siblingCount): (number | '...')[]`
ports Astryx's algorithm as a pure, independently-testable function (same
first/last/sibling/ellipsis behavior).

Variant rendering:

- `pages` — page-number buttons + ellipsis gaps via `generatePageRange`;
  active page gets `aria-current="page"`.
- `count` — `"{start}–{end} of {totalItems}"` (requires `totalItems`).
- `compact` — `"Page {page} of {totalPages}"` (requires a computed total).
- `dots` — one dot per page, active dot styled, `role="group"` +
  `aria-label="Page indicators"`.
- `none` — prev/next only.

`totalPages` is computed as `totalPages ?? (totalItems != null ? Math.ceil(totalItems / pageSize) : undefined)`.
`pageSize` is coerced to a positive integer (`Math.max(1, Math.floor(...))`,
falling back to `10` if non-finite) to guard the `dots` variant against
`Array.from({length: Infinity})`-style crashes.

### Behavior

- Prev/next disabled at bounds (`page <= 1` / computed-last-page or
  `!hasMore`).
- Page-size change: calls `onPageSizeChange`, then resets to page 1 via
  `onChange(1)`.
- `totalItems <= 0` or computed `totalPages <= 0` renders `null` (matches
  Astryx's empty-state behavior — no controls for zero-item data).
- **Deliberate simplification vs. Astryx**: no `useOptimistic`/
  `useTransition`/async `changeAction`/live-announce plumbing — var-ui has no
  existing announce-hook infra and this wasn't requested. Plain controlled
  component (`page`/`onChange`); `aria-current="page"` on the active control
  carries the accessibility signal.

### Tests

- `generatePageRange` unit cases: small total (all pages shown), near-start,
  near-end, middle (both ellipses).
- Prev/next disabled at first/last page; enabled otherwise.
- Clicking a page number calls `onChange` with that page.
- Each variant (`pages`/`count`/`compact`/`dots`/`none`) renders its expected
  content for a given prop set.
- Page-size change calls `onPageSizeChange` then `onChange(1)`.
- `totalItems={0}` / computed `totalPages <= 0` renders nothing.

---

## Example app

Each PR adds a gallery section:

- Breadcrumbs: one short trail (no collapse) and one long trail (triggers
  collapse, demonstrates click-to-expand).
- Pagination: one instance per variant (`pages`/`count`/`compact`/`dots`/
  `none`), plus one with `pageSizeOptions`.

Manual theme smoke across built-in themes is expected before closing the
phase; automated visual regression is out of scope.

---

## Success criteria

Phase 5 P1 is done when:

1. Both families are exported from `@var-ui/core` / `@var-ui/react`.
2. Each has unit tests green under `vp test`.
3. Both are demonstrably usable in the example app.
4. ROADMAP Phase 5 checkbox can note P1 shipped (P2/P3 still open).
5. No regressions to existing `Tabs`/`Link`/`button`/`Select` behavior.

---

## Open follow-ups (explicitly deferred)

- Phase 5 P2: `SideNav`, `TopNav`, `MobileNav`, `Tabs` vs. `TabList`/`Tab`/
  `TabMenu` merge evaluation.
- Phase 5 P3: `Outline`, `AppShell`, `NavIcon`/`NavMenu`.
- Icon-node breadcrumb separators.
- Breadcrumb overflow-via-menu (if click-to-expand proves insufficient for a
  real consumer).
- Pagination live-region page-change announcements, if a11y feedback surfaces
  a real need.

---

## Relationship to other docs

- Breadth inventory & phase table: `specs/component-breadth.md`
- Tracking: `ROADMAP.md` V6 Phase 5
- Implementation plan: `plans/2026-07-15-phase-5-navigation-p1.md`
