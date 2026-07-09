import path from 'node:path';
import { fileURLToPath } from 'node:url';
import contentCollections from '@content-collections/vite';
import typestylesVite from '@typestyles/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { prerenderPaths } from './src/data/prerender-paths';
import { extractPropsPlugin } from './src/lib/extract-props-plugin';
import { splitDocModulesPlugin } from './src/lib/split-doc-modules';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

// Under vitest we only need JSX + the workspace aliases below — the MDX/content-collections
// pipeline and TanStack Start's SSR plugin start their own watchers/dev servers that don't
// tear down cleanly when driven by the test runner instead of `vite dev`/`vite build`.
const isTest = !!process.env.VITEST;

export default defineConfig({
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@var-ui/core': `${root}/packages/core/src/index.ts`,
      '@var-ui/react': `${root}/packages/react/src/index.ts`,
      '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
      '@': path.join(docsRoot, 'src'),
    },
  },
  plugins: isTest
    ? [react()]
    : [
        extractPropsPlugin(docsRoot),
        contentCollections(),
        splitDocModulesPlugin(docsRoot),
        tanstackStart({
          pages: prerenderPaths.map((pagePath) => ({
            path: pagePath,
            prerender: { enabled: true },
          })),
          prerender: {
            enabled: true,
            crawlLinks: true,
          },
        }),
        react(),
        typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } }),
      ],
});
