import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Catalog } from '../types';

export function writeDocsPublic(catalog: Catalog, publicDir: string): void {
  const componentsDir = join(publicDir, 'components');
  mkdirSync(componentsDir, { recursive: true });

  for (const component of catalog.components) {
    const body = component.markdown.startsWith('#')
      ? component.markdown
      : `# ${component.name}\n\n${component.markdown}`;
    writeFileSync(join(componentsDir, `${component.slug}.md`), body);
  }

  const index = `${catalog.components
    .map((component) => `- [${component.name}](/components/${component.slug}.md)`)
    .join('\n')}\n`;
  writeFileSync(join(componentsDir, 'index.md'), index);
}

export function writeCatalogJson(catalog: Catalog, filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(catalog, null, 2)}\n`);
}
