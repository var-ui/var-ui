# Phase 5 P1 Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Phase 5 P1 — `Breadcrumbs` and `Pagination` — as two reviewable PR-shaped commit series, per `specs/phase-5-navigation-p1.md`.

**Architecture:** TypeStyles recipes in `@var-ui/core` (`c.vars()`, existing token scale) plus React Aria Components wrappers in `@var-ui/react`. `Breadcrumbs` is built directly on RAC `Breadcrumbs`/`Breadcrumb`/`Link` (item-array API with client-side collapse state). `Pagination` is a hand-rolled controlled component that reuses the existing `button`/`IconButton`/`Select` recipes and wrappers — no new button-like chrome, no RAC primitive (none exists for pagination).

**Tech Stack:** TypeStyles ^0.8, React 19, react-aria-components ^1.19, vite-plus (`vp`), Vitest via `vp test` / `pnpm test`, pnpm workspace.

## Global Constraints

- TypeStyles recipes: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })` from `../runtime`; tokens via `designTokens as t` from `../tokens`.
- Themeable colors/sizes go through `c.vars()` — no hard-coded theme colors outside vars.
- Circular shapes use literal `'50%'` for `borderRadius`, **not** `t.radius.full` (that token is `'0'` under the brutalist default theme — see `statusDot.ts`).
- Icons only via `IconProvider` / `<Icon>` (`chevronLeft`/`chevronRight` already exist in `iconNameList` — no icon-bundle changes needed this phase).
- react-aria-components first for a11y; hand-rolled DOM only for static chrome (ellipsis text/button, dots).
- Never rename or remove existing published class names on `button`, `select`, etc.
- Exports: core from `packages/core/src/components/index.ts` (re-exported automatically via `export * from './components'` in `packages/core/src/index.ts`); React from **both** `packages/react/src/components/index.ts` **and** the named-export list in `packages/react/src/index.ts` (the top-level barrel does not `export *` — every symbol must be added by name, matching how Toast/CommandPalette/AlertDialog were added there).
- Tests: `vite-plus/test` (`describe`/`it`/`expect`/`vi`); core recipe tests use `getRegisteredCss()` from `typestyles` (do **not** call `reset()`); React tests use `@testing-library/react` (`render`/`screen`/`within`) + `@testing-library/user-event` under jsdom. `IconProvider`/`LayerProvider` wrappers are **not** required for these two components — `useIcons()` defaults to an empty registry and renders the shared empty-fallback glyph without throwing.
- Validation before finishing a family: `pnpm check`, `pnpm test`, `pnpm build` (equivalent to `vp check`, `vp test run`, `vp run -F @var-ui/core -F @var-ui/react -F @var-ui/icons build`).
- Commits: conventional (`feat(core):`, `feat(react):`, `docs:`).
- Do not edit files under `examples/vite-app/node_modules/`, `packages/*/dist/`, or other `node_modules` trees.

### File map (create / modify)

| Area              | Files                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breadcrumbs core  | Create `packages/core/src/components/breadcrumbs.ts`, `breadcrumbs.test.ts`; modify `components/index.ts`                                                           |
| Breadcrumbs react | Create `packages/react/src/components/Breadcrumbs.tsx`, `Breadcrumbs.test.tsx`; modify react `components/index.ts`, `src/index.ts`, `examples/vite-app/src/App.tsx` |
| Pagination core   | Create `packages/core/src/components/pagination.ts`, `pagination.test.ts`; modify `components/index.ts`                                                             |
| Pagination react  | Create `packages/react/src/components/Pagination.tsx`, `Pagination.test.tsx`; modify react `components/index.ts`, `src/index.ts`, `examples/vite-app/src/App.tsx`   |
| Tracking          | Modify `ROADMAP.md`                                                                                                                                                 |

### PR grouping

1. **PR Breadcrumbs** — Tasks 1–3
2. **PR Pagination** — Tasks 4–6

No cross-dependency between the two families; Breadcrumbs first only because it's the smaller surface.

---

### Task 1: `breadcrumbs` recipe (core)

**Files:**

- Create: `packages/core/src/components/breadcrumbs.ts`
- Create: `packages/core/src/components/breadcrumbs.test.ts`
- Modify: `packages/core/src/components/index.ts` — add `export { breadcrumbs } from './breadcrumbs';`

**Interfaces:**

- Consumes: `designTokens as t` from `../tokens`
- Produces: `breadcrumbs()` → `{ root, list, item, ellipsisItem, link }` (no variants)

- [ ] **Step 1: Write the failing test**

```ts
// packages/core/src/components/breadcrumbs.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { breadcrumbs } from './breadcrumbs';

describe('breadcrumbs', () => {
  it('registers root, list, item, ellipsisItem, and link slots', () => {
    breadcrumbs();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-breadcrumbs-root');
    expect(css).toContain('var-ui-breadcrumbs-list');
    expect(css).toContain('var-ui-breadcrumbs-item');
    expect(css).toContain('var-ui-breadcrumbs-ellipsisItem');
    expect(css).toContain('var-ui-breadcrumbs-link');
  });

  it('renders the default separator as a themeable custom property', () => {
    breadcrumbs();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-breadcrumbs-separator');
    expect(css).toContain('"/"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- packages/core/src/components/breadcrumbs.test.ts`
Expected: FAIL (cannot resolve `./breadcrumbs` or export missing)

- [ ] **Step 3: Implement the recipe**

````ts
// packages/core/src/components/breadcrumbs.ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Breadcrumb trail chrome. Pair with the React `Breadcrumbs` wrapper, which
 * composes this on top of RAC `Breadcrumbs`/`Breadcrumb`/`Link`.
 *
 * ```ts
 * const b = breadcrumbs();
 * <nav className={b.root}><ol className={b.list}>…</ol></nav>
 * ```
 */
