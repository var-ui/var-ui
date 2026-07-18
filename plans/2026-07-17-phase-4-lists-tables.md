# Phase 4 Lists, Tables, and Data Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Phase 4 — `List`, `DescriptionList`, `OverflowList`, `Table` (+ sort/selection/pagination hooks), and `Tree` — per `specs/phase-4-lists-tables.md`.

**Architecture:** TypeStyles recipes in `@var-ui/core` plus presentational React wrappers in `@var-ui/react`. Dual API (`items` + namespaced compound children). Semantic HTML `<table>` with headless hooks (no RAC Table, no `plugins` bag). Tree uses hand-rolled APG focus via `useTreeFocus`. Overflow measurement via `useOverflow`.

**Tech Stack:** TypeStyles ^0.8+, React 19, react-aria-components (Checkbox/Button/Pagination reuse only), vite-plus (`vp`), Vitest via `vp test`, pnpm workspace.

## Global Constraints

- Spec: `specs/phase-4-lists-tables.md` (locked decisions — do not reopen).
- TypeStyles recipes: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })` from `../runtime`; tokens via `designTokens as t` from `../tokens`.
- Themeable colors/sizes through `c.vars()` — no hard-coded theme colors outside vars.
- Circular shapes use literal `'50%'` for `borderRadius`, **not** `t.radius.full`.
- Icons only via `IconProvider` / `<Icon>`. Add `arrowDown` + `arrowsUpDown` with Table. Reuse `chevronRight` for Tree.
- Namespaced compounds: `Object.assign(Parent, { Item: ParentItem, … })` (see `SideNav.Item` / `TabList.Tab`).
- Register every new recipe in `packages/core/src/themeable-components.ts` (alphabetically) — completeness test enforces this.
- Exports: core from `packages/core/src/components/index.ts`; React from **both** `packages/react/src/components/index.ts` **and** named exports in `packages/react/src/index.ts`. Hooks via `packages/react/src/hooks/index.ts` (`export *` already re-exported from react index).
- Tests: `vite-plus/test`; core uses `getRegisteredCss()` (do **not** call `reset()`); React uses `@testing-library/react` + `user-event` under jsdom.
- Validation before finishing a family: `vp check`, `vp test`, build `@var-ui/core` + `@var-ui/react` (+ `@var-ui/icons` when icons change).
- Commits: conventional (`feat(core):`, `feat(react):`, `docs:`). One commit series per PR-family; commit when the task says to (user asked to implement).
- Do not edit `node_modules`, `dist/`, or `examples/vite-app/node_modules/`.
- Do **not** ship filter, column resize, sticky columns, column settings, list selection, or Tree typeahead.
- Do **not** merge docs `fileTree` into product `Tree`.

### File map (create / modify)

| Area            | Files                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| List            | `packages/core/src/components/list.ts`, `list.test.ts`; `packages/react/src/components/List.tsx`, `List.test.tsx`; indexes + themeable + example |
| DescriptionList | `descriptionList.ts` / `DescriptionList.tsx` (+ tests); indexes + themeable + example                                                            |
| OverflowList    | `overflowList.ts`; `packages/react/src/hooks/useOverflow.ts` (+ test); `OverflowList.tsx` (+ test); indexes + themeable + example                |
| Table icons     | `packages/core/src/icons/iconNames.ts` (+ test); `packages/icons/src/bundle1.tsx` (+ test) — `arrowDown`, `arrowsUpDown`                         |
| Table           | `table.ts`; `useTableSort.ts`, `useTableSelection.ts`, `useTablePagination.ts` (+ tests); `Table.tsx` (+ test); indexes + themeable + example    |
| Tree            | `tree.ts`; `useTreeFocus.ts` (+ test); `Tree.tsx` (+ test); indexes + themeable + example                                                        |
| Tracking        | `ROADMAP.md` Phase 4 checklist                                                                                                                   |

### PR grouping

1. **PR List** — Tasks 1–2
2. **PR DescriptionList** — Tasks 3–4
3. **PR OverflowList** — Task 5
4. **PR Table** — Tasks 6–8
5. **PR Tree** — Tasks 9–10
6. **Tracking** — Task 11 (can land with Tree or alone)

---

### Task 1: `list` recipe (core)

**Files:**

- Create: `packages/core/src/components/list.ts`
- Create: `packages/core/src/components/list.test.ts`
- Modify: `packages/core/src/components/index.ts` — `export { list } from './list';`
- Modify: `packages/core/src/themeable-components.ts` — import + register `list`

**Interfaces:**

- Produces: `list(options?)` → slots `{ root, header, item, label, description, start, end, divider }`
- Variants: `density: 'compact' | 'balanced' | 'spacious'`, `listStyle: 'none' | 'disc' | 'decimal'`, `hasDividers: boolean`
- Vars: item padding (per density), divider color, hover/press background, label/description colors

- [ ] **Step 1: Write failing recipe test**

```ts
// packages/core/src/components/list.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { list } from './list';

