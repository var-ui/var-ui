// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const ROOTS: { label: string; dir: string; extensions: string[] }[] = [
  {
    label: 'packages/react/src',
    dir: join(repoRoot, 'packages/react/src'),
    extensions: ['.ts', '.tsx'],
  },
  {
    label: 'packages/astro/src',
    dir: join(repoRoot, 'packages/astro/src'),
    extensions: ['.ts', '.tsx', '.astro', '.js'],
  },
];

const BARREL_FROM = /\b(import|export)(\s+type)?\s+([^;]*?)\sfrom\s+(['"])@var-ui\/core\4/g;
const SIDE_EFFECT_IMPORT = /\bimport\s+(['"])@var-ui\/core\1/g;

function walk(dir: string, extensions: string[], files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, extensions, files);
      continue;
    }
    if (extensions.some((ext) => name.endsWith(ext))) files.push(path);
  }
  return files;
}

function runtimeBarrelImports(source: string): string[] {
  const hits: string[] = [];
  for (const match of source.matchAll(BARREL_FROM)) {
    const typeOnly = Boolean(match[2]);
    if (!typeOnly) hits.push(match[0].replace(/\s+/g, ' ').trim());
  }
  for (const match of source.matchAll(SIDE_EFFECT_IMPORT)) {
    hits.push(match[0]);
  }
  return hits;
}

describe('react/astro runtime imports of @var-ui/core', () => {
  it('only use import type / export type for the main entry', () => {
    const failures: string[] = [];
    for (const root of ROOTS) {
      for (const file of walk(root.dir, root.extensions)) {
        const source = readFileSync(file, 'utf8');
        const hits = runtimeBarrelImports(source);
        if (hits.length === 0) continue;
        const rel = relative(repoRoot, file);
        for (const hit of hits) failures.push(`${rel}: ${hit}`);
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
});
