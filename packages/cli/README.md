# @var-ui/cli

CLI for discovering Var UI components, guides, and agent docs.

Install as a **dev dependency**. Invoke with `npx @var-ui/cli` or `pnpm dlx @var-ui/cli`.
Bare `npx var-ui` is unreliable (unscoped name). After install, add a
`"var-ui": "var-ui"` script so agents and humans can run `pnpm var-ui`.

## Install

```bash
pnpm add -D @var-ui/cli
```

```json
{
  "scripts": {
    "var-ui": "var-ui"
  }
}
```

## Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `var-ui init`      | Write the AGENTS.md block                  |
| `var-ui component` | Look up a component or list all            |
| `var-ui search`    | Ranked search across components and guides |
| `var-ui docs`      | Look up a guide or list all                |

```bash
npx @var-ui/cli --help
pnpm dlx @var-ui/cli component --list
```
