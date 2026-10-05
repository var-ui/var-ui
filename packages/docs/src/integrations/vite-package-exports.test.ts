import { resolve } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { buildVarDocsExportAliases } from './vite-package-exports';

const pkgRoot = resolve(import.meta.dirname, '../..');

describe('buildVarDocsExportAliases', () => {
  it('maps kit astro components including CodeBlock', () => {
    const aliases = buildVarDocsExportAliases(pkgRoot);
    expect(aliases.get('@var-ui/docs/CodeBlock')).toMatch(/CodeBlock\.astro$/);
    expect(aliases.get('@var-ui/docs/DocsPage')).toMatch(/DocsPage\.astro$/);
  });
});
