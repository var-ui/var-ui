# `@var-ui/docs` Phase 1 — Extract shell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `packages/docs` (`@var-ui/docs`) with a prop-driven docs shell extracted from the current Astro docs site, and dogfood it by renaming the site to `@var-ui/docs-site`.

**Architecture:** Phase 1 extracts layout primitives only — no `varDocs()` integration, no content collections, no catch-all routes. `DocsPage.astro` accepts nav/search/theme props + slots so site-specific data (component registry, showcase themes, framework switcher) stays in the consumer. Later phases add the Astro integration on top of this shell.

**Tech Stack:** Astro 5, `@var-ui/astro`, `@var-ui/core`, typestyles, Vite+ (`vp test`, `vp check`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-11-var-docs-kit-design.md` Phase 1 only
- No visual regression on the docs site
- No `varDocs()` integration yet (Phase 2)
- Site package renames from `@var-ui/docs` → `@var-ui/docs-site`; kit takes `@var-ui/docs`
- Kit must not import from `docs/` (one-way dependency)
- Run `vp check` / package tests after tasks that change code

---

## File map

| File                                             | Responsibility                      |
| ------------------------------------------------ | ----------------------------------- |
| `packages/docs/package.json`                     | Kit package `@var-ui/docs`          |
| `packages/docs/src/types.ts`                     | Shared nav / search / theme types   |
| `packages/docs/src/utils/docs-toc.ts`            | Path normalize + TOC visibility     |
| `packages/docs/src/utils/reattachTypestyles.ts`  | View-transition typestyles reattach |
| `packages/docs/src/utils/search.ts`              | `DocsSearchItem` type + helper      |
| `packages/docs/src/components/DocsSidebar.astro` | SideNav sections renderer           |
| `packages/docs/src/components/DocsToc.astro`     | Auto TOC wrapper                    |
| `packages/docs/src/components/DocsSearch.astro`  | CommandPalette search (items prop)  |
| `packages/docs/src/components/DocsPage.astro`    | AppShell layout (from BaseLayout)   |
| `packages/docs/index.ts`                         | Public exports                      |
| `docs/package.json`                              | Rename to `@var-ui/docs-site`       |
| `docs/src/layouts/BaseLayout.astro`              | Thin site wrapper around DocsPage   |

---

### Task 1: Scaffold `@var-ui/docs` + rename site package

**Files:**

- Create: `packages/docs/package.json`, `tsconfig.json`, `vite.config.ts`, `src/env.d.ts`, `index.ts`, `README.md`
- Modify: `docs/package.json` — name `@var-ui/docs-site`
- Modify: root `package.json` scripts (`docs:dev` etc.)
- Modify: `pnpm-workspace.yaml` vite override key
- Modify: `.changeset/config.json`, `.github/workflows/ci.yml`, `vite.config.ts` test projects
- Modify: `docs/README.md`

**Interfaces:**

- Produces: workspace package `@var-ui/docs` (empty exports OK)
- Produces: site package `@var-ui/docs-site`

- [ ] **Step 1: Create package skeleton**

```json
{
  "name": "@var-ui/docs",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./index.ts",
    "./DocsPage": "./src/components/DocsPage.astro",
    "./DocsSidebar": "./src/components/DocsSidebar.astro",
    "./DocsToc": "./src/components/DocsToc.astro",
    "./DocsSearch": "./src/components/DocsSearch.astro"
  },
  "peerDependencies": {
    "@var-ui/astro": "workspace:^",
    "@var-ui/core": "workspace:^",
    "astro": "catalog:",
    "typestyles": "catalog:"
  }
}
```

- [ ] **Step 2: Rename site package and update references**

Replace `@var-ui/docs` → `@var-ui/docs-site` in scripts, CI filter, changeset ignore, pnpm override (`@var-ui/docs-site>vite`).

- [ ] **Step 3: `vp install` and confirm workspace resolves**

Run: `vp install`
Expected: lockfile updates; both packages listed.

- [ ] **Step 4: Commit**

```bash
git add packages/docs docs/package.json package.json pnpm-workspace.yaml pnpm-lock.yaml .changeset/config.json .github/workflows/ci.yml vite.config.ts docs/README.md
git commit -m "$(cat <<'EOF'
chore: scaffold @var-ui/docs kit and rename docs site package

