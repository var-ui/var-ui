import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: [
      'src/index.ts',
      'src/internal.ts',
      'src/styles.ts',
      'src/base-styles.ts',
      'src/theme-constants.ts',
      'src/register-default-theme.ts',
    ],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    unbundle: true,
    deps: { neverBundle: ['typestyles'] },
  },
});
