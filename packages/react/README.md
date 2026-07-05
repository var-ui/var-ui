# @var-ui/react

React component library built with [typestyles](https://github.com/type-styles/typestyles) and [`@var-ui/core`](../core/README.md) tokens. Consumed by the docs site and `examples/vite-app`.

Framework-specific wrappers around accessible primitives ([React Aria Components](https://react-spectrum.adobe.com/react-aria/)) with typed variants, design tokens, and theme context.

## Install

```bash
pnpm add @var-ui/react @var-ui/core react react-dom react-aria-components typestyles
```

Within this monorepo:

```json
{
  "dependencies": {
    "@var-ui/react": "workspace:*"
  }
}
```

Peer dependencies: `react`, `react-dom`, `react-aria-components`, and `@var-ui/core`.

## Usage

```tsx
import { Button, DesignSystemProvider, layout, text } from '@var-ui/react';

export function App() {
  return (
    <DesignSystemProvider>
      <main className={layout({ stack: true })}>
        <h1 className={text({ title: true })}>Hello</h1>
        <Button intent="primary">Click me</Button>
      </main>
    </DesignSystemProvider>
  );
}
```

Import the package once in your **extraction entry** so all registrations land in production CSS:

```ts
// src/typestyles-entry.ts
import '@var-ui/react';
import './app-styles';
```

## Exports

| Category             | Examples                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **Components**       | `Button`, `Link`, `TextField`, `Checkbox`, `Switch`, `Select`, `Tabs`, `Dialog`, `Alert`, `CodeBlock`, … |
| **Layout utilities** | `layout`, `text` — re-exported from `@var-ui/core`                                                       |
| **Tokens**           | `designTokens`, `defaultTheme`, typed value exports                                                      |
| **Theming**          | `DesignSystemProvider`, `useDesignSystemTheme`                                                           |
| **Hooks**            | Re-exported from `./hooks`                                                                               |

Side effect on import: `globalBody` registers base document styles.

## Structure

```text
src/
  components/     # React Aria–based UI
  styles.ts       # re-exports layout + text from @var-ui/core
  tokens.ts       # Re-exports / aliases @var-ui/core tokens
  theme.tsx       # DesignSystemProvider
  globalBody.ts   # Document/reset registrations
  index.ts        # Public API
```

## Learn more

- [`@var-ui/core`](../core/README.md) — framework-agnostic tokens and recipes
- [Component libraries guide](https://typestyles.dev/docs/component-libraries)
- [Vite example](../../examples/vite-app/) — consumes this package
