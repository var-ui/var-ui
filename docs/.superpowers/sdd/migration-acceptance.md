# Astro docs migration — acceptance evidence

## Cutover (2026-07-19)

- Completeness gate: 43 tests green (`vp run @var-ui/docs#test`)
- Typecheck: `vp run @var-ui/docs#check` — 0 errors
- Build: `vp run @var-ui/docs#build` — server bundle + Netlify SSR function

## Final review fixes (2026-07-19)

### Routes restored

| Route                | Status | Notes                                                                |
| -------------------- | ------ | -------------------------------------------------------------------- |
| `/components`        | ✅     | `components/index.astro` lists `componentSidebar` + MDX overview     |
| `/components/[slug]` | ✅     | No longer 404s `index` slug; dedicated index page owns `/components` |
| `/theming`           | ✅     | `theming/index.astro` loads `content/theming/index.mdx`              |
| `/theming/customize` | ✅     | `[slug].astro` loads MDX from `content/theming/`                     |
| `/theming/themes`    | ✅     | same                                                                 |
| `/theming/tokens`    | ✅     | same                                                                 |

### Navigation

- Primary nav: Docs → `/docs/getting-started`, Components → `/components`, Theming → `/theming`
- Homepage Explore links resolve to `/docs`, `/components`, `/theming`
- `BaseLayout` sidebar on `/components/*` and `/theming/*` from `componentSidebar` / `themingSidebar`

### SSR smoke — alert html cookie row

- `docs/src/lib/ssr-smoke.test.ts`: `htmlDemoMap['alert.default']()` contains `data-alert` and `var-ui-alert`; html snippet distinct from react
- DemoHost uses `Astro.locals.framework` from `var-ui-framework` cookie (middleware)

### Commands (worktree)

```bash
cd .worktrees/astro-docs-migration
vp run @var-ui/docs#test
vp run @var-ui/docs#check
vp run @var-ui/docs#build
```

Commit: `fix(docs): restore components and theming index routes`
