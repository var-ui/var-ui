import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { coreSrcAliases } from '../scripts/core-src-aliases.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    ...react(),
    {
      name: 'vitest-stub-astro',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'astro:transitions/client') {
          return '\0astro-transitions-client-stub';
        }
        if (id === 'virtual:homepage-preloads') {
          return '\0virtual-homepage-preloads-stub';
        }
      },
      load(id) {
        if (id === '\0virtual-homepage-preloads-stub') {
          return 'export default [];';
        }
        if (id === '\0astro-transitions-client-stub') {
          return 'export const navigate = () => Promise.resolve();';
        }
        // Keep `?raw` imports intact for Astro Props/slots extraction in tests.
        if (id.includes('.astro') && !id.includes('?raw') && !id.includes('&raw')) {
          return 'export default function AstroStub() { return null; }';
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: [
      ...coreSrcAliases(`${root}/packages/core/src`),
      { find: '@var-ui/react', replacement: `${root}/packages/react/src/index.ts` },
      { find: '@var-ui/icons', replacement: `${root}/packages/icons/src/index.ts` },
      { find: '@var-ui/astro', replacement: `${root}/packages/astro/index.ts` },
      { find: '@var-ui/docs/schema', replacement: `${root}/packages/docs/schema.ts` },
      { find: '@var-ui/docs/utils', replacement: `${root}/packages/docs/src/utils/index.ts` },
      { find: '@var-ui/docs/shiki', replacement: `${root}/packages/docs/src/utils/shiki-theme.ts` },
      { find: '@var-ui/docs/middleware', replacement: `${root}/packages/docs/src/middleware.ts` },
      {
        find: '@var-ui/docs/DocsPage',
        replacement: `${root}/packages/docs/src/components/DocsPage.astro`,
      },
      {
        find: '@var-ui/docs/DocsSearch',
        replacement: `${root}/packages/docs/src/components/DocsSearch.astro`,
      },
      {
        find: '@var-ui/docs/DocsSidebar',
        replacement: `${root}/packages/docs/src/components/DocsSidebar.astro`,
      },
      {
        find: '@var-ui/docs/DocsToc',
        replacement: `${root}/packages/docs/src/components/DocsToc.astro`,
      },
      {
        find: '@var-ui/docs/DocsThemePicker',
        replacement: `${root}/packages/docs/src/components/DocsThemePicker.astro`,
      },
      {
        find: '@var-ui/docs/DocsThemeScript',
        replacement: `${root}/packages/docs/src/components/DocsThemeScript.astro`,
      },
      { find: '@var-ui/docs', replacement: `${root}/packages/docs/index.ts` },
      {
        find: '@var-ui/docs-components/framework',
        replacement: `${root}/packages/docs-components/src/framework.ts`,
      },
      {
        find: '@var-ui/docs-components/scripts/frameworkSwitcher',
        replacement: `${root}/packages/docs-components/src/scripts/frameworkSwitcher.ts`,
      },
      {
        find: '@var-ui/docs-components/scripts/componentPageTabs',
        replacement: `${root}/packages/docs-components/src/scripts/componentPageTabs.ts`,
      },
      { find: '@var-ui/docs-components', replacement: `${root}/packages/docs-components/index.ts` },
      { find: '@', replacement: path.join(docsRoot, 'src') },
    ],
  },
});
