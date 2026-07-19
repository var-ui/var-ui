# `@var-ui/astro` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `@var-ui/astro` (source-shipped Astro components over `@var-ui/core`) plus `examples/astro-app`, covering the v0.1 docs/content kit with React prop-name parity and no React runtime.

**Architecture:** Peer on `astro` + `@var-ui/core`. Components are `.astro` files that call core recipes via shared `recipeProps`. Theme FOUC prevention and color mode / tabs / code-copy use small vanilla TS scripts. Package ships source (no `vp pack`). Example app uses `@typestyles/vite` extract like `docs/`.

**Tech Stack:** Astro 5, TypeScript, `@var-ui/core`, typestyles / `@typestyles/vite`, vite-plus (`vp`), Vitest for pure TS helpers.

**Spec:** `docs/superpowers/specs/2026-07-18-var-ui-astro-design.md`

## Global Constraints

- No React, `react-dom`, `react-aria-components`, or `@var-ui/react` anywhere in `packages/astro` or `examples/astro-app`.
- Prop / variant names match `@var-ui/react` counterparts; default slot ≈ `children`; named slots for structured regions (`icon`, etc.).
- Interactivity ladder: zero JS → native HTML → small vanilla TS. No Zag.js in v0.1.
- Source-shipped package — do **not** add `vp pack` for `@var-ui/astro`.
- Icons: optional `icon` slot or omit; do **not** depend on `@var-ui/icons` (React glyphs).
- Recipe attrs: always use `recipeProps()` so TypeStyles `attrs` (data-variant) spread correctly.
- Validation per task: `vp check` (touched files), `vp test` for `packages/astro` when tests exist; after example exists, `vp run @var-ui/example-astro-app#check` and `#build`.
- Commits: conventional (`feat(astro):`, `chore:`, `docs:`). Commit when the task says to.
- Do **not** edit `node_modules` or published `dist/` of other packages.

### File map

| Area       | Path                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| Package    | `packages/astro/package.json`, `index.ts`, `README.md`, `vite.config.ts`, `tsconfig.json`                                 |
| Utils      | `packages/astro/src/utils.ts`, `utils.test.ts`                                                                            |
| Theme      | `packages/astro/src/theme/ThemeScript.astro`, `ColorModeToggle.astro`, `packages/astro/src/scripts/colorMode.ts` (+ test) |
| Components | `packages/astro/src/components/*.astro`                                                                                   |
| Scripts    | `packages/astro/src/scripts/{tabs,codeBlockCopy}.ts` (+ tests)                                                            |
| Example    | `examples/astro-app/**`                                                                                                   |
| Monorepo   | Root `README.md`, `package.json`, `vite.config.ts`, `.changeset/config.json`, CI, `ROADMAP.md`                            |

### PR grouping (optional)

1. Tasks 1–2 — scaffold + theme
2. Tasks 3–5 — layout + content + actions
3. Tasks 6–7 — interactive content (CodeBlock, Tabs, Collapsible, Breadcrumbs)
4. Tasks 8–9 — example app + monorepo wiring

### Astro adaptations (locked)

| React API                         | Astro adaptation                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode`             | default `<slot />`                                                                                            |
| `icon?: ReactNode \| null`        | named `icon` slot; omit slot = no icon (no auto glyph)                                                        |
| `Alert` / `Banner` title          | `title` prop (string) as in React                                                                             |
| `EmptyState` description/action   | `description` prop + `action` slot                                                                            |
| `Tabs.tabs[].content`             | `tabs: { id; label }[]` + named slots matching `id`                                                           |
| `Breadcrumbs` item `label`        | `string` (not ReactNode)                                                                                      |
| `ColorModeToggle` + React context | self-contained: reads/writes `localStorage` + DOM                                                             |
| `Collapsible` controlled API      | `defaultExpanded` → `open` on `<details>`; skip controlled `isExpanded`/`onExpandedChange` in v0.1 (document) |
| `Banner.onDismiss`                | dismiss button + `scripts` optional; or `dismissible` boolean that hides via small script                     |

---

### Task 1: Scaffold `@var-ui/astro` + `recipeProps`

**Files:**

- Create: `packages/astro/package.json`
- Create: `packages/astro/tsconfig.json`
- Create: `packages/astro/vite.config.ts`
- Create: `packages/astro/index.ts`
- Create: `packages/astro/src/utils.ts`
- Create: `packages/astro/src/utils.test.ts`
- Create: `packages/astro/README.md` (stub)
- Modify: root `vite.config.ts` — add `'packages/astro'` to `test.projects`
- Modify: `pnpm-workspace.yaml` — add `astro` to `catalog` (e.g. `astro: ^5.14.0`)

**Interfaces:**

- Consumes: `typestyles` (`cx`, `ComponentAttrsResult`), `@var-ui/core` (peer)
- Produces: `recipeClassName`, `recipeProps`, package name `@var-ui/astro`

- [ ] **Step 1: Write failing utils test**

```ts
// packages/astro/src/utils.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { recipeClassName, recipeProps } from './utils';

