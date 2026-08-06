# Data table hooks — search, sort, column resize

**Date:** 2026-08-04  
**Status:** Approved  
**Goal:** Ship composable headless hooks and minimal Table/SearchInput extensions so callers can build rich data tables without a monolithic `DataTable`. Dogfood on the docs site with an interactive design-token reference table (React island).

## Summary

var-ui already ships a presentational `Table` compound component and headless hooks for sort, selection, and pagination. Filter and column resize were explicitly deferred in Phase 4. This spec adds the missing headless pieces and wires them into the existing composition model.

v1 is **client-side only** (full dataset in memory). Hooks use controlled/uncontrolled patterns so server-driven data fetching can be added later without API breaks. Filtering is **global search only** — one query scans configurable row keys. No monolithic `DataTable` component; callers compose hooks + `Table` + `Toolbar` + `SearchInput`.

The docs site replaces static HTML token tables in `CssVariableReference.astro` with a React island that dogfoods the new hooks against all registered design tokens and component CSS variables.

## Decisions

| Topic          | Decision                                                          |
| -------------- | ----------------------------------------------------------------- |
| Data model     | Client-side first; controlled hook props for future server-driven |
| Filtering      | Global search only (no per-column filters in v1)                  |
| API shape      | Composable hooks + existing `Table` — no `DataTable` wrapper      |
| Astro          | Static markup + React island; interactive behavior is React-only  |
| Pagination     | Optional; not required for token reference (~200–400 rows)        |
| Selection      | Out of scope; existing `useTableSelection` unchanged              |
| Persistence    | `useColumnResize` supports optional `autoSaveId` (localStorage)   |
| Dogfood target | Interactive token table on `/theming/css-variables`               |

## Architecture

### Data pipeline (client-side)

```
raw data
  → useTableFilter({ query, searchKeys })
  → filteredData
  → useTableSort({ sortDescriptor })
  → sortedData
  → Table (compound or columns/data API)
```

Search UI is a controlled `SearchInput` bound to `useTableFilter`'s `query` / `onQueryChange`. Sort UI is existing `Table.Column` sort chrome driven by `useTableSort`. Column widths come from `useColumnResize`.

### Server-driven (future, not v1)

Parent owns `query`, `sortDescriptor`, and `page`. Hooks run in controlled mode; `filterFn` becomes a passthrough (server returns pre-filtered rows). A thin `useTablePipeline` orchestrator may be added later — not in v1.

## New hooks

### `useTableFilter`

Location: `packages/react/src/hooks/useTableFilter.ts`

Mirrors `useTableSort` API conventions.

```ts
type UseTableFilterOptions<T> = {
  data: T[];
  /** Controlled search query. */
  query?: string;
  /** Uncontrolled initial query. @default '' */
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Row keys to search. Default: all own string keys on T. */
  searchKeys?: (keyof T & string)[];
  /** Custom matcher. Default: case-insensitive substring across searchKeys. */
  filterFn?: (row: T, query: string) => boolean;
};

type UseTableFilterResult<T> = {
  filteredData: T[];
  query: string;
  onQueryChange: (query: string) => void;
};
```

Default `filterFn`: trim query; if empty return all rows; otherwise match if any `searchKeys` value contains query (case-insensitive `String(value)`).

### `useColumnResize`

Location: `packages/react/src/hooks/useColumnResize.ts`

Tracks per-column widths for `table-layout: fixed` tables.

```ts
type UseColumnResizeOptions = {
  /** Column keys in display order. */
  columns: string[];
  /** Initial widths (CSS lengths). Unspecified columns share remaining space. */
  defaultWidths?: Record<string, string>;
  /** Minimum width in px when dragging. @default 80 */
  minWidth?: number;
  /** Persist widths to localStorage. @default undefined (no persist) */
  autoSaveId?: string;
  onWidthsChange?: (widths: Record<string, string>) => void;
};

type UseColumnResizeResult = {
  columnWidths: Record<string, string>;
  /** Props for Table.Column: { width, style? } */
  getColumnProps: (key: string) => { width: string; style?: React.CSSProperties };
  /** Props for ResizeHandle on column right edge. */
  getResizeHandleProps: (key: string) => ResizeHandleColumnProps;
};
```

Drag behavior reuses pointer/keyboard math patterns from `useResizable` and `ResizeHandle`, adapted for horizontal column boundaries (not panel layout). Resizing column `key` adjusts that column's width; adjacent column absorbs the delta to keep total table width stable.

Controlled mode: accept `widths` + `onWidthsChange` (same pattern as sort/filter).

## Component changes

### Core: `table.ts`

