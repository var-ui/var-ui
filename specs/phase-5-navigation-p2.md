# Phase 5 P2 — SideNav, TopNav, MobileNav, AppShell, TabList

Design for the P2 slice of V6 Phase 5 from `specs/component-breadth.md` /
`ROADMAP.md`. Ships navigation chrome at full Astryx parity for this slice,
pulls a minimal `AppShell` forward from P3, and resolves the Tabs vs TabList
decision. Defers Phase 5 P3 leftovers (`Outline`, `NavIcon`/`NavMenu`) to their
own spec.

**Date:** 2026-07-17  
**Status:** Shipped  
**Parent:** `specs/component-breadth.md` § Phase 5

---

## Goals

- Ship full Astryx-parity navigation chrome for this slice: `Resizable` /
  `ResizeHandle`, `SideNav`, `TopNav` (+ mega menu), `MobileNav`, minimal
  `AppShell`, and nav `TabList` / `Tab` / `TabMenu`.
- Keep existing panel `Tabs` unchanged in role; add `TabList` as a separate
  nav family (see Decisions).
- Use children composition with **namespaced** compounds (`SideNav.Section`,
  `TopNav.Item`, `TabList.Tab`, etc.).
- Ship foundation-first, **one PR per family** (Approach 1).
- Land an example-app admin shell demo once `AppShell` ships.

## Non-goals

- Phase 5 P3 leftovers: `Outline`, `NavIcon`, `NavMenu`.
- Full Phase 6 layout suite (`Collapsible`, multi-pane `Layout*`,
  `LayoutHeader`/`LayoutPanel`, etc.) — only the SideNav-needed Resizable
  surface lands in P2; multi-region split panes deepen later without API churn.
- Reworking panel `Tabs` into nav tabs or merging the two APIs.
- Auto-mirroring SideNav children into MobileNav without an explicit
  `mobileNav` slot (consumers share a variable for v1).
- Custom `as` / `LinkProvider` router adapters (plain `href` + RAC `Link` /
  `<a>` for v1).
- V3 classname snapshot / lint-rule audit.
- Per-recipe `.doc.ts` structured docs.

## Decisions (locked)

| Topic              | Choice                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Scope depth        | **Full Astryx P2 parity** — SideNav resize, TopNav mega menu, rich MobileNav                            |
| AppShell           | **Pulled into P2** (minimal); Outline / NavIcon / NavMenu stay P3                                       |
| Resizable          | **Shared `useResizable` + `ResizeHandle`** extracted in P2 (Phase 6 builds on it)                       |
| Tabs vs TabList    | **Keep both** — RAC panel `Tabs` stays; add nav `TabList`/`Tab`/`TabMenu`                               |
| Composition        | **Children + namespaced compounds** (`SideNav.Section`, not free `SideNavSection`)                      |
| Shipping           | **Foundation-first, one PR per family**                                                                 |
| MobileNav stacking | RAC `Modal`/`ModalOverlay` (or native `<dialog>`) + existing layer/scroll-lock — no new stacking system |
| AppShell layout    | CSS grid/flex via `appShell` recipe — **do not** pull Phase 6 `Layout*` families                        |

## Suggested PR order

1. Resizable (`useResizable`, `ResizeHandle`, `ResizableConfig`)
2. SideNav
3. TopNav (+ mega menu)
4. MobileNav
5. AppShell
6. TabList

No skipping: SideNav depends on Resizable; AppShell depends on SideNav /
TopNav / MobileNav. TabList is independent of the shell but ships last so the
admin-shell demo can close the phase without waiting on nav-tabs polish.

---

## Shared conventions

Aligned with Phase 5 P1 / Phase 3 P1:

