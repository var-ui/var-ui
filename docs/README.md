# @var-ui/docs

Documentation site for the var-ui design system. Built with [Astro](https://astro.build) and deployed via the [Netlify adapter](https://docs.astro.build/en/guides/integrations-guide/netlify/) (`output: 'server'`).

**Cutover status:** DemoHost migration is complete. Every live component MDX page uses `<Demo id="…" />` with react / astro / html registry entries. Legacy TanStack quarantine dirs (`content/_legacy/`, `src/demos/_legacy/`) are tombstones only.

Framework selection is SSR cookie-driven (`var-ui-framework` ∈ `react` \| `astro` \| `html`; default `react`).

## Commands

| Command                     | Description                       |
| --------------------------- | --------------------------------- |
| `vp run @var-ui/docs#dev`   | Start Astro dev server            |
| `vp run @var-ui/docs#build` | Build for Netlify to `docs/dist/` |
| `vp run @var-ui/docs#check` | Astro / TypeScript check          |
| `vp run @var-ui/docs#test`  | Docs unit tests (Vitest)          |

From the repo root you can also use `vp run docs:dev` / `docs:build`.

### Local development vs preview

This site uses `output: 'server'` with `@astrojs/netlify`, so routes are rendered by the SSR function — not as static HTML in `dist/`.

- **Use `vp run @var-ui/docs#dev`** to browse the site locally. Framework switching, demos, and PropsTable all work here.
- **`vp run @var-ui/docs#preview` is not supported** for SSR Netlify builds; it only serves static assets and returns 404 for app routes. For a production-like smoke test, deploy a preview on Netlify or run `netlify dev` after `build`.

Docs pins **Vite 6** (Astro 5’s supported bundler). `@astrojs/netlify`’s dev middleware uses Rolldown for dependency pre-bundling; if you see `Invalid key: "jsx"` warnings after upgrading React/Vite plugins, ensure `rolldownJsxOptionsCompat` remains wired in `astro.config.mjs`.

### Troubleshooting

- **`astro check` errors on `waku/router` in `src/pages.gen.ts`:** Delete `docs/src/pages.gen.ts`. It is a leftover from the pre-Astro docs stack (gitignored) and is not used by the Astro site.

## Testing / completeness

- Unit tests include the **MDX demo completeness gate** (`src/demos/completeness.test.ts`): every `<Demo id>` in active MDX must be registered in `DEMO_IDS`, snippets (react/astro/html), react loaders, and astro/html maps.
- Acceptance evidence for the demo migration cutover: `.superpowers/sdd/migration-acceptance.md` (gitignored local SDD artifact).

## Adding a component page

1. Add MDX under `content/components/<slug>.mdx` with `<Demo id="…" />` only (no inline framework snippets).
2. Register demos under `src/demos/<slug>/` and wire `registry.ts`, `astroDemoMap.ts`, `htmlDemoMap.ts`.
3. Add a sidebar entry in `src/data/navigation.ts`.
4. Run `vp run @var-ui/docs#test` — completeness gate must stay green.
