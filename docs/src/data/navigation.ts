import { componentRegistry } from './components';

export const githubUrl = 'https://github.com/var-ui/var-ui';

export const topNav = [
  { text: 'Docs', link: '/docs/getting-started', match: '/docs' },
  { text: 'Components', link: '/components', match: '/components' },
  { text: 'Theming', link: '/theming', match: '/theming' },
] as const;

export const docsSidebar = [{ text: 'Getting started', link: '/docs/getting-started' }] as const;

export const themingSidebar = [
  { text: 'Overview', link: '/theming' },
  { text: 'Customize', link: '/theming/customize' },
  { text: 'Themes', link: '/theming/themes' },
  { text: 'Design tokens', link: '/theming/tokens' },
] as const;

export const componentSidebar = componentRegistry.map((entry) => ({
  text: entry.name,
  link: `/components/${entry.slug}`,
}));

export const sidebar = {
  '/components': componentSidebar,
  '/docs': docsSidebar,
  '/theming': themingSidebar,
} as const;