describe('recipeProps', () => {
  it('merges a string recipe with className', () => {
    expect(recipeProps('btn', 'extra')).toEqual({ className: expect.stringContaining('btn') });
  });

  it('spreads attrs from a ComponentAttrsResult-like object', () => {
    const result = recipeProps({ className: 'root', attrs: { 'data-intent': 'primary' } }, 'x');
    expect(result.className).toMatch(/root/);
    expect(result['data-intent']).toBe('primary');
  });
});

describe('recipeClassName', () => {
  it('returns class string from attrs result', () => {
    expect(recipeClassName({ className: 'a', attrs: {} }, 'b')).toMatch(/a/);
  });
});
```

- [ ] **Step 2: Run test — expect fail (module missing)**

Run: `vp test run packages/astro/src/utils.test.ts`  
Expected: FAIL (cannot resolve `./utils` or project missing)

- [ ] **Step 3: Create package.json**

```json
{
  "name": "@var-ui/astro",
  "version": "0.0.1",
  "description": "Astro components for the var-ui design system",
  "homepage": "https://github.com/var-ui/var-ui/tree/main/packages/astro#readme",
  "bugs": "https://github.com/var-ui/var-ui/issues",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/var-ui/var-ui.git",
    "directory": "packages/astro"
  },
  "type": "module",
  "files": ["index.ts", "src", "README.md"],
  "exports": {
    ".": "./index.ts"
  },
  "publishConfig": { "access": "public" },
  "keywords": ["astro-component", "withastro", "design-system", "var-ui"],
  "scripts": {
    "test": "vp test run"
  },
  "peerDependencies": {
    "@var-ui/core": "workspace:^",
    "astro": "catalog:"
  },
  "devDependencies": {
    "@var-ui/core": "workspace:*",
    "astro": "catalog:",
    "typestyles": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

- [ ] **Step 4: Implement utils (mirror react, no React types)**

```ts
// packages/astro/src/utils.ts
import type { ComponentAttrsResult } from 'typestyles';
import { cx } from 'typestyles';

export { cx };

export type RecipeClass = string | ComponentAttrsResult;

export function recipeClassName(result: RecipeClass, className?: string | false | null): string {
  if (typeof result === 'string') {
    return cx(result, className);
  }
  return cx(result.className, className);
}

export function recipeProps(
  result: RecipeClass,
  className?: string | false | null,
): { className: string } & Record<string, string> {
  if (typeof result === 'string') {
    return { className: cx(result, className) };
  }
  return {
    ...result.attrs,
    className: cx(result.className, className),
  };
}
```

- [ ] **Step 5: Add vite.config.ts + tsconfig + empty index + README stub**

```ts
// packages/astro/vite.config.ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

```json
// packages/astro/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["index.ts", "src/**/*.ts", "src/**/*.astro"]
}
```

```ts
// packages/astro/index.ts
export { cx, recipeClassName, recipeProps, type RecipeClass } from './src/utils';
```

- [ ] **Step 6: Wire test project + catalog; install**

Modify root `vite.config.ts` `test.projects` to include `'packages/astro'`.  
Add `astro: ^5.14.0` (or current stable) to `pnpm-workspace.yaml` `catalog`.  
Run: `vp install`

- [ ] **Step 7: Run tests — expect pass**

Run: `vp test run packages/astro/src/utils.test.ts`  
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add packages/astro pnpm-workspace.yaml pnpm-lock.yaml vite.config.ts
git commit -m "$(cat <<'EOF'
feat(astro): scaffold @var-ui/astro package with recipeProps

EOF
)"
```

---

### Task 2: `ThemeScript` + color mode script + `ColorModeToggle`

**Files:**

- Create: `packages/astro/src/scripts/colorMode.ts`
- Create: `packages/astro/src/scripts/colorMode.test.ts`
- Create: `packages/astro/src/theme/ThemeScript.astro`
- Create: `packages/astro/src/theme/ColorModeToggle.astro`
- Modify: `packages/astro/index.ts` — export theme components
- Modify: `packages/astro/README.md` — ThemeScript usage

