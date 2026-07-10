# var-ui

A design system monorepo powered by [Vite+](https://viteplus.dev/) and [Oxc](https://oxc.rs/) (Oxlint + Oxfmt).

## Prerequisites

Install the Vite+ CLI globally:

```bash
curl -fsSL https://vite.plus | bash
```

Restart your terminal, then verify with `vp help`.

Set up git hooks (one-time per clone):

```bash
vp config --hooks --no-agent
```

## Commands

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `vp install`      | Install dependencies                  |
| `vp check`        | Format, lint, and type-check          |
| `vp check --fix`  | Auto-fix formatting and lint issues   |
| `vp test run`     | Run tests                             |
| `vp run -r build` | Build all publishable packages        |
| `vp run -r pack`  | Alias for package builds              |
| `vp dev`          | Start the example Vite app            |
| `vp run ready`    | Full validation: check → test → build |

Configuration lives in the root `vite.config.ts` — lint (Oxlint), formatting (Oxfmt), staged-file checks, Vitest projects, and task caching are all defined there. Per-package `vite.config.ts` files hold `vp pack` settings.

## Packages

| Package                    | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `@var-ui/core`             | Framework-agnostic tokens and component styles |
| `@var-ui/react`            | React bindings (React Aria Components)         |
| `@var-ui/example-vite-app` | Example consumer app (`examples/vite-app`)     |
| `@var-ui/docs`             | Documentation site (Vocs)                      |

## Publishing

Versioning uses [Changesets](https://github.com/changesets/changesets). Add a changeset with `vp exec changeset` before merging user-facing changes. The release workflow publishes `@var-ui/core` and `@var-ui/react` to npm when changesets are merged on `main`.

## Agent integration

See [AGENTS.md](./AGENTS.md) for Vite+ workflow notes for coding agents.