- Add `layout: 'auto' | 'fixed'` variant (`fixed` sets `table-layout: fixed` on the `<table>` slot).
- Add optional `resizeHandle` slot styled for column header edges (narrow hit target, `col-resize` cursor, uses existing focus ring tokens).
- No interactive state in core.

### React: `Table.tsx`

- When any column has an explicit width, render `<colgroup>` with `<col style={{ width }}>` elements.
- `Table.Column` accepts an optional `resizeHandle` render prop or child slot for a `ResizeHandle`.
- Pass `layout="fixed"` when using `useColumnResize`.

### React: `SearchInput.tsx` (new)

Wrap `searchInput` core recipe. Props mirror the Astro component's `default` variant: `value`, `defaultValue`, `onChange`, `placeholder`, `aria-label`, `size`, `className`. Export from `@var-ui/react`.

### React: `ResizeHandle.tsx`

No changes required; column resize passes standard `handleProps` with `direction: 'horizontal'`.

## Docs dogfood: Token Reference Table

### Data source

Reuse existing build-time helpers in `docs/src/lib/theme-css-variables.ts`:

- `getDesignTokenVariables()` — design tokens from `tokenValues` / `designTokens`
- `getComponentCssVariables()` — recipe-scoped vars from registered CSS

Flatten into rows at build time in `CssVariableReference.astro`:

```ts
type TokenRow = {
  id: string;
  kind: 'design' | 'component';
  namespace: string;
  tokenPath: string;
  cssVar: string;
  defaultValue: string | null;
};
```

Pass serialized rows as props to the React island.

### `TokenReferenceTable.tsx`

Location: `docs/src/components/TokenReferenceTable.tsx` (docs-only, not shipped in packages)

Features:

| Feature | Implementation                                                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------------- |
| Search  | `SearchInput` + `useTableFilter` over `tokenPath`, `cssVar`, `defaultValue`, `namespace`                       |
| Sort    | `useTableSort` on all columns                                                                                  |
| Resize  | `useColumnResize` with `autoSaveId: 'docs-token-table'`                                                        |
| Columns | Namespace · Token · CSS variable · Default · Preview                                                           |
| Preview | Color swatch for color tokens; spacing bar for `space.*`; font sample for typography tokens; em dash otherwise |
| Chrome  | `Toolbar` with search + result count; `Table` compact density, sticky header, row hover                        |

### Astro integration

`CssVariableReference.astro` becomes a thin shell:

1. Build `TokenRow[]` at compile time (same data as today's static tables).
2. Render section headings and prose unchanged.
3. Replace per-group static `<table>` blocks with one `<TokenReferenceTable client:load rows={rows} />` island (or one island per section if grouping is preferred — default: single unified table with namespace column).

MDX page `docs/content/theming/css-variables.mdx` unchanged except the island handles interactivity.

## Testing

| Area              | Tests                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `useTableFilter`  | Empty query returns all; substring match; case insensitivity; custom `filterFn`; controlled/uncontrolled |
| `useColumnResize` | Default widths; drag updates width; min width clamp; localStorage persist/restore                        |
| `SearchInput`     | Renders input; forwards change events; recipe class applied                                              |
| `Table` colgroup  | Renders `<colgroup>` when column widths provided                                                         |
| Docs              | Token table filters on search; sort toggles; column resize persists (smoke test optional)                |

## Out of scope (v1)

- Per-column filters
- Monolithic `DataTable` component
- `useTablePipeline` orchestrator
- Server-driven fetching
- Astro client scripts for sort/resize (React island only)
- Row selection in token table
- Virtualization

## File checklist

### Packages

- [ ] `packages/react/src/hooks/useTableFilter.ts`
- [ ] `packages/react/src/hooks/useColumnResize.ts`
- [ ] `packages/react/src/hooks/useTableFilter.test.ts`
- [ ] `packages/react/src/hooks/useColumnResize.test.ts`
- [ ] `packages/react/src/hooks/index.ts` — export new hooks
- [ ] `packages/react/src/components/SearchInput.tsx`
- [ ] `packages/react/src/components/index.ts` — export SearchInput
- [ ] `packages/core/src/components/table.ts` — layout variant + resizeHandle slot
- [ ] `packages/react/src/components/Table.tsx` — colgroup + resize handle support

### Docs

- [ ] `docs/src/components/TokenReferenceTable.tsx`
- [ ] `docs/src/components/CssVariableReference.astro` — React island
- [ ] Optional: `docs/src/demos/table/` — composition demo for component docs (follow-up)

## Related

- `packages/react/src/hooks/useTableSort.ts` — template for new hooks
- `examples/vite-app/src/App.tsx` (`TableDemo`) — existing composition reference
- `docs/src/lib/theme-css-variables.ts` — token data source
- `ROADMAP.md` Phase 4 — filter/column resize deferred note