export const breadcrumbs = styles.component(
  'breadcrumbs',
  (c) => {
    const v = c.vars({
      separator: { value: '"/"', syntax: '*', inherits: false },
      textColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      currentColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'list', 'item', 'ellipsisItem', 'link'],
      root: {
        display: 'block',
      },
      list: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: t.space[1],
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        fontSize: t.fontSize.sm,
        color: v.textColor.var,
        '&:not(:last-child)::after': {
          content: v.separator.var,
          marginLeft: t.space[1],
          color: v.textColor.var,
        },
        '&[data-current]': {
          color: v.currentColor.var,
          fontWeight: t.fontWeight.medium,
        },
      },
      ellipsisItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        fontSize: t.fontSize.sm,
        color: v.textColor.var,
        '&:not(:last-child)::after': {
          content: v.separator.var,
          marginLeft: t.space[1],
          color: v.textColor.var,
        },
      },
      link: {
        color: 'inherit',
        textDecoration: 'none',
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline',
        },
        '&[data-disabled]': {
          cursor: 'default',
          textDecoration: 'none',
        },
      },
    };
  },
  { layer: 'components' },
);
````

Add the export to `packages/core/src/components/index.ts` next to the other alphabetically-nearby entries (e.g. near `badge`/`banner`):

```ts
export { breadcrumbs } from './breadcrumbs';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- packages/core/src/components/breadcrumbs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/breadcrumbs.ts packages/core/src/components/breadcrumbs.test.ts packages/core/src/components/index.ts
git commit -m "feat(core): add breadcrumbs recipe"
```

---

### Task 2: `Breadcrumbs` React wrapper

**Files:**

- Create: `packages/react/src/components/Breadcrumbs.tsx`
- Create: `packages/react/src/components/Breadcrumbs.test.tsx`
- Modify: `packages/react/src/components/index.ts`
- Modify: `packages/react/src/index.ts`

**Interfaces:**

- Consumes: `breadcrumbs` recipe from `@var-ui/core`; RAC `Breadcrumbs as AriaBreadcrumbs`, `Breadcrumb`, `Link`
- Produces:
  - `BreadcrumbItemData = { id: string; label: ReactNode; href?: string }`
  - `BreadcrumbsProps = { items: BreadcrumbItemData[]; maxItems?: number; itemsBeforeCollapse?: number; itemsAfterCollapse?: number; separator?: string; label?: string; onAction?: (id: string) => void; className?: string }`
  - `Breadcrumbs(props: BreadcrumbsProps): JSX.Element`

**Design notes:**

