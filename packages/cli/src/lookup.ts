import type { Catalog, ComponentRecord, GuideRecord } from './types';

export function findComponent(catalog: Catalog, query: string): ComponentRecord | undefined {
  const q = query.toLowerCase();
  return catalog.components.find(
    (record) => record.name.toLowerCase() === q || record.slug.toLowerCase() === q,
  );
}

export function findGuide(catalog: Catalog, query: string): GuideRecord | undefined {
  const q = query.toLowerCase();
  return catalog.guides.find(
    (record) => record.id.toLowerCase() === q || record.title.toLowerCase() === q,
  );
}
