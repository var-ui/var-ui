import type { DocsSearchItem, SidebarSection } from '@var-ui/docs';

export const docsSidebarSections: SidebarSection[] = [
  {
    title: 'Guides',
    items: [
      { text: 'Overview', link: '/docs' },
      { text: 'Getting started', link: '/docs/getting-started' },
      { text: 'Installation', link: '/docs/installation' },
    ],
  },
];

export const docsSearchItems: DocsSearchItem[] = [
  {
    id: 'docs',
    title: 'Documentation',
    meta: 'Overview',
    keywords: ['docs', 'guides'],
    group: 'Guides',
  },
  {
    id: 'getting-started',
    title: 'Getting started',
    meta: 'Guides',
    keywords: ['start', 'quickstart'],
    group: 'Guides',
  },
  {
    id: 'installation',
    title: 'Installation',
    meta: 'Guides',
    keywords: ['install', 'packages', 'deps'],
    group: 'Guides',
  },
];
