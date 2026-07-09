import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Plugin } from 'vite';

type DocRecord = {
  slug: string;
  title: string;
  description: string;
  mdx: string;
  headings: unknown;
};

const collections = [
  { name: 'components', file: 'allComponents.js' },
  { name: 'docs', file: 'allDocs.js' },
  { name: 'theming', file: 'allThemings.js' },
] as const;

let splitPromise: Promise<void> | null = null;

export async function splitDocModules(root: string) {
  const generatedRoot = path.join(root, '.content-collections/generated');
  const slugsRoot = path.join(root, '.content-collections/slugs');

  for (const { name, file } of collections) {
    const sourcePath = path.join(generatedRoot, file);

    try {
      await fs.access(sourcePath);
    } catch {
      continue;
    }

    const module = await import(pathToFileURL(sourcePath).href);
    const docs = module.default as DocRecord[];
    const outDir = path.join(slugsRoot, name);

    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });

    await Promise.all(
      docs.map(async (doc) => {
        const payload = {
          slug: doc.slug,
          title: doc.title,
          description: doc.description,
          mdx: doc.mdx,
          headings: doc.headings,
        };

        await fs.writeFile(path.join(outDir, `${doc.slug}.json`), JSON.stringify(payload));
      }),
    );
  }
}

function scheduleSplit(root: string) {
  splitPromise = splitPromise
    ? splitPromise.then(() => splitDocModules(root))
    : splitDocModules(root);

  return splitPromise;
}

export function splitDocModulesPlugin(root: string): Plugin {
  return {
    name: 'split-doc-modules',
    enforce: 'post',
    async buildStart() {
      await scheduleSplit(root);
    },
    configureServer(server) {
      const generatedRoot = path.join(root, '.content-collections/generated');
      server.watcher.add(generatedRoot);
      server.watcher.on('add', (file) => {
        if (
          file.endsWith('allComponents.js') ||
          file.endsWith('allDocs.js') ||
          file.endsWith('allThemings.js')
        ) {
          void scheduleSplit(root);
        }
      });
      server.watcher.on('change', (file) => {
        if (
          file.endsWith('allComponents.js') ||
          file.endsWith('allDocs.js') ||
          file.endsWith('allThemings.js')
        ) {
          void scheduleSplit(root);
        }
      });
    },
  };
}
