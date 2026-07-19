# Docs shell parity — design

Make `@var-ui/react` sufficient for documentation-site chrome so the Var UI
docs app uses package components instead of a parallel custom shell.

**Date:** 2026-07-18  
**Status:** Shipped  
**Parent:** `specs/component-breadth.md` (Phase 5 P3 Outline; Phase 6
Collapsible pulled forward); docs readiness review

---

## Goals

- Ship missing primitives needed for a docs site: `Outline`, `Collapsible` /
  `CollapsibleGroup`, an `AppShell` aside slot, and thin React wrappers for
  existing core recipes (`Skeleton`, `StatusDot`, `Kbd`, `Steps`, `FileTree`).
- Wire docs search with existing `CommandPalette` (header trigger + ⌘K).
- Migrate `docs/` chrome onto `AppShell` + `TopNav` + `SideNav` + `MobileNav` +
  `Outline` and delete most of `docsShell` / custom sidebar / TOC / mobile nav.
- Prove the composition so third parties can build docs sites with Var UI and
  little custom layout CSS.

## Non-goals

- No `@var-ui/docs` package or high-level `DocsLayout` kit.
- Leave in `docs/`: `Demo`, `PropsTable`, MDX component map, homepage bento,
  nav/data registries, heading extraction, route loaders.
- Defer `NavIcon` / `NavMenu` (remaining Phase 5 P3 leftovers).
- Defer multi-region `Layout*` and multi-pane resizable deepen (rest of
  Phase 6).
- No full-text search engine — build a `CommandPalette` index from existing
  sidebar + component registry data.

## Locked decisions

| Topic         | Choice                                                          |
| ------------- | --------------------------------------------------------------- |
| Scope depth   | Shell parity (not a docs kit; not maximal extraction)           |
| TOC placement | First-class `aside` / outline slot on `AppShell`                |
| Collapsible   | Include in this initiative (pulled forward from Phase 6)        |
| Thin wrappers | `Kbd`, `Steps`, `FileTree`, `Skeleton`, `StatusDot`             |
| Shipping      | Vertical slices — Approach 1 (one usable PR at a time)          |
| Search        | Docs composition around `CommandPalette`; no new search package |

## Target composition

```tsx
<AppShell
  topNav={
    <TopNav endContent={<>
      <SearchTrigger />
      <ColorModeToggle />
      {/* GitHub, etc. */}
    </>}>
      {/* brand + primary links */}
    </TopNav>
  }
  sideNav={<SideNav>{/* sections / items from nav data */}</SideNav>}
  aside={<Outline items={headings} />}
  mobileNav={<MobileNav>{/* shared SideNav tree */}</MobileNav>}
>
  <article className={proseContent().root}>{mdx}</article>
</AppShell>
<CommandPalette items={searchIndex} onAction={navigate} />
```

---

## Component APIs

### `AppShell` aside slot

- New optional prop: `aside?: ReactNode`.
- New recipe slot: `aside`.
- When `aside` is present, frame grid is:

  ```
  "top top top"
  "side main aside"
  ```

  with columns `auto 1fr auto`. When `aside` is omitted, keep the current
  two-column grid (no empty third column).

- Hide `aside` under the existing `data-mobile` breakpoint (same as
  `sideNav`). Mobile has no TOC rail in v1.
- Optional CSS custom property for aside width; default ~12.5rem (matches
  current docs TOC).

### `Outline`

- Core recipe + React wrapper.
- Items API: `{ id: string; text: string; level: 2 | 3 }[]`, and/or compound
  `Outline.Item` children.
- Sticky “On this page” nav; nest/indent `level === 3`.
- Active item: controlled `activeId`, or built-in scroll-spy via
  `IntersectionObserver` against `document.getElementById(id)` (default on).
- Links are plain `#id` anchors (router-agnostic), matching today’s `DocsToc`.

### `Collapsible` / `CollapsibleGroup`

- Built on RAC `Disclosure` / `DisclosureGroup`.
- `Collapsible`: `title` (or `trigger` slot) + `children`; controlled /
  `defaultExpanded`.
