# Astro docs foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `@var-ui/docs` to an Astro + Netlify on-demand site with `@var-ui/astro` chrome, a cookie-backed framework switcher, and a complete three-framework Demo registry vertical slice for Button.

**Architecture:** Cookie `var-ui-framework` selects React island / Astro SSR / HTML core-recipe preview per request via `DemoHost.astro`. MDX references demos by id only. This plan is the foundation vertical slice; full cutover of every component demo is a follow-up plan.

**Tech Stack:** Astro 5, `@astrojs/netlify`, `@astrojs/mdx`, `@astrojs/react`, `@var-ui/astro`, `@var-ui/core`, `@var-ui/react`, TypeStyles / `@typestyles/vite`, Vitest via `vite-plus`.

**Spec:** `docs/superpowers/specs/2026-07-18-astro-docs-design.md`

## Scope of this plan vs follow-ups

| This plan (foundation) | Follow-up plan(s) |
| --- | --- |
| Astro scaffold + Netlify adapter | Migrate all remaining demos (Alert…Chat…) |
| Framework cookie + header switcher | Framework-aware PropsTable (Astro/HTML) |
| Demo registry + DemoHost | Homepage bento three-framework completeness |
| Button page fully migrated (`button.*` ids) | Remove any leftover TanStack-only assets |
| Minimal routes: home, docs/getting-started, components/button | Port all MDX pages + search parity |
| Keep React props extraction for Button | ROADMAP V5 site-framework note (can land here if trivial) |

**Do not merge to main as “docs cutover complete” until the follow-up plan’s completeness gate is green** (every MDX `<Demo id>` has react/astro/html). This branch may replace the TanStack stack in `docs/` while incomplete pages are stubs or omitted.

## Global Constraints

- Cookie name: `var-ui-framework`; values: `react` \| `astro` \| `html`; default: `react`.
- Site chrome uses `@var-ui/astro` + `@var-ui/core` — not React (except React demo islands).
- Deploy: `@astrojs/netlify`; cookie-aware routes must be on-demand (`prerender = false` or `output: 'server'`).
- HTML demos: `@var-ui/core` recipes / class names only — no `@var-ui/html` package.
- MDX demos: `<Demo id="…" />` only — no inline framework code strings.
- Validation: `vp check`, `vp test` for docs tests, `vp run @var-ui/docs#build` (or package script), `astro check` when wired.
- Commits: only when the user explicitly asks (skip commit steps otherwise). Prefer conventional messages (`feat(docs):`, `chore(docs):`).
- Do not edit `node_modules` or published `dist/` of other packages.
- Work in an isolated git worktree when executing (`.worktrees/`).

### File map

| Area | Path |
| --- | --- |
| Package / Astro config | `docs/package.json`, `docs/astro.config.mjs`, `docs/tsconfig.json`, `docs/typestyles-entry.ts` |
| Framework preference | `docs/src/lib/framework.ts`, `docs/src/lib/framework.test.ts`, `docs/src/middleware.ts` |
| Chrome | `docs/src/layouts/BaseLayout.astro`, `docs/src/components/FrameworkSwitcher.astro`, `docs/src/components/DocsChrome.astro` |
| Demo system | `docs/src/components/DemoHost.astro`, `docs/src/components/DemoReactIsland.tsx`, `docs/src/demos/registry.ts`, `docs/src/demos/registry.test.ts`, `docs/src/demos/button/**` |
| Pages | `docs/src/pages/index.astro`, `docs/src/pages/docs/[...slug].astro`, `docs/src/pages/components/[slug].astro` |
| Content | `docs/content/components/button.mdx` (id-based), stub getting-started |
| Remove / stop using | TanStack routes under `docs/src/routes/**`, old `Demo.tsx` children API, `vite.config.ts` TanStack Start plugin (replace with Astro) |

---

### Task 1: Scaffold Astro docs package (replace TanStack Start tooling)

**Files:**

