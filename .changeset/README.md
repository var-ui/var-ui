# var-ui

Changesets for this monorepo are managed with [Changesets](https://github.com/changesets/changesets).

Run `pnpm changeset` (or `vp exec changeset`) to add a new changeset when making user-facing changes to a published package (`@var-ui/core`, `@var-ui/react`, `@var-ui/form`, `@var-ui/icons`, `@var-ui/astro`, `@var-ui/docs`, or `@var-ui/docs-components`).

Packages stay on 0.x until we intentionally ship a stable 1.0. Use **patch** or **minor** only — never **major**. On 0.x, breaking changes are a minor bump. A major changeset would publish 1.0.0.
