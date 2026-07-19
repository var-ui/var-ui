# Astro docs site + multi-framework demos — design

Migrate `@var-ui/docs` from TanStack Start / React to Astro, build the site
chrome with `@var-ui/astro`, and ship a site-wide framework switcher that
swaps live examples and snippets across React, Astro, and plain HTML/CSS.

**Date:** 2026-07-18  
**Status:** Approved  
**Parent:** ROADMAP V5 (var-ui.com site framework decision) + multi-framework
surface; depends on `@var-ui/astro` (`2026-07-18-var-ui-astro-design.md`)

---

## Goals

- Replace the TanStack Start docs site with an Astro site as the canonical
  var-ui.com / docs surface.
- Build docs chrome (header, sidebar, TOC, homepage, search chrome) with
  `@var-ui/astro` + `@var-ui/core` — not React.
- Provide a **site-wide** framework switcher (React | Astro | HTML) that
  persists via cookie and changes both **live previews** and **code snippets**.
- Author demos once in a typed registry keyed by id; MDX only references ids.
- Full cutover: every MDX-referenced demo has React + Astro + HTML before the
  old stack is removed.

## Non-goals

- Vue / Svelte / other framework bindings or switcher entries.
- A publishable `@var-ui/html` package (HTML demos use `@var-ui/core` class
  names / markup directly).
- Per-demo framework tabs (preference is global only).
- Client-side swap of all three previews on one page (no shipping unused
  framework JS).
- Iframe-isolated demos.
- Keeping TanStack docs live in parallel after cutover.
- Instant switch without navigation/reload (cookie + SSR implies soft reload).
- Pure static multi-URL mirrors (`/react/…`, `/astro/…`) as the v1 preference
  mechanism.

---

## Locked decisions

| Topic                 | Choice                                                                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Site framework        | Astro                                                                                                                                                                                                        |
| Docs chrome           | `@var-ui/astro`                                                                                                                                                                                              |
| v1 frameworks         | React, Astro, HTML/CSS                                                                                                                                                                                       |
| Live demos            | Real per-framework preview (not snippet-only)                                                                                                                                                                |
| HTML surface          | Core-only hand-written markup                                                                                                                                                                                |
| Switcher              | Site-wide header control; cookie-persisted                                                                                                                                                                   |
| Default framework     | React (when no cookie)                                                                                                                                                                                       |
| Authoring             | Shared demo registry; MDX uses `<Demo id="…" />`                                                                                                                                                             |
| Rendering             | Cookie-keyed SSR; React island only when React selected                                                                                                                                                      |
| Deploy mode           | Astro on-demand rendering via `@astrojs/netlify` (Netlify Functions). Prefer `output: 'static'` + `prerender = false` on cookie-aware routes, or `output: 'server'`. Pure static multi-build is out of scope |
| Migration             | Full cutover gate before removing TanStack stack                                                                                                                                                             |
| Cookie name           | `var-ui-framework` ∈ `react` \| `astro` \| `html`                                                                                                                                                            |
| React-only components | Astro/HTML demos use core recipe markup (+ native HTML where applicable); visual parity required; React Aria–level behavior not required until those components exist in `@var-ui/astro`                     |

---

## Approaches considered

1. **Cookie-keyed SSR + selective islands (chosen)** — Render only the active
   framework’s preview and snippet per request. Light pages; matches Astro.
2. **Client-side swap** — All variants in the page / lazy-loaded; instant
   switch. Heavier; fights “ship less JS.”
3. **Iframe isolation** — Strong sandboxing; worse authoring, perf, and a11y
   for shared core CSS.

---

## Architecture

```
@var-ui/core          recipes, tokens, themes
       ▲
       ├──────────────────┬──────────────────┐
@var-ui/react        @var-ui/astro      (HTML: class names)
       ▲                  ▲                  ▲
       │                  │                  │
       └──────── docs (Astro site) ──────────┘
                  DemoHost + registry
                  cookie: var-ui-framework
```

### Stack

- Replace `@var-ui/docs` tooling: Astro + MDX (Content Collections or
  equivalent), `@typestyles/vite` as in `examples/astro-app`.
- **SSR/hybrid required:** cookie-selected demos need a request-time render.
  Pure static output cannot vary preview/snippet by cookie on one URL. Choose
  an Astro adapter at implementation time (Node, Cloudflare, Netlify, etc.);
  path-prefixed static mirrors (`/react/…`, `/astro/…`) are a rejected
  alternative for v1.
- Dependencies: `@var-ui/astro`, `@var-ui/core`; `@var-ui/react` + React only
  as peers for React islands when the active framework is React.
- Root scripts `docs:dev` / `docs:build` / `docs:preview` point at the Astro
  docs package after cutover.

### Framework preference

1. Header switcher sets `var-ui-framework` cookie and soft-reloads /
   navigates so SSR re-renders.
2. Astro middleware or layout reads the cookie on each request.
3. Optional tiny inline script mirrors cookie to `data-framework` on `<html>`
   for any CSS hooks.
4. Missing / invalid cookie → `react`.

### Demo pipeline

```
MDX: <Demo id="button.variants" />
        │
        ▼
DemoHost.astro  ──reads cookie──► registry[id][framework]
        │
        ├── react → client island (e.g. client:load) + snippet
        ├── astro → server-rendered .astro preview + snippet
        └── html  → static HTML fragment + snippet
```