**Interfaces:**

- Consumes: storage key + theme class string
- Produces:
  - `applyThemeBoot({ themeClass, storageKey? })` logic used by ThemeScript
  - `ColorMode = 'light' | 'dark' | 'system'`
  - `setColorMode(mode)`, `readStoredColorMode()`, `resolveColorMode(mode)`
  - `ThemeScript` props: `{ themeClass: string; storageKey?: string }` (default `'theme-mode'`)
  - `ColorModeToggle` props matching React names: `includeSystem?`, `appearance?` (`'icons' | 'labels' | 'iconsAndLabels'`), `size?`, `className?`, `aria-label?` — self-contained (no controlled props required in v0.1; optional `storageKey`)

- [ ] **Step 1: Write failing colorMode tests**

```ts
// packages/astro/src/scripts/colorMode.test.ts
import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { readStoredColorMode, resolveColorMode, applyColorModeToDocument } from './colorMode';

describe('colorMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
  });

  it('reads valid stored modes only', () => {
    localStorage.setItem('theme-mode', 'dark');
    expect(readStoredColorMode('theme-mode')).toBe('dark');
    localStorage.setItem('theme-mode', 'nope');
    expect(readStoredColorMode('theme-mode')).toBeNull();
  });

  it('resolveColorMode maps system via matchMedia stub', () => {
    expect(resolveColorMode('light')).toBe('light');
    expect(resolveColorMode('dark')).toBe('dark');
  });

  it('applyColorModeToDocument sets or clears data-mode', () => {
    applyColorModeToDocument('dark');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    applyColorModeToDocument('system');
    expect(document.documentElement.hasAttribute('data-mode')).toBe(false);
  });
});
```

Note: set `test.environment` to `'happy-dom'` or `'jsdom'` in `packages/astro/vite.config.ts` for these tests (add `jsdom` or `happy-dom` devDep if needed — prefer `jsdom` to match react package).

- [ ] **Step 2: Run test — expect fail**

Run: `vp test run packages/astro/src/scripts/colorMode.test.ts`  
Expected: FAIL

- [ ] **Step 3: Implement `colorMode.ts`**

```ts
// packages/astro/src/scripts/colorMode.ts
export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

const VALID: ReadonlySet<string> = new Set(['light', 'dark', 'system']);

export function readStoredColorMode(storageKey: string): ColorMode | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(storageKey);
  return raw && VALID.has(raw) ? (raw as ColorMode) : null;
}

export function resolveColorMode(mode: ColorMode): ResolvedColorMode {
  if (mode === 'light' || mode === 'dark') return mode;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function applyColorModeToDocument(mode: ColorMode): void {
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-mode');
  } else {
    document.documentElement.setAttribute('data-mode', mode);
  }
}

export function persistColorMode(storageKey: string, mode: ColorMode): void {
  localStorage.setItem(storageKey, mode);
}

/** Boot path used by ThemeScript (class + data-mode). */
export function bootTheme(themeClass: string, storageKey = 'theme-mode'): ColorMode {
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = readStoredColorMode(storageKey);
  const mode: ColorMode = stored ?? (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.add(themeClass);
  applyColorModeToDocument(mode === 'system' ? 'system' : mode);
  // When stored is null and we inferred light/dark from prefers, still set data-mode
  // to match core README snippet behavior (stored system clears attr).
  if (stored === 'system') {
    applyColorModeToDocument('system');
  } else if (stored === 'light' || stored === 'dark') {
    applyColorModeToDocument(stored);
  } else {
    applyColorModeToDocument(prefersDark ? 'dark' : 'light');
  }
  return mode;
}
```

Align `bootTheme` exactly with the core README Astro snippet (prefer copying that control flow verbatim into ThemeScript `define:vars` and keeping helpers for the toggle).

- [ ] **Step 4: Implement ThemeScript.astro**

```astro
---
// packages/astro/src/theme/ThemeScript.astro
type Props = {
  themeClass: string;
  storageKey?: string;
};
const { themeClass, storageKey = 'theme-mode' } = Astro.props;
---
<script is:inline define:vars={{ themeClass, storageKey }}>
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = localStorage.getItem(storageKey);
  const mode =
    stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : prefersDark
        ? 'dark'
        : 'light';
  document.documentElement.classList.add(themeClass);
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-mode');
  } else {
    document.documentElement.setAttribute('data-mode', mode);
  }
</script>
```

- [ ] **Step 5: Implement ColorModeToggle.astro**

