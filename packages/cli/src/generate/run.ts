import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error TS5097: Node generate entry imports siblings with a .ts extension
import { buildCatalog, defaultRepoPaths, findRepoRoot } from './build-catalog.ts';
// @ts-expect-error TS5097: Node generate entry imports siblings with a .ts extension
import { writeCatalogJson, writeDocsPublic } from './write-docs-public.ts';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findRepoRoot(here);
const paths = defaultRepoPaths(repoRoot);
const cliPackage = join(repoRoot, 'packages/cli');
const { version } = JSON.parse(readFileSync(join(cliPackage, 'package.json'), 'utf8')) as {
  version: string;
};

const catalog = await buildCatalog(paths, version);
writeCatalogJson(catalog, join(cliPackage, 'data/catalog.json'));

if (process.argv.includes('--write-docs-public')) {
  writeDocsPublic(catalog, paths.publicDir);
}
