import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import type { Catalog } from '../types';
import { buildCatalog, defaultRepoPaths, findRepoRoot } from './build-catalog';

describe('catalog completeness', () => {
  it('every registry slug has MDX and every Demo id has snippets', async () => {
    const repoRoot = findRepoRoot(process.cwd());
    const { version } = JSON.parse(
      readFileSync(join(repoRoot, 'packages/cli/package.json'), 'utf8'),
    ) as {
      version: string;
    };
    const catalog = await buildCatalog(defaultRepoPaths(repoRoot), version);
    expect(catalog.components.length).toBeGreaterThan(50);
    expect(catalog.guides.some((guide) => guide.id === 'getting-started')).toBe(true);

    const catalogPath = join(repoRoot, 'packages/cli/data/catalog.json');
    const committed = JSON.parse(readFileSync(catalogPath, 'utf8')) as Catalog;
    expect(
      committed,
      'Committed packages/cli/data/catalog.json does not match generate output. Run `vp run -F @var-ui/cli generate`.',
    ).toEqual(catalog);
    expect(committed.components.length).toBeGreaterThan(50);
  }, 60_000);
});
