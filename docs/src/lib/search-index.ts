import { categoryLabels, componentRegistry } from '@/data/components';
import { docsSidebar, playgroundSidebar, themingSidebar } from '@/data/navigation';
import type { DocsSearchItem } from '@var-ui/docs/utils';

export type { DocsSearchItem };

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
  const playground = sidebarItems(playgroundSidebar, 'Playground', 'Playground');
  const components = componentRegistry.map((entry) => ({
    id: `/components/${entry.slug}`,
    title: entry.name,
    meta: categoryLabels[entry.category],
    group: 'Components',
    keywords: [entry.slug, entry.category, entry.description],
  }));

  return [...docs, ...theming, ...playground, ...components];
}
