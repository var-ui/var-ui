# Docs Shell Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `@var-ui/react` sufficient for documentation-site chrome and migrate the Var UI docs app onto package components (`AppShell` aside, `Outline`, `Collapsible`, thin wrappers, `CommandPalette` search), deleting most custom `docsShell` chrome.

**Architecture:** Thin React wrappers over existing core recipes first; then new `outline` / `collapsible` recipes + React; extend `appShell` with an optional `aside` slot; migrate docs layout to compose package chrome; wire search as docs-only glue around `CommandPalette`.

**Tech Stack:** TypeStyles, React 19, react-aria-components (`Disclosure` / `DisclosureGroup` / `DisclosurePanel`), TanStack Router (docs), vite-plus (`vp`), Vitest via `vp test`, pnpm workspace.

**Spec:** `docs/superpowers/specs/2026-07-18-docs-shell-parity-design.md`

## Global Constraints

- Spec locked decisions — do not reopen (shell parity, AppShell aside, include Collapsible, wrappers list, Approach 1 shipping).
- TypeStyles recipes: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })` from `../runtime`; tokens via `designTokens as t`.
- Themeable values through `c.vars()`.
- Circular shapes use literal `'50%'` for `borderRadius`, **not** `t.radius.full`.
- Icons only via `IconProvider` / `<Icon>` (reuse `chevronDown`, `search`, `copy` / `check` as needed).
- Namespaced compounds: `Object.assign(Parent, { Item: ParentItem, … })`.
- Register every **new** recipe in `packages/core/src/themeable-components.ts` (alphabetically). Existing thin-wrapper recipes are already registered.
- Exports: React from **both** `packages/react/src/components/index.ts` **and** `packages/react/src/index.ts`.
- Tests: `vite-plus/test`; core uses `getRegisteredCss()` (do **not** call `reset()`); React uses `@testing-library/react` + `user-event` under jsdom.
- Validation before finishing a PR slice: `vp check`, `vp test` for touched packages (and docs when docs change). Build `@var-ui/core` + `@var-ui/react` when packages change.
- Commits: conventional (`feat(core):`, `feat(react):`, `docs:`). Commit when the task says to.
- Do **not** create `@var-ui/docs` / `DocsLayout`. Leave `Demo`, `PropsTable`, MDX glue, homepage bento in `docs/`.
- Do **not** ship `NavIcon` / `NavMenu` or multi-region `Layout*`.
- Do **not** edit `node_modules` or `dist/`.

### File map (create / modify)

| Area           | Files                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Thin wrappers  | `packages/react/src/components/{Skeleton,StatusDot,Kbd,Steps,FileTree}.tsx` (+ tests); indexes                                        |
| Outline        | `packages/core/src/components/outline.ts` (+ test); `packages/react/src/components/Outline.tsx` (+ test); themeable + indexes         |
| AppShell aside | `packages/core/src/components/appShell.ts` (+ test if present); `packages/react/src/components/AppShell.tsx`, `AppShell.test.tsx`     |
| Collapsible    | `packages/core/src/components/collapsible.ts` (+ test); `packages/react/src/components/Collapsible.tsx` (+ test); themeable + indexes |
| Docs chrome    | `docs/src/layouts/DocsProviders.tsx`, `DocsPageLayout.tsx`, new nav helpers; delete `docsShell` / obsolete chrome                     |
| Search         | `docs/src/lib/search-index.ts`, header search trigger + `CommandPalette` wiring                                                       |
| Demo           | `docs/src/components/Demo.tsx` — use `Collapsible`                                                                                    |
| Example        | `examples/vite-app/src/App.tsx` — Outline + AppShell aside demo                                                                       |
| Tracking       | `ROADMAP.md`, `specs/component-breadth.md` inventory notes                                                                            |

### PR grouping

1. **PR Thin wrappers** — Task 1
2. **PR Outline + AppShell aside** — Tasks 2–3
3. **PR Docs chrome migration** — Task 4
4. **PR Search** — Task 5
5. **PR Collapsible + Demo** — Task 6
6. **Tracking** — Task 7 (land with last PR or alone)

---

### Task 1: Thin React wrappers (`Skeleton`, `StatusDot`, `Kbd`, `Steps`, `FileTree`)

**Files:**

- Create: `packages/react/src/components/Skeleton.tsx`, `Skeleton.test.tsx`
- Create: `packages/react/src/components/StatusDot.tsx`, `StatusDot.test.tsx`
- Create: `packages/react/src/components/Kbd.tsx`, `Kbd.test.tsx`
- Create: `packages/react/src/components/Steps.tsx`, `Steps.test.tsx`
- Create: `packages/react/src/components/FileTree.tsx`, `FileTree.test.tsx`
- Modify: `packages/react/src/components/index.ts` — export all five
- Modify: `packages/react/src/index.ts` — named exports for all five + types
- Modify: `examples/vite-app/src/App.tsx` — small gallery rows (optional but preferred)

**Interfaces:**

- Consumes: existing core recipes `skeleton`, `statusDot`, `kbd`, `steps`, `fileTree` (already exported from `@var-ui/core`)
- Produces:
  - `Skeleton({ shape?: 'text' | 'rect' | 'circle'; className?; style?; … })`
  - `StatusDot({ tone?; pulse?: boolean; 'aria-label'?: string; className? })`
  - `Kbd({ children; className? })` → `<kbd>`
  - `Steps({ children; className? })` → `<ol>`
  - `FileTree` / `FileTree.Folder` / `FileTree.File` compounds matching recipe slots

- [ ] **Step 1: Write failing tests**

```tsx
// packages/react/src/components/Skeleton.test.tsx
import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a decorative placeholder with the shape variant class', () => {
    const { container } = render(<Skeleton shape="circle" style={{ width: 40 }} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toMatch(/skeleton/);
  });
});
```

```tsx
// packages/react/src/components/StatusDot.test.tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('exposes the accessible name via aria-label', () => {
    render(<StatusDot tone="success" aria-label="Online" />);
    expect(screen.getByLabelText('Online')).toBeTruthy();
  });
});
```

```tsx
// packages/react/src/components/Kbd.test.tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders children inside a kbd element', () => {
    render(<Kbd>⌘K</Kbd>);
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });
});
```

```tsx
// packages/react/src/components/Steps.test.tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Steps } from './Steps';

