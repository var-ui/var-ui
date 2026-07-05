import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts', 'src/components/codeHighlight.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    deps: { neverBundle: ['typestyles'] },
  },
});
