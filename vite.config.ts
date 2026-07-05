import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    ignorePatterns: ['**/node_modules/**', 'dist/**', '**/__snapshots__/**'],
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ['**/node_modules/**', 'dist/**', '**/__snapshots__/**'],
    plugins: ['typescript'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    overrides: [
      {
        files: ['packages/react/**', 'examples/**'],
        plugins: ['typescript', 'react'],
      },
      {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        plugins: ['typescript', 'vitest'],
      },
      {
        files: ['packages/core/**'],
        jsPlugins: [{ name: 'typestyles', specifier: '@typestyles/eslint-plugin' }],
        rules: {
          'typestyles/no-removed-public-classname': [
            'error',
            { snapshotFile: 'packages/core/.typestyles-public-classnames.json' },
          ],
        },
      },
    ],
  },
  staged: {
    '*.{js,jsx,ts,tsx,json,css,md}': 'vp check --fix',
  },
  run: {
    cache: true,
  },
  test: {
    projects: ['packages/core', 'packages/react'],
  },
});
