import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { defaultRepoPaths, findRepoRoot } from './build-catalog';

const temps: string[] = [];

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-ui-repo-root-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temps.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('findRepoRoot', () => {
  it('walks parents until pnpm-workspace.yaml exists', () => {
    const repoRoot = findRepoRoot(process.cwd());
    expect(fs.existsSync(path.join(repoRoot, 'pnpm-workspace.yaml'))).toBe(true);
  });

  it('throws when no workspace file is found', () => {
    expect(() => findRepoRoot(tmpDir())).toThrow(/repo root/i);
  });
});

describe('defaultRepoPaths', () => {
  it('joins the documented docs, demos, astro, props, and public paths', () => {
    const paths = defaultRepoPaths('/repo');
    expect(paths).toEqual({
      repoRoot: '/repo',
      docsContent: '/repo/docs/content',
      docsDemos: '/repo/docs/src/demos',
      astroComponents: '/repo/packages/astro/src/components',
      propsDir: '/repo/docs/src/generated/props',
      publicDir: '/repo/docs/public',
    });
  });
});