Use a `<div role="group">` of `<button type="button" data-color-mode="light|dark|system">` buttons. Labels/icons via `appearance` prop (text labels always work without icon package; for `icons` appearance use simple inline SVG sun/moon/monitor paths — not `@var-ui/icons`).

Load script:

```astro
<script>
  import { initColorModeToggle } from '../scripts/colorMode';
  initColorModeToggle();
</script>
```

Implement `initColorModeToggle()` to query `[data-var-ui-color-mode-toggle]`, wire clicks to `persistColorMode` + `applyColorModeToDocument`, and sync `aria-pressed`.

Match React prop names: `includeSystem`, `appearance`, `size`, `className`, `aria-label`. Style buttons with `segmentedControl` or `button` recipes from core if a segmented recipe exists — check `packages/react/src/components/ColorModeToggle.tsx` / `SegmentedControl`; prefer reusing `segmentedControl` recipe classes for visual parity.

- [ ] **Step 6: Export from index.ts**

```ts
export { default as ThemeScript } from './src/theme/ThemeScript.astro';
export { default as ColorModeToggle } from './src/theme/ColorModeToggle.astro';
export type { ColorMode, ResolvedColorMode } from './src/scripts/colorMode';
```

Astro default exports from `.astro` via the barrel are supported when consumers use Astro; if TypeScript complains about exporting `.astro` from `.ts`, use explicit subpath exports in `package.json` instead:

```json
"exports": {
  ".": "./index.ts",
  "./ThemeScript": "./src/theme/ThemeScript.astro",
  "./ColorModeToggle": "./src/theme/ColorModeToggle.astro"
}
```

and document both import styles. Prefer a working `index.ts` re-export if Astro + TS allow it in the example app.

- [ ] **Step 7: Run tests + commit**

Run: `vp test run packages/astro`  
Expected: PASS

```bash
git add packages/astro
git commit -m "$(cat <<'EOF'
feat(astro): add ThemeScript and ColorModeToggle

EOF
)"
```

---

### Task 3: Layout primitives

**Files:**

- Create: `packages/astro/src/components/{Stack,HStack,VStack,Grid,Center,Section,Divider,AspectRatio}.astro`
- Modify: `packages/astro/index.ts`

**Interfaces (mirror React):**

- `Stack`: `direction?`, `gap?`, `align?`, `justify?`, `wrap?`, `className?` + default slot
- `HStack` / `VStack`: omit `direction` (HStack default `align: 'center'`)
- `Grid`: `columns?`, `gap?`, `className?`
- `Center`: `inline?`, `className?`
- `Section`: `title?`, `className?`
- `Divider`: `orientation?`, `className?`
- `AspectRatio`: `ratio?` (number → `style={`aspect-ratio: ${ratio}`}`)

Recipes: `stack`, `grid`, `center`, `section`, `divider`, `aspectRatio` from `@var-ui/core`.

- [ ] **Step 1: Implement Stack.astro (canonical pattern)**

```astro
---
import { stack } from '@var-ui/core';
import { recipeProps } from '../utils';

type Props = {
  direction?: 'column' | 'row';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  className?: string;
};

const {
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
} = Astro.props;
const rp = recipeProps(stack({ direction, gap, align, justify, wrap }), className);
---
<div {...rp}><slot /></div>
```

- [ ] **Step 2: Implement HStack, VStack, Grid, Center, Section, Divider, AspectRatio**

Same pattern — copy prop defaults from:

- `packages/react/src/components/Stack.tsx`
- `Grid.tsx`, `Center.tsx`, `Section.tsx`, `Divider.tsx`, `AspectRatio.tsx`

For `Section` with `title`, render heading inside using section recipe slots (match React markup).

- [ ] **Step 3: Export all from index.ts**

- [ ] **Step 4: `vp check` on package; commit**

```bash
git add packages/astro
git commit -m "$(cat <<'EOF'
feat(astro): add layout primitives

EOF
)"
```

---

### Task 4: Content / feedback atoms

**Files:**

- Create: `packages/astro/src/components/{Badge,Kbd,Heading,Text,Avatar,Spinner,Skeleton,ProgressBar,StatusDot,Card,EmptyState}.astro`
- Modify: `packages/astro/index.ts`

**Prop mirrors** (from React — copy defaults exactly):

