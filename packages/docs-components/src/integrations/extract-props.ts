import path from 'node:path';
import type { Plugin } from 'vite';

export type ExtractPropsPluginOptions = {
  /** Astro project root (absolute). */
  root: string;
  /** Writes props JSON into the absolute output directory. */
  write: (outputDir: string) => void | Promise<void>;
  /** Output directory relative to root. */
  outputDir: string;
  /** Paths relative to root to watch in dev. */
  watch?: readonly string[];
};

/** Vite plugin that regenerates component props JSON via a consumer write callback. */
export function extractPropsPlugin(options: ExtractPropsPluginOptions): Plugin {
  const outputDir = path.resolve(options.root, options.outputDir);
  const watchRoots = (options.watch ?? []).map((p) =>
    path.isAbsolute(p) ? p : path.resolve(options.root, p),
  );

  let writing: Promise<void> | null = null;

  const run = async () => {
    if (writing) return writing;
    writing = Promise.resolve(options.write(outputDir)).finally(() => {
      writing = null;
    });
    return writing;
  };

  return {
    name: 'var-docs-components-extract-props',
    enforce: 'pre',
    async buildStart() {
      await run();
    },
    configureServer(server) {
      for (const root of watchRoots) {
        server.watcher.add(root);
      }
      server.watcher.on('change', (file) => {
        if (!watchRoots.some((root) => file.startsWith(root))) return;
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
        void run();
      });
    },
  };
}
