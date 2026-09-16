import type { Catalog, GuideRecord } from '../types';

export function unknownGuideMessage(query: string): string {
  return `Unknown guide "${query}". Run \`var-ui docs --list\`.\n`;
}

export function listGuides(catalog: Catalog): string {
  if (catalog.guides.length === 0) {
    return '';
  }
  return `${catalog.guides
    .map((record) => `${record.title}\t${record.id}\t${record.docsPath}`)
    .join('\n')}\n`;
}

export function formatGuide(record: GuideRecord, json: boolean): string {
  if (json) {
    return `${JSON.stringify(record, null, 2)}\n`;
  }
  return record.markdown.endsWith('\n') ? record.markdown : `${record.markdown}\n`;
}
