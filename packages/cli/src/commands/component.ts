import { categoryLabel } from '../category-labels';
import type { Catalog, ComponentRecord } from '../types';

export function unknownComponentMessage(query: string): string {
  return `Unknown component "${query}". Run \`var-ui component --list\`.\n`;
}

export function listComponents(catalog: Catalog): string {
  if (catalog.components.length === 0) {
    return '';
  }
  return `${catalog.components
    .map(
      (record) =>
        `${record.name}\t${record.slug}\t${categoryLabel(record.category)}\t${record.description}`,
    )
    .join('\n')}\n`;
}

export function formatComponent(record: ComponentRecord, json: boolean): string {
  if (json) {
    return `${JSON.stringify(record, null, 2)}\n`;
  }
  const body = stripLeadingHeading(record.markdown);
  const output = `# ${record.name}\n\n${record.importLine}\n\n${body}`;
  return output.endsWith('\n') ? output : `${output}\n`;
}

function stripLeadingHeading(markdown: string): string {
  return markdown.replace(/^\s*#[^\n]*\n?/, '').replace(/^\s+/, '');
}