describe('list', () => {
  it('registers slots and density/listStyle/hasDividers variants', () => {
    list({ density: 'compact', listStyle: 'decimal', hasDividers: true });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-list-root');
    expect(css).toContain('var-ui-list-item');
    expect(css).toContain('var-ui-list-label');
    expect(css).toContain('data-density="compact"');
    expect(css).toContain('data-list-style="decimal"');
    expect(css).toContain('data-has-dividers');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm test -- packages/core/src/components/list.test.ts`

- [ ] **Step 3: Implement recipe**

```ts
// packages/core/src/components/list.ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const list = styles.component(
  'list',
  (c) => {
    const v = c.vars({
      labelColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      hoverBg: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      dividerColor: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      itemPaddingY: { value: t.space[2], syntax: '<length>', inherits: false },
      itemPaddingX: { value: t.space[3], syntax: '<length>', inherits: false },
    });
    return {
      slots: ['root', 'header', 'item', 'label', 'description', 'start', 'end', 'divider'],
      root: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        '&[data-list-style="disc"]': { listStyle: 'disc', paddingLeft: t.space[5] },
        '&[data-list-style="decimal"]': { listStyle: 'decimal', paddingLeft: t.space[5] },
      },
      header: {
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.semibold,
        color: v.labelColor.var,
        padding: `${t.space[2]} ${v.itemPaddingX.var}`,
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[3],
        position: 'relative',
        padding: `${v.itemPaddingY.var} ${v.itemPaddingX.var}`,
        color: v.labelColor.var,
        '&[data-interactive]': { cursor: 'pointer' },
        '&[data-interactive]:hover': { backgroundColor: v.hoverBg.var },
        '&[data-disabled]': { opacity: 0.5, pointerEvents: 'none' },
        '[data-has-dividers] >&:not(:last-child)': {
          borderBottom: `1px solid ${v.dividerColor.var}`,
        },
      },
      label: {
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.medium,
        color: v.labelColor.var,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      description: {
        fontSize: t.fontSize.sm,
        color: v.descriptionColor.var,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      start: { display: 'flex', flexShrink: 0, alignItems: 'center' },
      end: { display: 'flex', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' },
      divider: { display: 'none' }, // dividers via item border when hasDividers
      variants: {
        density: {
          compact: {
            item: {
              /* vars override via compound or data attrs — set itemPaddingY in variant */
            },
          },
          balanced: {},
          spacious: {},
        },
        listStyle: { none: {}, disc: {}, decimal: {} },
        hasDividers: { true: {}, false: {} },
      },
      defaultVariants: { density: 'balanced', listStyle: 'none', hasDividers: false },
    };
  },
  { layer: 'components' },
);
```

Implement density by assigning `itemPaddingY`/`itemPaddingX` in each density variant’s `item` slot (or root `c.vars` overrides — follow patterns in `sideNav.ts` / `pagination.ts`). Prefer data-attrs from variants (`data-density`, `data-list-style`, `data-has-dividers`) matching the test.

- [ ] **Step 4: Register exports + themeableComponents; run test — PASS**

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/list.ts packages/core/src/components/list.test.ts \
  packages/core/src/components/index.ts packages/core/src/themeable-components.ts
git commit -m "$(cat <<'EOF'
feat(core): add list recipe

EOF
)"
```

---

### Task 2: `List` React wrapper + demo

**Files:**

- Create: `packages/react/src/components/List.tsx`
- Create: `packages/react/src/components/List.test.tsx`
- Modify: `packages/react/src/components/index.ts`, `packages/react/src/index.ts`
- Modify: `examples/vite-app/src/App.tsx` — add List demo under a new “Data display” section

**Interfaces:**

```ts
export type ListItemData = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  href?: string;
  isDisabled?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type ListProps = {
  density?: 'compact' | 'balanced' | 'spacious';
  listStyle?: 'none' | 'disc' | 'decimal';
  hasDividers?: boolean;
  header?: ReactNode;
  items?: ListItemData[];
  renderStart?: (item: ListItemData) => ReactNode;
  renderEnd?: (item: ListItemData) => ReactNode;
  children?: ReactNode;
  className?: string;
  /** Fired for interactive items without href (items mode / Item onPress). */
  onAction?: (id: string) => void;
};

export type ListItemProps = {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  href?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
};

export function List(props: ListProps): JSX.Element;
export const ListItem: (props: ListItemProps) => JSX.Element;
// List.Item = ListItem
```

Behavior:

- Root is `<ul>` or `<ol>` when `listStyle === 'decimal'`.
- Interactive: absolute inset link/button overlay (`aria` name from label string when possible); `data-interactive` on item.
- Compound children preferred when `children` set; else map `items`.
- Context optional for density inheritance to items (only needed if items read density — can pass via context).

- [ ] **Step 1: Write failing React tests** (compound + items render label; href sets link; disabled)

```ts
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { List } from './List';

describe('List', () => {
  it('renders compound items', () => {
    render(
      <List header="Members">
        <List.Item label="Ada" description="Admin" />
      </List>,
    );
    expect(screen.getByText('Members')).toBeTruthy();
    expect(screen.getByText('Ada')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('renders items-array mode', () => {
    render(<List items={[{ id: 'a', label: 'Ada' }]} />);
    expect(screen.getByText('Ada')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Implement `List.tsx`** using `list()` recipe + `recipeProps`; namespace `List.Item`

- [ ] **Step 3: Export from both barrels; add App.tsx demo; `vp check` + `vp test`; commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add List component

EOF
)"
```

---

### Task 3: `descriptionList` recipe (core)

**Files:**

- Create: `packages/core/src/components/descriptionList.ts`, `descriptionList.test.ts`
- Modify: `components/index.ts`, `themeable-components.ts`

**Interfaces:**

- Slots: `root`, `title`, `item`, `term`, `details`, `toggle`
- Variants: `columns: 'single' | 'multi'` (numeric columns via inline style / CSS var `--var-ui-description-list-columns` set from React), `labelPosition: 'start' | 'top'`
- Vars: term color, details color, gap, term width

- [ ] **Step 1: Failing test** — registers slots + `--var-ui-description-list-*` vars

- [ ] **Step 2: Implement recipe** — `root` as grid; `item` contains `term`+`details`; `labelPosition=start` → two-column grid on item; `top` → stacked

- [ ] **Step 3: Export + themeable; test PASS; commit `feat(core): add descriptionList recipe`**

---

### Task 4: `DescriptionList` React + demo

**Files:**

- Create: `packages/react/src/components/DescriptionList.tsx`, `DescriptionList.test.tsx`
- Modify: react indexes + `App.tsx`

**Interfaces:**

```ts
export type DescriptionListItemData = {
  id: string;
  label: string;
  value: ReactNode;
  icon?: IconName | ReactNode;
};

export type DescriptionListProps = {
  columns?: 'single' | 'multi' | number;
  labelPosition?: 'start' | 'top';
  maxItems?: number;
  title?: ReactNode;
  items?: DescriptionListItemData[];
  children?: ReactNode;
  className?: string;
};

export type DescriptionListItemProps = {
  label: string;
  children?: ReactNode;
  icon?: IconName | ReactNode;
  className?: string;
};
```

Behavior:

- Semantic `<dl>` / wrap each pair as `<div class=item>` containing `<dt>` + `<dd>` (valid HTML5).
- `maxItems`: hide extras; toggle button “Show more” / “Show less” using plain `<button>` + button recipe or text button styles.
- Default `labelPosition`: `start` when `columns === 'single'`, else `top`.
- Numeric `columns`: set CSS var / style `gridTemplateColumns: repeat(N, minmax(0, 1fr))` on root.

- [ ] **Step 1: Tests** — dl/dt/dd present; maxItems hides then reveals

- [ ] **Step 2: Implement + export + demo; validate; commit `feat(react): add DescriptionList`**

---

### Task 5: `OverflowList` + `useOverflow`

**Files:**

- Create: `packages/core/src/components/overflowList.ts`, `overflowList.test.ts`
- Create: `packages/react/src/hooks/useOverflow.ts`, `useOverflow.test.tsx`
- Create: `packages/react/src/components/OverflowList.tsx`, `OverflowList.test.tsx`
- Modify: core/react indexes, themeable, hooks index, App.tsx

**Interfaces:**

```ts
// useOverflow.ts
export type UseOverflowOptions = {
  /** Extra hard cap after measurement. */
  maxVisible?: number;
  gapPx?: number;
  enabled?: boolean;
};

export type UseOverflowResult<T> = {
  containerRef: RefObject<HTMLElement | null>;
  measureRef: RefObject<HTMLElement | null>;
  visibleItems: T[];
  hiddenItems: T[];
};

export function useOverflow<T>(items: T[], options?: UseOverflowOptions): UseOverflowResult<T>;
```

Measurement algorithm:

1. Render hidden measure row with all items + overflow indicator placeholder.
2. On resize, walk widths left-to-right; reserve indicator width when any would hide.
3. Return slice of visible / hidden.

```ts
export type OverflowListProps<T = unknown> = {
  items?: T[];
  children?: ReactNode;
  renderItem?: (item: T, index: number) => ReactNode;
  renderOverflow: (hidden: T[] | ReactElement[]) => ReactNode;
  maxVisible?: number;
  fillParent?: boolean;
  gap?: keyof typeof /* space scale — or number px */;
  className?: string;
};

export type OverflowListItemProps = { children: ReactNode; className?: string };
```

For compound mode, treat each `OverflowList.Item` child as an item (cloneElement / Children.toArray). `renderOverflow` receives hidden children or hidden data items.

- [ ] **Step 1: Failing tests** — recipe slots; hook returns all visible when container wide (mock getBoundingClientRect); OverflowList calls renderOverflow when maxVisible=1

- [ ] **Step 2: Implement recipe, hook, component**

- [ ] **Step 3: Export + demo (`+N` button); validate; commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add OverflowList and useOverflow

EOF
)"
```

(Include core recipe in same commit or prior `feat(core): add overflowList recipe` if preferred.)

---

### Task 6: Sort icon names (`arrowDown`, `arrowsUpDown`)

**Files:**

- Modify: `packages/core/src/icons/iconNames.ts`, `iconNames.test.ts`
- Modify: `packages/icons/src/bundle1.tsx`, `bundle1.test.tsx` (or new bundle entry if tests split by name list)

**Interfaces:**

- Add `'arrowDown' | 'arrowsUpDown'` to `iconNameList`
- SVG glyphs: down arrow; up-down double chevron (24×24, stroke currentColor — match bundle1 style)

- [ ] **Step 1: Update failing iconNameList snapshot test expectations**

- [ ] **Step 2: Add names + glyphs; tests PASS; commit `feat(icons): add table sort glyphs`**

---

### Task 7: Table hooks (headless)

**Files:**

- Create: `packages/react/src/hooks/useTableSort.ts`, `useTableSort.test.ts`
- Create: `packages/react/src/hooks/useTableSelection.ts`, `useTableSelection.test.ts`
- Create: `packages/react/src/hooks/useTablePagination.ts`, `useTablePagination.test.ts`
- Modify: `packages/react/src/hooks/index.ts`

**Interfaces:**

```ts
export type SortDirection = 'ascending' | 'descending';
export type SortDescriptor = { column: string; direction: SortDirection };

export type UseTableSortOptions<T> = {
  data: T[];
  /** Default / uncontrolled initial sort. */
  defaultSort?: SortDescriptor;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (next: SortDescriptor) => void;
  /** Per-column comparators; default: string/number coerce on `row[column]`. */
  getSortValue?: (row: T, column: string) => string | number | boolean | null | undefined;
};

export type UseTableSortResult<T> = {
  sortedData: T[];
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (next: SortDescriptor) => void;
};

export function useTableSort<T>(options: UseTableSortOptions<T>): UseTableSortResult<T>;

export type SelectionMode = 'single' | 'multiple';

export type UseTableSelectionOptions<T> = {
  data: T[];
  getRowId: (row: T) => string;
  mode: SelectionMode;
  defaultSelectedKeys?: Iterable<string>;
  selectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;
};

export type UseTableSelectionResult = {
  selectedKeys: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  selectAll: () => void;
  clear: () => void;
  onSelectionChange: (keys: Set<string>) => void;
};

export function useTableSelection<T>(options: UseTableSelectionOptions<T>): UseTableSelectionResult;

export type UseTablePaginationOptions<T> = {
  data: T[];
  pageSize: number;
  page?: number; // 1-based controlled
  defaultPage?: number;
  onPageChange?: (page: number) => void;
};

export type UseTablePaginationResult<T> = {
  pageData: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
};

export function useTablePagination<T>(
  options: UseTablePaginationOptions<T>,
): UseTablePaginationResult<T>;
```

- [ ] **Step 1: Unit tests** — sort asc/desc toggle; selection single vs multiple + selectAll; pagination slices and clamps page

- [ ] **Step 2: Implement hooks (no DOM)**

- [ ] **Step 3: Export; tests PASS; commit `feat(react): add useTableSort/Selection/Pagination`**

---

### Task 8: `table` recipe + `Table` React + demo

**Files:**

- Create: `packages/core/src/components/table.ts`, `table.test.ts`
- Create: `packages/react/src/components/Table.tsx`, `Table.test.tsx`
- Modify: core/react indexes, themeable, App.tsx (compose hooks + Pagination + Checkbox)

**Interfaces:**

```ts
// Recipe slots
// root, table, caption, header, headerCell, body, row, cell, footer, empty
// variants: density, dividers, isStriped, hasHover, stickyHeader, textOverflow

export type TableColumnAlign = 'start' | 'center' | 'end';
export type TableColumnDef<T extends Record<string, unknown>> = {
  key: string;
  header?: ReactNode;
  align?: TableColumnAlign;
  isRowHeader?: boolean;
  width?: string;
  allowsSorting?: boolean;
};

export type TableProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  density?: 'compact' | 'balanced' | 'spacious';
  dividers?: 'rows' | 'columns' | 'grid' | 'none';
  isStriped?: boolean;
  hasHover?: boolean;
  stickyHeader?: boolean;
  textOverflow?: 'wrap' | 'truncate';
  columns?: TableColumnDef<T>[];
  data?: T[];
  getRowId?: (row: T) => string;
  renderCell?: (column: TableColumnDef<T>, row: T) => ReactNode;
  emptyContent?: ReactNode;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (next: SortDescriptor) => void;
  children?: ReactNode;
  className?: string;
  caption?: ReactNode;
};

// Parts: Table.Header, Table.Body, Table.Footer, Table.Row, Table.Column, Table.Cell, Table.Caption
export type TableColumnProps = {
  children?: ReactNode;
  isRowHeader?: boolean;
  align?: TableColumnAlign;
  width?: string;
  allowsSorting?: boolean;
  sortDirection?: SortDirection | 'none';
  onSort?: () => void;
  className?: string;
};
```

Behavior:

- Data mode: build Header from columns; Body maps rows; `Table.Column` sort button shows `<Icon name={sortDirection === 'ascending' ? 'arrowUp' : sortDirection === 'descending' ? 'arrowDown' : 'arrowsUpDown'} />` — note `arrowUp` already exists; use it for ascending.
- Sticky: `th { position: sticky; top: 0; z-index: 1; background: … }`.
- Empty: when `data` is `[]`, render `empty` slot with `emptyContent`.
- Compound mode ignores `columns`/`data`.

- [ ] **Step 1: Recipe test + React tests** (compound table semantics; data mode renders cells; emptyContent)

- [ ] **Step 2: Implement recipe + Table parts**

- [ ] **Step 3: Demo** — sort + multi-select checkboxes + Pagination wiring

- [ ] **Step 4: Validate; commit `feat(core): add table recipe` + `feat(react): add Table`** (one or two commits)

---

### Task 9: `tree` recipe (core)

**Files:**

- Create: `packages/core/src/components/tree.ts`, `tree.test.ts`
- Modify: indexes + themeable

**Interfaces:**

- Slots: `root`, `item`, `row`, `toggle`, `label`, `description`, `group`, `start`, `end`
- Variants: `density`
- Vars: indent size, row hover, selected bg, label colors
- Toggle: rotate chevron via `&[data-expanded] { transform: rotate(90deg) }`

- [ ] **Step 1–4: Test, implement, export, commit `feat(core): add tree recipe`**

---

### Task 10: `useTreeFocus` + `Tree` React + demo

**Files:**

- Create: `packages/react/src/hooks/useTreeFocus.ts`, `useTreeFocus.test.tsx`
- Create: `packages/react/src/components/Tree.tsx`, `Tree.test.tsx`
- Modify: hooks/components/react indexes, App.tsx

**Interfaces:**

```ts
export type TreeItemData = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  children?: TreeItemData[];
  isDisabled?: boolean;
  href?: string;
};

export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export type TreeProps = {
  items?: TreeItemData[];
  children?: ReactNode;
  density?: 'compact' | 'balanced' | 'spacious';
  expandedKeys?: Iterable<string>;
  defaultExpandedKeys?: Iterable<string>;
  onExpandedChange?: (keys: Set<string>) => void;
  selectedKeys?: Iterable<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  selectionMode?: TreeSelectionMode;
  renderStart?: (item: TreeItemData) => ReactNode;
  renderEnd?: (item: TreeItemData) => ReactNode;
  className?: string;
  'aria-label'?: string;
};

export type TreeItemProps = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  isDisabled?: boolean;
  href?: string;
  defaultExpanded?: boolean;
  children?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
};

// useTreeFocus — bind to tree root
export type UseTreeFocusOptions = {
  getItems: () => {
    id: string;
    element: HTMLElement;
    isDisabled: boolean;
    hasChildren: boolean;
    isExpanded: boolean;
  }[];
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  onSelect?: (id: string) => void;
};
export function useTreeFocus(options: UseTreeFocusOptions): {
  onKeyDown: (e: KeyboardEvent) => void;
  tabIndex: number;
};
```

APG keys: ArrowUp/Down move among visible rows; Left collapses or moves to parent; Right expands or moves to first child; Home/End; Enter/Space activate/select when selectionMode ≠ none. Skip disabled.

Roving tabindex on rows (`role="tree"` / `role="treeitem"` / `aria-expanded` / `aria-selected` / `aria-level`).

- [ ] **Step 1: Hook keyboard unit tests** (with stub items) + Tree expand/collapse + dual API tests

- [ ] **Step 2: Implement**

- [ ] **Step 3: Demo; validate; commit `feat(react): add Tree and useTreeFocus`**

---

### Task 11: ROADMAP tracking

**Files:**

- Modify: `ROADMAP.md` — mark Phase 4 complete (or check off with PR links as each PR merges; if implementing in one branch, mark done when all tasks land)

- [ ] **Step 1: Update ROADMAP Phase 4 checkbox + note shipped families**

- [ ] **Step 2: Commit `docs: mark Phase 4 lists/tables shipped`**

---

## Self-review (plan vs spec)

| Spec requirement                         | Task(s)      |
| ---------------------------------------- | ------------ |
| List dual API + List.Item                | 1–2          |
| DescriptionList (not MetadataList)       | 3–4          |
| OverflowList + useOverflow + render prop | 5            |
| Table semantic HTML + sticky header      | 8            |
| useTableSort/Selection/Pagination        | 7–8          |
| No plugins bag / no RAC Table            | Global + 7–8 |
| Tree + useTreeFocus (not TreeList)       | 9–10         |
| arrowDown / arrowsUpDown                 | 6            |
| Example Data display gallery             | 2,4,5,8,10   |
| Filter/resize deferred                   | Non-goal     |

No TBD placeholders. Hook result types in Task 7 match Table wiring in Task 8. `arrowUp` reused for ascending sort (already in registry).
