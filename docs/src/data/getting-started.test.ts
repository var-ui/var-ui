import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const gettingStarted = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../content/docs/getting-started.mdx'),
  'utf8',
);
const installation = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../content/docs/installation.mdx'),
  'utf8',
);

describe('getting-started copy', () => {
  it('has copy-paste npm install and no stub sentence', () => {
    expect(gettingStarted).toContain('pnpm add @var-ui/react');
    expect(gettingStarted).toContain('@typestyles/vite');
    expect(gettingStarted).toContain("import '@var-ui/core/styles'");
    expect(gettingStarted).toContain('DesignSystemProvider');
    expect(gettingStarted).toContain('IconProvider');
    expect(gettingStarted).toContain('LayerProvider');
    expect(gettingStarted).toContain('<Button>');
    expect(gettingStarted).not.toContain('follow-up pass');
  });
});

describe('installation copy', () => {
  it('documents npm packages instead of unpublished workspace-only install', () => {
    expect(installation).toContain('@var-ui/cli');
    expect(installation).not.toContain('before the first public release');
  });
});
