import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Catalog } from './types';

const defaultCatalogPath = fileURLToPath(new URL('../data/catalog.json', import.meta.url));

export function loadCatalog(fromDir?: string): Catalog {
  const filePath = fromDir ? join(fromDir, 'data/catalog.json') : defaultCatalogPath;
  if (!existsSync(filePath)) {
    throw new Error('catalog.json missing; reinstall @var-ui/cli');
  }
  return JSON.parse(readFileSync(filePath, 'utf8')) as Catalog;
}
