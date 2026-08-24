import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const here = dirname(fileURLToPath(import.meta.url));

describe('tree RTL expand', () => {
  it('rotates the expanded toggle the opposite way under dir=rtl', () => {
    const src = readFileSync(join(here, 'tree.ts'), 'utf8');
    expect(src).toContain("'&[data-expanded]': { transform: 'rotate(90deg)' }");
    expect(src).toContain("'[dir=\"rtl\"] &[data-expanded]': { transform: 'rotate(-90deg)' }");
  });
});