- Core: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })`
  with themeable values via `c.vars()`.
- React: RAC for focus, keyboard, ARIA, menus, and modal/dialog; hand-rolled
  DOM only for static chrome.
- Namespaced compounds: attach subcomponents on the parent function
  (`SideNav.Section = SideNavSection`) and also export the parts for
  tree-shaking / docs if useful.
- Icons only through `IconProvider` / `<Icon>`. Add `menu` (already reserved
  in `component-breadth.md` for MobileNav toggle). Reuse `close`,
  `chevronLeft`/`Right`/`Down`, `moreHorizontal`.
- Exports: core recipes from `packages/core/src/components/index.ts`; React
  components + types from `packages/react/src/components/index.ts` and
  `packages/react/src/index.ts`.
- Validation: `vp check`, `vp test`, build core + react before finishing a PR.
- Example-app demo section for each family; admin shell after AppShell.

### Architecture

```text
Resizable / ResizeHandle / useResizable
        ↓
     SideNav  ──────────────────────┐
                                    │
TopNav (+ MegaMenu) ───────────────► AppShell (slots + mobile context)
                                    │
MobileNav (+ Toggle) ───────────────┘
        ↑
  shares SideNav.* children

Tabs (existing, panels)     TabList / Tab / TabMenu (new, nav)
```

---

## 1. Resizable

### Exports

| Export                 | Role                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `useResizable(config)` | Size state, collapse, drag handlers, optional `autoSaveId` localStorage |
| `ResizeHandle`         | Accessible separator (keyboard + pointer); pill grip via recipe         |
| `ResizableConfig`      | Shared shape SideNav (and later Layout) consume                         |

### P2 hook scope

**Single-region** resize (what SideNav needs). Multi-region split panes can
deepen in Phase 6 without renaming these exports.

### SideNav defaults (via `ResizableConfig`)

- `defaultWidth: 260`
- `minWidth: 180`
- `maxWidth: 480`
- Drag below ~160px collapses when SideNav is `collapsible`
- Handle hidden while collapsed

### Core

`resizeHandle` recipe slots: `root`, `pill` (direction variant via data attr /
prop). Themeable grip colors via `c.vars()`.

### Testing

- Keyboard resize (arrow keys) and pointer drag clamp to min/max.
- `autoSaveId` round-trips width through `localStorage`.
- Collapse threshold when `collapsible` is enabled on the hook config.

---

## 2. SideNav

### React API

Five zones + collapse + resize:

```tsx
<SideNav
  header={<SideNav.Heading heading="Acme" />}
  topContent={<Button>New</Button>}
  footer={…}
  footerIcons={…}
  collapsible
  resizable
>
  <SideNav.Section title="Main">
    <SideNav.Item label="Dashboard" href="/" isSelected />
    <SideNav.Item label="Projects" href="/projects" collapsible>
      <SideNav.Item label="Alpha" href="/projects/alpha" />
    </SideNav.Item>
  </SideNav.Section>
</SideNav>
```

### Namespaced parts

| Part                     | Role                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SideNav.Heading`        | Brand block (heading / optional super/sub + hrefs; optional `menu` popover via existing Popover/DropdownMenu)                              |
| `SideNav.Section`        | Optional title / subtitle / endContent; groups items                                                                                       |
| `SideNav.Item`           | Label, `href` or `onPress`, icons (`IconName` or node), `isSelected`, `isDisabled`, `endContent`, nested children + per-item `collapsible` |
| `SideNav.CollapseButton` | Optional external toggle (collapse context / imperative handle)                                                                            |

### Behavior

- `collapsible: boolean \| { defaultIsCollapsed?, isCollapsed?, onCollapsedChange?, hasButton?, buttonLabel? }`
- `resizable: boolean \| ResizableConfig` — uses §1 primitives
- Collapsed: icon-only items; labels via existing `Tooltip`
- Imperative `handleRef` for external `CollapseButton` (separate from DOM `ref`)

### Core

Recipe `sideNav` slots: `root`, `stickyTop`, `scrollable`, `footer`,
`footerIcons`, `item`, `section`, `heading`, `collapseButton` (resize handle
reuses `resizeHandle` recipe).