Only the active branch is included in the response for that request.

---

## Content & demo authoring

### MDX

Pages keep frontmatter (`title`, `description`) and framework-neutral prose.
Live examples are id-only:

```mdx
### Variants

Use `intent` to change visual weight.

<Demo id="button.variants" />
```

No framework imports or inline `code` strings in MDX.

### Registry layout

```
docs/src/demos/
  registry.ts              # id → DemoEntry; typed + exhaustive
  button/
    variants/
      react.tsx            # default export Preview
      astro.astro          # Preview component
      html.ts              # export html string (or .html)
      snippets.ts          # { react, astro, html }
    default/
      …
```

### `DemoEntry` contract

Every registered id provides:

- `react` preview module + snippet
- `astro` preview module + snippet
- `html` preview fragment + snippet

**Completeness gate:** Vitest (and/or build-time check) fails if any id
referenced from MDX lacks any framework variant. This is the cutover gate.

### Visual parity

For a given id, the three previews should match visually under the same theme
and color mode. Allowed differences are API-shaped only (React children vs
Astro slots vs HTML class names). Snippets show the idiomatic API for that
framework.

### Components without `@var-ui/astro` counterparts

Many interactive React components (Dialog, Select, menus, etc.) are not in the
Astro content kit yet. Full cutover still requires Astro + HTML **registry
entries** for every demo id:

- Prefer composing shipped `@var-ui/astro` pieces when they exist.
- Otherwise Astro and HTML previews are core recipe class-name markup (and
  native elements / small scripts where that already matches the Astro kit
  ladder).
- **Visual** parity with the React demo is required; full interaction parity
  with React Aria is **not** required until those components land in
  `@var-ui/astro`. Snippets must still be honest (show real HTML/Astro usage,
  not fake React-looking APIs).

### HTML demos

Hand-written markup using `@var-ui/core` recipe class names / attributes. No
wrapper package. Getting-started for HTML documents theme class + TypeStyles
CSS setup once; demos assume that chrome is present on the docs site.

### Props & install snippets

- `<PropsTable />` (or successor) follows the site framework preference:
  React prop types, Astro `Props` / slots, HTML public classes/attributes.
- Install / getting-started blocks are framework-aware (`@var-ui/react` vs
  `@var-ui/astro` vs core + class names).
- Exact prop-extraction implementation may extend the existing React
  extractor; Astro/HTML sources are part of the implementation plan.

---

## Chrome UX

- **Shell:** Header, sidebar, TOC, homepage, search chrome via `@var-ui/astro`.
- **Color mode:** Existing Astro `ThemeScript` / `ColorModeToggle` pattern.
- **Framework switcher:** Global header, beside color mode; options React |
  Astro | HTML.
- **Search:** Prefer build-time index (current docs approach); small client
  island only if the search box requires it.
- **Demo chrome:** Preview + code panels (same role as today’s `Demo`); copy
  copies the active snippet.
- **Homepage / bento:** Must use registry demos or Astro rewrites under the
  same three-framework completeness rules — no React-only exceptions after
  cutover.

---

## Cutover plan

Work happens **in place** on `docs/` (feature branch). Do not add a second
long-lived docs package beside TanStack.

1. Convert `docs/` to Astro SSR/hybrid + MDX; port chrome to `@var-ui/astro`.
2. Introduce demo registry + switcher; migrate demos until every MDX-referenced
   id has React + Astro + HTML.
3. Gate green: registry completeness test, `astro check` / `docs:build`,
   applicable `vp check` / `vp test`.
4. On the same change set that passes the gate: remove TanStack Start /
   React-router docs deps; point root `docs:*` scripts at Astro.
5. Update ROADMAP V5 / theme-gallery prerequisite: site framework is **Astro**.

---

## Testing & validation

- Unit: cookie parsing / framework resolution; registry shape.
- Completeness: every MDX `<Demo id>` exists in registry with all three
  variants + snippets.
- Build: `astro check` + `astro build` for docs.
- Smoke: switching framework updates preview and snippet after reload;
  default without cookie is React.
- No requirement for a full visual theme matrix in this spec (covered
  elsewhere); demos must not crash under the site’s default theme.

---

## Success criteria

1. Docs site runs on Astro (SSR/hybrid) with chrome from `@var-ui/astro`.
2. Site-wide switcher persists and SSR-selects React, Astro, or HTML demos.
3. MDX authors only pass demo ids; no per-page framework branching.
4. Full cutover: no TanStack docs stack remains; every demo id is complete.
5. HTML path documents core class-name usage without a new HTML package.
6. React-only components still have honest Astro/HTML demos (visual parity;
   interaction may be reduced until Astro parity).

---

## Follow-ups (explicitly later)

- **Homepage bento:** Re-port the TanStack homepage showcase from commit
  `c293d6b` (`docs/src/components/homepage/**`, `docs/src/styles/homeBento.ts`).
  Task 7 removed it with the Start shell; Astro search chrome is not wired yet.
- Additional frameworks in the switcher (Vue, Svelte, etc.).
- Optional `@var-ui/html` helpers if core class-name DX proves painful.
- Client-side instant switch without reload (if cookie+SSR UX is insufficient).
- Theme gallery page (V5 Part B) on the Astro site once V4 surfaces land.
- Vocs/other external doc hosts — out of scope; this repo’s docs are Astro.
