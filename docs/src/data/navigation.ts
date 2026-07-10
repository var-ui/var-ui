import { categoryLabels, componentRegistry } from './components';

export const githubUrl = 'https://github.com/var-ui/var-ui';

export const topNav = [
  { text: 'Docs', link: '/docs', match: '/docs' },
  { text: 'Components', link: '/components', match: '/components' },
  { text: 'Theming', link: '/theming', match: '/theming' },
] as const;

export const componentSidebar = Object.entries(categoryLabels).map(([category, label]) => ({
  text: label,
  items: componentRegistry
    .filter((c) => c.category === category)
    .map((c) => ({
      text: c.name,
      link: `/components/${c.slug}`,
    })),
}));

export const docsSidebar = [
  { text: 'Introduction', link: '/docs' },
  { text: 'Getting started', link: '/docs/getting-started' },
  { text: 'Installation', link: '/docs/installation' },
];

export const themingSidebar = [
  { text: 'Overview', link: '/theming' },
  { text: 'Design tokens', link: '/theming/tokens' },
  { text: 'Themes', link: '/theming/themes' },
];

export const sidebar = {
  '/components': componentSidebar,
  '/docs': docsSidebar,
  '/theming': themingSidebar,
} as const;
