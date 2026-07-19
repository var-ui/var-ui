import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import typestylesVite from '@typestyles/vite';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    resolve: {
      alias: {
        '@var-ui/core': `${root}/packages/core/src/index.ts`,
        '@var-ui/astro': `${root}/packages/astro/index.ts`,
      },
    },
  },
});
