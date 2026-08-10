import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

describe('extractThemeOnlyCss', () => {
  it('keeps @font-face and theme class rules in built theme CSS', () => {
    const trimmed = readFileSync(path.join(process.cwd(), 'public/themes/forest.css'), 'utf8');
    expect(trimmed).toContain('@font-face');
    expect(trimmed).toContain('.theme-var-ui-forest');
    expect(trimmed.length).toBeLessThan(50_000);
  });
});
