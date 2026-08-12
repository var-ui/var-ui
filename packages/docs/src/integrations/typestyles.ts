import typestylesVite from '@typestyles/vite';
import type { Plugin } from 'vite';

/** Wire `@typestyles/vite` for the configured extraction entry. */
export function vitePluginVarDocsTypestyles(entry: string): Plugin {
  return typestylesVite({
    extract: {
      modules: [entry],
    },
  }) as Plugin;
}