- `CollapsibleGroup`: exclusive or multi-expand via RAC group semantics.
- Chevron via `<Icon name="chevronDown" />` (already in the icon registry).
- Docs adoption: replace the raw “Show code” control in `Demo` with
  `Collapsible`. `Demo` itself stays docs-local.

### Thin wrappers

Presentational React wrappers over existing core recipes (no new recipes
required unless a small API gap appears during implementation):

| Component   | Shape                                                          |
| ----------- | -------------------------------------------------------------- |
| `Skeleton`  | `shape` (+ size via `className` / style)                       |
| `StatusDot` | `tone`, `pulse`; require `aria-label` or adjacent visible text |
| `Kbd`       | children → `<kbd>`                                             |
| `Steps`     | `<ol>` root; children are `<li>`                               |
| `FileTree`  | compounds matching recipe slots: root / folder / file          |

### Search (docs-only composition)

- Header: `IconButton` (search) + optional `<Kbd>⌘K</Kbd>` opens
  `CommandPalette`.
- Index built in docs from `sidebar` + `componentRegistry` (`title` / `meta` /
  `keywords` → route id).
- `CommandPalette` keeps default `hotkey` (⌘K / Ctrl+K).
- `onAction` navigates via the TanStack router.

---

## Docs migration

After the package pieces land:

1. Wrap docs routes in `AppShell` (homepage may omit side/aside or sit outside
   the shell).
2. Replace `DocsHeader` with `TopNav` (brand, primary links, `MobileNav.Toggle`,
   search trigger, `ColorModeToggle`, GitHub).
3. Replace `DocsSidebar` / rail with `SideNav` + `SideNav.Section` /
   `SideNav.Item` driven by `navigation.ts`.
4. Replace `DocsToc` with `Outline` in `aside`.
5. Replace custom `DocsMobileNav` + docs `MobileNavContext` with package
   `MobileNav` / provider (AppShell already wraps `MobileNavProvider`).
6. Shrink `DocsPageLayout` to MDX article + `PropsTable` wiring inside shell
   children (or a thin helper that only passes headings into `aside`).
7. Delete `docsShell` once unused; delete obsolete chrome files.
8. Update `Demo` to use `Collapsible` for show-code.

### Intentionally custom after migration

- Nav/data registries, heading extraction, MDX components map, `PropsTable`,
  homepage bento, route loaders.
- Tiny glue: search-index builder and navigate-on-action.

---

## Testing

- **Package:** unit tests for `Outline` (active state / scroll-spy with mocked
  observer), `Collapsible` expand + keyboard, `AppShell` aside grid and
  `data-mobile` hiding, thin-wrapper smoke renders.
- **Docs:** update existing chrome tests; add a search open/navigate smoke test
  if practical.
- **Example app:** small Outline + AppShell-aside demo.
- **Gate:** `vp check` and `vp test` for touched packages/docs.

---

## PR order (Approach 1)

1. Thin wrappers (`Skeleton`, `StatusDot`, `Kbd`, `Steps`, `FileTree`)
2. `Outline` + `AppShell` `aside` slot → replace `DocsToc` / body grid usage
3. Docs chrome migration → `AppShell` + `TopNav` + `SideNav` + `MobileNav` +
   `Outline`; delete custom shell
4. `CommandPalette` search wiring + `Kbd` in header
5. `Collapsible` / `CollapsibleGroup` + `Demo` adoption

Each PR should leave docs more on Var UI than before.

## ROADMAP / parent-spec updates

- Mark Phase 5 P3 `Outline` as addressed by this initiative; leave
  `NavIcon` / `NavMenu` deferred.
- Note `Collapsible` pulled forward from Phase 6 into this initiative.
- Update `specs/component-breadth.md` inventory rows when components ship.

---

## Success criteria

- Docs article pages render with package `AppShell` / nav / `Outline` and no
  dependency on `docsShell` for chrome.
- ⌘K (and a header control) open a palette that navigates to docs/component
  pages.
- A third party can copy the docs composition using only `@var-ui/react` +
  their own content/routing data, without forking a docs layout CSS module.
