import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [
    {
      name: 'vitest-stub-astro',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'astro:transitions/client') {
          return '\0astro-transitions-client-stub';
        }
      },
      load(id) {
        if (id === '\0astro-transitions-client-stub') {
          return 'export const navigate = () => Promise.resolve();';
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
  },
});