EOF
)"
```

---

### Task 2: Extract TOC utils + reattachTypestyles

**Files:**

- Create: `packages/docs/src/utils/docs-toc.ts`, `docs-toc.test.ts`
- Create: `packages/docs/src/utils/reattachTypestyles.ts`, `reattachTypestyles.test.ts`
- Modify: `packages/docs/index.ts` — re-export utils
- Modify: `docs/src/lib/docs-toc.ts` — re-export from kit (compat)
- Modify: `docs/src/scripts/reattachTypestyles.ts` — import kit helper + keep page-load side effect
- Modify: `vite.config.ts` — add `packages/docs` to test projects

**Interfaces:**

- Produces: `normalizeDocsPath(path: string): string`
- Produces: `shouldShowDocsToc(path: string): boolean`
- Produces: `DOCS_TOC_CONTENT_SELECTOR`, `DOCS_TOC_HEADING_SELECTOR`
- Produces: `reattachTypestyles(): void`

- [ ] **Step 1: Move TOC utils + tests into kit** (copy from `docs/src/lib/docs-toc.ts` + test)

- [ ] **Step 2: Move `reattachTypestyles` function into kit; site script imports it and keeps `astro:page-load` listener**

- [ ] **Step 3: Run kit + docs tests**

Run: `vp test run packages/docs docs/src/lib/docs-toc.test.ts docs/src/scripts/reattachTypestyles.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(docs): extract toc and typestyles helpers into @var-ui/docs

EOF
)"
```

---

### Task 3: Extract DocsSidebar, DocsToc, DocsSearch

**Files:**

- Create: `packages/docs/src/types.ts`
- Create: `packages/docs/src/components/DocsSidebar.astro`
- Create: `packages/docs/src/components/DocsToc.astro`
- Create: `packages/docs/src/components/DocsSearch.astro`
- Modify: site components to re-export or thin-wrap kit components

**Interfaces:**

```ts
export type SidebarItem = { text: string; link: string };
export type SidebarSection = { title: string; items: readonly SidebarItem[] };
export type TopNavItem = { text: string; link: string; match: string };
export type DocsSearchItem = {
  id: string;
  title: string;
  meta?: string;
  keywords?: string[];
  group?: string;
};
```

- DocsSidebar props: `{ sections, isLinkActive }`
- DocsToc props: `{ contentSelector?, headingSelector? }`
- DocsSearch props: `{ items, placeholder? }`

- [ ] **Step 1: Add types + three Astro components in kit**

- [ ] **Step 2: Update site wrappers to use kit components** (`DocsSidebarNav`, `DocsToc`, `DocsSearch`)

- [ ] **Step 3: Smoke via docs unit tests + `vp check` on packages/docs if applicable**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(docs): extract DocsSidebar, DocsToc, and DocsSearch into kit

EOF
)"
```

---

### Task 4: Extract DocsPage and thin BaseLayout

**Files:**

- Create: `packages/docs/src/components/DocsPage.astro`
- Modify: `docs/src/layouts/BaseLayout.astro` — compute site props, render `<DocsPage>`
- Modify: `docs/astro.config.mjs` + `docs/tsconfig.json` — alias `@var-ui/docs`
- Modify: `docs/package.json` — add `@var-ui/docs` dependency

**Interfaces:**

DocsPage props:

```ts
{
  title?: string;
  contentWidth?: 'default' | 'full';
  showToc?: boolean;
  tocContentSelector?: string;
  themeClassName: string;
  bodyClassName?: string;
  topNav: readonly TopNavItem[];
  sidebarSections: readonly SidebarSection[] | null;
  searchItems: readonly DocsSearchItem[];
  brand?: { heading: string; href: string };
}
```

Slots: `default`, `head`, `toc`, `tools` (site puts FrameworkSwitcher here), `themePicker` (site puts DocsThemePicker here), `themeScript` (site puts DocsThemeScript).

- [ ] **Step 1: Implement DocsPage from BaseLayout with props/slots**

- [ ] **Step 2: Rewrite BaseLayout as site adapter**

- [ ] **Step 3: Manual smoke — `vp run @var-ui/docs-site#dev` loads home, /components/button, /theming**

- [ ] **Step 4: Run `vp test run packages/docs docs` and `vp check`**

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(docs): extract DocsPage shell and dogfood from docs site

EOF
)"
```

---

## Out of scope (later phases)

- `varDocs()` Astro integration
- Content collections / catch-all routes
- Moving DocsThemePicker / showcase themes into kit
- `@var-ui/docs-components` / playground plugins

## Success criteria

- [ ] `@var-ui/docs` package exists and tests pass
- [ ] Docs site (`@var-ui/docs-site`) imports DocsPage from kit
- [ ] No intentional visual changes
- [ ] CI filter / scripts updated for new package name
