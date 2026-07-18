# Phase 5 P2 Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Phase 5 P2 — `Resizable`, `SideNav`, `TopNav` (+ mega menu), `MobileNav`, minimal `AppShell`, and nav `TabList` — per `specs/phase-5-navigation-p2.md`.

**Architecture:** TypeStyles recipes in `@var-ui/core` plus React Aria Components wrappers in `@var-ui/react`. Foundation-first: shared `useResizable`/`ResizeHandle` first, then SideNav (consumes resize), TopNav, MobileNav, AppShell (composes the three + mobile context), then TabList (independent nav tabs; panel `Tabs` unchanged). Namespaced compounds (`SideNav.Section`, etc.).

**Tech Stack:** TypeStyles ^0.8+, React 19, react-aria-components, vite-plus (`vp`), Vitest via `vp test`, pnpm workspace.

## Global Constraints

- Spec: `specs/phase-5-navigation-p2.md` (locked decisions — do not reopen).
- TypeStyles recipes: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })` from `../runtime`; tokens via `designTokens as t` from `../tokens`.
- Themeable colors/sizes through `c.vars()` — no hard-coded theme colors outside vars.
- Circular shapes use literal `'50%'` for `borderRadius`, **not** `t.radius.full`.
- Icons only via `IconProvider` / `<Icon>`. Add `menu` to `iconNameList` + `@var-ui/icons` when MobileNav ships. Reuse `close`, chevrons, `moreHorizontal`.
- react-aria-components first for a11y; hand-rolled DOM only for static chrome.
- Never rename or remove existing published class names on `tabs`, `dialog`, `menu`, etc.
- Namespaced compounds: `Object.assign(Parent, { Section: ParentSection, … })` pattern; also export leaf components if needed for tests.
- Exports: core from `packages/core/src/components/index.ts` (and hooks from a clear path); React from **both** `packages/react/src/components/index.ts` **and** named exports in `packages/react/src/index.ts` (top-level barrel does not `export *` for components — add each symbol by name). Hooks may use `export * from './hooks'`.
- Tests: `vite-plus/test`; core uses `getRegisteredCss()` from `typestyles` (do **not** call `reset()`); React uses `@testing-library/react` + `user-event` under jsdom.
- Validation before finishing a family: `vp check`, `vp test`, build `@var-ui/core` + `@var-ui/react` (+ `@var-ui/icons` when icons change).
- Commits: conventional (`feat(core):`, `feat(react):`, `docs:`). Prefer one commit series per PR-family; only commit when the task says to and the user has allowed commits in-session (user asked to implement — commits are expected per plan steps).
- Do not edit `node_modules`, `dist/`, or `examples/vite-app/node_modules/`.
- Do **not** pull Phase 6 `Layout*` families; AppShell uses its own recipe layout.
- Do **not** change panel `Tabs` semantics.

### File map (create / modify)

| Area      | Files                                                                                                                                                                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resizable | Create `packages/core/src/components/resizeHandle.ts`, `resizeHandle.test.ts`; Create `packages/react/src/hooks/useResizable.ts`, `useResizable.test.tsx`, `packages/react/src/components/ResizeHandle.tsx`, `ResizeHandle.test.tsx`; modify core/react indexes, hooks index |
| SideNav   | Create `packages/core/src/components/sideNav.ts`, `sideNav.test.ts`; Create `packages/react/src/components/SideNav.tsx` (+ context files if split), `SideNav.test.tsx`; modify indexes, example app                                                                          |
| TopNav    | Create `topNav.ts` / `TopNav.tsx` (+ MegaMenu parts), tests; modify indexes, example app                                                                                                                                                                                     |
| MobileNav | Create `mobileNav.ts` / `MobileNav.tsx`, tests; add `menu` icon; modify indexes, example app                                                                                                                                                                                 |
| AppShell  | Create `appShell.ts` / `AppShell.tsx` (+ mobile context), tests; admin shell demo in example app                                                                                                                                                                             |
| TabList   | Create `tabList.ts` / `TabList.tsx`, tests; modify indexes, example app                                                                                                                                                                                                      |
| Tracking  | Modify `ROADMAP.md`, `specs/component-breadth.md` (decision #2 + Phase 5 table)                                                                                                                                                                                              |

### PR grouping

1. **PR Resizable** — Tasks 1–2
2. **PR SideNav** — Tasks 3–4
3. **PR TopNav** — Tasks 5–6
4. **PR MobileNav** — Tasks 7–8
5. **PR AppShell** — Tasks 9–10
6. **PR TabList + tracking** — Tasks 11–12

---

### Task 1: `resizeHandle` recipe + `useResizable` / `ResizeHandle` (core + react foundation)

**Files:**

- Create: `packages/core/src/components/resizeHandle.ts`
- Create: `packages/core/src/components/resizeHandle.test.ts`
- Create: `packages/react/src/hooks/useResizable.ts`
- Create: `packages/react/src/hooks/useResizable.test.tsx`
- Create: `packages/react/src/components/ResizeHandle.tsx`
- Create: `packages/react/src/components/ResizeHandle.test.tsx`
- Modify: `packages/core/src/components/index.ts` — `export { resizeHandle } from './resizeHandle';`
- Modify: `packages/react/src/hooks/index.ts` — export `useResizable` + types
- Modify: `packages/react/src/components/index.ts` — export `ResizeHandle`, types
- Modify: `packages/react/src/index.ts` — named exports for `ResizeHandle` + types (hooks already `export *`)

**Interfaces:**

- Consumes: `designTokens`, existing test patterns
- Produces:

```ts
// packages/react/src/hooks/useResizable.ts
export type ResizableConfig = {
  defaultWidth?: number; // default 260
  minWidth?: number; // default 180
  maxWidth?: number; // default 480
  autoSaveId?: string;
  onWidthChange?: (width: number) => void;
  collapsible?: boolean;
  collapsedSize?: number; // drag threshold, default 160 for SideNav use
};