- Modify: `docs/package.json`
- Create: `docs/astro.config.mjs`
- Modify: `docs/tsconfig.json`
- Modify: `docs/typestyles-entry.ts` (keep core + react + docs styles; add nothing Astro-specific required for extract)
- Create: `docs/src/pages/index.astro` (temporary hello page)
- Create: `docs/src/env.d.ts`
- Modify: root `package.json` docs scripts if needed (`docs:dev` → `astro dev`)
- Delete or stop referencing: TanStack-only entry once Astro builds (leave route files until Task 6 if needed for reference; prefer deleting when pages exist)

**Interfaces:**

- Consumes: `astro` catalog, `@astrojs/netlify`, `@astrojs/mdx`, `@astrojs/react`, workspace `@var-ui/*`
- Produces: `@var-ui/docs` runnable via `astro dev` / `astro build`

- [ ] **Step 1: Rewrite `docs/package.json` scripts and deps**

```json
{
  "name": "@var-ui/docs",
  "version": "0.0.0",
  "private": true,
  "description": "Documentation site for var-ui",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vp test run",
    "extract:props": "node --experimental-strip-types scripts/extract-props.ts"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.3.0",
    "@astrojs/netlify": "^6.5.0",
    "@astrojs/react": "^4.3.0",
    "@var-ui/astro": "workspace:*",
    "@var-ui/core": "workspace:*",
    "@var-ui/icons": "workspace:*",
    "@var-ui/react": "workspace:*",
    "astro": "catalog:",
    "react": "catalog:",
    "react-aria-components": "catalog:",
    "react-dom": "catalog:",
    "typestyles": "catalog:"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@typestyles/vite": "catalog:",
    "jsdom": "^26.0.0",
    "typescript": "catalog:",
    "vite": "catalog:",
    "zod": "^4.4.3"
  }
}
```

Pin `@astrojs/*` versions to whatever `astro add` / current Astro 5 peers resolve in the workspace; adjust if install complains. Remove `@tanstack/*`, `@content-collections/*`, `@vitejs/plugin-react` from docs unless still required by tests.

- [ ] **Step 2: Add `docs/astro.config.mjs`**

```js
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import typestylesVite from '@typestyles/vite';
import { defineConfig } from 'astro/config';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [mdx(), react()],
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    resolve: {
      alias: {
        '@var-ui/core': `${root}/packages/core/src/index.ts`,
        '@var-ui/react': `${root}/packages/react/src/index.ts`,
        '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
        '@var-ui/astro': `${root}/packages/astro/index.ts`,
        '@': `${docsRoot}/src`,
      },
    },
  },
});
```

- [ ] **Step 3: Add `docs/src/env.d.ts` and hello `docs/src/pages/index.astro`**

```ts
/// <reference types="astro/client" />
```

```astro
---
import { defaultTheme } from '@var-ui/core';
---
<html lang="en" class={defaultTheme.className}>
  <head>
    <meta charset="utf-8" />
    <title>Var UI</title>
    <link rel="stylesheet" href="/typestyles.css" />
  </head>
  <body>
    <h1>Var UI docs (Astro)</h1>
  </body>
</html>
```

- [ ] **Step 4: Install and verify build**

Run: `vp install` from repo root, then `vp run @var-ui/docs#build`

Expected: build succeeds (Netlify adapter output under `docs/dist` or adapter publish dir). Fix peer/version issues until green.

- [ ] **Step 5: Vitest config for docs**

Keep or add `docs/vite.config.ts` **only** for Vitest (no TanStack plugin):

```ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@var-ui/core': `${root}/packages/core/src/index.ts`,
      '@var-ui/react': `${root}/packages/react/src/index.ts`,
      '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
      '@var-ui/astro': `${root}/packages/astro/index.ts`,
      '@': path.join(docsRoot, 'src'),
    },
  },
});
```

Confirm root `vite.config.ts` still lists `'docs'` in `test.projects`.

- [ ] **Step 6: Commit (only if user asked)**

