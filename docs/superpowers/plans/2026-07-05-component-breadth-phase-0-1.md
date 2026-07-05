# Component Breadth Phase 0+1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the infrastructure prerequisites (Phase 0) and the feedback/content/container components (Phase 1) from `specs/component-breadth.md` — ~20 new recipe families with React wrappers, tests, docs, and example-app coverage.

**Architecture:** Every component is a TypeStyles recipe in `@var-ui/core` (`styles.component()` with `c.vars()` for themeable properties) plus, where interactive, a React wrapper in `@var-ui/react` built on react-aria-components. Icons live in a new optional `@var-ui/icons` package resolved exclusively through `IconProvider`. Shared field chrome, layout primitives, and a floating-layer z-index allocator unlock later phases.

**Tech Stack:** TypeStyles ^0.8.0, React 19, react-aria-components ^1.19, vite-plus (`vp`) toolchain, Vitest via `vp test`, pnpm workspace.

## Global Constraints

Copied from `specs/component-breadth.md` + repo conventions — every task implicitly includes these:

- **TypeStyles, not StyleX**: recipes use `styles.component('<kebab-name>', (c) => {…}, { layer: 'components' })`, importing `styles` from `../runtime` and `designTokens as t` from `../tokens`.
- **V3 contract from day one**: every themeable color/size goes through `c.vars({ name: { value, syntax, inherits } })` — no hard-coded colors that need a later audit. Tone colors come from `semanticTone.ts` helpers.
- **Stable semantic class names are public API**: scopeId is `example-ds`, so classes read `example-ds-<component>-<slot>[-<variant>-<value>]`. Never rename an existing class. New classes must be added to `packages/core/.typestyles-public-classnames.json` (Task 21).
- **react-aria-components first** for focus/keyboard/ARIA; hand-rolled DOM only for static content.
- **Icons are never bundled in `@var-ui/react` or `@var-ui/core`**. Components resolve glyphs only via `IconProvider`; `@var-ui/react` ships one empty fallback SVG. Default glyphs live in `@var-ui/icons` (optional peer of react).
- **Exports**: every recipe exported from `packages/core/src/components/index.ts`; every React component + prop types exported from `packages/react/src/components/index.ts` and re-exported from `packages/react/src/index.ts`.
- **Docs**: minimal JSDoc + usage example in each recipe/wrapper file (per-recipe `.doc.ts` system is out of scope).
- **Validation commands**: `vp check --fix` (format+lint+typecheck), `vp test run` (all test projects), `vp run packages/core#build packages/react#build` before finishing.
- **Commits**: one per task, conventional style (`feat(core): …`, `feat(react): …`, `feat(icons): …`), ending with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- **Test API**: import from `vite-plus/test` (`describe`, `it`, `expect`); core recipe tests call the recipe then assert on `getRegisteredCss()` from `typestyles` (CSS registers lazily on first recipe invocation — do NOT call `reset()` in recipe tests). React tests use `@testing-library/react` under jsdom (Task 1 sets this up).
- **Animation**: use `keyframes.create(name, stops)` from `typestyles`; every looping animation gets a `@media (prefers-reduced-motion: reduce)` override.

### Existing-pattern cheat sheet (read once, reuse everywhere)

- Flat recipe with tone vars: `packages/core/src/components/badge.ts`
- Slot recipe with two variant axes + `c.vars()`: `packages/core/src/components/alert.ts`
- Recipe invocation: flat recipes return a class string (`button({ intent: 'primary' })`); slot recipes return a slot→class map (`const a = alert({ tone }); a.root`).
- Variant assignment to a var: `[v.foo.name]: t.color.accent.default` inside a variant block; consumption: `v.foo.var`.
- Semantic tones: `semanticChannelAssignments(v, key)` (needs vars named `semantic`/`solidBg`/`solidFg`), `subtleBackgroundColor(driver)`, `subtleBorderColor(driver)` from `semanticTone.ts`.
- React wrapper: `packages/react/src/components/Alert.tsx` (slot recipe) and `Button.tsx` (flat recipe + RAC).
- `cx` helper: `import { cx } from './utils';` in react components.

---

### Task 1: React package test infrastructure

**Files:**

- Modify: `/Users/danielbanks/dev/var-ui/vite.config.ts` (test.projects)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/vite.config.ts` (jsdom test env)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/package.json` (devDeps)
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Button.test.tsx`

**Interfaces:**

- Consumes: existing `Button` component.
- Produces: working `vp test run` across core + react; the pattern every later React test follows (`render` from `@testing-library/react`, jsdom env).

- [ ] **Step 1: Add devDependencies to packages/react**

```bash
pnpm --dir /Users/danielbanks/dev/var-ui add --filter @var-ui/react -D jsdom @testing-library/react @testing-library/user-event
```

(If `--filter` misbehaves with vp-managed pnpm, edit `packages/react/package.json` devDependencies by hand — `"jsdom": "^26.0.0"`, `"@testing-library/react": "^16.1.0"`, `"@testing-library/user-event": "^14.5.0"` — then `vp install`.)

- [ ] **Step 2: Register react as a test project and set jsdom env**

In root `vite.config.ts`:

```ts
  test: {
    projects: ['packages/core', 'packages/react'],
  },
```

In `packages/react/vite.config.ts` add a `test` block alongside `pack`:

```ts
  test: {
    environment: 'jsdom',
  },
```

- [ ] **Step 3: Write the canary test**

`packages/react/src/components/Button.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and applies the intent recipe class', () => {
    render(<Button intent="primary">Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toContain('example-ds-button-base');
    expect(button.className).toContain('example-ds-button-intent-primary');
  });
});
```

- [ ] **Step 4: Run and verify**

Run: `vp test run`
Expected: core tests still pass; the new react project runs the Button test and passes. If jsdom env is not picked up, check `vp test --help` / `node_modules/vite-plus/docs` for the project-level test config key and adjust.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts packages/react/vite.config.ts packages/react/package.json packages/react/src/components/Button.test.tsx pnpm-lock.yaml
git commit -m "test(react): add jsdom test project with testing-library canary"
```

---

### Task 2: Icon names + `icon` recipe in core (spec §0.4)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/icons/iconNames.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/icon.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/index.ts` (export `IconName`, `iconNameList`, and whatever `components/index.ts` re-export shape it already uses — inspect first)
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/icons/iconNames.test.ts`

**Interfaces:**

- Produces: `type IconName` (closed union, bundle 1 = 11 names), `const iconNameList: readonly IconName[]`, `icon` recipe with `size` variant (`sm` 14px | `md` 16px | `lg` 20px | `inherit` 1em) and `c.vars()` for `size` + `color`. Tasks 3–4 and 20 depend on these exact names.

- [ ] **Step 1: Write the failing test**

`packages/core/src/icons/iconNames.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { iconNameList } from './iconNames';
import { icon } from '../components/icon';

