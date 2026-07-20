import type { DocsSearchItem } from './search-index';

export type DocsSearchGroupId = 'docs' | 'components' | 'theming';

export type DocsSearchGroup = {
  id: DocsSearchGroupId;
  label: string;
  items: DocsSearchItem[];
};

const GROUP_ORDER: DocsSearchGroupId[] = ['docs', 'components', 'theming'];

const GROUP_LABELS: Record<DocsSearchGroupId, string> = {
  docs: 'Docs',
  components: 'Components',
  theming: 'Theming',
};

export function matchDocsSearchItem(item: DocsSearchItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.title.toLowerCase().includes(q)) return true;
  if (item.meta?.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) return true;
  return false;
}

export function filterDocsSearchItems(
  items: ReadonlyArray<DocsSearchItem>,
  query: string,
): DocsSearchItem[] {
  return items.filter((item) => matchDocsSearchItem(item, query));
}

export function docsSearchGroupId(item: DocsSearchItem): DocsSearchGroupId {
  if (item.meta === 'Theming' || item.id.startsWith('/theming')) return 'theming';
  if (item.meta === 'Docs' || item.id.startsWith('/docs')) return 'docs';
  return 'components';
}

/** Group filtered items into Docs / Components / Theming (empty groups omitted). */
export function groupDocsSearchResults(items: ReadonlyArray<DocsSearchItem>): DocsSearchGroup[] {
  const buckets: Record<DocsSearchGroupId, DocsSearchItem[]> = {
    docs: [],
    components: [],
    theming: [],
  };

  for (const item of items) {
    buckets[docsSearchGroupId(item)].push(item);
  }

  return GROUP_ORDER.filter((id) => buckets[id].length > 0).map((id) => ({
    id,
    label: GROUP_LABELS[id],
    items: buckets[id],
  }));
}

/** Flatten groups in display order for keyboard navigation. */
export function flattenDocsSearchGroups(groups: ReadonlyArray<DocsSearchGroup>): DocsSearchItem[] {
  return groups.flatMap((group) => group.items);
}

export function moveDocsSearchActiveIndex(
  activeIndex: number,
  length: number,
  direction: 'up' | 'down',
): number {
  if (length <= 0) return -1;
  if (activeIndex < 0) return direction === 'down' ? 0 : length - 1;
  if (direction === 'down') return (activeIndex + 1) % length;
  return (activeIndex - 1 + length) % length;
}
