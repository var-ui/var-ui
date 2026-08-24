import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const here = dirname(fileURLToPath(import.meta.url));

describe('breadcrumbs RTL', () => {
  it('uses logical margin for the separator', () => {
    const src = readFileSync(join(here, 'breadcrumbs.ts'), 'utf8');
    expect(src).toContain('marginInlineStart');
    expect(src).not.toContain('marginLeft');
  });
});