- RAC's `Breadcrumb` already marks the last item in the collection as current (`aria-current="page"`, non-interactive, no `onAction`) — do not reimplement that logic.
- RAC's `<Breadcrumbs>` renders the `<ol>` itself (not a `<nav>`); wrap it in a manual `<nav aria-label={label}>` for the landmark, and also pass `aria-label={label}` to `AriaBreadcrumbs` itself (RAC always sets some `aria-label` on the `<ol>` — passing the same string avoids a mismatched second label).
- RAC's `Link` auto-downgrades to a non-interactive `<span>` when `isDisabled` (which the current item always is, via context) — so every real item can render `<Link href={item.href}>{item.label}</Link>` uniformly; no manual current-item branching needed.
- Collapse state is local (`useState<boolean>`) — clicking the ellipsis always reveals the **full** `items` list (not just the hidden slice).
- The separator override is a CSS custom property; when a caller passes `separator`, set it via inline `style` as `{'--var-ui-breadcrumbs-separator': \`"${separator}"\`}`(the value must stay a quoted CSS string for`content` to render it literally).

- [ ] **Step 1: Write the failing tests**

```tsx
// packages/react/src/components/Breadcrumbs.test.tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders every item when under maxItems', () => {
    render(
      <Breadcrumbs
        label="Test trail"
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'projects', label: 'Projects', href: '/projects' },
          { id: 'current', label: 'My Project' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Test trail' });
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('My Project')).toBeTruthy();
  });

  it('marks the last item as current and non-interactive', () => {
    render(
      <Breadcrumbs
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'current', label: 'My Project' },
        ]}
      />,
    );
    const current = screen.getByText('My Project');
    expect(current.closest('[aria-current="page"]')).toBeTruthy();
    expect(current.closest('a')).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
  });

  it('collapses middle items and expands on ellipsis click', async () => {
    render(
      <Breadcrumbs
        maxItems={3}
        items={[
          { id: 'a', label: 'A', href: '/a' },
          { id: 'b', label: 'B', href: '/a/b' },
          { id: 'c', label: 'C', href: '/a/b/c' },
          { id: 'd', label: 'D' },
        ]}
      />,
    );
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.queryByText('C')).toBeNull();
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Show all breadcrumbs' }));
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
  });

  it('calls onAction with the pressed item id', async () => {
    const onAction = vi.fn();
    render(
      <Breadcrumbs
        onAction={onAction}
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'current', label: 'My Project' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onAction).toHaveBeenCalledWith('home');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- packages/react/src/components/Breadcrumbs.test.tsx`
Expected: FAIL (module missing)

- [ ] **Step 3: Implement `Breadcrumbs.tsx`**

````tsx
// packages/react/src/components/Breadcrumbs.tsx
import type { CSSProperties, JSX, ReactNode } from 'react';
import { useState } from 'react';
import { Breadcrumb, Breadcrumbs as AriaBreadcrumbs, Link } from 'react-aria-components';
import { breadcrumbs as breadcrumbsStyles } from '@var-ui/core';
import { cx } from './utils';

export type BreadcrumbItemData = {
  /** Stable identifier, passed to `onAction` when the item is pressed. */
  id: string;
  label: ReactNode;
  /** Omit for items that only act via `onAction` (no navigation). */
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItemData[];
  /** Collapse to an ellipsis once `items.length` exceeds this. */
  maxItems?: number;
  /** Leading items kept visible before the collapse point. @default 1 */
  itemsBeforeCollapse?: number;
  /** Trailing items kept visible after the collapse point. @default 1 */
  itemsAfterCollapse?: number;
  /** Separator string rendered between items via CSS `content`. @default '/' */
  separator?: string;
  /** Accessible name for the nav landmark. @default 'Breadcrumb' */
  label?: string;
  /** Fires with the pressed item's `id` (not called for the current item). */
  onAction?: (id: string) => void;
  className?: string;
};

const ELLIPSIS_ID = '__ellipsis__';

type VisibleItem = BreadcrumbItemData & { isEllipsis?: boolean };

function getVisibleItems(
  items: BreadcrumbItemData[],
  maxItems: number | undefined,
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number,
  expanded: boolean,
): VisibleItem[] {
  if (expanded || maxItems == null || items.length <= maxItems) {
    return items;
  }
  const leading = items.slice(0, itemsBeforeCollapse);
  const trailing = items.slice(items.length - itemsAfterCollapse);
  return [...leading, { id: ELLIPSIS_ID, label: '…', isEllipsis: true }, ...trailing];
}