export type UseResizableResult = {
  width: number;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  collapse: () => void;
  expand: () => void;
  resize: (width: number) => void;
  /** Bind to ResizeHandle */
  handleProps: {
    direction: 'horizontal';
    value: number;
    minValue: number;
    maxValue: number;
    onChange: (next: number) => void;
    onCollapse?: () => void;
    isCollapsed: boolean;
    'aria-label'?: string;
  };
};

export function useResizable(config?: boolean | ResizableConfig): UseResizableResult;
```

```ts
// ResizeHandle props
export type ResizeHandleProps = {
  direction?: 'horizontal' | 'vertical'; // default horizontal (sidebar)
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (next: number) => void;
  onCollapse?: () => void;
  isCollapsed?: boolean;
  'aria-label'?: string;
  className?: string;
};
```

- [ ] **Step 1: Write failing core recipe test**

```ts
// packages/core/src/components/resizeHandle.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { resizeHandle } from './resizeHandle';

describe('resizeHandle', () => {
  it('registers root and pill slots', () => {
    resizeHandle();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-resize-handle-root');
    expect(css).toContain('var-ui-resize-handle-pill');
  });
});
```

- [ ] **Step 2: Implement `resizeHandle` recipe**

```ts
// packages/core/src/components/resizeHandle.ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const resizeHandle = styles.component(
  'resize-handle',
  (c) => {
    const v = c.vars({
      lineColor: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      pillColor: {
        value: `${t.color.border.strong ?? t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      focusRing: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'pill'],
      root: {
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: v.lineColor.var,
        outline: 'none',
        '&[data-orientation="horizontal"]': {
          width: '1px',
          alignSelf: 'stretch',
          cursor: 'col-resize',
        },
        '&[data-orientation="vertical"]': {
          height: '1px',
          width: '100%',
          cursor: 'row-resize',
        },
        '&:focus-visible': {
          outline: `2px solid ${v.focusRing.var}`,
          outlineOffset: t.space[0.5] ?? '2px',
        },
      },
      pill: {
        width: '4px',
        height: '24px',
        borderRadius: t.radius.sm,
        backgroundColor: v.pillColor.var,
        pointerEvents: 'none',
        '[data-orientation="vertical"] &': {
          width: '24px',
          height: '4px',
        },
      },
    };
  },
  { layer: 'components' },
);
```

(Adjust token paths to match actual `designTokens` — use existing `t.color.border.*` / `t.space` keys from neighboring recipes like `divider.ts` / `tabs.ts`. If `border.strong` or `space[0.5]` missing, use `border.default` and a literal `'2px'`.)

- [ ] **Step 3: Write failing `useResizable` tests**

```ts
// packages/react/src/hooks/useResizable.test.tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { renderHook, act } from '@testing-library/react';
import { useResizable } from './useResizable';

describe('useResizable', () => {
  it('starts at defaultWidth 260', () => {
    const { result } = renderHook(() => useResizable(true));
    expect(result.current.width).toBe(260);
    expect(result.current.isCollapsed).toBe(false);
  });

  it('clamps resize to min/max', () => {
    const { result } = renderHook(() =>
      useResizable({ defaultWidth: 260, minWidth: 180, maxWidth: 480 }),
    );
    act(() => result.current.resize(100));
    expect(result.current.width).toBe(180);
    act(() => result.current.resize(900));
    expect(result.current.width).toBe(480);
  });

  it('collapse / expand toggles isCollapsed', () => {
    const { result } = renderHook(() => useResizable({ collapsible: true }));
    act(() => result.current.collapse());
    expect(result.current.isCollapsed).toBe(true);
    act(() => result.current.expand());
    expect(result.current.isCollapsed).toBe(false);
  });

  it('persists width when autoSaveId is set', () => {
    const key = 'var-ui-resizable:test-sidebar';
    localStorage.removeItem(key);
    const { result, unmount } = renderHook(() =>
      useResizable({ autoSaveId: 'test-sidebar', defaultWidth: 260 }),
    );
    act(() => result.current.resize(300));
    unmount();
    const { result: result2 } = renderHook(() =>
      useResizable({ autoSaveId: 'test-sidebar', defaultWidth: 260 }),
    );
    expect(result2.current.width).toBe(300);
    localStorage.removeItem(key);
  });
});
```

- [ ] **Step 4: Implement `useResizable`**

Single-region only. Storage key: `var-ui-resizable:${autoSaveId}`. When `config === false` or `undefined`, still return a usable no-op-ish result OR callers only invoke when truthy — SideNav will call only when `resizable` is set. Prefer: `useResizable(true)` enables defaults; `useResizable({…})` merges; if used with `false`, return fixed `defaultWidth` without drag (or document SideNav guards the call).

Implement pointer/keyboard updates inside `ResizeHandle` via `onChange`; hook owns clamp + collapse threshold: if `collapsible` and `next < collapsedSize` (default 160), call `collapse()`.

- [ ] **Step 5: Implement `ResizeHandle` + test**

Role `separator`, `aria-orientation`, `aria-valuenow/min/max`, `tabIndex={0}`. Arrow keys nudge by 10px (Shift+Arrow by 50). Pointer drag tracks delta on the inline axis. Render pill child with recipe slots.

Test: render with controlled value; fire `{ArrowRight}`; expect `onChange` called with +10 (horizontal).

- [ ] **Step 6: Export everything; run `vp test` filtered to new files; `vp check`**

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/components/resizeHandle.ts packages/core/src/components/resizeHandle.test.ts \
  packages/core/src/components/index.ts \
  packages/react/src/hooks/useResizable.ts packages/react/src/hooks/useResizable.test.tsx \
  packages/react/src/hooks/index.ts \
  packages/react/src/components/ResizeHandle.tsx packages/react/src/components/ResizeHandle.test.tsx \
  packages/react/src/components/index.ts packages/react/src/index.ts
git commit -m "$(cat <<'EOF'
feat: add Resizable primitives (useResizable + ResizeHandle)

EOF
)"
```

---

### Task 2: Example-app Resizable smoke (optional thin demo)

**Files:**

- Modify: `examples/vite-app/src/App.tsx` — small “Resizable” gallery: a box whose width is driven by `useResizable` + `ResizeHandle`

- [ ] **Step 1: Add demo section**
- [ ] **Step 2: Commit** `docs(examples): demo Resizable handle`

(If example app is noisy, fold this demo into the SideNav PR instead and skip this task’s commit.)

---

### Task 3: `sideNav` recipe (core)

**Files:**

- Create: `packages/core/src/components/sideNav.ts`
- Create: `packages/core/src/components/sideNav.test.ts`
- Modify: `packages/core/src/components/index.ts`

**Interfaces — slots:** `root`, `stickyTop`, `topContent`, `scrollable`, `footer`, `footerIcons`, `heading`, `section`, `sectionTitle`, `item`, `itemLabel`, `collapseButton`

- [ ] **Step 1: Failing slot-registration test** (assert each `var-ui-side-nav-*` class appears in `getRegisteredCss()`)
- [ ] **Step 2: Implement recipe** with `c.vars()` for background, item colors, selected accent, border
- [ ] **Step 3: Export; tests pass; commit** `feat(core): add sideNav recipe`

---

### Task 4: `SideNav` React compound

**Files:**

- Create: `packages/react/src/components/SideNav.tsx` (may split `SideNavContext.tsx` colocated)
- Create: `packages/react/src/components/SideNav.test.tsx`
- Modify: react component index + `src/index.ts`
- Modify: `examples/vite-app/src/App.tsx`

**Interfaces:**

```tsx
type SideNavProps = {
  header?: ReactNode;
  topContent?: ReactNode;
  footer?: ReactNode;
  footerIcons?: ReactNode;
  children?: ReactNode;
  collapsible?:
    | boolean
    | {
        defaultIsCollapsed?: boolean;
        isCollapsed?: boolean;
        onCollapsedChange?: (v: boolean) => void;
        hasButton?: boolean;
        buttonLabel?: string;
      };
  resizable?: boolean | ResizableConfig;
  handleRef?: Ref<SideNavCollapseHandle>;
  className?: string;
  label?: string; // nav aria-label, default 'Side navigation'
};

type SideNavCollapseHandle = { collapse: () => void; expand: () => void; toggle: () => void };

// SideNav.Heading, .Section, .Item, .CollapseButton as namespaced exports
```

`SideNav.Item`: `label`, `href?`, `onPress?`, `icon?`, `selectedIcon?`, `isSelected?`, `isDisabled?`, `endContent?`, `children?`, `collapsible?`

- [ ] **Step 1: Failing tests** — renders landmark; collapse hides labels; nested item expand; resize handle present when `resizable`
- [ ] **Step 2: Implement** using collapse context + `useResizable` when `resizable` truthy; Tooltip on collapsed items; `ResizeHandle` at inline-end
- [ ] **Step 3: Example demo** with sections/items
- [ ] **Step 4: `vp check` / `vp test`; commit** `feat(react): add SideNav compound component`

---

### Task 5: `topNav` recipe (core)

**Files:** `packages/core/src/components/topNav.ts`, `topNav.test.ts`, index export

Slots: `root`, `heading`, `start`, `center`, `end`, `item`, `menuTrigger`, `megaPanel`, `megaItem`, `featuredCard`

- [ ] Recipe + tests + commit `feat(core): add topNav recipe`

---

### Task 6: `TopNav` React compound (+ mega menu)

**Files:** `packages/react/src/components/TopNav.tsx` (split MegaMenu if file > ~400 lines), tests, indexes, example app

Parts: `TopNav.Heading`, `.Item`, `.Menu`, `.MegaMenu`, `.MegaMenu.Item`, `.MegaMenu.FeaturedCard`

- [ ] Tests: landmark; selected item `aria-current`; Menu opens on hover/press; MegaMenu shows featured slot
- [ ] Implement with HoverCard/Popover for Menu; absolute/full-width panel for MegaMenu
- [ ] Commit `feat(react): add TopNav with mega menu`

---

### Task 7: `menu` icon + `mobileNav` recipe (core)

**Files:**

- Modify: `packages/core/src/icons/iconNames.ts`, `iconNames.test.ts`
- Modify: `packages/icons/src/bundle1.tsx` (or bundle that holds nav icons) + tests
- Create: `packages/core/src/components/mobileNav.ts`, `mobileNav.test.ts`
- Modify: core components index

Slots: `overlay`, `panel`, `header`, `closeButton`, `toggle`

- [ ] Add `menu` to `iconNameList`; glyph SVG (hamburger)
- [ ] Recipe + tests
- [ ] Commit `feat(core): add mobileNav recipe and menu icon`

---

### Task 8: `MobileNav` React

**Files:** `MobileNav.tsx`, `MobileNav.test.tsx`, indexes, example app

```tsx
type MobileNavProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  header?: ReactNode;
  width?: number; // default 320, CSS max 85vw
  side?: 'start' | 'end' | 'auto';
  children: ReactNode;
};
// MobileNav.Toggle — label default 'Open navigation'
```

Use RAC Modal/ModalOverlay (or Dialog) + `useScrollLock` as needed. Standalone controlled mode required before AppShell.

- [ ] Tests: open/close; Escape; backdrop; Toggle calls onOpenChange
- [ ] Commit `feat(react): add MobileNav drawer`

---

### Task 9: `appShell` recipe (core)

**Files:** `appShell.ts`, `appShell.test.ts`, index

Slots: `root`, `banner`, `frame`, `topNav`, `sideNav`, `main`, `skipLink`  
Variants: `height` (`fill`|`auto`), `variant` (`wash`|`surface`|`section`|`elevated`), content padding via var or variant map

- [ ] Commit `feat(core): add appShell recipe`

---

### Task 10: `AppShell` React + admin demo

**Files:** `AppShell.tsx`, `AppShellMobileContext.tsx` (or colocated), tests, example **admin shell** section

```tsx
type AppShellProps = {
  children?: ReactNode;
  topNav?: ReactNode;
  sideNav?: ReactNode;
  mobileNav?: ReactNode;
  banner?: ReactNode;
  height?: 'fill' | 'auto';
  variant?: 'wash' | 'surface' | 'section' | 'elevated';
  contentPadding?: number; // maps to space token
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'none'; // default md
};
```

Provides mobile open context. Below breakpoint: hide side nav column; `MobileNav.Toggle` (placed by consumer in TopNav) works via context. Skip link → `#var-ui-app-shell-main`.

- [ ] Tests: context open/close; main landmark id; side nav hidden under mocked matchMedia
- [ ] Admin shell demo in example app
- [ ] Commit `feat(react): add AppShell`

---

### Task 11: `tabList` recipe + `TabList` React

**Files:** `tabList.ts`, `TabList.tsx`, tests, indexes, example app

Do **not** reuse `tabs` recipe. Parts: `TabList.Tab`, `TabList.Menu` (DropdownMenu). Controlled `value`/`onChange`. Roving tabindex.

- [ ] Tests: selection; href + `aria-current`; Menu option fires onChange; arrow keys
- [ ] Commit `feat: add TabList nav tabs (separate from panel Tabs)`

---

### Task 12: Tracking docs

**Files:**

- Modify: `ROADMAP.md` — check Phase 5 P2; note AppShell + Resizable pulled forward; P3 = Outline + NavIcon/NavMenu
- Modify: `specs/component-breadth.md` — Phase 5 table; open decision #2 → **Decided: keep both**
- Modify: `specs/phase-5-navigation-p2.md` — Status → `Approved` / `Shipped` as appropriate

- [ ] Commit `docs: mark Phase 5 P2 shipped and resolve Tabs vs TabList`

---

## Spec coverage checklist

| Spec section                | Tasks              |
| --------------------------- | ------------------ |
| Resizable                   | 1–2                |
| SideNav                     | 3–4                |
| TopNav + mega               | 5–6                |
| MobileNav + menu icon       | 7–8                |
| AppShell minimal            | 9–10               |
| TabList keep-both           | 11                 |
| ROADMAP / breadth updates   | 12                 |
| Admin shell demo            | 10                 |
| No Layout\* / no Tabs merge | Global constraints |

## Execution

Use **subagent-driven-development**: one fresh implementer subagent per task, review between tasks, continuous execution without pausing for “should I continue?”.
