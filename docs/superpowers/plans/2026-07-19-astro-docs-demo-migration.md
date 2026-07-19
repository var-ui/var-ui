# Astro docs demo migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Astro docs cutover after the foundation vertical slice — every MDX `<Demo id>` has react/astro/html registry entries, homepage parity, framework-aware props, and search UI.

**Prerequisite:** Foundation acceptance (Task 8) — Astro + Netlify scaffold, cookie SSR switcher, Button `button.*` demos, registry tests, HTML core-recipe previews.

**Spec:** `docs/superpowers/specs/2026-07-18-astro-docs-design.md`

**Foundation plan:** `docs/superpowers/plans/2026-07-18-astro-docs-foundation.md`

## Scope

| Follow-up (this plan)                             | Already done (foundation)                                     |
| ------------------------------------------------- | ------------------------------------------------------------- |
| Migrate all remaining component demos             | Button `button.default`, `button.variants`, `button.disabled` |
| Homepage bento re-port from `c293d6b`             | Minimal index stub + nav links                                |
| PropsTable framework modes (React / Astro / HTML) | Button Props section deferred                                 |
| Full completeness gate vs every MDX `<Demo id>`   | Registry tests for `button.*` only                            |
| Wire search UI to `search-index`                  | Search index module exists; no UI                             |

**Do not merge to main as “docs cutover complete” until the completeness gate below is green.**

## Global constraints (unchanged)

- Cookie: `var-ui-framework`; values `react` \| `astro` \| `html`; default `react`.
- Site chrome: `@var-ui/astro` + `@var-ui/core` (React only for demo islands).
- HTML demos: `@var-ui/core` recipes / class names only — no `@var-ui/html`.
- MDX demos: `<Demo id="…" />` only — no inline framework code strings.
- Cookie-aware routes: on-demand SSR (`prerender = false` or `output: 'server'`).

---

## Checklist

### Demo registry migration

- [ ] Inventory every `<Demo id="…" />` across `docs/content/**/*.mdx` (excluding foundation Button ids).
- [ ] For each id, add `docs/src/demos/<component>/<variant>/` with `react.tsx`, `astro.astro`, `html.ts`, `snippets.ts`.
- [ ] Register ids in `docs/src/demos/registry.ts`, `astroDemoMap.ts`, `htmlDemoMap.ts`.
- [ ] Extend `READY_COMPONENT_SLUGS` (or remove gate) in `docs/src/pages/components/[slug].astro` per migrated page.
- [ ] Port remaining MDX content from TanStack-era `docs/content/components/*.mdx` where not yet present in Astro worktree.

### Homepage bento

- [ ] Re-port `BentoShowcase`, `ThemeShowcaseSwitcher`, and tile components from commit `c293d6b` (TanStack homepage).
- [ ] Adapt bento to Astro: themed container, portal scoping, `@var-ui/astro` chrome — no React site shell.
- [ ] Ensure bento respects `var-ui-framework` cookie (three-framework preview where applicable).

### PropsTable

- [ ] Implement framework-aware `PropsTable` (React types today; Astro/HTML prop surfaces per spec).
- [ ] Wire PropsTable into component MDX pages; remove “deferred” stubs.

### Completeness gate

- [ ] Add test: scan all MDX for `<Demo id="…" />` and assert each id exists in `DEMO_IDS` with full react/astro/html/snippets/maps.
- [ ] `vp test run` in `docs/` green with expanded registry.
- [ ] `vp run @var-ui/docs#build` green.

### Search UI

- [ ] Wire header search chrome to `docs/src/lib/search-index.ts`.
- [ ] Parity with prior TanStack search UX (keyboard nav, result grouping).

### Cutover / cleanup

- [ ] Remove any remaining TanStack-only assets and dead stubs.
- [ ] Update ROADMAP / README when all routes live.
- [ ] Netlify deploy smoke: cookie SSR on a non-Button component page.

---

## Suggested task order

1. Completeness-gate test scaffold (failing) + MDX id inventory.
2. Batch demo migration by component family (forms, layout, feedback, chat…).
3. Expand component routes + MDX pages as each batch lands.
4. Homepage bento re-port.
5. PropsTable framework modes.
6. Search UI.
7. Final gate green + deploy smoke.
