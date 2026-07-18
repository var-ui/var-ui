# Phase 4 — Lists, tables, and data display

Design for V6 Phase 4 from `specs/component-breadth.md` / `ROADMAP.md`.
Ships the full table-and-list tier needed for admin UI competitiveness with
Astryx, without copying Astryx’s plugin registry, StyleX patterns, or naming
where clearer alternatives exist.

**Date:** 2026-07-17  
**Status:** Approved for planning  
**Parent:** `specs/component-breadth.md` § Phase 4

---

## Goals

- Ship Phase 4 end-to-end: `List`, `Table`, `DescriptionList`, `OverflowList`,
  `Tree`, plus `useTableSort` / `useTableSelection` / `useTablePagination`.
- Stay competitive with Astryx’s Table & List category for internal-tools
  surfaces while differentiating on API shape and architecture.
- Dual consumption model: `items` + render props **and** namespaced compound
  children (`List.Item`, `Table.Row`, …), matching `TabList.Tab` /
  `SideNav.Item`.
- Semantic HTML `<table>` parts + headless hooks (no RAC `Table`, no
  `plugins={{}}` bag).
- Make every family usable in the example app under a “Data display” gallery.

## Non-goals

- RAC `Table` / `GridList` / `Tree` as the foundation for this phase.
- Table filter, column resize, sticky columns, column settings / visibility.
- Virtualization, infinite scroll, spreadsheet-style editing.
- A public shared `Item` layout primitive (layout stays private to List/Tree).
- Phase 3 P2 Lightbox/Overlay; Phase 5 P3 Outline / NavIcon / NavMenu.
- Merging docs `fileTree` into product `Tree`.
- Full V3 classname snapshot / lint-rule audit.
- Per-recipe `.doc.ts` structured docs.

## Decisions (locked)

| Topic              | Choice                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Scope              | **Full Phase 4** (P1–P3 families in one design; multiple PRs)                                  |
| Table strategy     | Semantic HTML table parts + recipes + **headless** hooks (Approach 1)                          |
| Dual API           | Both `items` array and compound children; namespaced subcomponents (`List.Item`, …)            |
| Table plugins      | **Admin-core set**: sort + selection + pagination; filter/resize deferred                      |
| Plugin shape       | Pure controlled hooks — **no** Astryx-style `plugins` registry on Table                        |
| Naming             | Prefer clarity: `DescriptionList` (not MetadataList), `Tree` (not TreeList); keep OverflowList |
| List selection     | Out of scope on `List` (use Table selection or a later selectable list)                        |
| Tree foundation    | Hand-rolled APG tree focus via `useTreeFocus`                                                  |
| Overflow indicator | Render prop — caller owns `+N` / Popover / menu UI                                             |
| Shipping           | **One PR per family** (table hooks ship with Table)                                            |

Resolves open decision **#3** in `component-breadth.md` (Table strategy).

---

## Architecture

```
@var-ui/core     recipes: list, table, descriptionList, overflowList, tree
@var-ui/react    components + hooks
  List / Table / DescriptionList / OverflowList / Tree   presentational + dual API
  useTableSort / useTableSelection / useTablePagination  pure state (no DOM)
  useOverflow / useTreeFocus                             measurement / keyboard
```

Each family: core recipe with `c.vars()` → React wrapper → example-app demo →
tests. Shared conventions match prior component-breadth work (Phase 3 P1 /
Phase 5):

- Core: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })`
- React: hand-rolled DOM for static/semantic chrome; RAC only where an
  existing primitive is reused (e.g. `Checkbox`, `Button`, `Pagination`,
  `Popover` in demos)
- Icons only through `IconProvider` / `<Icon>`
- Exports: core from `packages/core/src/components/index.ts`; React from
  `packages/react/src/components/index.ts` + `packages/react/src/hooks`

---

## Suggested PR order

1. `List` (+ `list` recipe)
2. `DescriptionList` (+ `descriptionList` recipe)
3. `OverflowList` + `useOverflow`
4. `Table` + `useTableSort` / `useTableSelection` / `useTablePagination`
5. `Tree` + `useTreeFocus`

List first establishes the dual-API / namespace pattern. Table before Tree so
the admin demo can compose Table + Pagination. Tree last (largest a11y
surface).

---

## 1. List

### Role

Generic vertical list for settings rows, member lists, and static content —
not a data table and not a selectable grid.

### Core — `list`

Slots: `root`, `header`, `item`, `label`, `description`, `start`, `end`,
`divider`.

Variants:

- `density`: `compact` | `balanced` | `spacious`
- `listStyle`: `none` | `disc` | `decimal` (`decimal` → `<ol>`, else `<ul>`)
- `hasDividers`: boolean

Themeable via `c.vars()`: density padding, divider color, interactive
hover/press colors.

### React

```tsx
<List density="compact" hasDividers header="Members">
  <List.Item
    label="Ada"
    description="Admin"
    startContent={<Avatar />}
    endContent={<Badge>You</Badge>}
    href="/u/ada"
  />
