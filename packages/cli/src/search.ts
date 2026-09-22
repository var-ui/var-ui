import type { Catalog, ComponentRecord, GuideRecord } from './types';

export type SearchHit = {
  kind: 'component' | 'guide';
  score: number;
  component?: ComponentRecord;
  guide?: GuideRecord;
};

export function scoreText(
  query: string,
  name: string,
  slug: string,
  description: string,
  category: string,
): number {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return 0;
  }

  const n = name.toLowerCase();
  const s = slug.toLowerCase();
  if (n === q || s === q) {
    return 100;
  }
  if (n.startsWith(q) || s.startsWith(q)) {
    return 50;
  }
  if (n.includes(q) || s.includes(q)) {
    return 25;
  }
  if (description.toLowerCase().includes(q) || category.toLowerCase().includes(q)) {
    return 10;
  }
  return 0;
}

function hitLabel(hit: SearchHit): string {
  return hit.kind === 'component' ? (hit.component?.name ?? '') : (hit.guide?.title ?? '');
}

export function searchCatalog(catalog: Catalog, query: string): SearchHit[] {
  if (query.trim().length === 0) {
    return [];
  }

  const hits: SearchHit[] = [];

  for (const record of catalog.components) {
    const score = scoreText(query, record.name, record.slug, record.description, record.category);
    if (score > 0) {
      hits.push({ kind: 'component', score, component: record });
    }
  }

  for (const record of catalog.guides) {
    const score = scoreText(query, record.title, record.id, record.description, '');
    if (score > 0) {
      hits.push({ kind: 'guide', score, guide: record });
    }
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const aLabel = hitLabel(a);
    const bLabel = hitLabel(b);
    if (aLabel < bLabel) {
      return -1;
    }
    if (aLabel > bLabel) {
      return 1;
    }
    return 0;
  });

  return hits.slice(0, 10);
}
