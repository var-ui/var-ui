import path from 'node:path';
import type { Plugin } from 'vite';
import { writeComponentProps } from './extract-component-props';

export function extractPropsPlugin(docsRoot: string): Plugin {
  const outputDir = path.join(docsRoot, 'src/generated/props');

  const run = () => {
    writeComponentProps(outputDir);
  };

  return {
    name: 'var-ui-extract-props',
    enforce: 'pre',
    buildStart() {
      run();
    },
    configureServer(server) {
      const reactSrc = path.resolve(docsRoot, '../packages/react/src');

      server.watcher.add(reactSrc);
      server.watcher.on('change', (file) => {
        if (file.startsWith(reactSrc) && file.endsWith('.tsx')) {
          run();
        }
      });
    },
  };
}