</List>

<List
  items={[{ id: 'ada', label: 'Ada', description: 'Admin', href: '/u/ada' }]}
  renderStart={(item) => <Avatar name={String(item.label)} />}
/>
```

Props (root): `density`, `listStyle`, `hasDividers`, `header`, `items?`,
`renderStart?`, `renderEnd?`, `children?`, `className?`.

`List.Item` props: `label`, `description?`, `startContent?`, `endContent?`,
`href?`, `onPress?`, `isDisabled?`, `id?` (required in items mode).

Behavior:

- Interactive when `onPress` or `href` is set (invisible button/link overlay —
  single accessible hit target; no nested interactives in the label row).
- Selection is **out of scope**.
- No public shared `Item` export — layout is private to `List.Item`.

---

## 2. DescriptionList

### Role

Semantic key/value display (`<dl>` / `<dt>` / `<dd>`). Renamed from Astryx’s
`MetadataList` for HTML clarity.

### Core — `descriptionList`

Slots: `root`, `title`, `item`, `term`, `details`, `toggle`.

Vars: label/term color, gap, term width.

### React

```tsx
<DescriptionList columns="single" labelPosition="start" maxItems={4} title="Details">
  <DescriptionList.Item label="Owner">Ada</DescriptionList.Item>
  <DescriptionList.Item label="Region">us-west</DescriptionList.Item>
</DescriptionList>

<DescriptionList items={[{ id: 'o', label: 'Owner', value: 'Ada' }]} />
```

Props:

- `columns`: `'single' | 'multi' | number` (default `'single'`)
- `labelPosition`: `'start' | 'top'` — defaults to `start` for single column,
  `top` for multi
- `maxItems?` — when exceeded, Show more / Show less via text `Button`
- `title?`, `items?`, `children?`

`DescriptionList.Item`: `label` (string), `children` / `value`, optional
`icon` (`IconName` | `ReactNode`).

Horizontal wrap orientation is **deferred** unless it falls out of the grid
layout cheaply during implementation.

---

## 3. OverflowList

### Role

Horizontal row that shows as many children as fit and collapses the rest
behind a caller-supplied overflow affordance. Name kept (`OverflowList`) —
already descriptive.

### Core — `overflowList`

Slots: `root`, `item`, `overflow`. Gap via token / `c.vars()`.

### React

```tsx
<OverflowList
  renderOverflow={(hidden) => <Button>+{hidden.length}</Button>}
  fillParent
>
  <OverflowList.Item>Alpha</OverflowList.Item>
  <OverflowList.Item>Beta</OverflowList.Item>
</OverflowList>

<OverflowList
  items={tags}
  renderItem={(t) => <Badge>{t.label}</Badge>}
  renderOverflow={(hidden) => /* Popover / menu */}
/>
```

Props: `items?`, `children?`, `renderItem?`, `renderOverflow` (required when
overflow can occur), `maxVisible?` (hard cap in addition to measure-to-fit),
`fillParent?`, `gap?`.

### Hook — `useOverflow`

- ResizeObserver + hidden measurement row (no flicker).
- Exported from `@var-ui/react` hooks barrel.
- Used internally by `OverflowList`; available for custom layouts.

---

## 4. Table

### Role

Presentational semantic HTML data table for admin grids. Behavior comes from
hooks + caller wiring — Table does not own sort/selection/pagination state.

### Core — `table`

Slots: `root` (scroll wrapper), `table`, `caption`, `header`, `headerCell`,
`body`, `row`, `cell`, `footer`, `empty`.

Variants:

- `density`: `compact` | `balanced` | `spacious`
- `dividers`: `rows` | `columns` | `grid` | `none`
- `isStriped`, `hasHover`, `stickyHeader`
- `textOverflow`: `wrap` | `truncate`

Sticky header: `position: sticky` on `th` inside the scroll `root` (CSS only).

### React (dual)

```tsx
<Table density="compact" stickyHeader dividers="rows">
  <Table.Header>
    <Table.Row>
      <Table.Column isRowHeader>Name</Table.Column>
      <Table.Column>Role</Table.Column>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Ada</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>

<Table
  columns={[
    { key: 'name', header: 'Name', isRowHeader: true },
    { key: 'role', header: 'Role', align: 'end' },
  ]}
  data={rows}
  getRowId={(r) => r.id}
  renderCell={(column, row) => row[column.key]}
  emptyContent={<EmptyState title="No rows" />}
