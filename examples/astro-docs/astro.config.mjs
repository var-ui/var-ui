import { fileURLToPath } from 'node:url';
import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import { defineConfig } from 'astro/config';
import { coreSrcAliases } from '../../scripts/core-src-aliases.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  output: 'static',
  integrations: [
    varDocs({
      title: 'Example Docs',
      theme: {
        defaultClassName: defaultThemeClassName,
        syntax: 'design-tokens',
        colorMode: { default: 'system', storageKey: 'theme-mode' },
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
      topNav: [{ text: 'Docs', link: '/docs', match: '/docs' }],
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['@var-ui/docs', '@var-ui/astro', '@var-ui/core'],
    },
    resolve: {
      alias: [
        ...coreSrcAliases(`${root}/packages/core/src`),
        { find: '@var-ui/astro', replacement: `${root}/packages/astro/index.ts` },
        { find: '@var-ui/docs/schema', replacement: `${root}/packages/docs/schema.ts` },
        { find: '@var-ui/docs/utils', replacement: `${root}/packages/docs/src/utils/index.ts` },
        {
          find: '@var-ui/docs/shiki',
          replacement: `${root}/packages/docs/src/utils/shiki-theme.ts`,
        },
        { find: '@var-ui/docs/middleware', replacement: `${root}/packages/docs/src/middleware.ts` },
        {
          find: '@var-ui/docs/DocsPage',
          replacement: `${root}/packages/docs/src/components/DocsPage.astro`,
        },
        {
          find: '@var-ui/docs/routes/guide.astro',
          replacement: `${root}/packages/docs/src/routes/guide.astro`,
        },
        { find: '@var-ui/docs', replacement: `${root}/packages/docs/index.ts` },
      ],
    },
  },
});
