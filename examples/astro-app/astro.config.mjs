import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import typestylesVite from '@typestyles/vite';
import { coreSrcAliases } from '../../scripts/core-src-aliases.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));

const devAliases = [
  ...coreSrcAliases(`${root}/packages/core/src`),
  { find: '@var-ui/astro', replacement: `${root}/packages/astro/index.ts` },
];

export default defineConfig(({ command }) => ({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    resolve: command === 'serve' ? { alias: devAliases } : undefined,
  },
}));
