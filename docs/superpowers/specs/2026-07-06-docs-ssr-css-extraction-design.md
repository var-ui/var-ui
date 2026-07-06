# Docs site: eliminate FOUC via build-time CSS extraction

Date: 2026-07-06

## Problem

The docs site (Vocs v2, built on Waku/RSC) only ever gets typestyles CSS
client-side: the runtime `typestyles` package injects a `<style id="typestyles">`
element into `document.head` after the JS bundle loads and hydrates. Server-rendered
HTML — both `vite dev` and the production SSG build — ships with no CSS at all, so
every page shows a flash of unstyled content (FOUC) until hydration completes.

This is a separate, follow-on issue from the SSR crash fixed earlier (typestyles PR
[#125](https://github.com/type-styles/typestyles/pull/125)): that fix stopped SSR
from throwing when the same `styles.class()` name was registered twice across
Vite's `rsc`+`ssr` environments. It did not add any server-rendered CSS — the
runtime-only injection model was untouched.

## Chosen approach: build-time static extraction

Wire up `@typestyles/vite` — an existing, already-built package in the typestyles
monorepo — to extract all of var-ui's registered CSS into a real `typestyles.css`
file at build time, and reference it via a normal `<link rel="stylesheet">` tag.
This is the standard "zero-runtime CSS-in-JS" answer: no runtime execution-order
dependency, works identically for SSR/SSG/client, trivially cacheable.

This was chosen over the alternative (reading `getRegisteredCss()` at SSR
render time and inlining a `<style>` tag per request) because it produces a real,
cacheable asset with no dependence on the app's module-import ordering or on a
global CSS registry that accumulates across requests. That runtime-read approach
remains a viable fallback if this one is abandoned, but is not part of this design.

### Two bugs had to be found before this was viable

**1. `@typestyles/build-runner`'s `runTypestylesBuild` silently drops style
registrations (typestyles repo bug, confirmed, fix scoped below).**

`runTypestylesBuild` bundles the "extraction entry" module graph with esbuild
using default settings, then executes the bundle in a child process and reads
back `getRegisteredCss()`. Default esbuild tree-shaking assumes a call is
droppable if its return value is never referenced. `styles.component()` /
`styles.class()` calls are pure side effects — the CSS registration _is_ the
point, the returned classname-function is often not directly "used" by a
namespace-only import — so for any consumer library that (correctly) marks
itself tree-shakeable, real style registrations get silently eliminated before
the extraction script ever runs.

Confirmed empirically: bundling var-ui's actual `@var-ui/core` + `@var-ui/react`
packages through `runTypestylesBuild`'s exact esbuild config produced an 80KB
bundle containing zero `styles.component()` calls and empty extracted CSS. Adding
`treeShaking: false` to the same esbuild call produced a 2.5MB bundle retaining
all 42 `styles.component()` calls, and the full pipeline (through the actual
`@typestyles/vite` plugin, against var-ui's actual docs build) produced a
complete, correct 272KB `typestyles.css` — `@layer` order, `@font-face`, design
tokens, and every `example-ds-*` component class present.

**2. `docs/` doesn't directly depend on `typestyles`.**

It only depends on it transitively through `@var-ui/core`/`@var-ui/react`. The
extraction script's generated `require('typestyles')` call needs to resolve from
a file physically inside `docs/`, which — under pnpm's strict linking — requires
`typestyles` to be an explicit dependency of `@var-ui/docs`, not just a
transitive one. Fixed by adding it as a direct devDependency.

### Cascade order risk (found, avoided)

React 19's `precedence`-based style-hoisting (`<style href="..." precedence="...">`)
was tested and confirmed to work through Waku's streaming SSR renderer — but it
hoists tagged elements to the very front of `<head>`, ahead of Vocs' own plain
(non-precedence) `<link>` tags. That would invert today's cascade order (Vocs CSS
first, var-ui CSS second) and risk subtle visual regressions from flipped
specificity ties.

Avoided by using a plain `<link rel="stylesheet" href="/typestyles.css">` (no
`precedence`), rendered early in `docs/src/pages/_layout.tsx` — a Server
Component, so there's no hydration re-render to reason about at all. Plain
`<link>` tags are valid HTML5 in `<body>` and apply in document order, preserving
today's cascade order exactly.

## Concrete changes

### typestyles repo (new branch off `main`)

- `packages/build-runner/src/index.ts`: add `treeShaking: false` to the
  `esbuildBuild()` call in `runTypestylesBuild`, with a comment explaining why
  (side-effect-only calls, not dead code by the usual definition).
- New test fixture + test in the build-runner test suite: a module whose style
  call's return value is unused, asserting the registration survives extraction.
  This is the failing-test-first step (TDD).
- Changeset + PR, same process as typestyles PR #125.

### var-ui repo

- `docs/package.json`: add `typestyles` and `@typestyles/vite` as real
  dependencies (`catalog:` where applicable).
- New file `docs/typestyles-entry.ts`: imports `@var-ui/core`, `@var-ui/react`,
  and `./src/styles/docsShell` (the one docs-owned module that calls
  `styles.component` directly, outside the `@var-ui/*` packages).
- `docs/vite.config.ts`: add the `typestylesVite({ extract: { modules:
['typestyles-entry.ts'] } })` plugin.
- Keep the existing (already-fixed-elsewhere, uncommitted) `noExternal:
['typestyles']` SSR/RSC environment config — harmless, and still useful until
  a released typestyles version includes PR #125's fix.
- `docs/src/pages/_layout.tsx`: render `<link rel="stylesheet"
href="/typestyles.css" />` before `<DocsProviders>`.

## Known, accepted trade-offs

- **`vite dev` still shows FOUC, unchanged.** `@typestyles/vite`'s default
  `build` mode keeps client-side runtime injection active during `vite dev` (for
  HMR ergonomics) and only disables it for `vite build`. This design targets
  production/preview; dev keeps today's behavior. Revisit later if wanted —
  trades against fast HMR iteration.
- **Production runtime injection is fully disabled** once this ships — no more
  client JS creating `<style>` tags in prod at all. This is the intended
  "zero-runtime" end state, not a regression.
- **No dynamic-style correctness gap for var-ui specifically**: confirmed zero
  `hashClass()` usage anywhere in the codebase, and all `styles.component()` /
  `styles.class()` calls use static, module-scope config (variants are
  pre-registered at import time; props only select among them at render time).
  Static extraction has nothing dynamic to miss here.
- **Fully decoupled from Waku's multi-environment build.** The extraction runs
  as an isolated esbuild bundle executed in a standalone Node child process — it
  does not go through Vite's `rsc`/`ssr`/`client` environments at all, so none
  of Vite's newer Environment API compatibility questions apply.
- **Global CSS registry growth across a multi-page static build is expected and
  harmless** for the runtime-read fallback approach, not a concern for the
  chosen build-time-extraction approach (each build runs the extraction entry
  fresh, in one isolated child process, producing one complete, deterministic
  CSS file for the whole site — not per-page).

## Sequencing

`@typestyles/vite` is a published, versioned package (currently `0.4.1`) — var-ui
is not a workspace member of the typestyles monorepo, so it installs from the npm
registry, not a local link. The tree-shaking fix does not exist in any published
version yet. That means the var-ui wiring work is blocked on the typestyles PR
merging _and_ a new version being published (or, for immediate local testing
only, temporarily pointing `docs/package.json` at the local typestyles checkout
via pnpm's `link:` protocol, the way the design spike did — not a long-term
arrangement). The implementation plan should do the typestyles-repo fix first,
get it merged and released, then do the var-ui wiring against the released
version.

## Verification plan

1. `pnpm build` in `docs/`; confirm `dist/public/typestyles.css` contains the
   full expected CSS (already proven in the spike: 272KB, correct `@layer`
   order, font-face, tokens, every `example-ds-*` component class).
2. The conclusive FOUC test: load a built page in a headless browser **with
   JavaScript disabled**, screenshot it. Fully styled output with no JS running
   at all proves the styling comes from server-rendered HTML, not client
   hydration.
3. Confirm `docs/dist/serve-node.js` (the production preview server) serves
   `/typestyles.css` with a 200 and correct `content-type`.
4. Re-run `pnpm verify` in typestyles (lint + typecheck + test across the whole
   monorepo — the same gate used for PR #125).
