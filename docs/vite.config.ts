import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vitest-stub-astro',
      enforce: 'pre',
      load(id) {
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
    alias: {
      '@var-ui/core': `${root}/packages/core/src/index.ts`,
      '@var-ui/react': `${root}/packages/react/src/index.ts`,
      '@var-ui/icons': `${root}/packages/icons/src/index.ts`,
      '@var-ui/astro': `${root}/packages/astro/index.ts`,
      '@': path.join(docsRoot, 'src'),
    },
  },
});
