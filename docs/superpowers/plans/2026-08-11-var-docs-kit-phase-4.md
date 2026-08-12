# Phase 4 — `@var-ui/docs-components` plugin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract design-system catalog features (demos, props tables, framework switcher, component page chrome) into `@var-ui/docs-components`, wired by `componentDocsPlugin()`, while Var UI docs keeps registry data, demo implementations, MDX, and Netlify-safe site-owned routes.

**Architecture:** Mirror Phase 3 — package owns reusable chrome + Vite plugin; docs site owns data (`src/data/components.ts`, `src/demos/**`, `content/components/**`) and pages (`pages/components/*`) with `disableComponentRoutes: true` (same Netlify SSR escape hatch as guides).

**Tech stack:** Astro 5, Vite plugin, Zod, workspace package like `@var-ui/docs`.

---

## File map

| Path                                                         | Responsibility                                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `packages/docs-components/package.json`                      | `@var-ui/docs-components`                                                               |
| `packages/docs-components/index.ts`                          | `componentDocsPlugin` export                                                            |
| `packages/docs-components/schema.ts`                         | `componentDocsSchema()`                                                                 |
| `packages/docs-components/src/config.ts`                     | Zod plugin config                                                                       |
| `packages/docs-components/src/integration.ts`                | Astro integration (extract-props + virtual demos)                                       |
| `packages/docs-components/src/framework.ts`                  | Cookie parse / framework types                                                          |
| `packages/docs-components/src/middleware.ts`                 | Framework locals middleware (optional inject)                                           |
| `packages/docs-components/src/integrations/extract-props.ts` | Vite extract-props plugin (parameterized)                                               |
| `packages/docs-components/src/components/*`                  | DemoHost, DemoChrome, FrameworkSwitcher, PropsTable, ComponentDocTabs, …                |
| `packages/docs-components/src/virtual.d.ts`                  | `virtual:var-docs-components/demos` (+ registry if needed)                              |
| `docs/astro.config.mjs`                                      | Add `componentDocsPlugin({…})`; `disableComponentRoutes: true`                          |
| `docs/src/pages/components/*`                                | Import chrome from package                                                              |
| `docs/src/middleware.ts`                                     | Use package framework helpers (keep site-owned)                                         |
| Stay in docs-site                                            | `src/demos/**`, `src/data/components.ts`, playgrounds, styles panels that need registry |

---

### Task 1: Package skeleton + config schema

**Files:**

- Create: `packages/docs-components/package.json`, `tsconfig.json`, `vite.config.ts`, `index.ts`, `README.md`
- Create: `packages/docs-components/src/config.ts`, `src/config.test.ts`, `src/env.d.ts`

- [ ] **Step 1: Create package** with peers `@var-ui/docs`, `@var-ui/astro`, `@var-ui/core`, `astro`, `react`; export `.`, `./schema`, `./framework`, `./middleware`, component subpaths

- [ ] **Step 2: Zod config**

```ts
componentDocsPlugin({
  demos: './src/demos/demo-maps.ts', // module exporting { demoSnippets, astroDemoMap, htmlDemoMap, reactDemoMap }
  frameworks: ['react', 'astro', 'html'],
  defaultFramework: 'react',
  extractProps: {
    /** Absolute or project-relative output dir for JSON props docs */
    outputDir: 'src/generated/props',
    /** Optional: watch roots for HMR re-extract */
    watchPackages: ['../packages/react/src'],
  },
  disableComponentRoutes: true, // default true until inject is Netlify-safe
  disableMiddleware: true,
});
```

- [ ] **Step 3: Tests** — valid/invalid config parse
- [ ] **Step 4: `vp test run` in package** passes

---

### Task 2: Framework helpers + switcher

**Files:**

- Move: `docs/src/lib/framework.ts` → `packages/docs-components/src/framework.ts`
- Move: `docs/src/components/FrameworkSwitcher.astro` + `docs/src/scripts/frameworkSwitcher.ts`
- Create: `packages/docs-components/src/middleware.ts`
- Modify: `docs/src/middleware.ts`, `docs/src/layouts/BaseLayout.astro` imports
- Modify: `docs/src/lib/framework.ts` → re-export from package (compat)

- [ ] **Step 1: Move framework API**; keep cookie name `var-ui-framework` (or config later)
- [ ] **Step 2: Move FrameworkSwitcher**; site BaseLayout imports from `@var-ui/docs-components/FrameworkSwitcher`
- [ ] **Step 3: Package middleware** sets `locals.framework`; site keeps own middleware that calls same parse (disableMiddleware: true)
- [ ] **Step 4: Tests** for `parseFrameworkCookie`
- [ ] **Step 5: Verify** switcher still works on `/components/button`

---

### Task 3: Extract-props Vite plugin in package

**Files:**

- Move: `docs/src/lib/extract-props-plugin.ts`, `extract-component-props.ts` → package (parameterize registry lookup)
- Keep: `docs/src/lib/load-react-props.ts` or move with glob base configurable
- Modify: `docs/astro.config.mjs` — extract props via plugin, remove direct `extractPropsPlugin` vite entry