### Deferred inside SideNav

- Custom `as` link component / LinkProvider
- Shared `NavItem` style module (SideNav owns item styles for v1)

---

## 3. TopNav

### React API

Slot chrome: `heading` | `startContent` (`children` alias) | `centerContent` |
`endContent`. Flex when no center; 3-column grid when `centerContent` is set.
Root is `<nav aria-label={label}>` (default `"Top navigation"`).

```tsx
<TopNav
  heading={<TopNav.Heading heading="Acme" />}
  endContent={<Avatar … />}
>
  <TopNav.Item label="Home" href="/" isSelected />
  <TopNav.Menu label="Products" items={[…]} />
  <TopNav.MegaMenu
    label="Solutions"
    items={…}
    featured={<TopNav.MegaMenu.FeaturedCard … />}
  />
</TopNav>
```

### Namespaced parts

| Part                           | Role                                                                      |
| ------------------------------ | ------------------------------------------------------------------------- |
| `TopNav.Heading`               | Brand text/icon (+ optional hrefs)                                        |
| `TopNav.Item`                  | Link/button; `isSelected` → `aria-current="page"`; icon-only mode         |
| `TopNav.Menu`                  | Hover/focus popover of rich items (reuse HoverCard/Popover + item layout) |
| `TopNav.MegaMenu`              | Full-width panel; slots `items` + `featured`; hover open/close delays     |
| `TopNav.MegaMenu.Item`         | Mega panel link/row                                                       |
| `TopNav.MegaMenu.FeaturedCard` | Featured right-panel content                                              |

### Core

Recipe `topNav` slots covering bar regions, item, menu trigger, mega panel,
mega item, featured card. Themeable via `c.vars()`.

---

## 4. MobileNav

### React API

Slide-out drawer; accepts the same children as SideNav (sections/items) or
any `ReactNode`. Controlled outside AppShell; inside AppShell, open state
comes from context.

| Piece              | Role                                                                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MobileNav`        | Drawer: `isOpen` / `onOpenChange`, `header`, `width` (default 320, capped at 85vw), `side: 'start' \| 'end' \| 'auto'`                                         |
| `MobileNav.Toggle` | Hamburger (`menu` icon). In AppShell: reads context, renders nothing above mobile breakpoint. Outside AppShell: requires explicit handlers or a local provider |

### Implementation

Prefer RAC `Modal` / `ModalOverlay` (or native `<dialog>`) + existing
`useScrollLock` / `LayerProvider`. Escape + backdrop dismiss; focus trap.
No new z-index / stacking infrastructure.

### Core

Recipe `mobileNav` slots: `overlay`/`dialog`, `panel`, `header`, `closeButton`,
`toggle`.

### Icons

Add `menu` to `iconNameList` + `@var-ui/icons` glyph in this PR (or with
AppShell if Toggle ships only then — prefer with MobileNav).

---

## 5. AppShell (minimal; pulled from P3)

### React API

Composes chrome without Phase 6 `Layout*` families — CSS grid/flex in an
`appShell` recipe.

```tsx
<AppShell
  topNav={<TopNav … />}
  sideNav={<SideNav … />}
  mobileNav={
    <MobileNav header="Menu">{/* shared SideNav.* tree */}</MobileNav>
  }
  banner={<Banner … />}
  height="fill" // | 'auto'
  variant="elevated" // wash | surface | section | elevated
  contentPadding={4}
>
  {children} {/* rendered in <main> */}
