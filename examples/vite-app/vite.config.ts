import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import typestyles from '@typestyles/vite';
import { defineConfig, type UserConfig } from 'vite-plus';
import { coreSrcAliases } from '../../scripts/core-src-aliases.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  plugins: [...react(), typestyles({ extract: { modules: ['typestyles-entry.ts'] } })],
  resolve: {
    alias: [
      ...coreSrcAliases(`${root}/packages/core/src`),
      { find: '@var-ui/react', replacement: `${root}/packages/react/src/index.ts` },
      { find: '@var-ui/icons', replacement: `${root}/packages/icons/src/index.ts` },
    ],
  },
} as UserConfig);
