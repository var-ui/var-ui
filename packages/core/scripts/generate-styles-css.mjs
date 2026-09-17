#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTypestylesBuild } from '@typestyles/build-runner';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist');
const needles = ['.var-ui-button', '.theme-var-ui-default', '@property --var-ui-'];
const minBytes = 10_000;

const css = await runTypestylesBuild({
  root,
  modules: ['src/styles.ts'],
});

const bytes = Buffer.byteLength(css, 'utf8');
if (bytes < minBytes) {
  throw new Error(`Generated styles.css is too small (${bytes} bytes)`);
}

for (const needle of needles) {
  if (!css.includes(needle)) {
    throw new Error(`Generated styles.css missing required substring: ${needle}`);
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'styles.css'), css);
process.stdout.write(
  `Wrote ${path.join(outDir, 'styles.css')} (${(bytes / 1024).toFixed(1)} KB)\n`,
);
