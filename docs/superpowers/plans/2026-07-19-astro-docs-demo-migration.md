# Astro docs demo migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the Astro docs cutover — every live MDX `<Demo id>` has react/astro/html registry entries, all component pages ship, homepage bento returns, PropsTable is framework-aware, search UI is wired, and the completeness gate is green.

**Architecture:** Reuse the foundation DemoHost + cookie SSR pipeline. Migrate legacy TanStack demos from `docs/content/_legacy/` and `docs/src/demos/_legacy/` into the Button-style registry (`docs/src/demos/<slug>/<variant>/`). Astro/HTML previews use `@var-ui/astro` when a counterpart exists; otherwise core recipe markup with visual parity and reduced interactivity (per design spec).

**Tech Stack:** Astro 5, `@astrojs/netlify`, `@astrojs/mdx`, `@astrojs/react`, `@var-ui/astro`, `@var-ui/core`, `@var-ui/react`, Vitest / vite-plus.

**Spec:** `docs/superpowers/specs/2026-07-18-astro-docs-design.md`  
**Foundation:** `docs/superpowers/plans/2026-07-18-astro-docs-foundation.md` (complete on `main`)

## Global Constraints

- Cookie: `var-ui-framework` ∈ `react` \| `astro` \| `html`; default `react`.
- Chrome: `@var-ui/astro` + `@var-ui/core` (React only for demo islands).
- HTML demos: `@var-ui/core` recipes / class names only — no `@var-ui/html`.
- MDX: `<Demo id="…" />` only — no inline framework code strings or legacy Demo imports.
- Cookie-aware pages: `export const prerender = false` (or server output).
- Visual parity required under the same theme/color mode; React Aria interaction parity **not** required for components without `@var-ui/astro` counterparts.
- Commits: conventional (`feat(docs):`, `fix(docs):`, `chore(docs):`). Commit when task says so (SDD).
- Do not edit `node_modules` or published package `dist/`.
- Work in an isolated git worktree under `.worktrees/`.

### Locked demo id inventory (legacy → target)

Most legacy pages have one Default demo → `{slug}.default`. Exceptions:

| Slug | Demo ids |
| --- | --- |
| `button` (done) | `button.default`, `button.variants`, `button.disabled` |
| `select` | `select.default`, `select.options` |
| all other `_legacy` component pages | `{slug}.default` |

Active content today: only `docs/content/components/button.mdx` (+ `index.mdx` if present). Everything else is under `docs/content/_legacy/components/`.

### Demo migration playbook (every batch task)

For each slug in the batch:

1. Read `docs/content/_legacy/components/<slug>.mdx` + `docs/src/demos/_legacy/<Name>Demo.tsx` for visual/API intent and React snippet text.
2. Create `docs/src/demos/<slug>/default/` (and extra variants if needed) with:
   - `react.tsx` — default export Preview (port from legacy demo)
   - `astro.astro` — `@var-ui/astro` when available; else core-recipe markup in Astro
   - `html.ts` — `export function render(): string` via recipes + `serializeHtml` / `recipeProps`
   - `snippets.ts` — `{ react, astro, html }` idiomatic samples
3. Widen `DemoId` in `docs/src/demos/types.ts` and register in `registry.ts`, `astroDemoMap.ts`, `htmlDemoMap.ts`.
4. Write `docs/content/components/<slug>.mdx` (id-only demos; port prose). Remove stub Props note once Task PropsTable lands; until then keep the deferred Props paragraph.
5. Add slug to `READY_COMPONENT_SLUGS` in `docs/src/pages/components/[slug].astro` and to `componentSidebar` in `docs/src/data/navigation.ts`.
6. Delete the migrated `_legacy` MDX + `*Demo.tsx` for that slug (leave `_legacy/README.md`).
7. Run registry + completeness tests; `vp run @var-ui/docs#build` for the batch.

### `@var-ui/astro` availability (quick reference)

**Has Astro component:** Alert, AspectRatio, Avatar, Badge, Banner, Button, Card, Center, ClickableCard, CodeBlock, Divider, EmptyState, Grid, Heading, HStack/VStack/Stack, Link, ProgressBar, Section, Spinner, Tabs, Text.

**No Astro (core HTML / reduced interactivity):** Carousel, Checkbox, Dialog, Field, RadioGroup, Select, Switch, TextAreaField, TextField, Thumbnail, Timestamp, all Chat\*.

---

### Task 1: Completeness gate scaffold + inventory fixture

**Files:**

- Create: `docs/src/demos/mdxDemoIds.ts`
- Create: `docs/src/demos/completeness.test.ts`
- Modify: `docs/src/demos/registry.test.ts` (keep existing; gate is additive)

**Interfaces:**

- Produces: `collectMdxDemoIds(): string[]` scanning `docs/content/**/*.mdx` (exclude `_legacy/**`) for `<Demo id="…"/>`
- Produces: test asserting every collected id ∈ `DEMO_IDS` and has snippets + react loader + astro/html map entries

