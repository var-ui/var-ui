/** Minimal nav for the Astro foundation slice — only routes that render today. */

export const githubUrl = 'https://github.com/var-ui/var-ui';

export const topNav = [
  { text: 'Docs', link: '/docs/getting-started', match: '/docs' },
  { text: 'Components', link: '/components/button', match: '/components' },
] as const;

export const docsSidebar = [{ text: 'Getting started', link: '/docs/getting-started' }] as const;

/** Empty until theming pages ship in the Astro foundation slice. */
export const themingSidebar = [] as const;

export const componentSidebar = [{ text: 'Button', link: '/components/button' }] as const;

export const sidebar = {
  '/components': componentSidebar,
  '/docs': docsSidebar,
} as const;