```bash
git add docs/package.json docs/astro.config.mjs docs/tsconfig.json docs/src/pages/index.astro docs/src/env.d.ts docs/vite.config.ts
git commit -m "feat(docs): scaffold Astro + Netlify docs package"
```

---

### Task 2: Framework cookie resolution

**Files:**

- Create: `docs/src/lib/framework.ts`
- Create: `docs/src/lib/framework.test.ts`
- Create: `docs/src/middleware.ts`

**Interfaces:**

- Consumes: `AstroCookies` / `Request` cookie header
- Produces:
  - `export type DocsFramework = 'react' | 'astro' | 'html'`
  - `export const FRAMEWORK_COOKIE = 'var-ui-framework'`
  - `export const DOCS_FRAMEWORKS: readonly DocsFramework[]`
  - `export function parseFrameworkCookie(value: string | undefined | null): DocsFramework`
  - `export function readFrameworkFromCookieHeader(cookieHeader: string | null): DocsFramework`
  - Middleware sets `locals.framework: DocsFramework`

- [ ] **Step 1: Write failing tests**

```ts
// docs/src/lib/framework.test.ts
import { describe, expect, it } from 'vite-plus/test';
import {
  FRAMEWORK_COOKIE,
  parseFrameworkCookie,
  readFrameworkFromCookieHeader,
} from './framework';

describe('parseFrameworkCookie', () => {
  it('defaults to react when missing or invalid', () => {
    expect(parseFrameworkCookie(undefined)).toBe('react');
    expect(parseFrameworkCookie('')).toBe('react');
    expect(parseFrameworkCookie('vue')).toBe('react');
  });

  it('accepts react, astro, html', () => {
    expect(parseFrameworkCookie('react')).toBe('react');
    expect(parseFrameworkCookie('astro')).toBe('astro');
    expect(parseFrameworkCookie('html')).toBe('html');
  });
});

describe('readFrameworkFromCookieHeader', () => {
  it('reads var-ui-framework from Cookie header', () => {
    expect(readFrameworkFromCookieHeader(`${FRAMEWORK_COOKIE}=astro; other=1`)).toBe('astro');
    expect(readFrameworkFromCookieHeader(null)).toBe('react');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `vp test run docs/src/lib/framework.test.ts`

Expected: FAIL (module missing or exports missing).

- [ ] **Step 3: Implement `framework.ts`**

```ts
export type DocsFramework = 'react' | 'astro' | 'html';

export const FRAMEWORK_COOKIE = 'var-ui-framework';

export const DOCS_FRAMEWORKS = ['react', 'astro', 'html'] as const satisfies readonly DocsFramework[];

export function parseFrameworkCookie(value: string | undefined | null): DocsFramework {
  if (value === 'react' || value === 'astro' || value === 'html') return value;
  return 'react';
}

