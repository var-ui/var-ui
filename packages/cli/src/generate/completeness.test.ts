import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import type { Catalog } from '../types';
import { buildCatalog, defaultRepoPaths, findRepoRoot } from './build-catalog';
import { writeCatalogJson } from './write-docs-public';

describe('catalog completeness', () => {
  it('every registry slug has MDX and every Demo id has snippets', async () => {
    const repoRoot = findRepoRoot(process.cwd());
    const catalog = await buildCatalog(defaultRepoPaths(repoRoot), '0.1.0');
    expect(catalog.components.length).toBeGreaterThan(50);
    expect(catalog.guides.some((guide) => guide.id === 'getting-started')).toBe(true);

    const catalogPath = join(repoRoot, 'packages/cli/data/catalog.json');
    writeCatalogJson(catalog, catalogPath);
    const written = readFileSync(catalogPath, 'utf8');
    expect(written).toBe(`${JSON.stringify(catalog, null, 2)}\n`);
    const parsed = JSON.parse(written) as Catalog;
    expect(parsed.components.length).toBeGreaterThan(50);
  }, 60_000);
});