| Component   | Key props                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Badge       | `tone?`                                                                                                                                            |
| Kbd         | default slot                                                                                                                                       |
| Heading     | `level?` 1–6, `size?` — render `<h{level}>`                                                                                                        |
| Text        | `as?` `p\|span\|div`, `size?`, `tone?`, `weight?`                                                                                                  |
| Avatar      | `src?`, `alt?`, `name?`, `size?`, `status?`                                                                                                        |
| Spinner     | `size?`, `tone?`, `label?`                                                                                                                         |
| Skeleton    | `shape?`, `className?`, style attrs                                                                                                                |
| ProgressBar | `value?`, `isIndeterminate?` → native/`role="progressbar"`, `tone?`, `label?`, `showValueText?` — match React DOM structure from `ProgressBar.tsx` |
| StatusDot   | `tone?`, `pulse?`, `aria-label?`                                                                                                                   |
| Card        | `title?` + default slot; also `ClickableCard.astro` with `title`, `description?`, `hint?`, `href`                                                  |
| EmptyState  | `title`, `description?`, slots: `icon`, `action`                                                                                                   |

- [ ] **Step 1: Implement Badge + Heading + Text + Kbd**

Follow Stack pattern with recipes `badge`, typography recipes from React `Typography.tsx`, `kbd`.

- [ ] **Step 2: Implement Avatar, Spinner, Skeleton, ProgressBar, StatusDot**

Read each React file for DOM structure and recipe slots; port without React.

- [ ] **Step 3: Implement Card, ClickableCard, EmptyState**

EmptyState:

```astro
---
import { emptyState } from '@var-ui/core';
import { recipeProps } from '../utils';
type Props = { title: string; description?: string; className?: string };
const { title, description, className } = Astro.props;
const e = emptyState();
---
<div {...recipeProps(e.root, className)}>
  <div {...recipeProps(e.icon)}><slot name="icon" /></div>
  <p {...recipeProps(e.title)}>{title}</p>
  {description ? <p {...recipeProps(e.description)}>{description}</p> : null}
  <div {...recipeProps(e.action)}><slot name="action" /></div>
</div>
```

Adjust slot/recipe names to match actual `emptyState` recipe in core.

- [ ] **Step 4: Export + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(astro): add content and feedback components

EOF
)"
```

---

### Task 5: `Button`, `Link`, `Alert`, `Banner`

**Files:**

- Create: `packages/astro/src/components/{Button,Link,Alert,Banner}.astro`
- Modify: `packages/astro/index.ts`

**Interfaces:**

- `Button`: `intent?`, `size?`, `className?`, `type?` (`button`/`submit`/`reset`), `disabled?` — native `<button>` only (links → `Link`)
- `Link`: `href` (required), `className?`, plus passthrough anchor attrs safe for Astro (`target`, `rel`, …)
- `Alert`: `variant`, `appearance?`, `title?`, `action?: { href; label }`, `className?`; slots: default (body), `icon` (omit = no icon)
- `Banner`: `tone?`, `appearance?`, `title?`, `dismissible?` (v0.1 stand-in for `onDismiss`), `dismissLabel?`, `className?`; slots: default, `icon`, `actions`

- [ ] **Step 1: Button.astro**

```astro
---
import { button } from '@var-ui/core';
import { recipeProps } from '../utils';

type Props = {
  intent?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};
const { intent = 'secondary', size = 'md', className, type = 'button', disabled } = Astro.props;
const rp = recipeProps(button({ intent, size }), className);
---
<button type={type} disabled={disabled} {...rp}><slot /></button>
```

- [ ] **Step 2: Link.astro** — `link` recipe on `<a href={href}>`

- [ ] **Step 3: Alert.astro** — port markup from `packages/react/src/components/Alert.tsx` (data-alert attrs + slots). No default Icon glyph.

- [ ] **Step 4: Banner.astro** — port from `Banner.tsx`. If `dismissible`, render dismiss `<button>` and:

```astro
<script>
  import { initDismissibleBanner } from '../scripts/bannerDismiss';
  initDismissibleBanner();
</script>
```

```ts
// packages/astro/src/scripts/bannerDismiss.ts
export function initDismissibleBanner(): void {
  document.querySelectorAll('[data-var-ui-banner-dismiss]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const root = btn.closest('[data-banner]');
      root?.remove();
    });
  });
}
```

(Use the same `data-*` hooks React uses if present.)

- [ ] **Step 5: Export, check, commit**

```bash
git commit -m "$(cat <<'EOF'
feat(astro): add Button, Link, Alert, and Banner

