import { categoryLabels, componentRegistry, type ComponentCategory } from './components';

export const githubUrl = 'https://github.com/var-ui/var-ui';

export const topNav = [
  { text: 'Docs', link: '/docs/getting-started', match: '/docs' },
  { text: 'Components', link: '/components', match: '/components' },
  { text: 'Theming', link: '/theming', match: '/theming' },
] as const;

export type SidebarItem = {
  text: string;
  link: string;
};

export type SidebarSection = {
  title: string;
  items: readonly SidebarItem[];
};

export const docsSidebar = [{ text: 'Getting started', link: '/docs/getting-started' }] as const;

export const themingSidebarSections: readonly SidebarSection[] = [
  {
    title: 'Theming',
    items: [
      { text: 'Overview', link: '/theming' },
      { text: 'Customize', link: '/theming/customize' },
      { text: 'Themes', link: '/theming/themes' },
      { text: 'Design tokens', link: '/theming/tokens' },
    ],
  },
] as const;

const componentCategoryOrder = [
  'action',
  'data-input',
  'feedback',
  'overlay',
  'layout',
  'content',
  'container',
  'chat',
] as const satisfies readonly ComponentCategory[];

export const componentSidebarSections: readonly SidebarSection[] = componentCategoryOrder
  .map((category) => ({
    title: categoryLabels[category],
    items: componentRegistry
      .filter((entry) => entry.category === category)
      .map((entry) => ({
        text: entry.name,
        link: `/components/${entry.slug}`,
      })),
  }))
  .filter((section) => section.items.length > 0);

/** @deprecated Use `componentSidebarSections` for grouped navigation. */
export const componentSidebar = componentSidebarSections.flatMap((section) => section.items);

export const themingSidebar = themingSidebarSections[0]?.items ?? [];

export const sidebar = {
  '/components': componentSidebarSections,
  '/docs': docsSidebar,
  '/theming': themingSidebarSections,
} as const;
