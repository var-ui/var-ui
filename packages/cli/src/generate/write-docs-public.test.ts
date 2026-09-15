import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import type { Catalog, ComponentRecord, GuideRecord } from '../types';
import { writeCatalogJson, writeDocsPublic } from './write-docs-public';

const temps: string[] = [];

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-ui-docs-public-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temps.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function component(
  partial: Pick<ComponentRecord, 'slug' | 'name' | 'markdown'> & Partial<ComponentRecord>,
): ComponentRecord {
  return {
    category: 'action',
    description: 'Triggers an action or event.',
    importLine: "import { Button } from '@var-ui/react';",
    packages: ['react', 'core'],
    docsPath: `/components/${partial.slug}`,
    examples: [],
    props: [],
    ...partial,
  };
}

function guide(partial: Pick<GuideRecord, 'id' | 'title'>): GuideRecord {
  return {
    description: 'Install var-ui',
    docsPath: `/docs/${partial.id}`,
    markdown: `# ${partial.title}\n`,
    ...partial,
  };
}

function miniCatalog(overrides: Partial<Catalog> = {}): Catalog {
  return {
    version: '0.1.0',
    components: [
      component({
        slug: 'button',
        name: 'Button',
        markdown: '# Button\n\nTriggers an action or event.\n',
      }),
    ],
    guides: [guide({ id: 'getting-started', title: 'Getting started' })],
    ...overrides,
  };
}

describe('writeDocsPublic', () => {
  it('writes component markdown and index links, but not llms.txt', () => {
    const publicDir = tmpDir();
    writeDocsPublic(miniCatalog(), publicDir);

    const buttonPath = path.join(publicDir, 'components', 'button.md');
    const indexPath = path.join(publicDir, 'components', 'index.md');
    expect(fs.existsSync(buttonPath)).toBe(true);
    expect(fs.existsSync(indexPath)).toBe(true);
    expect(fs.readFileSync(buttonPath, 'utf8')).toContain('# Button');
    expect(fs.readFileSync(indexPath, 'utf8')).toContain('[Button](/components/button.md)');
    expect(fs.existsSync(path.join(publicDir, 'llms.txt'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'docs'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'theming'))).toBe(false);
  });

  it('prepends a heading when markdown does not start with #', () => {
    const publicDir = tmpDir();
    writeDocsPublic(
      miniCatalog({
        components: [
          component({
            slug: 'button',
            name: 'Button',
            markdown: 'Triggers an action or event.\n',
          }),
        ],
      }),
      publicDir,
    );

    expect(fs.readFileSync(path.join(publicDir, 'components', 'button.md'), 'utf8')).toBe(
      '# Button\n\nTriggers an action or event.\n',
    );
  });
});

describe('writeCatalogJson', () => {
  it('writes pretty JSON with a trailing newline', () => {
    const filePath = path.join(tmpDir(), 'catalog.json');
    const catalog = miniCatalog();
    writeCatalogJson(catalog, filePath);
    expect(fs.readFileSync(filePath, 'utf8')).toBe(`${JSON.stringify(catalog, null, 2)}\n`);
  });
});