/>
```

Namespaced parts: `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`,
`Table.Column`, `Table.Cell`, `Table.Caption`.

Column model (data-driven): `key`, `header?`, `align?` (`start` | `center` |
`end`), `isRowHeader?`, `width?` (CSS length string — no proportional helper
in v1), optional sort chrome props (`sortDirection?`, `allowsSorting?`) wired
by the caller from `useTableSort`.

Sort icons: add registry names `arrowDown` / `arrowsUpDown` (already listed
in `component-breadth.md` icon tables) and render via `<Icon>` when a column
allows sorting.

Selection UI is **caller-composed** (e.g. a leading `Table.Column` with
`Checkbox`) — no magic `selectionMode` prop on Table itself.

### Hooks (headless)

| Hook                                            | Responsibility                       | Typical wiring                       |
| ----------------------------------------------- | ------------------------------------ | ------------------------------------ |
| `useTableSort({ data, defaultSort? })`          | Sort descriptor + sorted rows        | Column `onSort` + sorted `data`      |
| `useTableSelection({ data, getRowId, mode })`   | `single` \| `multiple` selection set | Checkboxes / `aria-selected` on rows |
| `useTablePagination({ data, pageSize, page? })` | Page slice + page/totalPages         | Existing `Pagination` component      |

Compose in the app (no plugin bag):

```tsx
const { sortedData, sortDescriptor, onSortChange } = useTableSort({ data });
const { pageData, page, setPage, totalPages } = useTablePagination({
  data: sortedData,
  pageSize: 20,
});
const selection = useTableSelection({
  data: pageData,
  getRowId: (r) => r.id,
  mode: 'multiple',
});
```

Controlled and uncontrolled modes supported where natural (`defaultSort` /
`sortDescriptor`+`onSortChange`, etc.).

**Deferred:** filter, column resize, sticky columns, column visibility.

---

## 5. Tree

### Role

Hierarchical expandable list with APG tree keyboard behavior. Renamed from
Astryx’s `TreeList`. Docs `fileTree` remains a separate static recipe.

### Core — `tree`

Slots: `root`, `item`, `row`, `toggle`, `label`, `description`, `group`,
`start`, `end`. Indent via padding / `c.vars()` per level. Density aligned
with `List`.

### React

```tsx
<Tree
  items={[
    {
      id: 'src',
      label: 'src',
      children: [{ id: 'app', label: 'App.tsx' }],
    },
  ]}
  expandedKeys={expanded}
  onExpandedChange={setExpanded}
  selectedKeys={selected}
  onSelectionChange={setSelected}
  selectionMode="single"
/>;

{
  /* Optional renderStart / startContent: arbitrary nodes; no new folder/file icon names in v1 */
}

<Tree>
  <Tree.Item id="src" label="src" defaultExpanded>
    <Tree.Item id="app" label="App.tsx" />
  </Tree.Item>
</Tree>;
```

Item fields: `id`, `label`, `description?`, `children?`, `isDisabled?`,
`href?`, `onPress?`.

- Expand chevron: `<Icon name="chevronRight">`, rotates when expanded.
- `selectionMode`: `'none'` (default) | `'single'` | `'multiple'`.
- Controlled `expandedKeys` / uncontrolled `defaultExpandedKeys` (and
  per-item `defaultExpanded` in compound mode).

### Hook — `useTreeFocus`

Hand-rolled APG tree focus: ArrowUp/Down, Left/Right (collapse/expand +
move), Home/End, skip disabled. Typeahead **deferred** if costly in v1.
Exported from hooks barrel; used internally by `Tree`.

---

## Testing

- Core: recipe exports + themeable `c.vars()` smoke where existing patterns
  require it.
- React dual-API parity: items mode vs compound children produce equivalent
  structure for List, DescriptionList, OverflowList, Table, Tree.
- Table hooks: pure unit tests (sort order, page slices, selection set math,
  controlled updates).
- Overflow: fixed-width measurement with mocked `getBoundingClientRect` /
  `ResizeObserver` in jsdom.
- Tree: keyboard cases (arrows, expand/collapse, disabled skip).
- Validation gate per PR: `vp check`, `vp test`, build `@var-ui/core` +
  `@var-ui/react`.

## Example app

One **Data display** gallery section covering:

- List (compound + items)
- DescriptionList (collapse via `maxItems`)
- OverflowList (with a simple `+N` Popover demo)
- Table composed with sort + multi-select + `Pagination`
- Tree (expand/collapse + optional selection)

## Tracking updates

When this spec is approved for planning:

- [x] Record Table strategy decision in `component-breadth.md` open decisions
- [x] Point `ROADMAP.md` Phase 4 at this spec
- [ ] Check off Phase 4 items as PRs land

## Done when

- All five families + three table hooks + `useOverflow` + `useTreeFocus` are
  exported from `@var-ui/core` / `@var-ui/react`.
- Example demos wired; check/test/build green.
- ROADMAP Phase 4 marked complete (or progressively checked per PR).

---

## References

- Parent plan: `specs/component-breadth.md` § Phase 4
- Prior dual-API / namespace examples: `TabList`, `SideNav`, `TopNav`
- Existing consumers for composition: `Pagination`, `Checkbox`, `EmptyState`,
  `Icon`, `Popover` / `Button`
- Icon registry names: add `arrowDown` / `arrowsUpDown` with the Table PR;
  Tree reuses `chevronRight`