/**
 * Navigation breadcrumb trail on RAC `Breadcrumbs`/`Breadcrumb`/`Link`.
 * Collapses long trails to a click-to-expand ellipsis.
 *
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { id: 'home', label: 'Home', href: '/' },
 *     { id: 'current', label: 'My Project' },
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  separator,
  label = 'Breadcrumb',
  onAction,
  className,
}: BreadcrumbsProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const b = breadcrumbsStyles();
  const visibleItems = getVisibleItems(
    items,
    maxItems,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    expanded,
  );
  const style = separator
    ? ({ '--var-ui-breadcrumbs-separator': `"${separator}"` } as CSSProperties)
    : undefined;

  return (
    <nav aria-label={label} className={cx(b.root, className)} style={style}>
      <AriaBreadcrumbs
        items={visibleItems}
        onAction={onAction}
        aria-label={label}
        className={b.list}
      >
        {(item: VisibleItem) =>
          item.isEllipsis ? (
            <Breadcrumb id={item.id} className={b.ellipsisItem}>
              <button
                type="button"
                className={b.link}
                onClick={() => setExpanded(true)}
                aria-label="Show all breadcrumbs"
              >
                {item.label}
              </button>
            </Breadcrumb>
          ) : (
            <Breadcrumb id={item.id} className={b.item}>
              <Link href={item.href} className={b.link}>
                {item.label}
              </Link>
            </Breadcrumb>
          )
        }
      </AriaBreadcrumbs>
    </nav>
  );
}
````

**Implementer note:** if the `navigation`-role query in Step 1's first test can't find a unique accessible name (because `AriaBreadcrumbs` also renders its own default `aria-label` on the `<ol>`, which testing-library's accessible-name computation might prefer for the innermost list rather than the outer `<nav>`), verify with `screen.debug()` — the outer `<nav>` should still expose its own `aria-label` as the `navigation` landmark's name regardless of the inner list's label, since they're different elements/roles (`navigation` vs `list`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- packages/react/src/components/Breadcrumbs.test.tsx`
Expected: PASS

- [ ] **Step 5: Add exports**

In `packages/react/src/components/index.ts`, add near the other simple exports:

```ts
export { Breadcrumbs, type BreadcrumbItemData, type BreadcrumbsProps } from './Breadcrumbs';
```

In `packages/react/src/index.ts`, add to the destructured export list from `./components` (near `Divider`/`Grid`):

```ts
  Breadcrumbs,
  type BreadcrumbItemData,
  type BreadcrumbsProps,
```

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/Breadcrumbs.tsx packages/react/src/components/Breadcrumbs.test.tsx packages/react/src/components/index.ts packages/react/src/index.ts
git commit -m "feat(react): add Breadcrumbs wrapper"
```

---

### Task 3: Breadcrumbs example-app demo (closes Breadcrumbs PR)

**Files:**

- Modify: `examples/vite-app/src/App.tsx`

- [ ] **Step 1: Add a Navigation section with two Breadcrumbs demos**

Add `Breadcrumbs` to the big `@var-ui/react` import list (alphabetical position, near `Banner`/`Button`), then add:

```tsx
function NavigationSection() {
  return (
    <Section title="Navigation">
      <Stack gap="md">
        <Breadcrumbs
          label="Short trail"
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'settings', label: 'Settings', href: '/settings' },
            { id: 'profile', label: 'Profile' },
          ]}
        />
        <Breadcrumbs
          label="Deep trail"
          maxItems={4}
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'org', label: 'Acme Corp', href: '/org' },
            { id: 'team', label: 'Platform Team', href: '/org/team' },
            { id: 'project', label: 'var-ui', href: '/org/team/project' },
            { id: 'issue', label: 'Issue #482', href: '/org/team/project/issues/482' },
            { id: 'comment', label: 'Comment' },
          ]}
        />
      </Stack>
    </Section>
  );
}
```

Mount `<NavigationSection />` in `App()` after `<FormsSection />`.

- [ ] **Step 2: Validate + commit**

```bash
pnpm check
pnpm test
git add examples/vite-app/src/App.tsx
git commit -m "docs(example): demo Breadcrumbs"
```

---

### Task 4: `pagination` recipe (core)

**Files:**

- Create: `packages/core/src/components/pagination.ts`
- Create: `packages/core/src/components/pagination.test.ts`
- Modify: `packages/core/src/components/index.ts` — add `export { pagination } from './pagination';`

**Interfaces:**

- Consumes: `designTokens as t` from `../tokens`
- Produces: `pagination({ size? })` → `{ root, controls, ellipsis, infoText, dotsContainer, dot, dotActive, pageSizeGroup }`; `size: 'sm' | 'md'` (default `'md'`)

- [ ] **Step 1: Write the failing test**

```ts
// packages/core/src/components/pagination.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { pagination } from './pagination';

describe('pagination', () => {
  it('registers all slots and the size variant', () => {
    pagination({ size: 'sm' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-pagination-root');
    expect(css).toContain('var-ui-pagination-controls');
    expect(css).toContain('var-ui-pagination-ellipsis');
    expect(css).toContain('var-ui-pagination-infoText');
    expect(css).toContain('var-ui-pagination-dotsContainer');
    expect(css).toContain('var-ui-pagination-dot');
    expect(css).toContain('var-ui-pagination-dotActive');
    expect(css).toContain('var-ui-pagination-pageSizeGroup');
    expect(css).toContain('var-ui-pagination-size-sm');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- packages/core/src/components/pagination.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement the recipe**

````ts
// packages/core/src/components/pagination.ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Pagination chrome. Page-number and prev/next buttons reuse the existing
 * `button`/`IconButton` recipes — this recipe only covers the chrome those
 * don't already provide (ellipsis text, count/compact text, dot indicators,
 * page-size grouping).
 *
 * ```ts
 * const p = pagination({ size: 'sm' });
 * <nav className={p.root}>…</nav>
 * ```
 */