export function readFrameworkFromCookieHeader(cookieHeader: string | null): DocsFramework {
  if (!cookieHeader) return 'react';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${FRAMEWORK_COOKIE}=([^;]*)`),
  );
  return parseFrameworkCookie(match?.[1] ? decodeURIComponent(match[1]) : undefined);
}
```

- [ ] **Step 4: Middleware**

```ts
// docs/src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { FRAMEWORK_COOKIE, parseFrameworkCookie } from './lib/framework';

export const onRequest = defineMiddleware(async (context, next) => {
  const raw = context.cookies.get(FRAMEWORK_COOKIE)?.value;
  context.locals.framework = parseFrameworkCookie(raw);
  return next();
});
```

Extend `docs/src/env.d.ts`:

```ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    framework: import('./lib/framework').DocsFramework;
  }
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `vp test run docs/src/lib/framework.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit (only if user asked)**

---

### Task 3: Base layout + FrameworkSwitcher

**Files:**

- Create: `docs/src/layouts/BaseLayout.astro`
- Create: `docs/src/components/FrameworkSwitcher.astro`
- Create: `docs/src/scripts/frameworkSwitcher.ts`
- Create: `docs/src/scripts/frameworkSwitcher.test.ts`
- Modify: `docs/src/pages/index.astro` to use `BaseLayout`

**Interfaces:**

- Consumes: `Astro.locals.framework`, `@var-ui/astro` `ThemeScript`, `ColorModeToggle`, `defaultTheme`
- Produces: switcher sets cookie `var-ui-framework` and `location.reload()`

- [ ] **Step 1: Failing unit test for switcher script helper**

```ts
// docs/src/scripts/frameworkSwitcher.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { frameworkCookieWriteValue } from './frameworkSwitcher';
import { FRAMEWORK_COOKIE } from '../lib/framework';

describe('frameworkCookieWriteValue', () => {
  it('builds a cookie assignment for the chosen framework', () => {
    expect(frameworkCookieWriteValue('html')).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(frameworkCookieWriteValue('html')).toMatch(/Path=\//);
    expect(frameworkCookieWriteValue('html')).toMatch(/Max-Age=/);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement script + Astro switcher**

```ts
// docs/src/scripts/frameworkSwitcher.ts
import { FRAMEWORK_COOKIE, type DocsFramework } from '../lib/framework';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function frameworkCookieWriteValue(framework: DocsFramework): string {
  return `${FRAMEWORK_COOKIE}=${encodeURIComponent(framework)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function applyFrameworkChoice(framework: DocsFramework): void {
  document.cookie = frameworkCookieWriteValue(framework);
  location.reload();
}
```

`FrameworkSwitcher.astro`: render three buttons/radios labeled React / Astro / HTML; `data-framework` + `aria-pressed` for current `Astro.locals.framework`; client script imports `applyFrameworkChoice` and wires clicks.

`BaseLayout.astro`: html shell with `defaultTheme.className`, `ThemeScript`, typestyles.css, header with `FrameworkSwitcher` + `ColorModeToggle`, `<slot />`. Set `data-framework={Astro.locals.framework}` on `<html>`.

- [ ] **Step 4: Wire index page through BaseLayout; run `vp run @var-ui/docs#dev` smoke**

Expected: switcher reload flips `data-framework` and cookie.

- [ ] **Step 5: Tests PASS; commit if asked**

---

### Task 4: Demo registry types + Button entries (TDD)

**Files:**

- Create: `docs/src/demos/types.ts`
- Create: `docs/src/demos/registry.ts`
- Create: `docs/src/demos/registry.test.ts`
- Create: `docs/src/demos/button/default/react.tsx`
- Create: `docs/src/demos/button/default/astro.astro`
- Create: `docs/src/demos/button/default/html.ts`
- Create: `docs/src/demos/button/default/snippets.ts`
- Create: `docs/src/demos/button/variants/**` (same shape)
- Create: `docs/src/demos/button/disabled/**` (same shape)

**Interfaces:**

- Consumes: `@var-ui/react` Button/HStack, `@var-ui/astro` Button/HStack, `@var-ui/core` `button` + `recipeProps` pattern for HTML
- Produces:

```ts
export type DemoId = 'button.default' | 'button.variants' | 'button.disabled'; // widen later

export type DemoSnippets = Record<DocsFramework, string>;

export type DemoEntry = {
  id: DemoId;
  snippets: DemoSnippets;
  react: () => Promise<{ default: React.ComponentType }>;
  // Astro components are imported by DemoHost via static map — registry stores loaders or host imports map
};

export const demoRegistry: Record<DemoId, DemoEntry>;
export function assertDemoComplete(entry: DemoEntry): void;
```

Practical shape for Astro: `registry.ts` exports metadata + snippets + React loaders; `DemoHost.astro` holds a **static** `astroPreviews` / `htmlPreviews` map keyed by id (Astro cannot dynamically import `.astro` by string at runtime). Keep both maps in sync; registry test imports both maps and asserts key equality.

- [ ] **Step 1: Write failing registry completeness test**

```ts
import { describe, expect, it } from 'vite-plus/test';
import { DEMO_IDS, demoSnippets, reactDemoLoaders } from './registry';
import { astroDemoIds } from './astroDemoMap';
import { htmlDemoIds } from './htmlDemoMap';

describe('demo registry completeness', () => {
  it('has snippets and loaders for every id across frameworks', () => {
    for (const id of DEMO_IDS) {
      expect(demoSnippets[id].react.length).toBeGreaterThan(0);
      expect(demoSnippets[id].astro.length).toBeGreaterThan(0);
      expect(demoSnippets[id].html.length).toBeGreaterThan(0);
      expect(reactDemoLoaders[id]).toBeTypeOf('function');
      expect(astroDemoIds).toContain(id);
      expect(htmlDemoIds).toContain(id);
    }
  });
});
```

Split maps into `astroDemoMap.ts` / `htmlDemoMap.ts` that re-export id lists used by the host — implement in Step 3.

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement Button demos**

React (`button/default/react.tsx`):

```tsx
import { Button } from '@var-ui/react';
export default function Preview() {
  return <Button>Click me</Button>;
}
```

Astro (`button/default/astro.astro`):

```astro
---
import { Button } from '@var-ui/astro';
---
<Button>Click me</Button>
```

HTML (`button/default/html.ts`) — build markup from core for visual parity; snippet shows public classes:

```ts
import { button } from '@var-ui/core';
import { recipeProps } from '@var-ui/astro/…'; // OR duplicate tiny helper in docs/src/lib/recipeProps.ts to avoid deep imports

export function render(): string {
  const rp = recipeProps(button({}));
  // serialize to <button …>Click me</button>
}
```

Prefer adding `docs/src/lib/recipeProps.ts` copied from astro utils (small) if `@var-ui/astro` does not export `recipeProps` cleanly for TS-only imports.

Snippets mirror current `button.mdx` code samples, adapted per framework (`isDisabled` → `disabled` for Astro/HTML).

Variants / disabled: match existing `ButtonDemo.tsx` layout with `HStack` (React/Astro) or flex markup (HTML using stack recipe if available).

- [ ] **Step 4: Wire registry maps; tests PASS**

- [ ] **Step 5: Commit if asked**

---

### Task 5: DemoHost + React island

**Files:**

- Create: `docs/src/components/DemoHost.astro`
- Create: `docs/src/components/DemoReactIsland.tsx`
- Create: `docs/src/components/DemoChrome.astro` (Card + Collapsible + CodeBlock via `@var-ui/astro`)

**Interfaces:**

- Consumes: `Astro.locals.framework`, registry maps, `id: DemoId` prop
- Produces: preview + snippet for active framework only

- [ ] **Step 1: Implement DemoReactIsland**

```tsx
import { createElement, type ComponentType } from 'react';

export default function DemoReactIsland({
  Preview,
}: {
  Preview: ComponentType;
}) {
  return createElement(Preview);
}
```

- [ ] **Step 2: Implement DemoHost.astro**

Pseudostructure:

```astro
---
import DemoChrome from './DemoChrome.astro';
import DemoReactIsland from './DemoReactIsland';
import { demoSnippets, reactDemoLoaders, type DemoId } from '../demos/registry';
import { astroPreviews } from '../demos/astroDemoMap';
import { htmlRenders } from '../demos/htmlDemoMap';

const { id } = Astro.props as { id: DemoId };
const framework = Astro.locals.framework;
const code = demoSnippets[id][framework];
---
<DemoChrome code={code} language={framework === 'react' ? 'tsx' : framework === 'astro' ? 'html' : 'html'}>
  {framework === 'react' && (
    <DemoReactIsland client:load Preview={(await reactDemoLoaders[id]()).default} />
  )}
  {framework === 'astro' && <astroPreviews[id] />}
  {framework === 'html' && <Fragment set:html={htmlRenders[id]()} />}
</DemoChrome>
```

Use valid Astro syntax for dynamic component (`const AstroPreview = astroPreviews[id];` then `<AstroPreview />`). Only import/await React loader when `framework === 'react'`.

- [ ] **Step 3: Manual smoke on a throwaway page** `/components/button` (Task 6) — switch frameworks, confirm only one preview path.

- [ ] **Step 4: Commit if asked**

---

### Task 6: MDX content pipeline + Button page + minimal nav

**Files:**

- Configure MDX components map so `Demo` resolves to `DemoHost.astro`
- Modify: `docs/content/components/button.mdx` to use `<Demo id="button.default" />` etc.
- Create: `docs/src/pages/components/[slug].astro` with `export const prerender = false`
- Create: `docs/src/pages/docs/[...slug].astro` (stub getting-started)
- Create: `docs/src/data/navigation.ts` port (trim to working links)
- Remove or ignore old TanStack `docs/src/routes/**` from the running app

**Interfaces:**

- Consumes: content MDX via Astro Content Collections or `import.meta.glob` on `docs/content/**/*.mdx`
- Produces: `/components/button` renders three demos via registry

- [ ] **Step 1: Choose content loading**

Prefer Astro Content Layer / collections for `docs/content/{docs,components,theming}` with schema `{ title, description }`. If migration friction is high, use `import.meta.glob('../../content/components/*.mdx')` in `[slug].astro` for this plan only.

- [ ] **Step 2: Rewrite `button.mdx` examples to ids**

```mdx
### Default

<Demo id="button.default" />

### Variants

…

<Demo id="button.variants" />

### Disabled

…

<Demo id="button.disabled" />
```

Keep PropsTable as React-only for this plan (existing extractor) or temporarily omit if wiring is heavy — if omitted, leave a short note in the page.

- [ ] **Step 3: Page renders MDX with `components={{ Demo: DemoHost }}`**

- [ ] **Step 4: `vp run @var-ui/docs#build` + manual switcher check on `/components/button`**

Expected: all three frameworks show matching Button previews and correct snippets.

- [ ] **Step 5: Commit if asked**

---

### Task 7: Cleanup TanStack surface + monorepo scripts

**Files:**

- Delete unused: `docs/src/routes/**`, `docs/src/router.tsx`, `docs/src/routeTree.gen.ts`, TanStack `DocsProviders`, old `Demo.tsx` if unused
- Modify: root `package.json` `docs:*` scripts
- Modify: `docs/README.md` — Astro + Netlify notes
- Modify: `ROADMAP.md` V5 bullet — site framework is Astro (Netlify)
- Modify: `specs/theme-gallery.md` prerequisite note if one line is enough

- [ ] **Step 1: Remove dead TanStack files that nothing imports**

- [ ] **Step 2: Ensure `vp run @var-ui/docs#check` and `#build` and docs unit tests pass**

- [ ] **Step 3: Update docs README + ROADMAP V5 site-framework sentence**

- [ ] **Step 4: Commit if asked**

---

### Task 8: Foundation acceptance checklist

- [ ] **Step 1: Verify against spec success criteria (foundation subset)**

1. Docs run on Astro with `@astrojs/netlify` and `@var-ui/astro` chrome.
2. Switcher persists cookie and SSR-selects react/astro/html on `/components/button`.
3. Button MDX uses only demo ids.
4. Registry tests enforce completeness for registered ids (`button.*`).
5. HTML Button demos use core recipes/classes — no HTML package.

- [ ] **Step 2: Open follow-up plan stub path**

Create empty checklist file or section note: next plan = migrate remaining component demos + homepage + PropsTable framework modes + full completeness gate vs all MDX `<Demo id>` references.

---

## Plan self-review

1. **Spec coverage:** Architecture, cookie SSR, registry, DemoHost, Astro chrome, Netlify, Button vertical slice, HTML core-only — covered. Full cutover of all demos — explicitly deferred. Framework-aware PropsTable — deferred. Homepage bento — deferred.
2. **Placeholders:** None intentional; `@astrojs/*` versions may need resolve-at-install adjustment (called out).
3. **Types:** `DocsFramework`, `DemoId`, cookie name consistent across tasks.
