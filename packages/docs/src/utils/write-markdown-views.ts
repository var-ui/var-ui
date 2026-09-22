import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import type { VarDocsConfig } from '../config';
import { normalizeDocsPath } from './docs-toc';
import { publicMarkdownRelPath, type ResolvedMarkdownViews } from './markdown-href';
import { transformMdx } from './transform-mdx';

export type { ResolvedMarkdownViews };

export function writeMarkdownViews(opts: {
  root: string;
  title: string;
  routes: NonNullable<VarDocsConfig['routes']>;
  markdownViews: ResolvedMarkdownViews;
}): void {
  if (!opts.markdownViews.enabled) {
    return;
  }

  const guideEntries: { title: string; href: string }[] = [];

  for (const route of Object.values(opts.routes)) {
    const collectionDir = join(opts.root, 'content', route.collection);
    for (const filePath of listMarkdownFiles(collectionDir)) {
      const source = readFileSync(filePath, 'utf8');
      const transformed = transformMdx({
        source,
        snippets: {},
        props: [],
        filePath,
      });
      const id = posixRelative(collectionDir, filePath).replace(/\.(md|mdx)$/, '');
      const prefix = normalizeDocsPath(route.prefix);
      const docsPath = id === 'index' ? prefix : `${prefix}/${id}`;
      const heading = transformed.title || id.split('/').pop() || id;
      const body = transformed.markdown.trimStart().startsWith('#')
        ? transformed.markdown
        : `# ${heading}\n\n${transformed.markdown}`;
      const outRel = publicMarkdownRelPath(docsPath);
      const outPath = join(opts.root, 'public', outRel);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, body);
      guideEntries.push({ title: heading, href: `/${outRel}` });
    }
  }

  const lines = [`# ${opts.title}`, ''];
  if (opts.markdownViews.tagline) {
    lines.push(`> ${opts.markdownViews.tagline}`, '');
  }
  lines.push('## Guides', '');
  for (const entry of guideEntries) {
    lines.push(`- [${entry.title}](${entry.href})`);
  }

  for (const extra of opts.markdownViews.extraPrefixes) {
    const prefix = extra.replace(/^\//, '');
    const dir = join(opts.root, 'public', prefix);
    if (!existsSync(dir)) {
      continue;
    }

    const files = readdirSync(dir)
      .filter((name) => name.endsWith('.md'))
      .sort();
    const pages = files.filter((name) => name !== 'index.md');
    const sectionTitle = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const hasIndex = files.includes('index.md');

    lines.push('');
    lines.push(hasIndex ? `## [${sectionTitle}](/${prefix}/index.md)` : `## ${sectionTitle}`);
    lines.push('');
    for (const file of pages) {
      const body = readFileSync(join(dir, file), 'utf8');
      const heading = body.match(/^# (.+)$/m)?.[1];
      const name = file.replace(/\.md$/, '');
      lines.push(`- [${heading ?? name}](/${prefix}/${file})`);
    }
  }

  lines.push('');
  const llmsPath = join(opts.root, 'public', 'llms.txt');
  mkdirSync(dirname(llmsPath), { recursive: true });
  writeFileSync(llmsPath, lines.join('\n'));
}

function listMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !/\.(md|mdx)$/.test(entry.name)) {
      continue;
    }
    files.push(join(entry.parentPath, entry.name));
  }
  return files.sort();
}

function posixRelative(from: string, to: string): string {
  return relative(from, to).split(sep).join('/');
}
