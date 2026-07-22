import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import typestylesVite from '@typestyles/vite';
import { defineConfig } from 'astro/config';
import { extractPropsPlugin } from './src/lib/extract-props-plugin.ts';
import { rolldownJsxOptionsCompat } from './src/lib/rolldown-jsx-options.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [mdx(), react()],
  vite: {
    plugins: [
      extractPropsPlugin(docsRoot),
      typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } }),
      rolldownJsxOptionsCompat(),
    ],
    resolve: {
      alias: {
        '@var-ui/core': `${root}/packages/core/src/index.ts`,
        '@var-ui/react': `${root}/packages/react/src/index.ts`,
        '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
        '@var-ui/astro': `${root}/packages/astro/index.ts`,
        '@': `${docsRoot}/src`,
      },
    },
  },
});