describe('Steps', () => {
  it('renders an ordered list of steps', () => {
    render(
      <Steps>
        <li>Install</li>
        <li>Import</li>
      </Steps>,
    );
    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
```

```tsx
// packages/react/src/components/FileTree.test.tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { FileTree } from './FileTree';

describe('FileTree', () => {
  it('renders folder and file labels', () => {
    render(
      <FileTree>
        <FileTree.Folder name="src">
          <FileTree.File name="index.ts" />
        </FileTree.Folder>
      </FileTree>,
    );
    expect(screen.getByText('src')).toBeTruthy();
    expect(screen.getByText('index.ts')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `vp test packages/react/src/components/Skeleton.test.tsx packages/react/src/components/StatusDot.test.tsx packages/react/src/components/Kbd.test.tsx packages/react/src/components/Steps.test.tsx packages/react/src/components/FileTree.test.tsx`

Expected: FAIL (modules not found / components undefined)

- [ ] **Step 3: Implement wrappers**

```tsx
// packages/react/src/components/Skeleton.tsx
import type { CSSProperties, JSX } from 'react';
import { skeleton } from '@var-ui/core';
import { recipeProps } from './utils';

export type SkeletonProps = {
  shape?: 'text' | 'rect' | 'circle';
  className?: string;
  style?: CSSProperties;
};

/** Loading placeholder. Size with `style` width/height. */
export function Skeleton({ shape = 'text', className, style }: SkeletonProps): JSX.Element {
  return <div {...recipeProps(skeleton({ shape }), className)} aria-hidden="true" style={style} />;
}
```

```tsx
// packages/react/src/components/StatusDot.tsx
import type { JSX } from 'react';
import { statusDot } from '@var-ui/core';
import { recipeProps } from './utils';

export type StatusDotProps = {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  pulse?: boolean;
  /** Required for a11y when no adjacent visible text names the status. */
  'aria-label'?: string;
  className?: string;
};

/** Semantic presence/status indicator. */
export function StatusDot({
  tone = 'neutral',
  pulse = false,
  'aria-label': ariaLabel,
  className,
}: StatusDotProps): JSX.Element {
  return (
    <span
      {...recipeProps(statusDot({ tone, pulse: pulse ? 'true' : 'false' }), className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
```

```tsx
// packages/react/src/components/Kbd.tsx
import type { JSX, ReactNode } from 'react';
import { kbd } from '@var-ui/core';
import { recipeProps } from './utils';

export type KbdProps = {
  children: ReactNode;
  className?: string;
};

/** Keyboard key cap for shortcut hints. */
export function Kbd({ children, className }: KbdProps): JSX.Element {
  return <kbd {...recipeProps(kbd(), className)}>{children}</kbd>;
}
```

```tsx
// packages/react/src/components/Steps.tsx
import type { JSX, ReactNode } from 'react';
import { steps } from '@var-ui/core';
import { recipeProps } from './utils';

export type StepsProps = {
  children: ReactNode;
  className?: string;
};

/** Numbered steps list (`<ol>`). Children should be `<li>` elements. */
export function Steps({ children, className }: StepsProps): JSX.Element {
  return <ol {...recipeProps(steps().root, className)}>{children}</ol>;
}
```

```tsx
// packages/react/src/components/FileTree.tsx
import type { JSX, ReactNode } from 'react';
import { fileTree } from '@var-ui/core';
import { recipeProps } from './utils';

export type FileTreeProps = {
  children: ReactNode;
  className?: string;
};

function FileTreeRoot({ children, className }: FileTreeProps): JSX.Element {
  const t = fileTree();
  return (
    <div {...recipeProps(t.root, className)}>
      <ul {...recipeProps(t.list)}>{children}</ul>
    </div>
  );
}

export type FileTreeFolderProps = {
  name: string;
  children?: ReactNode;
  className?: string;
};

function FileTreeFolder({ name, children, className }: FileTreeFolderProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...recipeProps(t.item, className)}>
      <span {...recipeProps(t.row)}>
        <span {...recipeProps(t.folder)}>{name}</span>
      </span>
      {children != null ? <ul {...recipeProps(t.listNested)}>{children}</ul> : null}
    </li>
  );
}

export type FileTreeFileProps = {
  name: string;
  className?: string;
};

function FileTreeFile({ name, className }: FileTreeFileProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...recipeProps(t.item, className)}>
      <span {...recipeProps(t.row)}>
        <span {...recipeProps(t.file)}>{name}</span>
      </span>
    </li>
  );
}

export const FileTree = Object.assign(FileTreeRoot, {
  Folder: FileTreeFolder,
  File: FileTreeFile,
});
```

- [ ] **Step 4: Export from indexes**

Add to `packages/react/src/components/index.ts` and `packages/react/src/index.ts` (mirror `Spinner` / `EmptyState` export style).

- [ ] **Step 5: Run tests — expect PASS**

Run: `vp test packages/react/src/components/Skeleton.test.tsx packages/react/src/components/StatusDot.test.tsx packages/react/src/components/Kbd.test.tsx packages/react/src/components/Steps.test.tsx packages/react/src/components/FileTree.test.tsx`

Then: `vp check` (or package-scoped check if used by the monorepo).

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/Skeleton.tsx packages/react/src/components/Skeleton.test.tsx \
  packages/react/src/components/StatusDot.tsx packages/react/src/components/StatusDot.test.tsx \
  packages/react/src/components/Kbd.tsx packages/react/src/components/Kbd.test.tsx \
  packages/react/src/components/Steps.tsx packages/react/src/components/Steps.test.tsx \
  packages/react/src/components/FileTree.tsx packages/react/src/components/FileTree.test.tsx \
  packages/react/src/components/index.ts packages/react/src/index.ts examples/vite-app/src/App.tsx
git commit -m "$(cat <<'EOF'
feat(react): add Skeleton, StatusDot, Kbd, Steps, and FileTree wrappers

Expose existing core docs/content recipes on the React package surface.
EOF
)"
```

---

### Task 2: `outline` recipe + `Outline` React component

**Files:**

- Create: `packages/core/src/components/outline.ts`
- Create: `packages/core/src/components/outline.test.ts`
- Create: `packages/react/src/components/Outline.tsx`
- Create: `packages/react/src/components/Outline.test.tsx`
- Modify: `packages/core/src/components/index.ts` — `export { outline } from './outline';`
- Modify: `packages/core/src/themeable-components.ts` — register `outline`
- Modify: `packages/react/src/components/index.ts` + `packages/react/src/index.ts`

**Interfaces:**

- Produces (core): `outline()` → slots `{ root, title, list, link, linkActive, linkNested }`
- Produces (react):
  ```ts
  type OutlineItemData = { id: string; text: string; level: 2 | 3 };
  type OutlineProps = {
    items?: OutlineItemData[];
    children?: ReactNode; // Outline.Item
    title?: string; // default 'On this page'
    activeId?: string;
    /** @default true — IntersectionObserver scroll-spy when activeId omitted */
    scrollSpy?: boolean;
    className?: string;
  };
  ```
- `Outline.Item`: `{ id, level?: 2 | 3, children }`

- [ ] **Step 1: Write failing core recipe test**

```ts
// packages/core/src/components/outline.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { outline } from './outline';

describe('outline', () => {
  it('registers outline slots', () => {
    outline();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-outline-root');
    expect(css).toContain('var-ui-outline-title');
    expect(css).toContain('var-ui-outline-list');
    expect(css).toContain('var-ui-outline-link');
    expect(css).toContain('var-ui-outline-link-active');
    expect(css).toContain('var-ui-outline-link-nested');
  });
});
```

- [ ] **Step 2: Run core test — expect FAIL**

Run: `vp test packages/core/src/components/outline.test.ts`

- [ ] **Step 3: Implement `outline` recipe**

Mirror visual intent of current docs TOC (`docsShell` toc\* slots): sticky-friendly root, uppercase title, secondary link color, active primary+semibold, nested indent via `linkNested`. Use `c.vars()` for border/link colors. Layer: `'components'`.

```ts
// packages/core/src/components/outline.ts — key structure
export const outline = styles.component(
  'outline',
  (c) => {
    const v = c.vars({
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      titleColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      linkColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      linkActiveColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'title', 'list', 'link', 'linkActive', 'linkNested'],
      root: {
        /* padding-inline-start + border-inline-start using v.border */
      },
      title: {
        /* xs uppercase secondary */
      },
      list: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
      },
      link: {
        /* secondary, no underline, hover primary */
      },
      linkActive: {
        /* primary + semibold */
      },
      linkNested: { paddingInlineStart: t.space[3] },
    };
  },
  { layer: 'components' },
);
```

Fill concrete CSS from `docs/src/styles/docsShell.ts` toc\* rules (lines ~259–297), tokenized.

- [ ] **Step 4: Register + export core; re-run core test — PASS**

- [ ] **Step 5: Write failing React Outline tests**

```tsx
// packages/react/src/components/Outline.test.tsx
import { describe, expect, it, vi, beforeEach, afterEach } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Outline } from './Outline';

describe('Outline', () => {
  it('renders title and links from items', () => {
    render(
      <Outline
        items={[
          { id: 'intro', text: 'Intro', level: 2 },
          { id: 'details', text: 'Details', level: 3 },
        ]}
      />,
    );
    expect(screen.getByText('On this page')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Intro' }).getAttribute('href')).toBe('#intro');
    expect(screen.getByRole('link', { name: 'Details' }).getAttribute('href')).toBe('#details');
  });

  it('marks the controlled activeId link', () => {
    render(
      <Outline
        activeId="intro"
        scrollSpy={false}
        items={[{ id: 'intro', text: 'Intro', level: 2 }]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Intro' });
    expect(link.getAttribute('data-active')).toBe('');
  });

  it('uses scroll-spy IntersectionObserver when activeId is omitted', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = observe;
        unobserve = () => {};
        disconnect = disconnect;
        constructor(public cb: IntersectionObserverCallback) {}
      },
    );
    document.body.innerHTML = '<h2 id="intro">Intro</h2>';
    render(<Outline items={[{ id: 'intro', text: 'Intro', level: 2 }]} />);
    expect(observe).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 6: Implement `Outline.tsx`**

- Nav landmark: `<nav aria-label={title}>`.
- Resolve items from `items` prop **or** collect `Outline.Item` children (support both; prefer `items` when both passed).
- Active class: `recipeProps(o.linkActive)` when `id === activeId`; else `o.link`. Nest with `cx(recipeClassName(o.linkNested))` for level 3.
- Scroll-spy: when `scrollSpy !== false` and `activeId` is `undefined`, observe heading elements; set local active to the topmost intersecting id (rootMargin tuned for sticky header, e.g. `'-20% 0px -60% 0px'`). If `activeId` is provided, skip observer.

```tsx
// Sketch — implement fully in the file as OutlineRoot + Object.assign
function OutlineRoot({
  items,
  children,
  title = 'On this page',
  activeId,
  scrollSpy = true,
  className,
}: OutlineProps) {
  const o = outline();
  const resolved = items ?? /* collect from Outline.Item children */;
  const [spyId, setSpyId] = useState<string | undefined>();
  const current = activeId ?? spyId;
  // useEffect for IntersectionObserver when scrollSpy && activeId == null …
  return (
    <nav aria-label={title} {...recipeProps(o.root, className)}>
      <p {...recipeProps(o.title)}>{title}</p>
      <ul {...recipeProps(o.list)}>
        {resolved.map((item) => {
          const isActive = current === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-active={isActive ? '' : undefined}
                className={cx(
                  recipeClassName(isActive ? o.linkActive : o.link),
                  item.level === 3 ? recipeClassName(o.linkNested) : undefined,
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
export const Outline = Object.assign(OutlineRoot, { Item: OutlineItem });
```

Use `cx` / `recipeClassName` from local utils (same pattern as `DocsToc`).

- [ ] **Step 7: Export; run tests — PASS; commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add Outline component for in-page TOC navigation

Core outline recipe plus React wrapper with optional scroll-spy.
EOF
)"
```

---

### Task 3: `AppShell` `aside` slot

**Files:**

- Modify: `packages/core/src/components/appShell.ts`
- Modify: `packages/core/src/components/appShell.test.ts` (create if missing; else extend)
- Modify: `packages/react/src/components/AppShell.tsx`
- Modify: `packages/react/src/components/AppShell.test.tsx`
- Modify: `examples/vite-app/src/App.tsx` — show aside + Outline in the admin shell demo

**Interfaces:**

- Consumes: Task 2 `Outline` (for example demo only)
- Produces: `AppShellProps.aside?: ReactNode`; recipe slot `aside`; root/frame `data-aside=""` when aside provided; CSS grid three-column when aside present; aside hidden under `[data-mobile]`

- [ ] **Step 1: Write failing AppShell React tests**

```tsx
// Append to AppShell.test.tsx
it('renders aside content in the aside slot', () => {
  stubMatchMedia(false);
  wrap(
    <AppShell aside={<span>TOC</span>} sideNav={<span>Side</span>}>
      Main
    </AppShell>,
  );
  expect(screen.getByText('TOC')).toBeTruthy();
  vi.unstubAllGlobals();
});

it('sets data-aside on the root when aside is provided', () => {
  stubMatchMedia(false);
  const { container } = wrap(<AppShell aside={<span>TOC</span>}>Main</AppShell>);
  const root = container.firstElementChild as HTMLElement;
  expect(root.getAttribute('data-aside')).toBe('');
  vi.unstubAllGlobals();
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `vp test packages/react/src/components/AppShell.test.tsx`

- [ ] **Step 3: Extend `appShell` recipe**

- Add `'aside'` to `APP_SHELL_SLOTS`.
- Add `asideWidth` var default `12.5rem`.
- Update `frame` base:

```ts
frame: {
  display: 'grid',
  flex: '1 1 auto',
  minHeight: 0,
  minWidth: 0,
  gridTemplateAreas: '"top top" "side main"',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto 1fr',
  '[data-aside]&': {
    gridTemplateAreas: '"top top top" "side main aside"',
    gridTemplateColumns: `auto 1fr ${/* asideWidth var */}`,
  },
  '[data-mobile]&': {
    gridTemplateAreas: '"top" "main"',
    gridTemplateColumns: '1fr',
  },
},
aside: {
  gridArea: 'aside',
  minHeight: 0,
  minWidth: 0,
  overflow: 'auto',
  position: 'sticky',
  top: 0,
  alignSelf: 'start',
  maxHeight: '100%',
  '[data-mobile] &': { display: 'none' },
},
```

Adjust selector syntax to match how TypeStyles encodes `[data-aside]` on the **root** vs frame — prefer setting `data-aside` on root (like `data-mobile`) and writing `'[data-aside] &'` on `frame` / `aside` the same way `sideNav` uses `'[data-mobile] &'`.

- [ ] **Step 4: Update React `AppShell`**

```tsx
export type AppShellProps = {
  // …existing…
  /** Optional right rail (e.g. Outline). Hidden below mobileBreakpoint. */
  aside?: ReactNode;
};

export function AppShell({ …, aside, … }: AppShellProps) {
  // …
  return (
    <MobileNavProvider>
      <div
        {...recipeProps(s.root, className)}
        data-mobile={isMobile ? '' : undefined}
        data-aside={aside ? '' : undefined}
      >
        {/* skip + banner */}
        <div {...recipeProps(s.frame)}>
          {topNav ? <header …>…</header> : null}
          {sideNav ? <div {...recipeProps(s.sideNav)}>{sideNav}</div> : null}
          <main id={APP_SHELL_MAIN_ID} …>{children}</main>
          {aside ? <aside {...recipeProps(s.aside)}>{aside}</aside> : null}
        </div>
        {mobileNav}
      </div>
    </MobileNavProvider>
  );
}
```

- [ ] **Step 5: Core CSS test (optional but recommended)** — assert `var-ui-app-shell-aside` appears after calling `appShell()`.

- [ ] **Step 6: Example app** — in the existing AppShell demo, pass `aside={<Outline items={[…]} scrollSpy={false} activeId="…" />}` with matching heading ids in main.

- [ ] **Step 7: Run tests + check — PASS; commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add AppShell aside slot for outline rails

Optional third column for in-page TOC; hidden on mobile with sideNav.
EOF
)"
```

---

### Task 4: Docs chrome migration onto package shell

**Files:**

- Create: `docs/src/components/DocsChrome.tsx` (or split `DocsTopNav.tsx` / `DocsSideNavNav.tsx` — prefer one composition module)
- Create: `docs/src/components/DocsChrome.test.tsx` (smoke: renders nav landmarks)
- Modify: `docs/src/layouts/DocsProviders.tsx`
- Modify: `docs/src/components/DocsPageLayout.tsx`
- Modify: `docs/src/routes/index.tsx` (homepage — TopNav or shell without side/aside)
- Delete after unused: `docs/src/styles/docsShell.ts`, `docs/src/components/DocsSidebar.tsx`, `docs/src/components/DocsHeader.tsx`, `docs/src/components/DocsMobileNav.tsx`, `docs/src/contexts/MobileNavContext.tsx` (and update imports / `docs/typestyles-entry.ts` if it imported `docsShell`)
- Keep: `ColorModeSwitcher` / `DocsHeaderActions` pieces that still apply — fold into `DocsChrome` endContent; can delete `DocsHeaderActions` if inlined
- Update tests that imported deleted modules (`ColorModeSwitcher.test.tsx`, etc.)

**Interfaces:**

- Consumes: `AppShell`, `TopNav`, `SideNav`, `MobileNav`, `Outline`, `proseContent`, `navigation.ts`, `DocHeading`
- Produces: docs section pages with zero `docsShell` dependency for chrome

**Routing note:** Package `SideNav.Item` / `TopNav.Item` use RAC `Link`/`href`. For SPA navigation without full reloads, docs chrome should use `onPress={() => navigate({ to: link })}` + `isSelected` from pathname (keep `href` omitted or set for progressive enhancement — prefer `onPress` + selected state for TanStack).

- [ ] **Step 1: Inventory `docsShell` / chrome imports**

Run: `rg "docsShell|DocsSidebar|DocsHeader|DocsMobileNav|MobileNavContext" docs/src`

List every hit; each must be replaced or deleted in this task.

- [ ] **Step 2: Implement `DocsChrome` composition**

```tsx
// docs/src/components/DocsChrome.tsx — shape
export function DocsChrome({
  children,
  headings = [],
}: {
  children: ReactNode;
  headings?: DocHeading[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  // Build SideNav sections from sidebar[section] + navigation helpers
  return (
    <AppShell
      variant="wash"
      height="fill"
      mobileBreakpoint="md"
      topNav={
        <TopNav
          heading={<TopNav.Heading heading="var(--ui)" headingHref="/" />}
          endContent={
            <>
              <MobileNav.Toggle />
              {/* ColorModeSwitcher / ColorModeToggle */}
              {/* GitHub IconButton/Link */}
            </>
          }
        >
          {topNav.map((item) => (
            <TopNav.Item
              key={item.link}
              label={item.text}
              isSelected={/* match */}
              onPress={() => navigate({ to: item.link })}
            />
          ))}
        </TopNav>
      }
      sideNav={
        <SideNav label="Docs">
          {/* map grouped or flat sidebar → SideNav.Section / SideNav.Item */}
        </SideNav>
      }
      aside={headings.length > 0 ? <Outline items={headings} /> : undefined}
      mobileNav={
        <MobileNav header="Menu">{/* same SideNav tree or shared render function */}</MobileNav>
      }
    >
      {children}
    </AppShell>
  );
}
```

Share one `renderSideNav(onNavigate?)` function for desktop + mobile.

- [ ] **Step 3: Wire `DocsProviders` + `DocsPageLayout`**

- `DocsProviders`: keep `DesignSystemProvider` / `IconProvider` / `LayerProvider` / `codeHljsScope`. For docs sections, **do not** render custom header; render `{children}` only (chrome moves into page layout) **or** wrap with `DocsChrome` without headings here.
- Preferred: `DocsPageLayout` wraps content in `DocsChrome` and passes `headings`. Homepage uses a lighter chrome (TopNav only via small `DocsHomeChrome` or `AppShell` without side/aside).

```tsx
// DocsPageLayout
export function DocsPageLayout({ children, headings = [], mdx, propsDoc }: DocPageProps) {
  const prose = proseContent();
  // mdx components memo…
  return (
    <DocsChrome headings={headings}>
      <div className={/* max-width article column — local style or Stack */}>
        {mdx ? (
          <article className={recipeClassName(prose.root)}>
            <MDXContent code={mdx} components={components} />
          </article>
        ) : (
          <article className={recipeClassName(prose.root)}>{children}</article>
        )}
      </div>
    </DocsChrome>
  );
}
```

Article max-width (~48rem) can be a tiny local CSS module **or** inline style / `Section` — do **not** resurrect `docsShell` for it. Prefer a small `docsContent.ts` recipe in docs if needed (docs-local is fine for content measure).

- [ ] **Step 4: Delete obsolete chrome; fix typestyles entry**

Remove `docsShell` from `docs/typestyles-entry.ts` (or equivalent). Ensure CSS build still includes remaining docs styles (`homeBento`, etc.).

- [ ] **Step 5: Update / fix docs tests**

Run: `vp test` in docs package (or monorepo filter for `docs`).

Fix `ColorModeSwitcher` tests if they depended on `docsShell` classes — point at package classNames or role queries.

- [ ] **Step 6: Manual smoke**

Run docs dev server; verify: desktop three-column, mobile drawer, TOC links, color mode, GitHub link.

- [ ] **Step 7: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: migrate chrome to AppShell, TopNav, SideNav, and Outline

Replace custom docsShell layout with package navigation primitives.
EOF
)"
```

---

### Task 5: Docs search (`CommandPalette` + header trigger + `Kbd`)

**Files:**

- Create: `docs/src/lib/search-index.ts`
- Create: `docs/src/lib/search-index.test.ts`
- Create: `docs/src/components/DocsSearch.tsx` (+ optional test)
- Modify: `docs/src/components/DocsChrome.tsx` — mount search in endContent + palette at shell level
- Uses: `CommandPalette`, `IconButton`, `Kbd` from `@var-ui/react`

**Interfaces:**

```ts
// search-index.ts
export type DocsSearchItem = {
  id: string; // route path, also CommandPaletteItem.id
  title: string;
  meta?: string;
  keywords?: string[];
};

export function buildDocsSearchIndex(): DocsSearchItem[];
```

Build from `docsSidebar`, `themingSidebar`, `componentSidebar` / `componentRegistry` (flatten links). `id` = `link` path.

- [ ] **Step 1: Failing test for index builder**

```ts
// docs/src/lib/search-index.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { buildDocsSearchIndex } from './search-index';

describe('buildDocsSearchIndex', () => {
  it('includes getting started and at least one component', () => {
    const items = buildDocsSearchIndex();
    expect(items.some((i) => i.id === '/docs/getting-started')).toBe(true);
    expect(items.some((i) => i.id.startsWith('/components/'))).toBe(true);
  });
});
```

- [ ] **Step 2: Implement `buildDocsSearchIndex`**

- [ ] **Step 3: Implement `DocsSearch`**

```tsx
export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const items = useMemo(() => buildDocsSearchIndex(), []);
  return (
    <>
      <IconButton name="search" aria-label="Search docs" onPress={() => setOpen(true)} />
      <Kbd>⌘K</Kbd>
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={items}
        placeholder="Search docs…"
        onAction={(id) => {
          setOpen(false);
          void navigate({ to: id });
        }}
      />
    </>
  );
}
```

Place `Kbd` beside the button (omit or hide on mobile).

Note: `CommandPalette` already registers ⌘K when mounted with `hotkey` default true — keep palette mounted (even when closed) so the hotkey works.

- [ ] **Step 4: Wire into `DocsChrome` endContent; test navigate smoke if practical**

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: wire CommandPalette search with header trigger and ⌘K

Index sidebar and component registry routes for palette navigation.
EOF
)"
```

---

### Task 6: `Collapsible` / `CollapsibleGroup` + `Demo` adoption

**Files:**

- Create: `packages/core/src/components/collapsible.ts`, `collapsible.test.ts`
- Create: `packages/react/src/components/Collapsible.tsx`, `Collapsible.test.tsx`
- Modify: themeable-components + core/react indexes
- Modify: `docs/src/components/Demo.tsx`
- Modify: `examples/vite-app/src/App.tsx` — small Collapsible demo

**Interfaces:**

```ts
type CollapsibleProps = {
  title?: ReactNode;
  trigger?: ReactNode; // overrides default title row
  children: ReactNode;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

type CollapsibleGroupProps = {
  children: ReactNode;
  /** @default false — when true, only one open at a time */
  allowsMultipleExpanded?: boolean;
  className?: string;
};
```

Use RAC: `Disclosure`, `DisclosurePanel`, `Button` (or Disclosure trigger API), `DisclosureGroup` from `react-aria-components` (available in workspace `^1.19.0`).

- [ ] **Step 1: Failing core recipe test** — slots `root`, `trigger`, `triggerIcon`, `panel` (names as implemented).

- [ ] **Step 2: Implement recipe** — bordered/flush optional via variant if needed; chevron rotation via `[aria-expanded=true]` / data attribute.

- [ ] **Step 3: Failing React tests**

```tsx
it('expands and collapses on trigger press', async () => {
  render(
    <IconProvider icons={/* chevronDown */}>
      <Collapsible title="Show code" defaultExpanded={false}>
        <pre>const x = 1</pre>
      </Collapsible>
    </IconProvider>,
  );
  expect(screen.queryByText('const x = 1')).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: /Show code/i }));
  expect(screen.getByText('const x = 1')).toBeTruthy();
});
```

Provide `chevronDown` via `@var-ui/icons` `defaultIcons` or a minimal stub in the test.

- [ ] **Step 4: Implement React wrappers + exports**

```tsx
import {
  Disclosure,
  DisclosurePanel,
  DisclosureGroup,
  Button as AriaButton,
} from 'react-aria-components';
```

Follow RAC 1.19 Disclosure API (verify prop names against installed types — `isExpanded` / `defaultExpanded` / `onExpandedChange` typically).

- [ ] **Step 5: Update `Demo.tsx`**

```tsx
export function Demo({ children, code, title }: DemoProps) {
  return (
    <VStack gap="sm" style={{ marginBlock: '1.5rem' }}>
      {title ? (
        <Heading level={4} size="sm">
          {title}
        </Heading>
      ) : null}
      <Card>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </Card>
      <Collapsible title="Show code" defaultExpanded={false}>
        <CodeBlock code={code} language="tsx" />
      </Collapsible>
    </VStack>
  );
}
```

Remove local `useState` show-code toggle.

- [ ] **Step 6: Tests + check — PASS; commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add Collapsible and adopt it in docs Demo

Pull Collapsible forward for expandable panels; replace Demo show-code button.
EOF
)"
```

---

### Task 7: ROADMAP + component-breadth tracking

**Files:**

- Modify: `ROADMAP.md` — Phase 5 P3: mark `Outline` done (leave `NavIcon`/`NavMenu`); Phase 6: note `Collapsible` shipped early via docs shell parity
- Modify: `specs/component-breadth.md` — refresh inventory rows that still claim Outline/Collapsible/Kbd missing (only the rows this initiative actually shipped)
- Modify: design spec status line to `Shipped` when all PRs land (optional)

- [ ] **Step 1: Update ROADMAP checkboxes with accurate wording**
- [ ] **Step 2: Update component-breadth current inventory table**
- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: mark docs shell parity pieces on the roadmap

Outline and Collapsible shipped; NavIcon/NavMenu remain deferred.
EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement                                                            | Task                              |
| --------------------------------------------------------------------------- | --------------------------------- |
| Thin wrappers Skeleton/StatusDot/Kbd/Steps/FileTree                         | Task 1                            |
| Outline + scroll-spy                                                        | Task 2                            |
| AppShell aside slot                                                         | Task 3                            |
| Docs migrate to AppShell/TopNav/SideNav/MobileNav/Outline; delete docsShell | Task 4                            |
| CommandPalette search + header + Kbd                                        | Task 5                            |
| Collapsible + Demo                                                          | Task 6                            |
| ROADMAP / breadth updates                                                   | Task 7                            |
| No docs kit / keep Demo+PropsTable in docs                                  | Honored in constraints + Task 4/6 |
| Defer NavIcon/NavMenu / Layout\*                                            | Honored in constraints            |
| Example app Outline+aside                                                   | Task 3                            |
| vp check / vp test gates                                                    | Each task                         |

No TBD placeholders. Types aligned across tasks (`OutlineItemData` level `2 \| 3` matches `DocHeading`).
