import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEMO_ID_RE = /<Demo\s+id=["']([^"']+)["']/g;
const LEGACY_PATH = '/_legacy/';

function getContentRoot(): string {
  try {
    const docsRoot = fileURLToPath(new URL('../..', import.meta.url));
    return path.join(docsRoot, 'content');
  } catch {
    return path.join(process.cwd(), 'docs/content');
  }
}

function walkMdxFiles(dir: string, files: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (fullPath.includes(LEGACY_PATH)) {
      continue;
    }
    if (entry.isDirectory()) {
      walkMdxFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
}

export function collectMdxDemoIds(): string[] {
  const ids = new Set<string>();
  const mdxFiles: string[] = [];
  walkMdxFiles(getContentRoot(), mdxFiles);

  for (const filePath of mdxFiles) {
    const source = readFileSync(filePath, 'utf8');
    for (const match of source.matchAll(DEMO_ID_RE)) {
      ids.add(match[1]!);
    }
  }

  return [...ids].sort();
}
