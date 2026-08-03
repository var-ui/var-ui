import { categoryLabels, componentRegistry } from '@/data/components';
import { docsSidebar, themingSidebar } from '@/data/navigation';

export type DocsSearchItem = {
  id: string;
  title: string;
  meta?: string;
  keywords?: string[];
  group?: string;
};

function sidebarItems(
  items: ReadonlyArray<{ text: string; link: string }>,
  meta: string,
  group: string,
): DocsSearchItem[] {
  return items.map((item) => ({
    id: item.link,
    title: item.text,
    meta,
    group,
  }));
}

/** Flat CommandPalette index from docs/theming sidebars and the component registry. */
export function buildDocsSearchIndex(): DocsSearchItem[] {
  const docs = sidebarItems(docsSidebar, 'Docs', 'Docs');
  const theming = sidebarItems(themingSidebar, 'Theming', 'Theming');
  const components = componentRegistry.map((entry) => ({
    id: `/components/${entry.slug}`,
    title: entry.name,
    meta: categoryLabels[entry.category],
    group: 'Components',
    keywords: [entry.slug, entry.category, entry.description],
  }));

  return [...docs, ...theming, ...components];
}
