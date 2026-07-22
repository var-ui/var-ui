import type { Plugin, UserConfig } from 'vite';

type UnknownRecord = Record<string, unknown>;

function stripJsxFields(target: unknown): void {
  if (!target || typeof target !== 'object') return;

  const record = target as UnknownRecord;
  if ('jsx' in record) delete record.jsx;

  const transform = record.transform;
  if (transform && typeof transform === 'object' && 'jsx' in transform) {
    const { jsx: _jsx, ...rest } = transform as UnknownRecord;
    if (Object.keys(rest).length > 0) record.transform = rest;
    else delete record.transform;
  }
}

function stripOptimizeDepsJsx(config?: UserConfig['optimizeDeps']): void {
  if (!config) return;
  stripJsxFields(config as UnknownRecord);
  stripJsxFields((config as UnknownRecord).rolldownOptions);
  stripJsxFields((config as UnknownRecord).rollupOptions);
}

/**
 * `@netlify/vite-plugin` runs dependency pre-bundling through Rolldown. `@vitejs/plugin-react`
 * still injects legacy Rollup/Oxc `jsx` fields into optimize-deps and input options, which
 * Rolldown rejects (`Invalid key: jsx`). The React plugin's top-level `oxc.jsx` config is
 * enough — strip the redundant fields.
 */
export function rolldownJsxOptionsCompat(): Plugin {
  return {
    name: 'var-ui:rolldown-jsx-options-compat',
    enforce: 'post',
    config(config) {
      stripOptimizeDepsJsx(config.optimizeDeps);
      stripOptimizeDepsJsx(config.ssr?.optimizeDeps);
    },
    options(options) {
      stripJsxFields(options);
      return options;
    },
  };
}
