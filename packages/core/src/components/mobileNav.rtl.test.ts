import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const here = dirname(fileURLToPath(import.meta.url));

describe('mobileNav RTL', () => {
  it('flips closed translateX under dir=rtl', () => {
    const src = readFileSync(join(here, 'mobileNav.ts'), 'utf8');
    expect(src).toContain('[dir="rtl"]');
    expect(src).toContain('translateX(100%)');
    expect(src).toContain('translateX(-100%)');
  });
});