- [ ] **Step 1: Write failing completeness test**

```ts
// docs/src/demos/completeness.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { DEMO_IDS, demoSnippets, reactDemoLoaders } from './registry';
import { astroDemoIds } from './astroDemoMap';
import { htmlDemoIds } from './htmlDemoMap';
import { collectMdxDemoIds } from './mdxDemoIds';

describe('MDX demo completeness gate', () => {
  it('every active MDX Demo id is fully registered', () => {
    const ids = collectMdxDemoIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(DEMO_IDS, `missing DEMO_IDS: ${id}`).toContain(id);
      expect(demoSnippets[id as keyof typeof demoSnippets].react.length).toBeGreaterThan(0);
      expect(demoSnippets[id as keyof typeof demoSnippets].astro.length).toBeGreaterThan(0);
      expect(demoSnippets[id as keyof typeof demoSnippets].html.length).toBeGreaterThan(0);
      expect(reactDemoLoaders[id as keyof typeof reactDemoLoaders]).toBeTypeOf('function');
      expect(astroDemoIds).toContain(id);
      expect(htmlDemoIds).toContain(id);
    }
  });
});
```

- [ ] **Step 2: Implement `collectMdxDemoIds` reading filesystem**

Scan with `fs` + regex `/<Demo\s+id=["']([^"']+)["']/` over `docs/content` excluding paths containing `/_legacy/`. Deduplicate + sort.

- [ ] **Step 3: Run tests**

Run: `vp test run docs/src/demos/completeness.test.ts docs/src/demos/registry.test.ts`  
Expected: completeness **passes for Button-only active content**; stays green as batches migrate. Document that gate fails if someone adds MDX Demo ids without registry entries.

- [ ] **Step 4: Commit**

```bash
git commit -m "test(docs): add MDX demo completeness gate"
```

---

### Task 2: Layout family demos

**Slugs:** `stack`, `grid`, `center`, `section`, `divider`, `aspect-ratio`  
**Ids:** `*.default` each

**Files:** playbook paths under `docs/src/demos/{stack,grid,center,section,divider,aspect-ratio}/default/**`, MDX under `docs/content/components/`, registry/maps/nav/`READY_COMPONENT_SLUGS`, delete matching `_legacy` files.

- [ ] **Step 1: Migrate all six per playbook** (TDD: extend completeness as MDX moves — keep gate green after each slug or after the whole batch)
- [ ] **Step 2: `vp test run docs/src/demos/` + `vp run @var-ui/docs#build`**
- [ ] **Step 3: Commit** `feat(docs): migrate layout component demos to DemoHost registry`

---

### Task 3: Content / typography / feedback family

**Slugs:** `heading`, `text`, `link`, `code-block`, `alert`, `banner`, `badge`, `spinner`, `progress-bar`, `empty-state`, `avatar`

All listed have `@var-ui/astro` counterparts (prefer them for Astro previews).

- [ ] **Step 1: Migrate per playbook**
- [ ] **Step 2: Tests + build**
- [ ] **Step 3: Commit** `feat(docs): migrate content and feedback demos to DemoHost`

---

### Task 4: Container family

**Slugs:** `card`, `clickable-card`, `carousel`, `thumbnail`, `timestamp`

`card` / `clickable-card` → `@var-ui/astro`. Others → core HTML with reduced interactivity.

- [ ] **Step 1: Migrate per playbook**
- [ ] **Step 2: Tests + build**
- [ ] **Step 3: Commit** `feat(docs): migrate container demos to DemoHost`

---

### Task 5: Forms family

**Slugs:** `field`, `text-field`, `text-area-field`, `checkbox`, `radio-group`, `switch`, `select`  
**Ids:** `*.default` plus `select.options`

No Astro form counterparts — Astro/HTML are core-recipe / native controls; snippets honest about HTML/API differences (`isDisabled` → `disabled`, etc.).

- [ ] **Step 1: Migrate per playbook**
- [ ] **Step 2: Tests + build**
- [ ] **Step 3: Commit** `feat(docs): migrate form demos to DemoHost`

---

### Task 6: Tabs + Dialog

**Slugs:** `tabs` (has `@var-ui/astro` Tabs), `dialog` (no Astro — static/core approximation for astro/html; full interaction React-only)

- [ ] **Step 1: Migrate per playbook**
- [ ] **Step 2: Tests + build**
- [ ] **Step 3: Commit** `feat(docs): migrate tabs and dialog demos to DemoHost`

---

### Task 7: Chat family

**Slugs:** `chat-layout`, `chat-message-list`, `chat-message`, `chat-message-bubble`, `chat-message-metadata`, `chat-composer`, `chat-send-button`, `chat-system-message`, `chat-tool-calls`

