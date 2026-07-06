import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { vocs } from 'vocs/vite';

const root = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  plugins: [react(), vocs()],
  resolve: {
    alias: {
      '@var-ui/core': `${root}/packages/core/src/index.ts`,
      '@var-ui/react': `${root}/packages/react/src/index.ts`,
      '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
