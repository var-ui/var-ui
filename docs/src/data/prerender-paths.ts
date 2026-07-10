import { componentRegistry } from './components';

export const prerenderPaths = [
  '/',
  '/components',
  '/docs',
  '/theming',
  ...componentRegistry.map((entry) => `/components/${entry.slug}`),
  '/docs/getting-started',
  '/docs/installation',
  '/theming/tokens',
  '/theming/themes',
];