EOF
)"
```

---

### Task 6: `CodeBlock`, `Steps`, `Breadcrumbs`, `Collapsible`

**Files:**

- Create: `packages/astro/src/components/{CodeBlock,Steps,Breadcrumbs,Collapsible}.astro`
- Create: `packages/astro/src/scripts/codeBlockCopy.ts` (+ test)
- Modify: `packages/astro/index.ts`

**Interfaces:**

- `CodeBlock`: same props as React (`code`, `language?`, `filename?`, `copyable?`, `variant?`, `wrapLongLines?`, `showLineNumbers?`, `highlightedLines?`, labels…). Port structure from `CodeBlock.tsx`; copy via `codeBlockCopy.ts`.
- `Steps`: default slot (expect `<li>` children), `className?`
- `Breadcrumbs`: `items: { id: string; label: string; href?: string }[]`, `maxItems?`, `itemsBeforeCollapse?`, `itemsAfterCollapse?`, `separator?`, `label?`, `className?` — collapse UI can be zero-JS (render ellipsis as non-interactive) or small script; match React visual when collapsed
- `Collapsible`: `title?`, `defaultExpanded?`, `variant?`, `className?`, `id?`; default slot = panel; use `<details>`/`<summary>`. **Omit** controlled `isExpanded` / `onExpandedChange` / `CollapsibleGroup` in v0.1 (note in README).

- [ ] **Step 1: Failing test for copy helper**

```ts
// packages/astro/src/scripts/codeBlockCopy.test.ts
import { describe, expect, it, vi } from 'vite-plus/test';
import { copyText } from './codeBlockCopy';