describe('icon system (core)', () => {
  it('ships the bundle 1 semantic names', () => {
    expect([...iconNameList].sort()).toEqual(
      [
        'check',
        'chevronDown',
        'chevronLeft',
        'chevronRight',
        'close',
        'copy',
        'error',
        'info',
        'search',
        'success',
        'warning',
      ].sort(),
    );
  });

  it('registers size variants and color var', () => {
    icon({ size: 'md' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-icon-base');
    expect(css).toContain('example-ds-icon-size-md');
    expect(css).toMatch(/--example-ds-icon-[\w-]*color/);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `vp test run` → FAIL (module not found).

- [ ] **Step 3: Implement**

`packages/core/src/icons/iconNames.ts`:

```ts
/**
 * Semantic icon names var-ui components reference internally. Names describe
 * *function*, not glyph (`close`, not `x-mark`). Glyphs resolve exclusively
 * through `IconProvider` in `@var-ui/react`; `@var-ui/icons` ships optional
 * defaults. Extend this union bundle-by-bundle as new components ship.
 */
export const iconNameList = [
  'close',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'check',
  'copy',
  'search',
  'info',
  'success',
  'warning',
  'error',
] as const;

export type IconName = (typeof iconNameList)[number];
```

`packages/core/src/components/icon.ts`:

````ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Styling-only icon shell: sizes the em-box and colors the glyph via
 * `currentColor`. No SVG markup lives in core — the React `<Icon>` renders
 * provider-resolved glyphs inside this class.
 *
 * ```tsx
 * <span className={icon({ size: 'md' })}>{svg}</span>
 * ```
 */
export const icon = styles.component(
  'icon',
  (c) => {
    const v = c.vars({
      size: { value: '16px', syntax: '<length>', inherits: false },
      color: { value: 'currentColor', syntax: '*', inherits: false },
    });
    return {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: v.size.var,
        height: v.size.var,
        color: v.color.var,
        '& svg': {
          width: '100%',
          height: '100%',
        },
      },
      variants: {
        size: {
          sm: { [v.size.name]: '14px' },
          md: { [v.size.name]: '16px' },
          lg: { [v.size.name]: '20px' },
          inherit: { [v.size.name]: '1em' },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
````

Exports: add `export { icon } from './icon';` to `components/index.ts`; add `export { iconNameList, type IconName } from './icons/iconNames';` to `src/index.ts` (match its existing export style — read it first).

Note: if `syntax: '*'` is rejected by `c.vars`, use `syntax: '<color>'` with value `currentColor` — verify against TypeStyles ^0.8 (`../typestyles/docs/dist/docs/api-reference.md`).

- [ ] **Step 4: Run tests** — `vp test run` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src
git commit -m "feat(core): add IconName registry and icon recipe"
```

---

### Task 3: `@var-ui/icons` package with bundle 1 glyphs (spec §0.4)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/icons/package.json`
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/tsconfig.json` (copy shape from `packages/react/tsconfig.json`)
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/vite.config.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/src/bundle1.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/src/index.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/README.md`
- Test: `/Users/danielbanks/dev/var-ui/packages/icons/src/bundle1.test.tsx` + register `packages/icons` in root `vite.config.ts` test projects

**Interfaces:**

- Consumes: `IconName` type from `@var-ui/core` (type-only).
- Produces: `bundle1Icons: Partial<Record<IconName, ReactNode>>` covering all 11 bundle-1 names; `defaultIcons` (merge of all bundles, currently = bundle 1). Task 4's `IconProvider` accepts these; example app imports `defaultIcons`.

- [ ] **Step 1: Scaffold the package**

`packages/icons/package.json`:

```json
{
  "name": "@var-ui/icons",
  "version": "0.0.1",
  "description": "Optional default icon glyphs for the var-ui design system",
  "homepage": "https://github.com/var-ui/var-ui/tree/main/packages/icons#readme",
  "bugs": "https://github.com/var-ui/var-ui/issues",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/var-ui/var-ui.git",
    "directory": "packages/icons"
  },
  "files": ["dist"],
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    }
  },
  "publishConfig": { "access": "public" },
  "scripts": {
    "build": "vp pack",
    "pack": "vp pack",
    "dev": "vp pack --watch"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@var-ui/core": "workspace:*",
    "react": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "peerDependencies": {
    "@var-ui/core": "workspace:^",
    "react": "catalog:"
  }
}
```

`packages/icons/vite.config.ts`:

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    deps: { neverBundle: ['react', '@var-ui/core'] },
  },
  test: { environment: 'jsdom' },
});
```

Run `vp install` after scaffolding (workspace glob `packages/*` already covers it). Add `'packages/icons'` to root `vite.config.ts` `test.projects`. Add jsdom + testing-library devDeps only if the test below needs them (it uses plain render-to-static-markup — add `react-dom` devDep instead).

- [ ] **Step 2: Write the failing test**

`packages/icons/src/bundle1.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { isValidElement } from 'react';
import { iconNameList } from '@var-ui/core';
import { bundle1Icons, defaultIcons } from './index';

describe('@var-ui/icons bundle 1', () => {
  it('maps every bundle-1 IconName to a React element', () => {
    for (const name of iconNameList) {
      expect(isValidElement(bundle1Icons[name]), `missing glyph: ${name}`).toBe(true);
    }
  });

  it('defaultIcons includes bundle 1', () => {
    expect(Object.keys(defaultIcons)).toEqual(expect.arrayContaining([...iconNameList]));
  });
});
```

- [ ] **Step 3: Run to verify it fails** — `vp test run` → FAIL.

- [ ] **Step 4: Implement the glyphs**

`packages/icons/src/bundle1.tsx` — 24×24 viewBox, `currentColor` strokes, `aria-hidden`, hand-authored paths (do NOT copy Lucide/Heroicons):

```tsx
import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';

type SvgProps = { children: ReactNode };

function Glyph({ children }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Bundle 1 — the 11 semantic glyphs required by existing + Phase 1 components. */
export const bundle1Icons: Partial<Record<IconName, ReactNode>> = {
  close: (
    <Glyph>
      <path d="M6 6l12 12M18 6L6 18" />
    </Glyph>
  ),
  chevronDown: (
    <Glyph>
      <path d="M6 9.5l6 6 6-6" />
    </Glyph>
  ),
  chevronLeft: (
    <Glyph>
      <path d="M14.5 6l-6 6 6 6" />
    </Glyph>
  ),
  chevronRight: (
    <Glyph>
      <path d="M9.5 6l6 6-6 6" />
    </Glyph>
  ),
  check: (
    <Glyph>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </Glyph>
  ),
  copy: (
    <Glyph>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        transform="translate(2 1)"
      />
    </Glyph>
  ),
  search: (
    <Glyph>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </Glyph>
  ),
  info: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Glyph>
  ),
  success: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </Glyph>
  ),
  warning: (
    <Glyph>
      <path d="M12 3.5L2.8 19.5a1 1 0 0 0 .87 1.5h16.66a1 1 0 0 0 .87-1.5L12 3.5z" />
      <path d="M12 9.5v5M12 17.5h.01" />
    </Glyph>
  ),
  error: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </Glyph>
  ),
};
```

(Adjust the `copy` glyph paths visually in the example app later if the transform looks off — simplest correct form: back sheet `<path d="M5 15V5a2 2 0 0 1 2-2h10" />` with no transform.)

`packages/icons/src/index.ts`:

```ts
import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { bundle1Icons } from './bundle1';

export { bundle1Icons };

/** All shipped bundles merged — pass to `IconProvider` for var-ui defaults. */
export const defaultIcons: Partial<Record<IconName, ReactNode>> = {
  ...bundle1Icons,
};
```

`packages/icons/README.md`: short package readme — what it is, install command, the `IconProvider` wiring snippet from the spec (§0.4 setup path 2), note that it is optional and tree-shakeable.

- [ ] **Step 5: Run tests** — `vp test run` → PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/icons vite.config.ts pnpm-lock.yaml
git commit -m "feat(icons): add @var-ui/icons package with bundle 1 glyphs"
```

---

### Task 4: `IconProvider` / `useIcons` / `<Icon>` in react (spec §0.4)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/icons/emptyFallback.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/icons/IconProvider.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/icons/Icon.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/icons/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/package.json` (optional peer on `@var-ui/icons`)
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/icons/Icon.test.tsx`

**Interfaces:**

- Consumes: `IconName`, `icon` recipe from `@var-ui/core`.
- Produces (used by Tasks 14–20 and every future overlay/nav component):

```ts
type IconRegistry = Partial<Record<IconName, ReactNode>>;
function IconProvider(props: { icons: IconRegistry; children: ReactNode }): JSX.Element; // nested providers shallow-merge over parent
function useIcons(): IconRegistry;
type IconProps = {
  name?: IconName;
  children?: ReactNode; // escape hatch — bypasses registry
  size?: 'sm' | 'md' | 'lg' | 'inherit';
  className?: string;
  'aria-label'?: string; // when set: role="img"; otherwise aria-hidden
};
function Icon(props: IconProps): JSX.Element;
```

- [ ] **Step 1: Write the failing test**

`packages/react/src/icons/Icon.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { Icon, IconProvider } from './index';

const star = <svg data-testid="star" viewBox="0 0 24 24" />;
const moon = <svg data-testid="moon" viewBox="0 0 24 24" />;

describe('Icon', () => {
  it('resolves glyphs from the provider registry', () => {
    const { getByTestId } = render(
      <IconProvider icons={{ close: star }}>
        <Icon name="close" />
      </IconProvider>,
    );
    expect(getByTestId('star')).toBeTruthy();
  });

  it('renders the shared empty fallback for unmapped names', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Icon name="search" />
      </IconProvider>,
    );
    const shell = container.querySelector('[data-icon-fallback]');
    expect(shell).toBeTruthy();
  });

  it('shallow-merges nested providers over the parent registry', () => {
    const { getByTestId, queryByTestId } = render(
      <IconProvider icons={{ close: star, search: star }}>
        <IconProvider icons={{ close: moon }}>
          <Icon name="close" />
        </IconProvider>
      </IconProvider>,
    );
    expect(getByTestId('moon')).toBeTruthy();
    expect(queryByTestId('star')).toBeNull();
  });

  it('children bypass the registry and aria-label switches to role img', () => {
    const { getByRole, getByTestId } = render(
      <IconProvider icons={{}}>
        <Icon aria-label="custom">{star}</Icon>
      </IconProvider>,
    );
    expect(getByTestId('star')).toBeTruthy();
    expect(getByRole('img', { name: 'custom' })).toBeTruthy();
  });

  it('applies the icon recipe size class', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Icon name="close" size="lg" />
      </IconProvider>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'example-ds-icon-size-lg',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `vp test run` → FAIL.

- [ ] **Step 3: Implement**

`packages/react/src/icons/emptyFallback.tsx`:

```tsx
/**
 * The single shared placeholder rendered for every unmapped IconName.
 * Keeps the em-box sized (via the `icon` recipe on the wrapping span) while
 * shipping zero glyph payload for apps that bring their own icon system.
 */
export const emptyFallback = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-icon-fallback="" />
);
```

`packages/react/src/icons/IconProvider.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { IconName } from '@var-ui/core';

export type IconRegistry = Partial<Record<IconName, ReactNode>>;

const IconContext = createContext<IconRegistry>({});

export type IconProviderProps = {
  /** Partial maps are fine — unmapped names render the shared empty fallback. */
  icons: IconRegistry;
  children: ReactNode;
};

/**
 * The only way glyphs reach var-ui components. Nest providers to shallow-merge
 * overrides over the parent registry for a subtree.
 *
 * ```tsx
 * import { defaultIcons } from '@var-ui/icons';
 * <IconProvider icons={defaultIcons}>{app}</IconProvider>
 * ```
 */
export function IconProvider({ icons, children }: IconProviderProps): JSX.Element {
  const parent = useContext(IconContext);
  const merged = useMemo<IconRegistry>(() => ({ ...parent, ...icons }), [parent, icons]);
  return <IconContext.Provider value={merged}>{children}</IconContext.Provider>;
}

/** Read the merged icon registry from context. */
export function useIcons(): IconRegistry {
  return useContext(IconContext);
}
````

`packages/react/src/icons/Icon.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { icon, type IconName } from '@var-ui/core';
import { cx } from '../components/utils';
import { emptyFallback } from './emptyFallback';
import { useIcons } from './IconProvider';

export type IconProps = {
  /** Semantic name resolved via `IconProvider`; unmapped names render the empty fallback. */
  name?: IconName;
  /** Caller-supplied node — bypasses the registry entirely. */
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'inherit';
  className?: string;
  'aria-label'?: string;
};

/**
 * Registry-resolved icon shell. Decorative by default (`aria-hidden`); pass
 * `aria-label` to expose it as an image to assistive tech.
 */
export function Icon({
  name,
  children,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: IconProps): JSX.Element {
  const icons = useIcons();
  const glyph = children ?? (name ? icons[name] : undefined) ?? emptyFallback;
  return (
    <span
      className={cx(icon({ size }), className)}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {glyph}
    </span>
  );
}
```

`packages/react/src/icons/index.ts`:

```ts
export { Icon, type IconProps } from './Icon';
export { IconProvider, useIcons, type IconProviderProps, type IconRegistry } from './IconProvider';
```

Wire into `packages/react/src/index.ts` (component + types). Add to `packages/react/package.json`:

```json
"peerDependencies": { "@var-ui/icons": "workspace:^" },
"peerDependenciesMeta": { "@var-ui/icons": { "optional": true } }
```

(merged into the existing peerDependencies block) and `"@var-ui/icons": "workspace:*"` to devDependencies. Run `vp install`.

- [ ] **Step 4: Run tests** — `vp test run` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react pnpm-lock.yaml
git commit -m "feat(react): add IconProvider, useIcons, and Icon with empty fallback"
```

---

### Task 5: `field` recipe + `fieldChrome` helper + React `Field` (spec §0.1)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/field.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/textField.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/textAreaField.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/select.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/index.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Field.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/index.ts`, `/Users/danielbanks/dev/var-ui/packages/react/src/index.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/field.test.ts`, `/Users/danielbanks/dev/var-ui/packages/react/src/components/Field.test.tsx`

**Interfaces:**

- Produces:

```ts
// core — shared chrome declarations, parameterized by each recipe's own c.vars refs
type FieldChromeColors = { label: string; description: string; error: string };
function fieldChrome(colors: FieldChromeColors): {
  root: object;
  label: object;
  description: object;
  error: object;
};
// core — standalone recipe for custom inputs, slots: root | label | description | error
const field: TypeStylesComponent;
// react
type FieldProps = {
  label?: string;
  description?: string;
  errorMessage?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};
function Field(props: FieldProps): JSX.Element;
```

- **Class-name safety:** existing `text-field`/`text-area-field`/`select` recipes keep their component names and slot names — only their style _declarations_ move to `fieldChrome`. No public class changes.

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/field.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { field } from './field';
import { textField } from './textField';

describe('field recipe', () => {
  it('registers root/label/description/error slots', () => {
    field();
    const css = getRegisteredCss();
    for (const slot of ['root', 'label', 'description', 'error']) {
      expect(css).toContain(`example-ds-field-${slot}`);
    }
  });

  it('keeps textField public class names stable after fieldChrome refactor', () => {
    textField();
    const css = getRegisteredCss();
    for (const slot of ['root', 'label', 'input', 'description', 'error']) {
      expect(css).toContain(`example-ds-text-field-${slot}`);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `vp test run` → FAIL (no `./field`).

- [ ] **Step 3: Implement**

`packages/core/src/components/field.ts`:

````ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export type FieldChromeColors = {
  label: string;
  description: string;
  error: string;
};

/**
 * Shared label/description/error declarations composed by every field-shaped
 * recipe (textField, textAreaField, select, and the standalone `field`).
 * Each recipe passes its own `c.vars()` refs so per-component theming keeps
 * working; class names stay per-recipe (public API is untouched).
 */
export function fieldChrome(colors: FieldChromeColors) {
  return {
    root: {
      display: 'grid',
      gap: t.space[1],
      minWidth: '240px',
    },
    label: {
      fontSize: t.fontSize.md,
      fontWeight: t.fontWeight.medium,
      color: colors.label,
    },
    description: {
      fontSize: t.fontSize.sm,
      color: colors.description,
    },
    error: {
      fontSize: t.fontSize.sm,
      color: colors.error,
    },
  } as const;
}

/**
 * Standalone field chrome for custom inputs that aren't one of the built-in
 * field recipes — label, help text, and validation message around any control.
 *
 * ```tsx
 * const f = field();
 * <div className={f.root}>
 *   <label className={f.label}>Amount</label>
 *   <MyCustomInput />
 *   <p className={f.description}>Help text</p>
 * </div>
 * ```
 */
export const field = styles.component(
  'field',
  (c) => {
    const v = c.vars({
      labelColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      errorColor: { value: `${t.color.danger.default}`, syntax: '<color>', inherits: false },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error'],
      ...chrome,
    };
  },
  { layer: 'components' },
);
````

Refactor `textField.ts`: keep its `c.vars` block; replace the `root`, `label`, `description`, `error` style objects with `...fieldChrome({ label: v.labelColor.var, description: v.descriptionColor.var, error: v.errorColor.var })` spread (import from `./field`), keeping `input` as-is. Same for `textAreaField.ts` (inspect its slots first — mirror what's there). For `select.ts`, replace only `root` + `label` declarations via the chrome (it has no description/error slots — spread just `root: chrome.root, label: chrome.label`; give it a local `const chrome = fieldChrome({ label: v.labelColor.var, description: '', error: '' })` or destructure — keep it minimal and typed).

`packages/react/src/components/Field.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { field } from '@var-ui/core';
import { cx } from './utils';

export type FieldProps = {
  label?: string;
  description?: string;
  errorMessage?: string;
  /** id of the wrapped control, wired to the label's `htmlFor`. */
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Field chrome for custom inputs: label, description, and error message
 * around any control that isn't one of the built-in field components.
 */
export function Field({
  label,
  description,
  errorMessage,
  htmlFor,
  className,
  children,
}: FieldProps): JSX.Element {
  const f = field();
  return (
    <div className={cx(f.root, className)}>
      {label ? (
        <label className={f.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {description ? <p className={f.description}>{description}</p> : null}
      {errorMessage ? (
        <p className={f.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
```

`packages/react/src/components/Field.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';

describe('Field', () => {
  it('wires label, description, and error around a custom control', () => {
    render(
      <Field label="Amount" description="In USD" errorMessage="Required" htmlFor="amt">
        <input id="amt" />
      </Field>,
    );
    expect(screen.getByLabelText('Amount')).toBeTruthy();
    expect(screen.getByText('In USD').className).toContain('example-ds-field-description');
    expect(screen.getByRole('alert').textContent).toBe('Required');
  });
});
```

- [ ] **Step 4: Run tests** — `vp test run` → PASS. Also `vp check --fix` (the typestyles lint rule must not report removed class names).

- [ ] **Step 5: Commit**

```bash
git add packages/core/src packages/react/src
git commit -m "feat(core,react): add field recipe with shared fieldChrome and Field wrapper"
```

---

### Task 6: Layout primitive recipes — stack, grid, divider, section, center, aspectRatio (spec §0.3)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/stack.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/grid.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/divider.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/section.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/center.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/aspectRatio.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/index.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/layoutPrimitives.test.ts`

**Interfaces:**

- Produces flat recipes (single class string) with these variant axes — Task 7 wrappers depend on the exact variant names:
  - `stack({ direction: 'column'|'row', gap: 'none'|'xs'|'sm'|'md'|'lg'|'xl', align: 'start'|'center'|'end'|'stretch', justify: 'start'|'center'|'end'|'between', wrap: 'wrap'|'nowrap' })` — defaults: column/md/stretch/start/nowrap
  - `grid({ columns: 'auto'|'1'|'2'|'3'|'4', gap: same scale as stack })` — `auto` = `repeat(auto-fill, minmax(var(minColumnWidth), 1fr))`, minColumnWidth var default `240px`; defaults: auto/md
  - `divider({ orientation: 'horizontal'|'vertical' })` — color via `c.vars`, default horizontal
  - `section()` — slot recipe `root`/`title` — bordered surface panel (promoted from `layout.section` look)
  - `center({ inline: 'true'|'false' })` — grid place-items center; default false
  - `aspectRatio()` — `aspect-ratio: 16/9` default; consumers override via inline `aspect-ratio` style (wrapper does this)

- [ ] **Step 1: Write the failing test**

`packages/core/src/components/layoutPrimitives.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { aspectRatio } from './aspectRatio';
import { center } from './center';
import { divider } from './divider';
import { grid } from './grid';
import { section } from './section';
import { stack } from './stack';

describe('layout primitives', () => {
  it('stack registers direction and gap variants', () => {
    stack({ direction: 'row', gap: 'lg' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-stack-base');
    expect(css).toContain('example-ds-stack-direction-row');
    expect(css).toContain('example-ds-stack-gap-lg');
  });

  it('grid registers auto-fill column mode with a min-column var', () => {
    grid({ columns: 'auto' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-grid-base');
    expect(css).toMatch(/auto-fill.*minmax/);
  });

  it('divider registers both orientations', () => {
    divider({ orientation: 'vertical' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-divider-orientation-vertical');
  });

  it('section, center, aspectRatio register base classes', () => {
    section();
    center();
    aspectRatio();
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-section-root');
    expect(css).toContain('example-ds-center-base');
    expect(css).toContain('example-ds-aspect-ratio-base');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `vp test run` → FAIL.

- [ ] **Step 3: Implement the six recipes**

`stack.ts`:

````ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Flex stack — the workhorse layout primitive. Vertical by default; use
 * `direction: 'row'` (or the React `HStack`) for horizontal grouping.
 *
 * ```tsx
 * <div className={stack({ gap: 'lg' })}>…</div>
 * ```
 */
export const stack = styles.component(
  'stack',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[3], syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: v.gap.var,
        minWidth: 0,
      },
      variants: {
        direction: {
          column: {},
          row: { flexDirection: 'row' },
        },
        gap: {
          none: { [v.gap.name]: '0px' },
          xs: { [v.gap.name]: t.space[1] },
          sm: { [v.gap.name]: t.space[2] },
          md: { [v.gap.name]: t.space[3] },
          lg: { [v.gap.name]: t.space[5] },
          xl: { [v.gap.name]: t.space[8] },
        },
        align: {
          start: { alignItems: 'flex-start' },
          center: { alignItems: 'center' },
          end: { alignItems: 'flex-end' },
          stretch: { alignItems: 'stretch' },
        },
        justify: {
          start: { justifyContent: 'flex-start' },
          center: { justifyContent: 'center' },
          end: { justifyContent: 'flex-end' },
          between: { justifyContent: 'space-between' },
        },
        wrap: {
          wrap: { flexWrap: 'wrap' },
          nowrap: {},
        },
      },
      defaultVariants: {
        direction: 'column',
        gap: 'md',
        align: 'stretch',
        justify: 'start',
        wrap: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
````

`grid.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Responsive grid. `columns: 'auto'` packs `minmax(minColumnWidth, 1fr)`
 * tracks (override the min width by setting the exposed CSS variable);
 * numeric columns give fixed equal tracks.
 */
export const grid = styles.component(
  'grid',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[4], syntax: '<length>', inherits: false },
      minColumnWidth: { value: '240px', syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'grid',
        gap: v.gap.var,
        gridTemplateColumns: `repeat(auto-fill, minmax(${v.minColumnWidth.var}, 1fr))`,
      },
      variants: {
        columns: {
          auto: {},
          1: { gridTemplateColumns: '1fr' },
          2: { gridTemplateColumns: 'repeat(2, 1fr)' },
          3: { gridTemplateColumns: 'repeat(3, 1fr)' },
          4: { gridTemplateColumns: 'repeat(4, 1fr)' },
        },
        gap: {
          none: { [v.gap.name]: '0px' },
          xs: { [v.gap.name]: t.space[1] },
          sm: { [v.gap.name]: t.space[2] },
          md: { [v.gap.name]: t.space[4] },
          lg: { [v.gap.name]: t.space[5] },
          xl: { [v.gap.name]: t.space[8] },
        },
      },
      defaultVariants: { columns: 'auto', gap: 'md' },
    };
  },
  { layer: 'components' },
);
```

(If numeric variant keys `1`–`4` upset the class-name generator or types, use `one|two|three|four` — check the generated CSS in the test.)

`divider.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Hairline separator; vertical orientation stretches to the parent's cross size. */
export const divider = styles.component(
  'divider',
  (c) => {
    const v = c.vars({
      color: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      base: {
        border: 'none',
        margin: 0,
        backgroundColor: v.color.var,
        flexShrink: 0,
      },
      variants: {
        orientation: {
          horizontal: { width: '100%', height: '1px' },
          vertical: { width: '1px', height: 'auto', alignSelf: 'stretch' },
        },
      },
      defaultVariants: { orientation: 'horizontal' },
    };
  },
  { layer: 'components' },
);
```

`section.ts` (slot recipe — bordered content region, the named-export promotion of `layout.section`):

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Bordered surface region with an optional title — the page-section building block. */
export const section = styles.component(
  'section',
  (c) => {
    const v = c.vars({
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      background: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'title'],
      root: {
        display: 'grid',
        gap: t.space[3],
        padding: t.space[4],
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.lg,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.xs,
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.xl,
        fontWeight: t.fontWeight.semibold,
      },
    };
  },
  { layer: 'components' },
);
```

`center.ts`:

```ts
import { styles } from '../runtime';

/** Centers children on both axes. `inline` variant for inline-grid contexts. */
export const center = styles.component(
  'center',
  () => ({
    base: {
      display: 'grid',
      placeItems: 'center',
    },
    variants: {
      inline: {
        true: { display: 'inline-grid' },
        false: {},
      },
    },
    defaultVariants: { inline: 'false' },
  }),
  { layer: 'components' },
);
```

`aspectRatio.ts`:

```ts
import { styles } from '../runtime';

/**
 * Constrains children to a fixed aspect ratio (16/9 default). The React
 * wrapper overrides the ratio via inline `aspect-ratio` style.
 */
export const aspectRatio = styles.component(
  'aspect-ratio',
  () => ({
    base: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      '& > *': {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
  }),
  { layer: 'components' },
);
```

Add all six exports to `components/index.ts`.

- [ ] **Step 4: Run tests** — `vp test run` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src
git commit -m "feat(core): add stack, grid, divider, section, center, aspectRatio recipes"
```

---

### Task 7: React layout wrappers — Stack/HStack/VStack, Grid, Divider, Section, Center, AspectRatio

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Stack.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Grid.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Divider.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Section.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Center.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/AspectRatio.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/index.ts`, `/Users/danielbanks/dev/var-ui/packages/react/src/index.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Stack.test.tsx`

**Interfaces:**

```ts
type StackProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'column' | 'row';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
};
function Stack(props: StackProps): JSX.Element;
function HStack(props: Omit<StackProps, 'direction'>): JSX.Element; // row + align center default
function VStack(props: Omit<StackProps, 'direction'>): JSX.Element;
type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: 'auto' | 1 | 2 | 3 | 4;
  gap?: StackProps['gap'];
};
type DividerProps = HTMLAttributes<HTMLHRElement> & { orientation?: 'horizontal' | 'vertical' }; // renders <hr>, vertical gets role="separator" aria-orientation
type SectionProps = HTMLAttributes<HTMLElement> & { title?: string }; // renders <section>, title as h2
type CenterProps = HTMLAttributes<HTMLDivElement> & { inline?: boolean };
type AspectRatioProps = HTMLAttributes<HTMLDivElement> & { ratio?: number }; // style={{ aspectRatio: ratio }}
```

- [ ] **Step 1: Write the failing test**

`packages/react/src/components/Stack.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { HStack, Stack } from './Stack';

describe('Stack', () => {
  it('applies variant classes for gap and direction', () => {
    const { container } = render(
      <Stack direction="row" gap="lg" data-testid="s">
        <span>a</span>
      </Stack>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('example-ds-stack-direction-row');
    expect(el.className).toContain('example-ds-stack-gap-lg');
  });

  it('HStack defaults to row with centered cross axis', () => {
    const { container } = render(<HStack>x</HStack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('example-ds-stack-direction-row');
    expect(el.className).toContain('example-ds-stack-align-center');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `vp test run` → FAIL.

- [ ] **Step 3: Implement the wrappers**

`Stack.tsx`:

```tsx
import type { HTMLAttributes, JSX } from 'react';
import { stack } from '@var-ui/core';
import { cx } from './utils';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'column' | 'row';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
};

/** Flex stack layout primitive. Vertical by default; see `HStack`/`VStack`. */
export function Stack({
  direction = 'column',
  gap = 'md',
  align,
  justify,
  wrap = false,
  className,
  ...props
}: StackProps): JSX.Element {
  return (
    <div
      {...props}
      className={cx(
        stack({ direction, gap, align, justify, wrap: wrap ? 'wrap' : 'nowrap' }),
        className,
      )}
    />
  );
}

/** Horizontal stack — row direction with centered cross axis by default. */
export function HStack({ align = 'center', ...props }: Omit<StackProps, 'direction'>): JSX.Element {
  return <Stack {...props} align={align} direction="row" />;
}

/** Vertical stack — explicit alias for readability at call sites. */
export function VStack(props: Omit<StackProps, 'direction'>): JSX.Element {
  return <Stack {...props} direction="column" />;
}
```

(Note: `stack({ align: undefined })` must fall back to the recipe default — TypeStyles treats missing keys as defaults; pass only defined values if it doesn't: build the variant object with conditional spreads.)

`Grid.tsx`, `Center.tsx`, `AspectRatio.tsx`, `Section.tsx`, `Divider.tsx` follow the same shape:

```tsx
// Grid.tsx
import type { HTMLAttributes, JSX } from 'react';
import { grid } from '@var-ui/core';
import { cx } from './utils';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: 'auto' | 1 | 2 | 3 | 4;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

/** Responsive grid; `columns="auto"` packs minmax(240px, 1fr) tracks. */
export function Grid({
  columns = 'auto',
  gap = 'md',
  className,
  ...props
}: GridProps): JSX.Element {
  return <div {...props} className={cx(grid({ columns: String(columns), gap }), className)} />;
}
```

```tsx
// Divider.tsx
import type { HTMLAttributes, JSX } from 'react';
import { divider } from '@var-ui/core';
import { cx } from './utils';

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: 'horizontal' | 'vertical';
};

/** Hairline separator. Vertical orientation exposes aria-orientation. */
export function Divider({
  orientation = 'horizontal',
  className,
  ...props
}: DividerProps): JSX.Element {
  return (
    <hr
      {...props}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cx(divider({ orientation }), className)}
    />
  );
}
```

```tsx
// Section.tsx
import type { HTMLAttributes, JSX } from 'react';
import { section } from '@var-ui/core';
import { cx } from './utils';

export type SectionProps = HTMLAttributes<HTMLElement> & { title?: string };

/** Bordered surface region with an optional heading. */
export function Section({ title, className, children, ...props }: SectionProps): JSX.Element {
  const s = section();
  return (
    <section {...props} className={cx(s.root, className)}>
      {title ? <h2 className={s.title}>{title}</h2> : null}
      {children}
    </section>
  );
}
```

```tsx
// Center.tsx
import type { HTMLAttributes, JSX } from 'react';
import { center } from '@var-ui/core';
import { cx } from './utils';

export type CenterProps = HTMLAttributes<HTMLDivElement> & { inline?: boolean };

/** Centers children on both axes. */
export function Center({ inline = false, className, ...props }: CenterProps): JSX.Element {
  return (
    <div {...props} className={cx(center({ inline: inline ? 'true' : 'false' }), className)} />
  );
}
```

```tsx
// AspectRatio.tsx
import type { HTMLAttributes, JSX } from 'react';
import { aspectRatio } from '@var-ui/core';
import { cx } from './utils';

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  /** width / height, e.g. `16 / 9` or `1`. Defaults to the recipe's 16/9. */
  ratio?: number;
};

/** Constrains children (images, embeds, maps) to a fixed aspect ratio. */
export function AspectRatio({ ratio, className, style, ...props }: AspectRatioProps): JSX.Element {
  return (
    <div
      {...props}
      className={cx(aspectRatio(), className)}
      style={ratio ? { ...style, aspectRatio: String(ratio) } : style}
    />
  );
}
```

Export all (components + prop types) from `components/index.ts` and `src/index.ts`.

- [ ] **Step 4: Run tests + check** — `vp test run && vp check --fix` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src
git commit -m "feat(react): add Stack, Grid, Divider, Section, Center, AspectRatio wrappers"
```

---

### Task 8: Floating layer system — `overlay` recipe, `LayerProvider`/`useLayer`, first hooks (spec §0.2, §0.5)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/overlay.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/layers/LayerProvider.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/hooks/useMediaQuery.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/hooks/useScrollLock.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/hooks/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Dialog.tsx` (wire z-index)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/index.ts`, core `components/index.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/layers/LayerProvider.test.tsx`, `/Users/danielbanks/dev/var-ui/packages/react/src/hooks/useMediaQuery.test.tsx`

**Interfaces:**

```ts
// core — shared backdrop recipe, slots: backdrop | positioner
const overlay: TypeStylesComponent; // backdrop: fixed inset-0 semi-opaque; positioner: fixed inset-0 grid place-items-center
// react
function LayerProvider(props: {
  children: ReactNode;
  baseZIndex?: number; /* default 100 */
}): JSX.Element;
function useLayer(): { zIndex: number; style: { zIndex: number } };
// Works without a provider (falls back to base 100). Each useLayer() mount
// allocates base + (mountOrder * 10) so later layers stack above earlier ones.
function useMediaQuery(query: string): boolean; // SSR-safe, false on server
function useScrollLock(locked: boolean): void; // locks document.body overflow while true
```

- Phase 3 (Toast/Popover/Tooltip/Lightbox) consumes these; today Dialog's ModalOverlay gets `style={style}` from `useLayer()`.

- [ ] **Step 1: Write the failing tests**

`packages/react/src/layers/LayerProvider.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { LayerProvider, useLayer } from './LayerProvider';

function Probe({ testId }: { testId: string }) {
  const { zIndex } = useLayer();
  return <div data-testid={testId} data-z={zIndex} />;
}

describe('LayerProvider', () => {
  it('falls back to base z-index without a provider', () => {
    const { getByTestId } = render(<Probe testId="a" />);
    expect(Number(getByTestId('a').dataset.z)).toBeGreaterThanOrEqual(100);
  });

  it('stacks sibling layers in mount order', () => {
    const { getByTestId } = render(
      <LayerProvider baseZIndex={200}>
        <Probe testId="first" />
        <Probe testId="second" />
      </LayerProvider>,
    );
    const first = Number(getByTestId('first').dataset.z);
    const second = Number(getByTestId('second').dataset.z);
    expect(first).toBeGreaterThanOrEqual(200);
    expect(second).toBeGreaterThan(first);
  });
});
```

`packages/react/src/hooks/useMediaQuery.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  it('reflects matchMedia state', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(min-width: 600px)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));
    expect(result.current).toBe(true);
    vi.unstubAllGlobals();
  });
});
```

(If `vi` is not exported from `vite-plus/test`, import from `'vitest'` — check `create-theme.test.ts`'s import source first.)

- [ ] **Step 2: Run to verify they fail** — `vp test run` → FAIL.

- [ ] **Step 3: Implement**

`packages/core/src/components/overlay.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Shared floating-layer chrome: a dimmed fixed backdrop plus a centered
 * positioner. Dialog, AlertDialog, Lightbox, and CommandPalette overlays
 * compose these instead of re-declaring fixed-inset boxes.
 */
export const overlay = styles.component(
  'overlay',
  (c) => {
    const v = c.vars({
      background: { value: `${t.color.overlay.backdrop}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['backdrop', 'positioner'],
      backdrop: {
        position: 'fixed',
        inset: 0,
        backgroundColor: v.background.var,
      },
      positioner: {
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        padding: t.space[4],
      },
    };
  },
  { layer: 'components' },
);
```

`packages/react/src/layers/LayerProvider.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo, useRef, useState } from 'react';

type LayerContextValue = {
  baseZIndex: number;
  allocate: () => number;
};

const DEFAULT_BASE = 100;
const STEP = 10;

const LayerContext = createContext<LayerContextValue | null>(null);

export type LayerProviderProps = {
  children: ReactNode;
  /** z-index of the first floating layer; each subsequent layer adds 10. */
  baseZIndex?: number;
};

/**
 * Coordinates z-index for floating UI (dialogs, toasts, popovers) so layers
 * stack in mount order instead of by hard-coded constants. Optional — layers
 * fall back to a base of 100 without it.
 */
export function LayerProvider({
  children,
  baseZIndex = DEFAULT_BASE,
}: LayerProviderProps): JSX.Element {
  const counter = useRef(0);
  const value = useMemo<LayerContextValue>(
    () => ({
      baseZIndex,
      allocate: () => baseZIndex + counter.current++ * STEP,
    }),
    [baseZIndex],
  );
  return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}

/** Allocate a stable z-index for one floating layer (stable across re-renders). */
export function useLayer(): { zIndex: number; style: { zIndex: number } } {
  const context = useContext(LayerContext);
  const [zIndex] = useState(() => (context ? context.allocate() : DEFAULT_BASE));
  return { zIndex, style: { zIndex } };
}
```

`packages/react/src/hooks/useMediaQuery.ts`:

```ts
import { useSyncExternalStore } from 'react';

/** SSR-safe media query subscription; returns false where matchMedia is unavailable. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () =>
      typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
    () => false,
  );
}
```

`packages/react/src/hooks/useScrollLock.ts`:

```ts
import { useEffect } from 'react';

/** Locks body scroll while `locked` is true; restores the previous overflow on cleanup. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
```

`hooks/index.ts`:

```ts
export { useMediaQuery } from './useMediaQuery';
export { useScrollLock } from './useScrollLock';
```

Wire `Dialog.tsx`: `const { style } = useLayer();` and pass `style={style}` to `ModalOverlay`. Export `LayerProvider`, `useLayer`, `LayerProviderProps` and `overlay` recipe from the respective indexes.

- [ ] **Step 4: Run tests** — `vp test run` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src packages/react/src
git commit -m "feat(core,react): add overlay recipe, LayerProvider/useLayer, media-query and scroll-lock hooks"
```

---

### Task 9: Spinner

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/spinner.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Spinner.tsx`
- Modify: both component indexes + `packages/react/src/index.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/feedback.test.ts` (shared by Tasks 9–12 — create here, extend later)

**Interfaces:**

- `spinner({ size: 'sm'|'md'|'lg', tone: 'accent'|'neutral' })` — flat recipe; track + indicator colors via `c.vars` (`trackColor`, `indicatorColor`), sizes 14/20/32px.
- `SpinnerProps = { size?; tone?; label?: string /* default 'Loading' */; className? }` — renders a `role="progressbar"`-free `<span>` with `role="status"` + visually-hidden label.

- [ ] **Step 1: Write the failing test** — create `feedback.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { spinner } from './spinner';

describe('spinner', () => {
  it('registers an animated ring with reduced-motion fallback', () => {
    spinner({ size: 'lg' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-spinner-base');
    expect(css).toContain('example-ds-spinner-size-lg');
    expect(css).toContain('animation');
    expect(css).toContain('prefers-reduced-motion');
  });
});
```

- [ ] **Step 2: Run to verify failure** — `vp test run` → FAIL.

- [ ] **Step 3: Implement**

`packages/core/src/components/spinner.ts`:

```ts
import { keyframes } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

const spin = keyframes.create('var-ui-spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/**
 * Indeterminate loading ring. Use `ProgressBar` when progress is measurable.
 * Reduced-motion users get a slow, less dizzying rotation.
 */
export const spinner = styles.component(
  'spinner',
  (c) => {
    const v = c.vars({
      indicatorColor: { value: `${t.color.accent.default}`, syntax: '<color>', inherits: false },
      trackColor: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      size: { value: '20px', syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'inline-block',
        width: v.size.var,
        height: v.size.var,
        borderRadius: '50%',
        border: `2px solid ${v.trackColor.var}`,
        borderTopColor: v.indicatorColor.var,
        animation: `${spin} 800ms linear infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animationDuration: '2400ms',
        },
      },
      variants: {
        size: {
          sm: { [v.size.name]: '14px' },
          md: { [v.size.name]: '20px' },
          lg: { [v.size.name]: '32px', borderWidth: '3px' },
        },
        tone: {
          accent: {},
          neutral: { [v.indicatorColor.name]: t.color.text.secondary },
        },
      },
      defaultVariants: { size: 'md', tone: 'accent' },
    };
  },
  { layer: 'components' },
);
```

(Verify `keyframes.create` return interpolates into `animation` — see `../typestyles/docs/dist/docs/animation-patterns.md`; adjust to `spin.name` or template usage per that doc.)

`packages/react/src/components/Spinner.tsx`:

```tsx
import type { JSX } from 'react';
import { spinner } from '@var-ui/core';
import { cx } from './utils';

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'accent' | 'neutral';
  /** Accessible loading announcement. */
  label?: string;
  className?: string;
};

/** Indeterminate loading indicator with a screen-reader-only status label. */
export function Spinner({
  size = 'md',
  tone = 'accent',
  label = 'Loading',
  className,
}: SpinnerProps): JSX.Element {
  return (
    <span role="status" className={className}>
      <span className={cx(spinner({ size, tone }))} aria-hidden="true" />
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {label}
      </span>
    </span>
  );
}
```

(If a `visuallyHidden` utility recipe would help, add `visuallyHidden` to core `styles.ts` utilities and reuse — Phase 6 wants `VisuallyHidden` anyway; prefer the recipe over inline style if trivial.)

- [ ] **Step 4: Run tests** — `vp test run` → PASS.

- [ ] **Step 5: Commit** — `feat(core,react): add spinner`

---

### Task 10: Skeleton

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/skeleton.ts` (core-only per spec — static/presentational)
- Modify: core `components/index.ts`
- Test: extend `feedback.test.ts`

**Interfaces:**

- `skeleton({ shape: 'text'|'rect'|'circle' })` — flat recipe; consumers size via inline `width`/`height`. Shimmer via animated `background-position`; `prefers-reduced-motion` gets a static tint.

- [ ] **Step 1: Failing test** (append to `feedback.test.ts`):

```ts
import { skeleton } from './skeleton';

describe('skeleton', () => {
  it('registers shape variants with a shimmer animation', () => {
    skeleton({ shape: 'circle' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-skeleton-base');
    expect(css).toContain('example-ds-skeleton-shape-circle');
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

````ts
import { keyframes } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

const shimmer = keyframes.create('var-ui-shimmer', {
  from: { backgroundPosition: '200% 0' },
  to: { backgroundPosition: '-200% 0' },
});

/**
 * Loading placeholder. Size with inline width/height; pick `shape` to match
 * the content it stands in for.
 *
 * ```tsx
 * <div className={skeleton({ shape: 'text' })} style={{ width: '12ch' }} />
 * ```
 */
export const skeleton = styles.component(
  'skeleton',
  (c) => {
    const v = c.vars({
      baseColor: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
      highlightColor: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        display: 'block',
        backgroundImage: `linear-gradient(90deg, ${v.baseColor.var} 25%, ${v.highlightColor.var} 50%, ${v.baseColor.var} 75%)`,
        backgroundSize: '200% 100%',
        animation: `${shimmer} 1600ms ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          backgroundImage: 'none',
          backgroundColor: v.baseColor.var,
        },
      },
      variants: {
        shape: {
          text: { height: '1em', borderRadius: t.radius.sm },
          rect: { borderRadius: t.radius.md },
          circle: { borderRadius: '50%', aspectRatio: '1' },
        },
      },
      defaultVariants: { shape: 'text' },
    };
  },
  { layer: 'components' },
);
````

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core): add skeleton recipe`

---

### Task 11: ProgressBar

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/progressBar.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/ProgressBar.tsx`
- Modify: indexes
- Test: extend `feedback.test.ts` + `/Users/danielbanks/dev/var-ui/packages/react/src/components/ProgressBar.test.tsx`

**Interfaces:**

- `progressBar({ tone: 'accent'|'success'|'warning'|'danger', indeterminate: 'true'|'false' })` — slots `root | header | label | valueText | track | fill`.
- `ProgressBarProps = Omit<RACProgressBarProps, 'children'> & { label?: string; tone?; showValueText?: boolean }` on RAC `ProgressBar` (gives `aria-valuenow` etc.; render-prop supplies `percentage`, `valueText`); fill width set inline from `percentage`; `isIndeterminate` maps to the recipe's animated variant.

- [ ] **Step 1: Failing tests** — core (append to `feedback.test.ts`):

```ts
import { progressBar } from './progressBar';

describe('progressBar', () => {
  it('registers slots and tone variants', () => {
    progressBar({ tone: 'success' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-progress-bar-track');
    expect(css).toContain('example-ds-progress-bar-fill');
    expect(css).toContain('example-ds-progress-bar-root-tone-success');
  });
});
```

React `ProgressBar.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes progressbar semantics with a label and value', () => {
    render(<ProgressBar label="Uploading" value={40} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('renders indeterminate without aria-valuenow', () => {
    render(<ProgressBar label="Working" isIndeterminate />);
    const bar = screen.getByRole('progressbar', { name: 'Working' });
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`progressBar.ts`:

```ts
import { keyframes } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

const slide = keyframes.create('var-ui-progress-slide', {
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(400%)' },
});

/** Linear progress. Fill width is set inline by the React wrapper (percentage). */
export const progressBar = styles.component(
  'progress-bar',
  (c) => {
    const v = c.vars({
      trackColor: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
      fillColor: { value: `${t.color.accent.default}`, syntax: '<color>', inherits: true },
    });
    return {
      slots: ['root', 'header', 'label', 'valueText', 'track', 'fill'],
      root: { display: 'grid', gap: t.space[1], minWidth: '160px' },
      header: { display: 'flex', justifyContent: 'space-between', gap: t.space[3] },
      label: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium },
      valueText: { fontSize: t.fontSize.sm, color: t.color.text.secondary },
      track: {
        height: '6px',
        borderRadius: t.radius.full,
        backgroundColor: v.trackColor.var,
        overflow: 'hidden',
      },
      fill: {
        height: '100%',
        borderRadius: 'inherit',
        backgroundColor: v.fillColor.var,
        transition: `width ${t.duration.medium} ${t.easing.standard}`,
      },
      variants: {
        tone: {
          accent: {},
          success: { root: { [v.fillColor.name]: t.color.success.solid } },
          warning: { root: { [v.fillColor.name]: t.color.warning.default } },
          danger: { root: { [v.fillColor.name]: t.color.danger.solid } },
        },
        indeterminate: {
          true: {
            fill: {
              width: '25%',
              animation: `${slide} 1200ms ease-in-out infinite`,
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
                width: '100%',
                opacity: 0.5,
              },
            },
          },
          false: {},
        },
      },
      defaultVariants: { tone: 'accent', indeterminate: 'false' },
    };
  },
  { layer: 'components' },
);
```

(Note the variant-block shape for slot recipes: variant values map slot→styles, same as `alert.ts`. `radius.full` is `'0'` in the brutalist default theme — that's fine, themes override.)

`ProgressBar.tsx`:

```tsx
import type { JSX } from 'react';
import {
  ProgressBar as AriaProgressBar,
  Label,
  type ProgressBarProps as RACProgressBarProps,
} from 'react-aria-components';
import { progressBar } from '@var-ui/core';
import { cx } from './utils';

export type ProgressBarProps = Omit<RACProgressBarProps, 'children' | 'className'> & {
  label?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValueText?: boolean;
  className?: string;
};

/** Linear progress bar on react-aria ProgressBar (determinate or indeterminate). */
export function ProgressBar({
  label,
  tone = 'accent',
  showValueText = true,
  className,
  ...props
}: ProgressBarProps): JSX.Element {
  const p = progressBar({ tone, indeterminate: props.isIndeterminate ? 'true' : 'false' });
  return (
    <AriaProgressBar {...props} className={cx(p.root, className)}>
      {({ percentage, valueText }) => (
        <>
          {label || (showValueText && !props.isIndeterminate) ? (
            <div className={p.header}>
              {label ? <Label className={p.label}>{label}</Label> : <span />}
              {showValueText && !props.isIndeterminate ? (
                <span className={p.valueText}>{valueText}</span>
              ) : null}
            </div>
          ) : null}
          <div className={p.track}>
            <div
              className={p.fill}
              style={props.isIndeterminate ? undefined : { width: `${percentage ?? 0}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add progress bar`

---

### Task 12: StatusDot

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/statusDot.ts` (core-only)
- Modify: core index
- Test: extend `feedback.test.ts`

**Interfaces:**

- `statusDot({ tone: 'neutral'|'accent'|'success'|'warning'|'danger'|'info', pulse: 'true'|'false' })` — flat 8px dot; tone drives `c.vars` color via `semanticTone`; pulse = soft expanding ring animation, disabled under reduced motion.

- [ ] **Step 1: Failing test** (append):

```ts
import { statusDot } from './statusDot';

describe('statusDot', () => {
  it('registers tone and pulse variants', () => {
    statusDot({ tone: 'success', pulse: 'true' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-status-dot-base');
    expect(css).toContain('example-ds-status-dot-tone-success');
    expect(css).toContain('example-ds-status-dot-pulse-true');
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

````ts
import { keyframes } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { semanticTone, type SemanticToneKey } from './semanticTone';

const pulse = keyframes.create('var-ui-status-pulse', {
  from: { boxShadow: '0 0 0 0 color-mix(in srgb, currentColor 45%, transparent)' },
  to: { boxShadow: '0 0 0 6px color-mix(in srgb, currentColor 0%, transparent)' },
});

function toneColor(key: SemanticToneKey) {
  return { color: semanticTone[key].semantic };
}

/**
 * Semantic presence/status indicator. Pair with visible text or an
 * `aria-label` on the host element — the dot alone is decorative.
 *
 * ```tsx
 * <span className={statusDot({ tone: 'success', pulse: 'true' })} />
 * ```
 */
export const statusDot = styles.component(
  'status-dot',
  (c) => {
    const v = c.vars({
      size: { value: '8px', syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'inline-block',
        width: v.size.var,
        height: v.size.var,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        color: t.color.text.secondary,
      },
      variants: {
        tone: {
          neutral: {},
          accent: toneColor('accent'),
          success: toneColor('success'),
          warning: toneColor('warning'),
          danger: toneColor('danger'),
          info: toneColor('info'),
        },
        pulse: {
          true: {
            animation: `${pulse} 1400ms ease-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          },
          false: {},
        },
      },
      defaultVariants: { tone: 'neutral', pulse: 'false' },
    };
  },
  { layer: 'components' },
);
````

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core): add status dot recipe`

---

### Task 13: Typography — kbd, heading, textBlock (+ Heading/Text wrappers)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/kbd.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/typography.ts` (exports `heading` + `textBlock`)
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Typography.tsx` (exports `Heading` + `Text`)
- Modify: indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/typography.test.ts`, `/Users/danielbanks/dev/var-ui/packages/react/src/components/Typography.test.tsx`

**Interfaces:**

- `kbd()` — flat key-cap recipe.
- `heading({ size: 'xs'|'sm'|'md'|'lg'|'xl'|'display' })` — sizes map to fontSize tokens (md=lg token, lg=xl, xl=2xl, display=3xl + display font family + tight tracking); color via `c.vars`.
- `textBlock({ size: 'sm'|'md'|'lg', tone: 'primary'|'secondary', weight: 'normal'|'medium'|'semibold' })`.
- React: `Heading({ level?: 1|2|3|4|5|6 /* default 2 */, size?, className, children, ...h-attrs })` renders `<h{level}>`; `Text({ as?: 'p'|'span'|'div', size?, tone?, weight?, ... })`. **Do not** touch the existing `text` utility export from `styles.ts` — `textBlock` is the new named recipe (avoids the export collision).

- [ ] **Step 1: Failing tests**

`typography.test.ts` (core):

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { kbd } from './kbd';
import { heading, textBlock } from './typography';

describe('typography recipes', () => {
  it('heading registers size variants including display', () => {
    heading({ size: 'display' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-heading-base');
    expect(css).toContain('example-ds-heading-size-display');
  });

  it('textBlock registers size, tone, and weight axes', () => {
    textBlock({ size: 'sm', tone: 'secondary', weight: 'medium' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-text-block-size-sm');
    expect(css).toContain('example-ds-text-block-tone-secondary');
    expect(css).toContain('example-ds-text-block-weight-medium');
  });

  it('kbd registers a key-cap base class', () => {
    kbd();
    expect(getRegisteredCss()).toContain('example-ds-kbd-base');
  });
});
```

`Typography.test.tsx` (react):

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Heading, Text } from './Typography';

describe('Typography', () => {
  it('Heading renders the requested level with a size class', () => {
    render(
      <Heading level={3} size="lg">
        Title
      </Heading>,
    );
    const h = screen.getByRole('heading', { level: 3, name: 'Title' });
    expect(h.className).toContain('example-ds-heading-size-lg');
  });

  it('Text renders the requested element with tone class', () => {
    render(
      <Text as="span" tone="secondary">
        hint
      </Text>,
    );
    const el = screen.getByText('hint');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toContain('example-ds-text-block-tone-secondary');
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`kbd.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Keyboard key cap for shortcut hints: `<kbd className={kbd()}>⌘K</kbd>`. */
export const kbd = styles.component(
  'kbd',
  (c) => {
    const v = c.vars({
      background: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      base: {
        display: 'inline-block',
        padding: `1px ${t.space[1]}`,
        fontFamily: t.fontFamily.mono,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.medium,
        lineHeight: t.lineHeight.normal,
        color: t.color.text.secondary,
        backgroundColor: v.background.var,
        border: `1px solid ${v.border.var}`,
        borderBottomWidth: '2px',
        borderRadius: t.radius.sm,
        whiteSpace: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
```

`typography.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Named heading recipe. Visual `size` is independent of the semantic level
 * the React wrapper renders — pick size for hierarchy, level for outline.
 */
export const heading = styles.component(
  'heading',
  (c) => {
    const v = c.vars({
      color: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      base: {
        margin: 0,
        color: v.color.var,
        fontWeight: t.fontWeight.semibold,
        lineHeight: t.lineHeight.tight,
        letterSpacing: '-0.01em',
      },
      variants: {
        size: {
          xs: { fontSize: t.fontSize.md },
          sm: { fontSize: t.fontSize.lg },
          md: { fontSize: t.fontSize.xl },
          lg: { fontSize: t.fontSize['2xl'] },
          xl: { fontSize: t.fontSize['3xl'] },
          display: {
            fontSize: t.fontSize['3xl'],
            fontFamily: t.fontFamily.display,
            letterSpacing: '-0.02em',
          },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

/** Named body-text recipe (`Text` in React). Distinct from the `text` docs utility. */
export const textBlock = styles.component(
  'text-block',
  (c) => {
    const v = c.vars({
      color: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      secondaryColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
    });
    return {
      base: {
        margin: 0,
        color: v.color.var,
        lineHeight: t.lineHeight.normal,
      },
      variants: {
        size: {
          sm: { fontSize: t.fontSize.sm },
          md: { fontSize: t.fontSize.md },
          lg: { fontSize: t.fontSize.lg },
        },
        tone: {
          primary: {},
          secondary: { color: v.secondaryColor.var },
        },
        weight: {
          normal: { fontWeight: t.fontWeight.normal },
          medium: { fontWeight: t.fontWeight.medium },
          semibold: { fontWeight: t.fontWeight.semibold },
        },
      },
      defaultVariants: { size: 'md', tone: 'primary', weight: 'normal' },
    };
  },
  { layer: 'components' },
);
```

`Typography.tsx`:

```tsx
import type { HTMLAttributes, JSX } from 'react';
import { createElement } from 'react';
import { heading, textBlock } from '@var-ui/core';
import { cx } from './utils';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic heading level (document outline). Defaults to 2. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of level. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'display';
};

/** Semantic heading with decoupled visual size. */
export function Heading({
  level = 2,
  size = 'md',
  className,
  ...props
}: HeadingProps): JSX.Element {
  return createElement(`h${level}`, { ...props, className: cx(heading({ size }), className) });
}

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'div';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'secondary';
  weight?: 'normal' | 'medium' | 'semibold';
};

/** Body text with size/tone/weight axes. Renders a `<p>` by default. */
export function Text({
  as = 'p',
  size = 'md',
  tone = 'primary',
  weight = 'normal',
  className,
  ...props
}: TextProps): JSX.Element {
  return createElement(as, {
    ...props,
    className: cx(textBlock({ size, tone, weight }), className),
  });
}
```

Exports: `kbd`, `heading`, `textBlock` from core; `Heading`, `Text` + prop types from react.

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add kbd, heading, and text recipes with wrappers`

---

### Task 14: Banner

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/banner.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Banner.tsx`
- Modify: indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Banner.test.tsx` + core assertion appended to `feedback.test.ts`

**Interfaces:**

- `banner({ tone: 'info'|'success'|'warning'|'danger', appearance: 'subtle'|'solid' })` — slots `root | icon | content | title | actions | dismiss`. Same tone-channel pattern as `alert.ts` (`semanticChannelAssignments` with vars named `semantic`/`solidBg`/`solidFg`) but page-level: full-width, square corners, horizontal layout.
- `BannerProps = { tone?; appearance?; title?: string; icon?: ReactNode /* default: <Icon name={toneIcon} /> */; actions?: ReactNode; onDismiss?: () => void; dismissLabel?: string; children: ReactNode; className? }`. Tone→icon map: info→`info`, success→`success`, warning→`warning`, danger→`error` (spec §0.4 tone table). Dismiss renders a RAC `Button` with `<Icon name="close" />` only when `onDismiss` is set. `role="status"` (info/success) or `role="alert"` (warning/danger).

- [ ] **Step 1: Failing tests**

Core (append to `feedback.test.ts`):

```ts
import { banner } from './banner';

describe('banner', () => {
  it('registers slots and tone variants', () => {
    banner({ tone: 'warning', appearance: 'solid' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-banner-root-tone-warning');
    expect(css).toContain('example-ds-banner-dismiss');
  });
});
```

React `Banner.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders title, content, and the default tone icon slot', () => {
    render(
      <IconProvider icons={{}}>
        <Banner tone="info" title="Heads up">
          Body copy
        </Banner>
      </IconProvider>,
    );
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Heads up')).toBeTruthy();
  });

  it('warning tone uses role alert', () => {
    render(
      <IconProvider icons={{}}>
        <Banner tone="warning">Careful</Banner>
      </IconProvider>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('calls onDismiss and hides the dismiss control otherwise', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(
      <IconProvider icons={{}}>
        <Banner onDismiss={onDismiss}>Dismissible</Banner>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    rerender(
      <IconProvider icons={{}}>
        <Banner>Not dismissible</Banner>
      </IconProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`banner.ts` (tone plumbing mirrors `alert.ts` — vars `semantic`/`solidBg`/`solidFg`, `semanticChannelAssignments`, `subtleBackgroundColor`/`subtleBorderColor`):

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticChannelAssignments,
  subtleBackgroundColor,
  subtleBorderColor,
} from './semanticTone';

/**
 * Page-level announcement bar. Same tone system as `alert`, but full-width
 * with horizontal layout, inline actions, and an optional dismiss control.
 */
export const banner = styles.component(
  'banner',
  (c) => {
    const v = c.vars({
      semantic: { value: t.color.accent.default, syntax: '<color>', inherits: true },
      solidBg: { value: t.color.accent.default, syntax: '<color>', inherits: false },
      solidFg: { value: t.color.text.onAccent, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'icon', 'content', 'title', 'actions', 'dismiss'],
      root: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[3],
        width: '100%',
        padding: `${t.space[3]} ${t.space[4]}`,
        fontSize: t.fontSize.md,
        lineHeight: 1.5,
      },
      icon: { flexShrink: 0, display: 'inline-flex', color: v.semantic.var },
      content: { flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', columnGap: t.space[2] },
      title: { fontWeight: t.fontWeight.semibold, color: v.semantic.var },
      actions: { display: 'flex', gap: t.space[2], flexShrink: 0 },
      dismiss: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        display: 'inline-flex',
        padding: t.space[1],
        borderRadius: t.radius.sm,
        '&:hover': { backgroundColor: subtleBackgroundColor(v.semantic.var) },
        '&:focus-visible': { outline: `2px solid ${t.color.border.focus}`, outlineOffset: '1px' },
      },
      variants: {
        tone: {
          info: { root: semanticChannelAssignments(v, 'accent') },
          success: { root: semanticChannelAssignments(v, 'success') },
          warning: { root: semanticChannelAssignments(v, 'warning') },
          danger: { root: semanticChannelAssignments(v, 'danger') },
        },
        appearance: {
          subtle: {
            root: {
              backgroundColor: subtleBackgroundColor(v.semantic.var),
              borderBlock: `1px solid ${subtleBorderColor(v.semantic.var)}`,
              color: t.color.text.primary,
            },
          },
          solid: {
            root: { backgroundColor: v.solidBg.var, color: v.solidFg.var },
            icon: { color: 'inherit' },
            title: { color: 'inherit' },
          },
        },
      },
      defaultVariants: { tone: 'info', appearance: 'subtle' },
    };
  },
  { layer: 'components' },
);
```

`Banner.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { banner, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

const toneIcon: Record<BannerTone, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

export type BannerProps = {
  tone?: BannerTone;
  appearance?: 'subtle' | 'solid';
  title?: string;
  /** Override the default tone glyph; pass null to hide the icon slot. */
  icon?: ReactNode;
  /** Inline action elements (links, small buttons). */
  actions?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  children: ReactNode;
  className?: string;
};

/** Full-width page announcement with tone icon, actions, and optional dismiss. */
export function Banner({
  tone = 'info',
  appearance = 'subtle',
  title,
  icon,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  children,
  className,
}: BannerProps): JSX.Element {
  const b = banner({ tone, appearance });
  const glyph = icon === undefined ? <Icon name={toneIcon[tone]} /> : icon;
  return (
    <div
      className={cx(b.root, className)}
      role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'}
    >
      {glyph !== null ? <span className={b.icon}>{glyph}</span> : null}
      <div className={b.content}>
        {title ? <span className={b.title}>{title}</span> : null}
        <span>{children}</span>
      </div>
      {actions ? <div className={b.actions}>{actions}</div> : null}
      {onDismiss ? (
        <AriaButton className={b.dismiss} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add banner`

---

### Task 15: EmptyState

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/emptyState.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/EmptyState.tsx`
- Modify: indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/EmptyState.test.tsx`

**Interfaces:**

- `emptyState()` — slots `root | icon | title | description | action`; centered column, muted icon well.
- `EmptyStateProps = { icon?: ReactNode; title: string; description?: ReactNode; action?: ReactNode; className? }` — icon slot is decorative/consumer-supplied (no registry default, per spec).

- [ ] **Step 1: Failing test** (`EmptyState.test.tsx`):

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description, and action', () => {
    render(
      <EmptyState
        title="No results"
        description="Try a different filter."
        action={<button>Clear filters</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No results' })).toBeTruthy();
    expect(screen.getByText('Try a different filter.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeTruthy();
  });

  it('omits the icon well when no icon is given', () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector('[data-empty-state-icon]')).toBeNull();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`emptyState.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Centered placeholder for empty lists/tables/search results. */
export const emptyState = styles.component(
  'empty-state',
  (c) => {
    const v = c.vars({
      iconColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      iconBackground: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'icon', 'title', 'description', 'action'],
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: t.space[2],
        padding: `${t.space[8]} ${t.space[4]}`,
      },
      icon: {
        display: 'grid',
        placeItems: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        color: v.iconColor.var,
        backgroundColor: v.iconBackground.var,
        marginBottom: t.space[1],
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.lg,
        fontWeight: t.fontWeight.semibold,
      },
      description: {
        margin: 0,
        fontSize: t.fontSize.md,
        color: t.color.text.secondary,
        maxWidth: '40ch',
      },
      action: { marginTop: t.space[2] },
    };
  },
  { layer: 'components' },
);
```

`EmptyState.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { emptyState } from '@var-ui/core';
import { cx } from './utils';

export type EmptyStateProps = {
  /** Decorative glyph or illustration; consumers pass `<Icon>` or a custom node. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Empty-list placeholder: icon well, headline, supporting copy, call to action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  const e = emptyState();
  return (
    <div className={cx(e.root, className)}>
      {icon ? (
        <div className={e.icon} data-empty-state-icon aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className={e.title}>{title}</h3>
      {description ? <p className={e.description}>{description}</p> : null}
      {action ? <div className={e.action}>{action}</div> : null}
    </div>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add empty state`

---

### Task 16: Avatar + AvatarGroup

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/avatar.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Avatar.tsx`
- Modify: indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Avatar.test.tsx`

**Interfaces:**

- `avatar({ size: 'xs'|'sm'|'md'|'lg'|'xl' })` — slots `root | image | initials | status`; sizes 20/24/32/40/56px via a `c.vars` size var; `status` is a bottom-right positioned well for a `statusDot`.
- `avatarGroup()` — slots `root | item | overflow`; negative-margin overlap, ring in surface color.
- React:

```ts
type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string /* initials derived: first letters of first 2 words */;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  className?;
};
function Avatar(props: AvatarProps): JSX.Element; // img on error/missing src → initials fallback (onError state)
type AvatarGroupProps = {
  children: ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  className?;
};
function AvatarGroup(props: AvatarGroupProps): JSX.Element; // clamps to max, renders "+N" overflow chip
```

- [ ] **Step 1: Failing test** (`Avatar.test.tsx`):

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="https://example.com/a.png" alt="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeTruthy();
  });

  it('falls back to initials derived from name', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('shows a status dot when status is set', () => {
    const { container } = render(<Avatar name="Ada" status="success" />);
    expect(container.querySelector('[data-avatar-status]')).toBeTruthy();
  });
});

describe('AvatarGroup', () => {
  it('clamps to max and renders an overflow chip', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" />
        <Avatar name="Edsger Dijkstra" />
      </AvatarGroup>,
    );
    expect(screen.getByText('AL')).toBeTruthy();
    expect(screen.getByText('GH')).toBeTruthy();
    expect(screen.queryByText('AT')).toBeNull();
    expect(screen.getByText('+2')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`avatar.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Identity avatar: image with initials fallback and an optional status well. */
export const avatar = styles.component(
  'avatar',
  (c) => {
    const v = c.vars({
      size: { value: '32px', syntax: '<length>', inherits: false },
      background: { value: `${t.color.accent.subtle}`, syntax: '<color>', inherits: false },
      foreground: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'image', 'initials', 'status'],
      root: {
        position: 'relative',
        display: 'inline-flex',
        width: v.size.var,
        height: v.size.var,
        borderRadius: '50%',
        backgroundColor: v.background.var,
        color: v.foreground.var,
        flexShrink: 0,
        verticalAlign: 'middle',
      },
      image: {
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        objectFit: 'cover',
      },
      initials: {
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        fontSize: `calc(${v.size.var} * 0.4)`,
        fontWeight: t.fontWeight.semibold,
        textTransform: 'uppercase',
        userSelect: 'none',
      },
      status: {
        position: 'absolute',
        right: '-1px',
        bottom: '-1px',
        display: 'inline-flex',
        borderRadius: '50%',
        border: `2px solid ${t.color.background.surface}`,
      },
      variants: {
        size: {
          xs: { root: { [v.size.name]: '20px' } },
          sm: { root: { [v.size.name]: '24px' } },
          md: { root: { [v.size.name]: '32px' } },
          lg: { root: { [v.size.name]: '40px' } },
          xl: { root: { [v.size.name]: '56px' } },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

/** Overlapping avatar row with a "+N" overflow chip. */
export const avatarGroup = styles.component(
  'avatar-group',
  (c) => {
    const v = c.vars({
      ringColor: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'item', 'overflow'],
      root: { display: 'inline-flex', alignItems: 'center' },
      item: {
        marginLeft: `calc(${t.space[2]} * -1)`,
        borderRadius: '50%',
        boxShadow: `0 0 0 2px ${v.ringColor.var}`,
        '&:first-child': { marginLeft: 0 },
      },
      overflow: {
        marginLeft: `calc(${t.space[2]} * -1)`,
        display: 'grid',
        placeItems: 'center',
        minWidth: '32px',
        height: '32px',
        padding: `0 ${t.space[1]}`,
        borderRadius: '50%',
        backgroundColor: t.color.background.subtle,
        boxShadow: `0 0 0 2px ${v.ringColor.var}`,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.semibold,
        color: t.color.text.secondary,
      },
    };
  },
  { layer: 'components' },
);
```

`Avatar.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { Children, useState } from 'react';
import { avatar, avatarGroup, statusDot } from '@var-ui/core';
import { cx } from './utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  src?: string;
  alt?: string;
  /** Display name — initials fallback uses the first letter of the first two words. */
  name?: string;
  size?: AvatarSize;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('');
}

/** Image avatar with initials fallback and optional presence dot. */
export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
}: AvatarProps): JSX.Element {
  const [errored, setErrored] = useState(false);
  const a = avatar({ size });
  const showImage = Boolean(src) && !errored;
  return (
    <span className={cx(a.root, className)}>
      {showImage ? (
        <img
          className={a.image}
          src={src}
          alt={alt ?? name ?? ''}
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          className={a.initials}
          aria-hidden={alt || name ? undefined : true}
          role="img"
          aria-label={alt ?? name}
        >
          {name ? initialsOf(name) : '?'}
        </span>
      )}
      {status ? (
        <span className={a.status} data-avatar-status>
          <span className={statusDot({ tone: status === 'neutral' ? 'neutral' : status })} />
        </span>
      ) : null}
    </span>
  );
}

export type AvatarGroupProps = {
  children: ReactNode;
  /** Maximum avatars before collapsing into a "+N" chip. */
  max?: number;
  className?: string;
};

/** Overlapping stack of avatars with overflow count. */
export function AvatarGroup({ children, max = 4, className }: AvatarGroupProps): JSX.Element {
  const g = avatarGroup();
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;
  return (
    <span className={cx(g.root, className)}>
      {visible.map((child, index) => (
        <span className={g.item} key={index}>
          {child}
        </span>
      ))}
      {hidden > 0 ? <span className={g.overflow}>+{hidden}</span> : null}
    </span>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add avatar and avatar group`

---

### Task 17: Badge + Card React wrappers (+ ClickableCard)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Badge.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Card.tsx`
- Modify: react indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Card.test.tsx`

**Interfaces:**

```ts
type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'tip';
};
function Badge(props: BadgeProps): JSX.Element; // <span className={badge({tone})}>
type CardProps = HTMLAttributes<HTMLDivElement> & { title?: string };
function Card(props: CardProps): JSX.Element; // card().root + optional title slot
type ClickableCardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  title: string;
  description?: string;
  hint?: string;
};
function ClickableCard(props: ClickableCardProps): JSX.Element; // <a> using linkRoot/linkTitle/linkDescription/linkHint slots
```

- [ ] **Step 1: Failing test** (`Card.test.tsx`):

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Card, ClickableCard } from './Card';

describe('Badge', () => {
  it('applies the tone class', () => {
    render(<Badge tone="success">Active</Badge>);
    expect(screen.getByText('Active').className).toContain('example-ds-badge-tone-success');
  });
});

describe('Card', () => {
  it('renders title and body content', () => {
    render(<Card title="Usage">Details</Card>);
    expect(screen.getByText('Usage').className).toContain('example-ds-card-title');
    expect(screen.getByText('Details')).toBeTruthy();
  });
});

describe('ClickableCard', () => {
  it('renders a link with title, description, and hint', () => {
    render(<ClickableCard href="/docs" title="Docs" description="Read them" hint="5 min" />);
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link.className).toContain('example-ds-card-linkRoot');
    expect(screen.getByText('Read them')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`Badge.tsx`:

```tsx
import type { HTMLAttributes, JSX } from 'react';
import { badge } from '@var-ui/core';
import { cx } from './utils';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'tip';
};

/** Small semantic label chip. */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps): JSX.Element {
  return <span {...props} className={cx(badge({ tone }), className)} />;
}
```

`Card.tsx`:

```tsx
import type { AnchorHTMLAttributes, HTMLAttributes, JSX } from 'react';
import { card } from '@var-ui/core';
import { cx } from './utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & { title?: string };

/** Static content surface with an optional title. */
export function Card({ title, className, children, ...props }: CardProps): JSX.Element {
  const c = card();
  return (
    <div {...props} className={cx(c.root, className)}>
      {title ? <h3 className={c.title}>{title}</h3> : null}
      <div className={c.body}>{children}</div>
    </div>
  );
}

export type ClickableCardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  title: string;
  description?: string;
  hint?: string;
};

/** Whole-card link surface (navigation cards, doc tiles). */
export function ClickableCard({
  title,
  description,
  hint,
  className,
  ...props
}: ClickableCardProps): JSX.Element {
  const c = card();
  return (
    <a {...props} className={cx(c.root, c.linkRoot, className)}>
      <span className={c.linkTitle}>{title}</span>
      {description ? <p className={c.linkDescription}>{description}</p> : null}
      {hint ? <span className={c.linkHint}>{hint}</span> : null}
    </a>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(react): add Badge, Card, and ClickableCard wrappers`

---

### Task 18: Carousel

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/carousel.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Carousel.tsx`
- Modify: indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Carousel.test.tsx`

**Interfaces:**

- `carousel()` — slots `root | viewport | item | controls | control`; CSS scroll-snap (`scroll-snap-type: x mandatory` on viewport, `scroll-snap-align: start` on items); controls are chevron buttons.
- `CarouselProps = { children: ReactNode; label: string /* aria-label for the region */; itemWidth?: string /* CSS length, default '280px' */; className? }` — wrapper renders children as snap items, Prev/Next buttons scroll the viewport by one item via `scrollBy({ left: ±item width })`. CSS-first: no index state, no autoplay.

- [ ] **Step 1: Failing test** (`Carousel.test.tsx`):

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('renders a labelled region with snap items and controls', () => {
    render(
      <IconProvider icons={{}}>
        <Carousel label="Featured">
          <div>one</div>
          <div>two</div>
        </Carousel>
      </IconProvider>,
    );
    expect(screen.getByRole('region', { name: 'Featured' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
  });

  it('scrolls the viewport on next', async () => {
    render(
      <IconProvider icons={{}}>
        <Carousel label="Featured">
          <div>one</div>
        </Carousel>
      </IconProvider>,
    );
    const viewport = screen
      .getByRole('region', { name: 'Featured' })
      .querySelector('[data-carousel-viewport]') as HTMLElement;
    viewport.scrollBy = vi.fn();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(viewport.scrollBy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`carousel.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Scroll-snap carousel. CSS does the snapping; the React wrapper only adds
 * prev/next buttons that nudge `scrollLeft`. Keyboard users can scroll the
 * viewport natively (it is focusable via tabindex in the wrapper).
 */
export const carousel = styles.component(
  'carousel',
  (c) => {
    const v = c.vars({
      itemWidth: { value: '280px', syntax: '<length>', inherits: false },
      controlBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      controlBorder: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'viewport', 'item', 'controls', 'control'],
      root: { display: 'grid', gap: t.space[3] },
      viewport: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: v.itemWidth.var,
        gap: t.space[3],
        overflowX: 'auto',
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: t.space[1],
        paddingBlock: t.space[1],
        '&:focus-visible': { outline: `2px solid ${t.color.border.focus}`, outlineOffset: '2px' },
      },
      item: { scrollSnapAlign: 'start', minWidth: 0 },
      controls: { display: 'flex', gap: t.space[2], justifyContent: 'flex-end' },
      control: {
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: t.radius.md,
        border: `1px solid ${v.controlBorder.var}`,
        backgroundColor: v.controlBackground.var,
        cursor: 'pointer',
        '&:hover': { backgroundColor: t.color.background.subtle },
        '&:focus-visible': { outline: `2px solid ${t.color.border.focus}`, outlineOffset: '1px' },
      },
    };
  },
  { layer: 'components' },
);
```

`Carousel.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { Children, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { carousel } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type CarouselProps = {
  children: ReactNode;
  /** Accessible name for the carousel region. */
  label: string;
  /** CSS length for each snap item (default 280px). */
  itemWidth?: string;
  className?: string;
};

/** Scroll-snap carousel with prev/next nudge buttons. */
export function Carousel({ children, label, itemWidth, className }: CarouselProps): JSX.Element {
  const s = carousel();
  const viewportRef = useRef<HTMLDivElement>(null);

  const nudge = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const item = viewport.querySelector('[data-carousel-item]');
    const step = item instanceof HTMLElement ? item.offsetWidth : viewport.clientWidth;
    viewport.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section className={cx(s.root, className)} role="region" aria-label={label}>
      <div
        ref={viewportRef}
        className={s.viewport}
        data-carousel-viewport
        tabIndex={0}
        style={itemWidth ? ({ gridAutoColumns: itemWidth } as const) : undefined}
      >
        {Children.map(children, (child) => (
          <div className={s.item} data-carousel-item>
            {child}
          </div>
        ))}
      </div>
      <div className={s.controls}>
        <AriaButton className={s.control} aria-label="Previous" onPress={() => nudge(-1)}>
          <Icon name="chevronLeft" size="sm" />
        </AriaButton>
        <AriaButton className={s.control} aria-label="Next" onPress={() => nudge(1)}>
          <Icon name="chevronRight" size="sm" />
        </AriaButton>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add scroll-snap carousel`

---

### Task 19: Thumbnail + Timestamp

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/thumbnail.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Thumbnail.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Timestamp.tsx`
- Modify: indexes
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Timestamp.test.tsx` (+ Thumbnail cases in same file)

**Interfaces:**

- `thumbnail({ size: 'sm'|'md'|'lg' })` — slots `root | image | dismiss`; 48/64/96px square, rounded, bordered; dismiss = small floating close button (top-right).
- `ThumbnailProps = { src: string; alt: string; size?; onDismiss?: () => void; dismissLabel?: string; className? }`.
- `TimestampProps = { date: Date | string | number; format?: 'relative'|'date'|'time'|'datetime' /* default 'relative' */; locale?: string; className? }` — renders `<time dateTime={iso}>`; relative uses `Intl.RelativeTimeFormat` picking the largest sensible unit; absolute formats use `Intl.DateTimeFormat`. No recipe needed beyond `textBlock` tone secondary — reuse `textBlock({ size: 'sm', tone: 'secondary' })`.

- [ ] **Step 1: Failing tests** (`Timestamp.test.tsx`):

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Thumbnail } from './Thumbnail';
import { Timestamp } from './Timestamp';

describe('Timestamp', () => {
  it('renders a time element with ISO datetime and relative text', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
    render(<Timestamp date={fiveMinAgo} locale="en" />);
    const time = document.querySelector('time') as HTMLTimeElement;
    expect(time.dateTime).toBe(fiveMinAgo.toISOString());
    expect(time.textContent).toContain('minute');
  });

  it('formats absolute dates', () => {
    render(<Timestamp date="2026-01-15T12:00:00Z" format="date" locale="en-US" />);
    const time = document.querySelector('time') as HTMLTimeElement;
    expect(time.textContent).toMatch(/Jan|January/);
  });
});

describe('Thumbnail', () => {
  it('renders the image and fires onDismiss', async () => {
    const onDismiss = vi.fn();
    render(
      <IconProvider icons={{}}>
        <Thumbnail src="https://example.com/x.png" alt="Attachment" onDismiss={onDismiss} />
      </IconProvider>,
    );
    expect(screen.getByRole('img', { name: 'Attachment' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

`thumbnail.ts`:

```ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Square media preview with an optional floating remove control. */
export const thumbnail = styles.component(
  'thumbnail',
  (c) => {
    const v = c.vars({
      size: { value: '64px', syntax: '<length>', inherits: false },
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'image', 'dismiss'],
      root: {
        position: 'relative',
        display: 'inline-block',
        width: v.size.var,
        height: v.size.var,
        borderRadius: t.radius.md,
        border: `1px solid ${v.border.var}`,
        overflow: 'visible',
      },
      image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'inherit',
      },
      dismiss: {
        position: 'absolute',
        top: `calc(${t.space[2]} * -1)`,
        right: `calc(${t.space[2]} * -1)`,
        display: 'grid',
        placeItems: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `1px solid ${v.border.var}`,
        backgroundColor: t.color.background.surface,
        cursor: 'pointer',
        padding: 0,
        '&:hover': { backgroundColor: t.color.background.subtle },
        '&:focus-visible': { outline: `2px solid ${t.color.border.focus}`, outlineOffset: '1px' },
      },
      variants: {
        size: {
          sm: { root: { [v.size.name]: '48px' } },
          md: { root: { [v.size.name]: '64px' } },
          lg: { root: { [v.size.name]: '96px' } },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
```

`Thumbnail.tsx`:

```tsx
import type { JSX } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { thumbnail } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type ThumbnailProps = {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

/** Attachment/media preview tile with an optional remove button. */
export function Thumbnail({
  src,
  alt,
  size = 'md',
  onDismiss,
  dismissLabel = 'Remove',
  className,
}: ThumbnailProps): JSX.Element {
  const s = thumbnail({ size });
  return (
    <span className={cx(s.root, className)}>
      <img className={s.image} src={src} alt={alt} />
      {onDismiss ? (
        <AriaButton className={s.dismiss} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </span>
  );
}
```

`Timestamp.tsx`:

```tsx
import type { JSX } from 'react';
import { textBlock } from '@var-ui/core';
import { cx } from './utils';

export type TimestampProps = {
  date: Date | string | number;
  /** relative ("5 minutes ago"), date, time, or datetime. */
  format?: 'relative' | 'date' | 'time' | 'datetime';
  locale?: string;
  className?: string;
};

const DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
];

function formatRelative(target: Date, locale?: string): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let duration = (target.getTime() - Date.now()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), 'years');
}

function formatAbsolute(
  target: Date,
  format: 'date' | 'time' | 'datetime',
  locale?: string,
): string {
  const options: Intl.DateTimeFormatOptions =
    format === 'date'
      ? { dateStyle: 'medium' }
      : format === 'time'
        ? { timeStyle: 'short' }
        : { dateStyle: 'medium', timeStyle: 'short' };
  return new Intl.DateTimeFormat(locale, options).format(target);
}

/** Locale-aware `<time>` element; relative by default. */
export function Timestamp({
  date,
  format = 'relative',
  locale,
  className,
}: TimestampProps): JSX.Element {
  const target = date instanceof Date ? date : new Date(date);
  const text =
    format === 'relative' ? formatRelative(target, locale) : formatAbsolute(target, format, locale);
  return (
    <time
      dateTime={target.toISOString()}
      title={formatAbsolute(target, 'datetime', locale)}
      className={cx(textBlock({ size: 'sm', tone: 'secondary' }), className)}
    >
      {text}
    </time>
  );
}
```

- [ ] **Step 4: `vp test run`** → PASS. **Step 5: Commit** — `feat(core,react): add thumbnail and timestamp`

---

### Task 20: Wire icons into existing components (spec §0.4 wire-up table)

**Files:**

- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Select.tsx` (chevron in trigger)
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/select.ts` (add `triggerIcon` slot: `marginLeft: 'auto'`, secondary color; make trigger `display:flex; alignItems:center; gap`)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Dialog.tsx` + `/Users/danielbanks/dev/var-ui/packages/core/src/components/dialog.ts` (icon dismiss button top-right: new `closeButton` + `header` slots; keep existing slots untouched)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/Alert.tsx` (default tone icon via registry when `icon` prop is absent; tone map info→info, success→success, warning→warning, danger→error, tip→info; `icon={null}` hides)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/CodeBlock.tsx` (copy button: `copy` glyph idle, `check` when copied — read the file first; keep text labels as accessible names)
- Test: extend `/Users/danielbanks/dev/var-ui/packages/react/src/components/IconWireup.test.tsx` (new file)

**Interfaces:**

- Consumes: `Icon`, `IconProvider` (Task 4), `IconName` glyph names `chevronDown`, `close`, `info`, `success`, `warning`, `error`, `copy`, `check`.
- Produces: no new APIs — `AlertProps.icon` gains `| null` (null = hide). Class additions only (new slots), no renames.

- [ ] **Step 1: Write the failing test** (`IconWireup.test.tsx`):

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Alert } from './Alert';

const glyph = <svg data-testid="tone-glyph" viewBox="0 0 24 24" />;

describe('icon wire-up', () => {
  it('Alert renders the registry glyph for its tone by default', () => {
    render(
      <IconProvider icons={{ success: glyph }}>
        <Alert variant="success">Saved</Alert>
      </IconProvider>,
    );
    expect(screen.getByTestId('tone-glyph')).toBeTruthy();
  });

  it('Alert icon={null} suppresses the default glyph', () => {
    const { container } = render(
      <IconProvider icons={{ success: glyph }}>
        <Alert variant="success" icon={null}>
          Saved
        </Alert>
      </IconProvider>,
    );
    expect(container.querySelector('[data-alert-icon]')).toBeNull();
  });
});
```

- [ ] **Step 2: Verify failure**, then **Step 3: Implement**

Alert change (core of the task — others follow the same pattern):

```tsx
// Alert.tsx — icon resolution
const toneIconName: Record<AlertVariant, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  tip: 'info',
};
// in the component body:
const resolvedIcon = icon === undefined ? <Icon name={toneIconName[variant]} /> : icon;
// render `resolvedIcon` (skip the wrapper div when it is null)
```

`AlertProps.icon` becomes `icon?: ReactNode | null`. Select trigger gains `<Icon name="chevronDown" size="sm" />` inside a new `triggerIcon` span slot. Dialog gains a `header` flex row slot containing the Heading and an icon close button (`closeButton` slot) with `aria-label="Close"`; keep the existing footer close Button for now (both work). CodeBlock: read `packages/react/src/components/CodeBlock.tsx` first; put `<Icon name="copy" size="sm" />` / `<Icon name="check" size="sm" />` before the existing "Copy"/"Copied" text inside the button.

**Read each file before editing** — these are behavior-preserving additions; do not rename any class or change any existing prop's meaning.

- [ ] **Step 4: `vp test run && vp check --fix`** → PASS (classname lint must show additions only).

- [ ] **Step 5: Commit** — `feat(react): wire registry icons into Alert, Select, Dialog, and CodeBlock`

---

### Task 21: Example app showcase, docs, classname snapshot, roadmap

**Files:**

- Modify: `/Users/danielbanks/dev/var-ui/examples/vite-app/src/App.tsx` (restructure into demo sections)
- Modify: `/Users/danielbanks/dev/var-ui/examples/vite-app/package.json` (add `@var-ui/icons` dep)
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/README.md` (icon setup — all three paths from spec §0.4; new component list)
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/README.md` (recipe inventory table)
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/.typestyles-public-classnames.json` (add all new class names)
- Modify: `/Users/danielbanks/dev/var-ui/ROADMAP.md` (V6: check off Phase 0 + Phase 1 with a short progress note)

**Interfaces:** consumes everything from Tasks 2–20.

- [ ] **Step 1: Rebuild packages so the example app sees new exports**

Run: `vp run packages/core#build packages/react#build packages/icons#build`
Expected: three dist builds succeed.

- [ ] **Step 2: Restructure the example app**

`App.tsx` becomes a sectioned showcase (use the new `Section`, `Stack`, `Grid` components as the page skeleton — dogfooding). Wrap the tree:

```tsx
import { defaultIcons } from '@var-ui/icons';
import {
  Alert,
  AspectRatio,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Button,
  Card,
  Carousel,
  Center,
  ClickableCard,
  DesignSystemProvider,
  Dialog,
  Divider,
  EmptyState,
  Field,
  Grid,
  Heading,
  HStack,
  Icon,
  IconProvider,
  LayerProvider,
  ProgressBar,
  Section,
  Select,
  Spinner,
  Stack,
  Text,
  Thumbnail,
  Timestamp,
} from '@var-ui/react';
import { kbd, skeleton, statusDot } from '@var-ui/core';

export function App() {
  return (
    <DesignSystemProvider defaultTheme="light">
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <Stack gap="xl" style={{ padding: '2rem', maxWidth: '56rem', margin: '0 auto' }}>
            <Heading level={1} size="display">
              var-ui
            </Heading>
            <Section title="Feedback">
              {' '}
              {/* Spinner, ProgressBar (determinate + indeterminate), Banner tones, statusDot, skeleton */}{' '}
            </Section>
            <Section title="Content">
              {' '}
              {/* Heading sizes, Text tones, kbd, Timestamp, EmptyState */}{' '}
            </Section>
            <Section title="Containers">
              {' '}
              {/* Card, ClickableCard grid, Carousel, Thumbnail, Avatar/AvatarGroup, Badge */}{' '}
            </Section>
            <Section title="Forms">
              {' '}
              {/* existing TextField/Select (now with chevron) + Field-wrapped custom input */}{' '}
            </Section>
            <Section title="Overlay"> {/* existing Dialog with icon close */} </Section>
          </Stack>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
```

Fill each comment with 3–8 real component instances demonstrating variants (write them out — e.g. `<Banner tone="warning" title="Scheduled maintenance" onDismiss={() => {}}>Sunday 02:00 UTC</Banner>`). Add `"@var-ui/icons": "workspace:*"` to the example app deps; `vp install`.

- [ ] **Step 3: Verify the app renders**

Run: `vp run examples/vite-app#build` (or `vp dev` + manual spot-check if quick).
Expected: build succeeds with no type errors; if a dev server is easy to drive, load the page and confirm no console errors.

- [ ] **Step 4: Update the classname snapshot**

Check `@typestyles/cli` for the snapshot command (`pnpm exec typestyles --help` in `packages/core`). If a generate command exists, run it; otherwise append the new class names manually (they follow `example-ds-<component>-<slot|base>[-<variant>-<value>]` — enumerate from each new recipe). Then `vp check` must pass the `typestyles/no-removed-public-classname` rule.

- [ ] **Step 5: Docs + roadmap**

- `packages/react/README.md`: add "Icons" section with the three setup paths (required empty provider, `@var-ui/icons` defaults, third-party lucide example — copy code from spec §0.4) and a component inventory table.
- `packages/core/README.md`: add the new recipes to whatever inventory/structure it has (read first).
- `ROADMAP.md` V6 section: add `Phase 0 — shipped` / `Phase 1 — shipped` checklist lines with a one-line summary each.

- [ ] **Step 6: Full validation + commit**

```bash
vp check --fix && vp test run && vp run packages/core#build packages/react#build packages/icons#build
git add -A
git commit -m "docs(examples): showcase phase 0-1 components; update snapshot and roadmap"
```

---

## Follow-up plans (not in this document)

- **Phase 2** (actions/menus/form expansion), **Phase 3** (overlays/toast/command palette), **Phase 4** (tables/lists), **Phase 5** (navigation), **Phase 6** (layout polish), **Phase 7** (chat) — each gets its own plan once this one lands, per `specs/component-breadth.md` ordering.

## Self-review notes

- **Spec coverage (Phase 0):** 0.1 field ✔ (Task 5), 0.2 layer system ✔ (Task 8 — Select popover wiring deferred to Phase 3 when popovers are reworked; Dialog wired now), 0.3 layout primitives ✔ (Tasks 6–7; FormLayout deferred to Phase 6 layout batch per its Astryx grouping), 0.4 icons ✔ (Tasks 2–4, 20), 0.5 hooks ✔ (Task 8, first wave; useFocusTrap deferred — RAC owns focus for all shipped overlays).
- **Spec coverage (Phase 1):** Spinner/Skeleton/ProgressBar ✔ (9–11), Banner ✔ (14), StatusDot ✔ (12), EmptyState ✔ (15), Kbd/Heading/Text ✔ (13), Avatar+Group ✔ (16), Badge/Card wrappers ✔ (17), Carousel ✔ (18), Thumbnail/Timestamp ✔ (19).
- **Type consistency check:** `IconName` union (Task 2) matches `bundle1Icons` keys (Task 3) and all `<Icon name>` usages (4, 14, 18, 19, 20). Stack/Grid gap scales match between recipe and wrapper. `fieldChrome` colors shape matches all three call sites.
- **Known execution risks** (verify in-step, not blockers): `keyframes.create` interpolation form; `c.vars` `syntax: '*'`; numeric variant keys on grid; vp test project config key. Each task notes its fallback.
