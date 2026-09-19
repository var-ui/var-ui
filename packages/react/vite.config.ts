import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';
import { coreSrcAliases } from '../../scripts/core-src-aliases.mjs';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: coreSrcAliases(coreSrc),
  },
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: {
      neverBundle: ['react', 'react-dom', 'react-aria-components', '@var-ui/core', 'typestyles'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