describe('copyText', () => {
  it('writes to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };
    await expect(copyText('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });
});
```

- [ ] **Step 2: Implement copy helper + CodeBlock.astro**

Wire copy button with `data-var-ui-code-copy` and init script importing `codeBlockCopy`.

- [ ] **Step 3: Steps, Breadcrumbs, Collapsible**

```astro
---
// Collapsible.astro (sketch)
import { collapsible } from '@var-ui/core';
import { recipeProps } from '../utils';
type Props = {
  title?: string;
  defaultExpanded?: boolean;
  variant?: 'flush' | 'bordered';
  className?: string;
  id?: string;
};
const { title, defaultExpanded = false, variant = 'flush', className, id } = Astro.props;
const c = collapsible({ variant });
---
<details id={id} open={defaultExpanded || undefined} {...recipeProps(c.root, className)}>
  <summary {...recipeProps(c.trigger)}>{title}<slot name="trigger" /></summary>
  <div {...recipeProps(c.panel)}><slot /></div>
</details>
```

Align slot/recipe names with `packages/react/src/components/Collapsible.tsx` and core `collapsible` recipe.

- [ ] **Step 4: Tests pass + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(astro): add CodeBlock, Steps, Breadcrumbs, and Collapsible

EOF
)"
```

---

### Task 7: `Tabs` + `tabs.ts` controller

**Files:**

- Create: `packages/astro/src/scripts/tabs.ts`
- Create: `packages/astro/src/scripts/tabs.test.ts`
- Create: `packages/astro/src/components/Tabs.astro`
- Modify: `packages/astro/index.ts`
- Modify: `packages/astro/README.md` — document named slots + no-JS first panel

**Interfaces:**

- Props: `tabs: { id: string; label: string }[]`, `className?`, optional `defaultSelectedId?` (first tab if omitted)
- Panels: `<div slot={id}>…</div>` for each tab id
- Produces: `createTabsController(root: HTMLElement)` with keyboard (ArrowLeft/Right, Home/End) and `aria-selected` / `hidden` updates

- [ ] **Step 1: Failing tabs controller test**

```ts
// packages/astro/src/scripts/tabs.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { createTabsController } from './tabs';

function mountTabs(): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = `
    <div data-var-ui-tabs>
      <div role="tablist">
        <button type="button" role="tab" id="tab-a" aria-controls="panel-a" aria-selected="true">A</button>
        <button type="button" role="tab" id="tab-b" aria-controls="panel-b" aria-selected="false">B</button>
      </div>
      <div role="tabpanel" id="panel-a" aria-labelledby="tab-a"></div>
      <div role="tabpanel" id="panel-b" aria-labelledby="tab-b" hidden></div>
    </div>
  `;
  document.body.appendChild(root);
  return root.querySelector('[data-var-ui-tabs]') as HTMLElement;
}

describe('createTabsController', () => {
  it('selects the clicked tab and toggles hidden', () => {
    const el = mountTabs();
    createTabsController(el);
    const tabB = el.querySelector('#tab-b') as HTMLButtonElement;
    tabB.click();
    expect(tabB.getAttribute('aria-selected')).toBe('true');
    expect(el.querySelector('#panel-b')?.hasAttribute('hidden')).toBe(false);
    expect(el.querySelector('#panel-a')?.hasAttribute('hidden')).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect fail; implement `tabs.ts`; pass**

- [ ] **Step 3: Tabs.astro**

```astro
---
import { tabs as tabsRecipe } from '@var-ui/core';
import { recipeProps } from '../utils';

type TabDef = { id: string; label: string };
type Props = {
  tabs: TabDef[];
  defaultSelectedId?: string;
  className?: string;
};
const { tabs, defaultSelectedId, className } = Astro.props;
const selected = defaultSelectedId ?? tabs[0]?.id;
const t = tabsRecipe();
---
<div data-var-ui-tabs {...recipeProps(t.root, className)}>
  <div role="tablist" {...recipeProps(t.list)}>
    {tabs.map((tab) => (
      <button
        type="button"
        role="tab"
        id={`tab-${tab.id}`}
        aria-controls={`panel-${tab.id}`}
        aria-selected={tab.id === selected ? 'true' : 'false'}
        tabindex={tab.id === selected ? 0 : -1}
        {...recipeProps(t.tab)}
      >
        {tab.label}
      </button>
    ))}
  </div>
  {tabs.map((tab) => (
    <div
      role="tabpanel"
      id={`panel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      hidden={tab.id !== selected ? true : undefined}
      {...recipeProps(t.panel)}
    >
      <slot name={tab.id} />
    </div>
  ))}
</div>
<script>
  import { createTabsController } from '../scripts/tabs';
  document.querySelectorAll('[data-var-ui-tabs]').forEach((root) => {
    createTabsController(root as HTMLElement);
  });
</script>
```

Fix Astro `hidden` / `slot name={tab.id}` syntax as required by Astro 5 (dynamic slots: use `slot={tab.id}` on consumer side; for rendering, Astro may need `Astro.slots.has(tab.id)` + `Astro.slots.render(tab.id)`).

Preferred panel render:

```astro
{tabs.map(async (tab) => (
  <div ...>
    {Astro.slots.has(tab.id) && <Fragment set:html={await Astro.slots.render(tab.id)} />}
  </div>
))}
```

Or document that consumers pass:

```astro
<Tabs tabs={[{ id: 'a', label: 'A' }]}>
  <Fragment slot="a">Hello</Fragment>
</Tabs>
```

and use `<slot name={tab.id} />` if supported.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(astro): add Tabs with vanilla controller

EOF
)"
```

---

### Task 8: `examples/astro-app` playground

**Files:**

- Create: `examples/astro-app/package.json`
- Create: `examples/astro-app/astro.config.mjs`
- Create: `examples/astro-app/tsconfig.json`
- Create: `examples/astro-app/typestyles-entry.ts`
- Create: `examples/astro-app/src/layouts/BaseLayout.astro`
- Create: `examples/astro-app/src/pages/index.astro`
- Create: `examples/astro-app/public/` (empty or favicon)
- Modify: `.changeset/config.json` — ignore `@var-ui/example-astro-app`

**Interfaces:**

- Package name: `@var-ui/example-astro-app`
- Scripts: `dev`, `build`, `check` (`astro check`), `preview`

- [ ] **Step 1: package.json**

```json
{
  "name": "@var-ui/example-astro-app",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "preview": "astro preview"
  },
  "dependencies": {
    "@var-ui/astro": "workspace:*",
    "@var-ui/core": "workspace:*",
    "astro": "catalog:"
  },
  "devDependencies": {
    "@typestyles/vite": "catalog:",
    "typestyles": "catalog:",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: astro.config.mjs with TypeStyles (follow docs, not vite-app)**

```js
// examples/astro-app/astro.config.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import typestylesVite from '@typestyles/vite';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    resolve: {
      alias: {
        '@var-ui/core': `${root}/packages/core/src/index.ts`,
        '@var-ui/astro': `${root}/packages/astro/index.ts`,
      },
    },
  },
});
```

```ts
// examples/astro-app/typestyles-entry.ts
import '@var-ui/core';
import '@var-ui/astro';
```

Ensure `@var-ui/astro` barrel (or a dedicated `packages/astro/typestyles-entry.ts`) side-effect-imports every component module that defines/uses recipes so CSS extracts. If importing the barrel is not enough (`.astro` not traced), create `packages/astro/typestyles-entry.ts` that imports `@var-ui/core` only — core recipes already register when imported from components; the example must import the components used on pages (index imports them → extract graph). Mirror docs: entry imports packages that pull recipes.

Practical approach: `typestyles-entry.ts` imports `@var-ui/core` and a new `packages/astro/src/styles-entry.ts` that imports every recipe used by Astro components (or simply `@var-ui/core` if all recipes are already in core’s index). **Core index already exports recipes** — importing `@var-ui/core` in the entry is sufficient for CSS; components only apply classes.

- [ ] **Step 3: BaseLayout + index page**

```astro
---
// src/layouts/BaseLayout.astro
import { ThemeScript, ColorModeToggle } from '@var-ui/astro';
import { defaultTheme } from '@var-ui/core';
const { title = 'var-ui Astro' } = Astro.props;
---
<html lang="en" class={defaultTheme.className}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <ThemeScript themeClass={defaultTheme.className} />
  </head>
  <body>
    <header>
      <ColorModeToggle includeSystem appearance="labels" />
    </header>
    <main><slot /></main>
  </body>
</html>
```

`index.astro`: exercise Button, Alert, Badge, Stack, Card, CodeBlock, Steps, Tabs, Collapsible, Breadcrumbs, ProgressBar, etc. in one scrollable gallery (like a slim vite-app).

- [ ] **Step 4: Install + check + build**

Run:

```bash
vp install
vp run @var-ui/example-astro-app#check
vp run @var-ui/example-astro-app#build
```

Expected: both succeed; no React in the bundle.

- [ ] **Step 5: Commit**

```bash
git add examples/astro-app .changeset/config.json
git commit -m "$(cat <<'EOF'
feat(astro): add examples/astro-app playground

EOF
)"
```

---

### Task 9: Monorepo docs, CI, ROADMAP, package README

**Files:**

- Modify: `README.md` — packages table
- Modify: `packages/astro/README.md` — full consumer guide (ThemeScript, TypeStyles, Tabs slots, no React)
- Modify: `ROADMAP.md` — Future bullet for `@var-ui/astro`
- Modify: `.github/workflows/ci.yml` — after existing steps, run example check/build
- Modify: `.github/workflows/release.yml` — only if it lists package filters; ensure changesets can publish source package (no pack step required)
- Modify: `.changeset/config.json` — `ignore` includes `@var-ui/example-astro-app`; consider linking `@var-ui/astro` with core/react or leave independent (recommend **independent** version, not in `linked` array, so Astro can ship without forcing react bumps)
- Modify: root `package.json` — optional script `"astro:check": "vp run @var-ui/example-astro-app#check"`; do **not** add astro to `build` pack filters

- [ ] **Step 1: Update root README packages table**

| `@var-ui/astro` | Astro components (no React) |
| `@var-ui/example-astro-app` | Example Astro consumer |

- [ ] **Step 2: Finish `packages/astro/README.md`**

Include: install peers, TypeStyles vite plugin + entry, ThemeScript snippet, Tabs named-slot example, interactivity ladder note, link to design spec.

- [ ] **Step 3: ROADMAP Future section**

```md
- **`@var-ui/astro`** — Astro bindings (v0.1 docs/content kit shipped / in progress).
  Progressive interactivity (native HTML → Zag later). Spec:
  `docs/superpowers/specs/2026-07-18-var-ui-astro-design.md`.
```

- [ ] **Step 4: CI**

```yaml
- run: vp run @var-ui/example-astro-app#check
- run: vp run @var-ui/example-astro-app#build
```

Add after `vp test run` (example needs workspace packages present; no `vp pack` for astro).

- [ ] **Step 5: Changeset for the package**

Run `vp exec changeset` and select `@var-ui/astro` as minor/patch (`0.0.1` first release → patch is fine).

- [ ] **Step 6: Final validation**

```bash
vp check
vp test run
vp run @var-ui/example-astro-app#check
vp run @var-ui/example-astro-app#build
```

Expected: all green.

- [ ] **Step 7: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: wire @var-ui/astro into README, ROADMAP, and CI

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement                        | Task       |
| --------------------------------------- | ---------- |
| Source-shipped `@var-ui/astro`          | 1          |
| No React                                | Global + 8 |
| ThemeScript + ColorModeToggle           | 2          |
| Layout kit                              | 3          |
| Content/feedback kit                    | 4          |
| Button/Link/Alert/Banner                | 5          |
| CodeBlock/Steps/Breadcrumbs/Collapsible | 6          |
| Tabs + vanilla TS, first panel w/o JS   | 7          |
| `examples/astro-app` + TypeStyles       | 8          |
| Monorepo / CI / ROADMAP / README        | 9          |
| Zag deferred                            | Global     |
| Icons via slots                         | 4–5        |
| React prop-name parity                  | 3–7        |
