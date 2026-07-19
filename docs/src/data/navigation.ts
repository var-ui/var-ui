/** Minimal nav for the Astro foundation slice — only routes that render today. */

export const githubUrl = 'https://github.com/var-ui/var-ui';

export const topNav = [
  { text: 'Docs', link: '/docs/getting-started', match: '/docs' },
  { text: 'Components', link: '/components/button', match: '/components' },
] as const;

export const docsSidebar = [{ text: 'Getting started', link: '/docs/getting-started' }] as const;

/** Empty until theming pages ship in the Astro foundation slice. */
export const themingSidebar = [] as const;

export const componentSidebar = [
  { text: 'Button', link: '/components/button' },
  { text: 'Stack', link: '/components/stack' },
  { text: 'Grid', link: '/components/grid' },
  { text: 'Center', link: '/components/center' },
  { text: 'Section', link: '/components/section' },
  { text: 'Divider', link: '/components/divider' },
  { text: 'AspectRatio', link: '/components/aspect-ratio' },
  { text: 'Heading', link: '/components/heading' },
  { text: 'Text', link: '/components/text' },
  { text: 'Link', link: '/components/link' },
  { text: 'CodeBlock', link: '/components/code-block' },
  { text: 'Alert', link: '/components/alert' },
  { text: 'Banner', link: '/components/banner' },
  { text: 'Badge', link: '/components/badge' },
  { text: 'Spinner', link: '/components/spinner' },
  { text: 'ProgressBar', link: '/components/progress-bar' },
  { text: 'EmptyState', link: '/components/empty-state' },
  { text: 'Avatar', link: '/components/avatar' },
  { text: 'Card', link: '/components/card' },
  { text: 'ClickableCard', link: '/components/clickable-card' },
  { text: 'Carousel', link: '/components/carousel' },
  { text: 'Thumbnail', link: '/components/thumbnail' },
  { text: 'Timestamp', link: '/components/timestamp' },
  { text: 'Field', link: '/components/field' },
  { text: 'TextField', link: '/components/text-field' },
  { text: 'TextAreaField', link: '/components/text-area-field' },
  { text: 'Checkbox', link: '/components/checkbox' },
  { text: 'RadioGroup', link: '/components/radio-group' },
  { text: 'Switch', link: '/components/switch' },
  { text: 'Select', link: '/components/select' },
  { text: 'Tabs', link: '/components/tabs' },
  { text: 'Dialog', link: '/components/dialog' },
] as const;

export const sidebar = {
  '/components': componentSidebar,
  '/docs': docsSidebar,
} as const;
