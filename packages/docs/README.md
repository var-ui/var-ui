# `@var-ui/docs`

Astro documentation kit **built with Var UI** — for general technical docs sites
(and design-system catalogs via optional plugins).

Chrome uses `@var-ui/astro` + typestyles. Theming DX matches apps:
`createDesignTheme()` drives shell, prose, and **syntax highlighting**
(`syntax: 'design-tokens'` → `color.code.*`).

## Minimal usage (guide-only site)

```js
import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    varDocs({
      title: 'My Docs',
      theme: {
        defaultClassName: defaultThemeClassName,
        // Default — fenced code tracks the active design theme.
        syntax: 'design-tokens',
      },
      typestyles: {
        entry: 'typestyles-entry.ts',
      },
      routes: {
        docs: { prefix: '/docs', collection: 'docs' },
      },
      components: {
        Layout: './src/layouts/BaseLayout.astro',
      },
    }),
  ],
});
```

`varDocs()` wires:

- Config validation (`title`, `theme` incl. optional `presets`, `typestyles`, free-form `routes`, `components`)
- `@typestyles/vite` extraction for the configured entry
- Design-token Shiki theme for MDX fenced code (theme-owned `color.code.*`)
- Lazy showcase theme CSS in dev + `astro:build:start` extract when `theme.presets` includes `lazyCss` entries
- `@astrojs/mdx` + `rehype-slug` when MDX is not already registered
- `virtual:var-docs/config` (+ Layout / MDX component virtual modules)
- Optional injected guide routes + middleware (disable on Netlify SSR sites)

### Showcase presets

```js
varDocs({
  title: 'My Docs',
  theme: {
    defaultClassName: defaultThemeClassName,
    syntax: 'design-tokens',
    presets: [
      { id: 'default', label: 'Default', className: defaultThemeClassName, lazyCss: false },
      { id: 'forest', label: 'Forest', className: forestTheme.className, swatch: '#16a34a' },
    ],
  },
  typestyles: { entry: 'typestyles-entry.ts' },
});
```

Add a preset: theme module + `typestyles-themes/{id}.ts` + one `presets` entry (no hardcoded script ID lists).

Design-system features (demos, props tables, framework switcher, theme playground)
belong in `@var-ui/docs-components` / `@var-ui/docs-playground` — not this package.

## Content collections

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@var-ui/docs/schema';

export const collections = {
  docs: defineCollection({
    loader: glob({ base: './content/docs', pattern: '**/*.{md,mdx}' }),
    schema: docsSchema(),
  }),
};
```

Add more guide collections as needed and map them in `routes` — e.g. Var UI docs
adds `theming`; a library might add `api` or `guides`. Use `matchGuideRoute()` from
`@var-ui/docs/utils` to map URLs → collection entries.

## Shell components

```astro
---
import DocsPage from '@var-ui/docs/DocsPage';
---

<DocsPage
  title="My Docs"
  themeClassName={defaultThemeClassName}
  topNav={topNav}
  sidebarSections={sidebarSections}
  searchItems={searchItems}
>
  <article slot="default">…</article>
</DocsPage>
```

See `docs/superpowers/specs/2026-08-11-var-docs-kit-design.md`.