</AppShell>
```

### Owns

- Mobile open state + breakpoint (reuse `useMediaQuery`)
- Skip-to-content link targeting main
- Hide persistent SideNav below breakpoint
- Context so `MobileNav` / `MobileNav.Toggle` stay in sync — consumers place
  `<MobileNav.Toggle />` in `TopNav` `endContent` (or equivalent); AppShell
  does not inject the toggle automatically

### Still P3

- `Outline`, `NavIcon`, `NavMenu`
- Auto-deriving `mobileNav` from `sideNav` children

### Core

Recipe `appShell` slots: `root`, `banner`, `topNav`, `sideNav`, `main`,
`skipLink`; variants for `height` / `variant` / content padding.

### Example app

Admin shell demo: TopNav + collapsible/resizable SideNav + MobileNav at
narrow width + main content. Theme smoke light/dark.

---

## 6. TabList

### Decision

**Keep both families:**

| Family            | Role                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| `Tabs` (existing) | In-page content switching with panels (RAC `Tabs` / `TabPanel`)                 |
| `TabList` (new)   | Nav landmark for view switching; optional `href`s; overflow menu; **no panels** |

Resolves `specs/component-breadth.md` open decision #2.

### React API

```tsx
<TabList value={tab} onChange={setTab} size="md" layout="hug" hasDivider orientation="horizontal">
  <TabList.Tab value="overview" label="Overview" href="/overview" />
  <TabList.Tab value="activity" label="Activity" endContent={<Badge>3</Badge>} />
  <TabList.Menu
    label="More"
    options={[
      { value: 'settings', label: 'Settings' },
      { value: 'audit', label: 'Audit log' },
    ]}
  />
</TabList>
```

### Namespaced parts

| Part           | Role                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `TabList`      | Controlled `value` / `onChange`; size `sm\|md\|lg`; `layout` hug/fill; `hasDivider`; orientation; roving tabindex (Arrow / Home / End) |
| `TabList.Tab`  | Button or link (`href`); selected styling; optional icons / `endContent` / `isLabelHidden`                                             |
| `TabList.Menu` | Overflow “More” trigger; reuses `DropdownMenu`; selecting an option calls `onChange`                                                   |

### Core

Recipe `tabList` slots: `root`, `tab`, `indicator`, `menu`, `menuTrigger`.
Do **not** reuse the `tabs` recipe — different semantics (nav vs panels) and
visual tokens may diverge.

### Testing

- Keyboard roving focus and selection
- `href` tabs render as links with correct `aria-current`
- `TabList.Menu` selection updates `value` via `onChange`

---

## Example app

- Per-family gallery sections as each PR lands.
- After AppShell: dedicated **admin shell** demo (SideNav + TopNav +
  MobileNav + main). Manual theme smoke across built-in themes before closing
  the phase; automated visual regression out of scope.

---

## Success criteria

Phase 5 P2 is done when:

1. All six families are exported from `@var-ui/core` / `@var-ui/react`.
2. Each has unit tests green under `vp test`.
3. Admin shell demo works in the example app (incl. mobile drawer).
4. ROADMAP notes P2 shipped; P3 trimmed to Outline + NavIcon/NavMenu;
   Resizable called out as pulled forward from Phase 6.
5. `component-breadth.md` open decision #2 updated to **keep both**.
6. No regressions to existing `Tabs` / Dialog / DropdownMenu / HoverCard /
   Tooltip behavior.

---

## Open follow-ups (explicitly deferred)

- Phase 5 P3: `Outline`, `NavIcon`, `NavMenu`.
- Phase 6: multi-region `Resizable` layouts, `Collapsible*`, full `Layout*`.
- LinkProvider / custom `as` adapters for nav items.
- Auto-sharing SideNav tree into MobileNav inside AppShell.
- Panel `Tabs` enhancements (overflow, href mode) — out of scope; use TabList.

---

## Relationship to other docs

- Breadth inventory & phase table: `specs/component-breadth.md`
- Tracking: `ROADMAP.md` V6 Phase 5
- Prior slice: `specs/phase-5-navigation-p1.md`
- Implementation plan: `plans/2026-07-17-phase-5-navigation-p2.md` (to be
  written after this spec is reviewed)
- Astryx references (parity target, not a dependency): SideNav, TopNav,
  MobileNav, AppShell, TabList, Resizable in `facebook/astryx`