None in `@var-ui/astro` — React islands for real behavior; Astro/HTML use core recipe markup approximating layout/chrome; snippets show `@var-ui/react` vs core HTML honestly.

- [ ] **Step 1: Migrate per playbook**
- [ ] **Step 2: Tests + build**
- [ ] **Step 3: Commit** `feat(docs): migrate chat demos to DemoHost`

---

### Task 8: Drop READY gate + purge empty legacy

**Files:**

- Modify: `docs/src/pages/components/[slug].astro` — remove `READY_COMPONENT_SLUGS` whitelist; any MDX under `content/components/*.mdx` is live
- Modify: `docs/src/data/navigation.ts` — generate `componentSidebar` from `componentRegistry` (or fully expanded list matching all migrated slugs)
- Delete: remaining `_legacy/components` / `_legacy` demo files if any leftover; keep README explaining quarantine is closed if empty

- [ ] **Step 1: Assert `_legacy/components` is empty of MDX (or only README)**
- [ ] **Step 2: Remove whitelist; nav lists all components
- [ ] **Step 3: Completeness gate + build green
- [ ] **Step 4: Commit** `feat(docs): open all component MDX routes after demo migration`

---

### Task 9: Homepage bento re-port

**Files:**

- Restore from git `c293d6b` (or `git show c293d6b:…`): `docs/src/styles/homeBento.ts`, `docs/src/components/homepage/**`
- Adapt for Astro homepage: prefer React island for bento (heavy portals/themes) **or** `@var-ui/astro`-based rewrite if feasible in one task — **locked choice: React island for BentoShowcase** mounted from `docs/src/pages/index.astro` with `client:load`, theme switcher island; docs chrome stays Astro
- Framework cookie: bento showcases product UI with `@var-ui/react` (homepage showcase is product theater, not a DemoHost registry surface). Document that in homepage comment. Do **not** require three-framework bento tiles in v1 of this re-port (spec follow-up allowed “registry demos or Astro rewrites”; React island restore is enough to recover the showcase)
- Wire `typestyles-entry.ts` to import `homeBento` again

- [ ] **Step 1: Restore + adapt homepage island**
- [ ] **Step 2: Manual/dev smoke of `/` with theme switcher
- [ ] **Step 3: Build + commit** `feat(docs): restore homepage bento as React island`

---

### Task 10: Framework-aware PropsTable

**Files:**

- Modify/create: `docs/src/components/PropsTable.astro` (or keep React island fed by framework)
- Modify: existing `docs/src/components/PropsTable.tsx` / `extract-component-props.ts` / extract script
- Wire MDX: replace deferred Props stubs with `<PropsTable slug="…" />` (framework from `Astro.locals.framework`)

**Behavior:**

- `react`: current React prop extraction
- `astro`: document Astro `Props` / slots for components that exist in `@var-ui/astro`; otherwise show a short “no Astro binding — use HTML/core” note
- `html`: public class names / data attributes from recipes (manual tables or generated from recipe metadata where cheap)

- [ ] **Step 1: Implementation + Button page first**
- [ ] **Step 2: Roll PropsTable into migrated MDX pages (batch script OK)
- [ ] **Step 3: Tests if extractors change; build; commit** `feat(docs): add framework-aware PropsTable`

---

### Task 11: Search UI

**Files:**

- Create: `docs/src/components/DocsSearch.astro` + small client script **or** React island
- Use `buildDocsSearchIndex()` from `docs/src/lib/search-index.ts`
- Mount in `BaseLayout.astro` header near FrameworkSwitcher
- Keyboard nav + grouped results (parity with old TanStack DocsSearch intent)

- [ ] **Step 1: Implement search chrome + unit tests for helpers**
- [ ] **Step 2: Build smoke; commit** `feat(docs): wire docs search UI to search-index`

---

### Task 12: Cutover validation + docs polish

- [ ] **Step 1: Completeness gate green on full MDX set; `vp run @var-ui/docs#test|check|build`**
- [ ] **Step 2: Dev SSR smoke: switch cookie on a non-Button page (e.g. `/components/alert`) and confirm preview/snippet swap**
- [ ] **Step 3: Update `docs/README.md` + ROADMAP if cutover-complete language needed; delete `_legacy` dirs if empty**
- [ ] **Step 4: Commit** `chore(docs): complete Astro docs demo migration cutover`
- [ ] **Step 5: Append acceptance evidence to**.superpowers/sdd/migration-acceptance.md` (gitignored ok) or README Testing section

---

## Plan self-review

1. **Spec coverage:** demos, completeness gate, homepage, PropsTable, search, cutover — mapped to Tasks 1–12. Theme gallery page not in this plan (V5 separate).
2. **Placeholders:** none intentional; batch tasks reuse the playbook rather than duplicating file lists.
3. **Types:** DemoId must widen monotonically; completeness gate is source of truth for “cutover complete.”
