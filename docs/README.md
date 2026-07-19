# @var-ui/docs

Documentation site for the var-ui design system. Built with [Astro](https://astro.build) and deployed via the [Netlify adapter](https://docs.astro.build/en/guides/integrations-guide/netlify/) (`output: 'server'`).

## Commands

| Command                       | Description                       |
| ----------------------------- | --------------------------------- |
| `vp run @var-ui/docs#dev`     | Start Astro dev server            |
| `vp run @var-ui/docs#build`   | Build for Netlify to `docs/dist/` |
| `vp run @var-ui/docs#preview` | Preview production build          |
| `vp run @var-ui/docs#check`   | Astro / TypeScript check          |
| `vp run @var-ui/docs#test`    | Docs unit tests (Vitest)          |

From the repo root you can also use `vp run docs:dev` / `docs:build` / `docs:preview`.

## Adding a component page

1. Add MDX under `content/components/<slug>.mdx`.
2. Register demos in `src/demos/registry.ts` (and Astro/HTML maps as needed).
3. Wire the slug in `src/pages/components/[slug].astro` when the page is DemoHost-ready.
4. Add a sidebar entry in `src/data/navigation.ts`.
