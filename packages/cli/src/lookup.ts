import type { Catalog, ComponentRecord, GuideRecord } from './types';

export function findComponent(catalog: Catalog, query: string): ComponentRecord | undefined {
  const q = query.toLowerCase();
  return catalog.components.find(
    (record) => record.name.toLowerCase() === q || record.slug.toLowerCase() === q,
  );
}

export function findGuide(catalog: Catalog, query: string): GuideRecord | undefined {
  const q = query.toLowerCase();
  const matches = catalog.guides.filter((record) => {
    const id = record.id.toLowerCase();
    const title = record.title.toLowerCase();
    const docsPath = record.docsPath.toLowerCase();
    return id === q || title === q || docsPath === q || docsPath === `/${q}`;
  });
  return matches.length === 1 ? matches[0] : undefined;
}