**Constraint:** `extract-component-props.ts` today imports `componentRegistry` from docs data. Parameterize:

```ts
extractPropsPlugin({
  docsRoot: string,
  outputDir: string,
  getRegistry: () => ComponentEntry[], // or path resolved at build
  watchRoots?: string[],
});
```

For dogfood, plugin config can accept `registryModule` resolved via `createRequire` / dynamic import of the site’s `components.ts`, **or** keep `writeComponentProps` in the site and only move the Vite plugin wrapper that calls a site callback. Prefer: move extractor + pass `registry` array from a small site adapter script if dynamic import is painful.

Pragmatic dogfood path:

1. Move Vite plugin shell to package
2. Site passes `extract: () => writeComponentProps(...)` **or** keep extractor in site behind `docs/src/lib/extract-component-props.ts` and plugin in package calls into configured `entry` module exporting `writeComponentProps(outputDir)`.

- [ ] **Step 1: Choose adapter** — `extractProps.entry` module exporting `writeComponentProps(outputDir: string): void`
- [ ] **Step 2: Package vite plugin** watches configured roots, calls entry on buildStart/change
- [ ] **Step 3: Wire in `componentDocsPlugin`** → `updateConfig({ vite: { plugins: [...] }})`
- [ ] \*\*Step 4: Remove raw plugin from docs `astro.config.mjs` vite.plugins`
- [ ] **Step 5: Confirm** `src/generated/props` still regenerates in dev

---

### Task 4: Demo + props + tabs chrome

**Files to move into `packages/docs-components/src/components/`:**

- `DemoHost.astro`, `DemoChrome.astro`, `DemoReactIsland.tsx`
- `PropsTable.astro`, `PropsTable.tsx`, `HiddenPropsTable.astro`
- `ComponentDocTabs.astro`, `ComponentPageHeader.astro` (if generic)
- Scripts: `componentPageTabs.ts`

**Virtual demos module** (avoid coupling package to site demos):

```ts
// virtual:var-docs-components/demos
export { demoSnippets, astroDemoMap, htmlDemoMap, reactDemoMap } from '<user demos module>';
```

Site provides e.g. `docs/src/demos/demo-maps.ts` that re-exports the four maps.

- [ ] **Step 1: Add site `demo-maps.ts` barrel**
- [ ] **Step 2: Plugin virtual module** resolves `demos` config path
- [ ] **Step 3: Move DemoHost stack** to import from `virtual:var-docs-components/demos`
- [ ] **Step 4: Move PropsTable stack**; `loadReactProps` stays site-local or uses `import.meta.glob` from consumer (PropsTable may need `loadProps` prop / virtual)
- [ ] **Step 5: Move ComponentDocTabs** + page tab helpers that don’t hardcode registry (pass tabs as props — already does)
- [ ] **Step 6: Update `[slug].astro` imports to package**
- [ ] **Step 7: Smoke** `/components/button` demos + props + tabs

**Stay in site:** `ComponentStylesPanel`, `ButtonConfigurator`, `component-page.ts` registry/source-link helpers (Var UI repo-specific globs), `astro-component-docs`, `html-api-docs`.

---

### Task 5: `componentDocsSchema` + content collection (optional thin)

**Files:**

- Create: `packages/docs-components/schema.ts` — `title`, `description`, optional `tableOfContents`
- Optional: add `components` collection in `docs/src/content.config.ts` **without** switching `[slug].astro` off globs yet (avoid Netlify/content migration risk in same phase)

- [ ] **Step 1: Export `componentDocsSchema()`**
- [ ] **Step 2: Unit test schema**
- [ ] **Step 3: Document** that route/collection migration can follow; Phase 4 success is plugin chrome + extract-props, not necessarily dropping globs

---

### Task 6: Wire plugin + workspace + verify

- [ ] **Step 1:** `docs/package.json` depend on `@var-ui/docs-components`
- [ ] **Step 2:** `astro.config.mjs` — `componentDocsPlugin({ demos, extractProps, disableComponentRoutes: true, disableMiddleware: true })`
- [ ] **Step 3:** `vite.ssr.noExternal` + aliases for the new package
- [ ] **Step 4:** `vp install` if needed
- [ ] **Step 5:** `vp check` + package/site tests
- [ ] **Step 6:** Smoke: `/`, `/docs/getting-started`, `/components/button`, framework switch, props tab
- [ ] **Step 7:** Update design spec Phase 4 status ✅

---

## Success criteria

- [ ] `@var-ui/docs-components` package exists and tests pass
- [ ] `/components/button` parity (demos, tabs, props, framework switcher)
- [ ] extract-props runs via plugin, not ad-hoc docs vite plugin list
- [ ] Guide-only `@var-ui/docs` consumers need not depend on this package
- [ ] Netlify SSR: component routes remain site-owned (`disableComponentRoutes`)

## Out of scope (later)

- Injected `/components/[...slug]` catch-all for Netlify
- Moving demo implementations / registry into the package
- Full content-collection migration for components (can be Phase 4.1)
- Theme playground (Phase 6)