export const pagination = styles.component(
  'pagination',
  (c) => {
    const v = c.vars({
      textColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      dotColor: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: [
        'root',
        'controls',
        'ellipsis',
        'infoText',
        'dotsContainer',
        'dot',
        'dotActive',
        'pageSizeGroup',
      ],
      base: {
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[4],
          flexWrap: 'wrap',
        },
        controls: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1],
        },
        ellipsis: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2rem',
          height: '2rem',
          color: v.textColor.var,
          fontSize: t.fontSize.sm,
          userSelect: 'none',
        },
        infoText: {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.sm,
          color: v.textColor.var,
        },
        dotsContainer: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1],
        },
        dot: {
          width: t.space[2],
          height: t.space[2],
          borderWidth: 0,
          padding: 0,
          borderRadius: '50%',
          backgroundColor: v.dotColor.var,
          cursor: 'pointer',
          transition: `background-color ${t.duration.fast} ${t.easing.standard}`,
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.5,
          },
        },
        dotActive: {
          backgroundColor: t.color.accent.default,
        },
        pageSizeGroup: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2],
          fontSize: t.fontSize.sm,
          color: v.textColor.var,
        },
      },
      variants: {
        size: {
          sm: {
            ellipsis: { minWidth: '1.5rem', height: '1.5rem', fontSize: t.fontSize.xs },
            dot: { width: t.space[1], height: t.space[1] },
          },
          md: {},
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
````

Add the export to `packages/core/src/components/index.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- packages/core/src/components/pagination.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/pagination.ts packages/core/src/components/pagination.test.ts packages/core/src/components/index.ts
git commit -m "feat(core): add pagination recipe"
```

---

### Task 5: `Pagination` React wrapper

**Files:**

- Create: `packages/react/src/components/Pagination.tsx`
- Create: `packages/react/src/components/Pagination.test.tsx`
- Modify: `packages/react/src/components/index.ts`
- Modify: `packages/react/src/index.ts`

**Interfaces:**

- Consumes: `pagination` recipe + `button` recipe from `@var-ui/core`; `IconButton` and `Select` from `./IconButton` / `./Select`; RAC `Button as AriaButton`
- Produces:
  - `generatePageRange(currentPage: number, totalPages: number, siblingCount: number): (number | '...')[]` (exported, pure, independently testable)
  - `PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'none'`
  - `PaginationProps` per the spec (see below)
  - `Pagination(props: PaginationProps): JSX.Element | null`

**Design notes:**

- No `useOptimistic`/`useTransition`/async `changeAction`/live-announce — plain controlled component (locked decision in the spec). `aria-current="page"` on the active control is the accessibility signal.
- Active page button uses `button({ intent: 'secondary', size })`; other page buttons use `button({ intent: 'ghost', size })` — this is how "active page" styling is achieved without a new button variant.
- `pageSize` is coerced: `Number.isFinite(pageSizeProp) ? Math.max(1, Math.floor(pageSizeProp)) : 10`, guarding the `dots` variant against `Array.from({ length: Infinity })`.
- Renders `null` when `totalItems <= 0` or computed `totalPages <= 0`.
- The page-size `Select` has no visible `<Label>` (a static "Rows per page" span sits next to it instead) — pass `aria-label="Items per page"` through to `Select`, which spreads unrecognized props onto RAC's `AriaSelect`. If the accessible-name test in Step 1 fails because RAC doesn't expose `aria-label` on the trigger without a `<Label>`, the fallback is wrapping a `<VisuallyHidden><Label>Items per page</Label></VisuallyHidden>` from `react-aria-components` — try `aria-label` first since it's simpler.

```ts
export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'none';

export type PaginationProps = {
  page: number;
  onChange: (page: number) => void;
  totalItems?: number;
  totalPages?: number;
  hasMore?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  variant?: PaginationVariant;
  siblingCount?: number;
  size?: 'sm' | 'md';
  isDisabled?: boolean;
  label?: string;
  className?: string;
};
```

- [ ] **Step 1: Write the failing tests**

```tsx
// packages/react/src/components/Pagination.test.tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generatePageRange, Pagination } from './Pagination';

describe('generatePageRange', () => {
  it('shows all pages when total fits within slots', () => {
    expect(generatePageRange(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses near the start', () => {
    expect(generatePageRange(1, 10, 1)).toEqual([1, 2, 3, '...', 10]);
  });

  it('collapses near the end', () => {
    expect(generatePageRange(10, 10, 1)).toEqual([1, '...', 8, 9, 10]);
  });

  it('collapses on both sides in the middle', () => {
    expect(generatePageRange(5, 10, 1)).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });
});

describe('Pagination', () => {
  it('renders page-number buttons and calls onChange', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} onChange={onChange} totalPages={5} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('disables previous on the first page and next on the last page', () => {
    const { rerender } = render(<Pagination page={1} onChange={() => {}} totalPages={3} />);
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    rerender(<Pagination page={3} onChange={() => {}} totalPages={3} />);
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('marks the active page with aria-current', () => {
    render(<Pagination page={2} onChange={() => {}} totalPages={3} />);
    expect(screen.getByRole('button', { name: 'Go to page 2' }).getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('renders count variant text', () => {
    render(
      <Pagination page={2} onChange={() => {}} totalItems={45} pageSize={10} variant="count" />,
    );
    expect(screen.getByText('11–20 of 45')).toBeTruthy();
  });

  it('renders compact variant text', () => {
    render(<Pagination page={2} onChange={() => {}} totalPages={5} variant="compact" />);
    expect(screen.getByText('Page 2 of 5')).toBeTruthy();
  });

  it('renders dots variant with one dot per page', () => {
    render(<Pagination page={1} onChange={() => {}} totalPages={4} variant="dots" />);
    expect(screen.getByRole('group', { name: 'Page indicators' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /Go to page/ })).toHaveLength(4);
  });

  it('renders no page indicator for the none variant', () => {
    render(<Pagination page={1} onChange={() => {}} totalPages={4} variant="none" />);
    expect(screen.queryByRole('button', { name: /Go to page/ })).toBeNull();
  });

  it('changes page size and resets to page 1', async () => {
    const onChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={3}
        onChange={onChange}
        totalItems={100}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Items per page' }));
    await userEvent.click(screen.getByRole('option', { name: '25' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('renders nothing when totalItems is zero', () => {
    const { container } = render(<Pagination page={1} onChange={() => {}} totalItems={0} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- packages/react/src/components/Pagination.test.tsx`
Expected: FAIL (module missing)

- [ ] **Step 3: Implement `Pagination.tsx`**

````tsx
// packages/react/src/components/Pagination.tsx
import type { JSX } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { button, pagination } from '@var-ui/core';
import { IconButton } from './IconButton';
import { Select } from './Select';
import { cx } from './utils';

export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'none';

export type PaginationProps = {
  /** Current page number (1-based). */
  page: number;
  onChange: (page: number) => void;
  /** Total item count — takes precedence over `totalPages` when both are set. */
  totalItems?: number;
  /** Total page count, when the item count isn't known. */
  totalPages?: number;
  /** Cursor-based pagination: whether a next page exists. Ignored once totalPages is computable. */
  hasMore?: boolean;
  /** @default 10 */
  pageSize?: number;
  /** Shows a page-size `Select` when provided. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /** @default 'pages' */
  variant?: PaginationVariant;
  /** Page buttons shown on each side of the current page (`pages` variant only). @default 1 */
  siblingCount?: number;
  /** @default 'md' */
  size?: 'sm' | 'md';
  isDisabled?: boolean;
  /** Accessible name for the nav landmark. @default 'Pagination' */
  label?: string;
  className?: string;
};

/**
 * Page numbers + optional leading/trailing ellipsis for a given current page
 * and total. Ported from Astryx's algorithm; pure and independently testable.
 */
export function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | '...')[] {
  const totalSlots = 5 + 2 * siblingCount;
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = 3 + 2 * siblingCount;
    const pages: (number | '...')[] = Array.from({ length: leftRange }, (_, i) => i + 1);
    pages.push('...', totalPages);
    return pages;
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = 3 + 2 * siblingCount;
    const pages: (number | '...')[] = [1, '...'];
    for (let i = totalPages - rightRange + 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  const pages: (number | '...')[] = [1, '...'];
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }
  pages.push('...', totalPages);
  return pages;
}

/**
 * Pagination controls with five display variants and an optional page-size
 * selector. Controlled component — the caller owns `page`.
 *
 * ```tsx
 * <Pagination page={page} onChange={setPage} totalItems={200} pageSize={20} />
 * ```
 */
export function Pagination({
  page,
  onChange,
  totalItems,
  totalPages: totalPagesProp,
  hasMore,
  pageSize: pageSizeProp = 10,
  pageSizeOptions,
  onPageSizeChange,
  variant = 'pages',
  siblingCount = 1,
  size = 'md',
  isDisabled = false,
  label = 'Pagination',
  className,
}: PaginationProps): JSX.Element | null {
  const p = pagination({ size });
  const pageSize = Number.isFinite(pageSizeProp) ? Math.max(1, Math.floor(pageSizeProp)) : 10;
  const totalPages =
    totalPagesProp ?? (totalItems != null ? Math.ceil(totalItems / pageSize) : undefined);

  if ((totalItems != null && totalItems <= 0) || (totalPages != null && totalPages <= 0)) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = totalPages != null ? page < totalPages : (hasMore ?? false);

  const goTo = (next: number) => {
    if (!isDisabled) {
      onChange(next);
    }
  };

  const handlePageSizeChange = (key: string) => {
    onPageSizeChange?.(Number(key));
    goTo(1);
  };

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize;

  function renderIndicator() {
    switch (variant) {
      case 'pages': {
        if (totalPages == null) {
          return null;
        }
        const range = generatePageRange(page, totalPages, siblingCount);
        return range.map((item, index) =>
          item === '...' ? (
            <span
              key={`ellipsis-${range[index - 1]}-${range[index + 1]}`}
              className={p.ellipsis}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <AriaButton
              key={item}
              className={button({ intent: item === page ? 'secondary' : 'ghost', size })}
              onPress={() => goTo(item)}
              isDisabled={isDisabled}
              aria-label={`Go to page ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </AriaButton>
          ),
        );
      }

      case 'count':
        return totalItems == null ? null : (
          <span className={p.infoText}>
            {rangeStart}–{rangeEnd} of {totalItems}
          </span>
        );

      case 'compact':
        return totalPages == null ? null : (
          <span className={p.infoText}>
            Page {page} of {totalPages}
          </span>
        );

      case 'dots':
        return totalPages == null ? null : (
          <div className={p.dotsContainer} role="group" aria-label="Page indicators">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                aria-current={i + 1 === page ? 'page' : undefined}
                onClick={() => goTo(i + 1)}
                disabled={isDisabled}
                className={cx(p.dot, i + 1 === page && p.dotActive)}
              />
            ))}
          </div>
        );

      case 'none':
      default:
        return null;
    }
  }

  return (
    <nav aria-label={label} className={cx(p.root, className)}>
      {pageSizeOptions && pageSizeOptions.length > 0 ? (
        <div className={p.pageSizeGroup}>
          <span>Rows per page</span>
          <Select
            aria-label="Items per page"
            options={pageSizeOptions.map((n) => ({ id: String(n), label: String(n) }))}
            selectedKey={String(pageSize)}
            onSelectionChange={(key) => handlePageSizeChange(String(key))}
            isDisabled={isDisabled}
          />
        </div>
      ) : null}
      <div className={p.controls}>
        <IconButton
          name="chevronLeft"
          aria-label="Go to previous page"
          intent="ghost"
          size={size}
          onPress={() => goTo(page - 1)}
          isDisabled={isDisabled || !hasPrevious}
        />
        {renderIndicator()}
        <IconButton
          name="chevronRight"
          aria-label="Go to next page"
          intent="ghost"
          size={size}
          onPress={() => goTo(page + 1)}
          isDisabled={isDisabled || !hasNext}
        />
      </div>
    </nav>
  );
}
````

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- packages/react/src/components/Pagination.test.tsx`
Expected: PASS (debug the `Select` accessible-name assumption per the Design note above if the page-size test fails)

- [ ] **Step 5: Add exports**

In `packages/react/src/components/index.ts`:

```ts
export {
  Pagination,
  generatePageRange,
  type PaginationProps,
  type PaginationVariant,
} from './Pagination';
```

In `packages/react/src/index.ts`, add to the destructured export list from `./components`:

```ts
  Pagination,
  generatePageRange,
  type PaginationProps,
  type PaginationVariant,
```

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/Pagination.tsx packages/react/src/components/Pagination.test.tsx packages/react/src/components/index.ts packages/react/src/index.ts
git commit -m "feat(react): add Pagination wrapper"
```

---

### Task 6: Pagination example demo + ROADMAP (closes Pagination PR / Phase 5 P1 docs)

**Files:**

- Modify: `examples/vite-app/src/App.tsx`
- Modify: `ROADMAP.md`

- [ ] **Step 1: Add Pagination demos to the Navigation section**

Add `Pagination` to the `@var-ui/react` import list in `App.tsx`, then extend `NavigationSection` (from Task 3) with one `useState`-backed instance per variant:

```tsx
function PaginationDemo() {
  const [pagesPage, setPagesPage] = useState(1);
  const [countPage, setCountPage] = useState(2);
  const [compactPage, setCompactPage] = useState(2);
  const [dotsPage, setDotsPage] = useState(1);
  const [sizedPage, setSizedPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Stack gap="md">
      <Pagination page={pagesPage} onChange={setPagesPage} totalPages={12} />
      <Pagination
        page={countPage}
        onChange={setCountPage}
        totalItems={45}
        pageSize={10}
        variant="count"
      />
      <Pagination page={compactPage} onChange={setCompactPage} totalPages={6} variant="compact" />
      <Pagination page={dotsPage} onChange={setDotsPage} totalPages={5} variant="dots" />
      <Pagination
        page={sizedPage}
        onChange={setSizedPage}
        totalItems={230}
        pageSize={pageSize}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={setPageSize}
      />
    </Stack>
  );
}
```

Render `<PaginationDemo />` inside `NavigationSection`, below the two `Breadcrumbs` demos.

- [ ] **Step 2: Update ROADMAP.md**

In the `V6 — Component breadth` section, replace the single `- [ ] Phase 5 — navigation and app chrome` line with:

```md
- [x] **Phase 5 P1 — Breadcrumbs and Pagination** — shipped: `Breadcrumbs`
      (item-array API, click-to-expand overflow collapse), `Pagination`
      (`pages`/`count`/`compact`/`dots`/`none` variants + page-size
      selector). Spec: `specs/phase-5-navigation-p1.md`. Plan:
      `plans/2026-07-15-phase-5-navigation-p1.md`.
- [ ] Phase 5 P2 — SideNav, TopNav, MobileNav, Tabs vs. TabList/Tab/TabMenu
      merge evaluation
- [ ] Phase 5 P3 — Outline, AppShell, NavIcon/NavMenu
```

- [ ] **Step 3: Full validation**

```bash
pnpm check
pnpm test
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add examples/vite-app/src/App.tsx ROADMAP.md
git commit -m "docs: demo Pagination and mark Phase 5 P1 on roadmap"
```

---

## Self-review checklist (author)

- [x] Spec coverage: Breadcrumbs (items API, collapse, current-item, onAction), Pagination (full variant set, page-size selector, dropped async plumbing), example demos, ROADMAP update, P2/P3 deferred.
- [x] No TBD/placeholder steps — every step has complete code.
- [x] Types consistent: `BreadcrumbItemData`/`BreadcrumbsProps` (Task 2) and `PaginationVariant`/`PaginationProps`/`generatePageRange` (Task 5) match their Interfaces blocks and export steps.
- [x] `radius.full` pitfall called out in Global Constraints (this theme's token is `'0'`, not a percentage) after checking `statusDot.ts`'s precedent of using literal `'50%'`.
- [x] Both react barrels (`components/index.ts` and `src/index.ts`) covered per export step — `src/index.ts` doesn't `export *`, so it's easy to miss.

## Execution Handoff

Plan saved to `plans/2026-07-15-phase-5-navigation-p1.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks
2. **Inline Execution** — execute tasks in this session with checkpoints

Which approach?
