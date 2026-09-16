import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { writeMarkdownViews } from './write-markdown-views';

const temps: string[] = [];

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-ui-markdown-views-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temps.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

const routes = { docs: { prefix: '/docs', collection: 'docs' } };

function writeGettingStarted(root: string): void {
  const contentDir = path.join(root, 'content', 'docs');
  fs.mkdirSync(contentDir, { recursive: true });
  fs.writeFileSync(
    path.join(contentDir, 'getting-started.mdx'),
    '---\ntitle: Getting started\n---\n\n# Getting started\n',
  );
}

describe('writeMarkdownViews', () => {
  it('writes guide markdown, llms.txt, and extraPrefix rows', () => {
    const root = tmpDir();
    writeGettingStarted(root);
    fs.mkdirSync(path.join(root, 'public', 'components'), { recursive: true });
    fs.writeFileSync(path.join(root, 'public', 'components', 'button.md'), 'Triggers an action.\n');

    writeMarkdownViews({
      root,
      title: 'Example Docs',
      routes,
      markdownViews: { enabled: true, extraPrefixes: ['/components'] },
    });

    const guidePath = path.join(root, 'public', 'docs', 'getting-started.md');
    expect(fs.existsSync(guidePath)).toBe(true);
    const llms = fs.readFileSync(path.join(root, 'public', 'llms.txt'), 'utf8');
    expect(llms).toContain('# Example Docs');
    expect(llms).toContain('[Getting started](/docs/getting-started.md)');
    expect(llms).toContain('## Components');
    expect(llms).toContain('[button](/components/button.md)');
  });

  it('prepends an H1 when transform output does not start with #', () => {
    const root = tmpDir();
    const contentDir = path.join(root, 'content', 'docs');
    fs.mkdirSync(contentDir, { recursive: true });
    fs.writeFileSync(
      path.join(contentDir, 'getting-started.mdx'),
      '---\ntitle: Getting started\n---\n\nInstall Var UI.\n',
    );

    writeMarkdownViews({
      root,
      title: 'Example Docs',
      routes,
      markdownViews: { enabled: true, extraPrefixes: [] },
    });

    const written = fs.readFileSync(
      path.join(root, 'public', 'docs', 'getting-started.md'),
      'utf8',
    );
    expect(written.trimStart().startsWith('# Getting started\n\n')).toBe(true);
    expect(written).toContain('Install Var UI.');
    expect(written.match(/^# Getting started$/gm)).toEqual(['# Getting started']);
  });

  it('does not duplicate an H1 when transform output starts with leading whitespace', () => {
    const root = tmpDir();
    writeGettingStarted(root);

    writeMarkdownViews({
      root,
      title: 'Example Docs',
      routes,
      markdownViews: { enabled: true, extraPrefixes: [] },
    });

    const written = fs.readFileSync(
      path.join(root, 'public', 'docs', 'getting-started.md'),
      'utf8',
    );
    expect(written.match(/^# Getting started$/gm)).toEqual(['# Getting started']);
  });

  it('writes nothing when disabled', () => {
    const root = tmpDir();
    writeGettingStarted(root);

    writeMarkdownViews({
      root,
      title: 'Example Docs',
      routes,
      markdownViews: { enabled: false, extraPrefixes: [] },
    });

    expect(fs.existsSync(path.join(root, 'public', 'docs', 'getting-started.md'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'public', 'llms.txt'))).toBe(false);
  });
});
