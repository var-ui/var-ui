# @var-ui/docs

Documentation site for the var-ui design system. Built with [Vocs](https://vocs.dev).

## Commands

| Command                       | Description                  |
| ----------------------------- | ---------------------------- |
| `vp run @var-ui/docs#dev`     | Start dev server             |
| `vp run @var-ui/docs#build`   | Static build to `docs/dist/` |
| `vp run @var-ui/docs#preview` | Preview production build     |

From the repo root you can also use `vp run docs:dev` via the root script aliases.

## Adding a component page

1. Add an entry to `src/data/components.ts`.
2. Run `pnpm scaffold:pages` (or hand-author `src/pages/components/<slug>.mdx`).
3. Add sidebar entry automatically via `vocs.config.ts` registry import.
4. Expand the page with multiple `<Demo>` blocks and accessibility notes.
