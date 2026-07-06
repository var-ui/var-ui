import { categoryLabels, componentRegistry } from './src/data/components';
import { defineConfig } from 'vocs/config';

const sidebar = Object.entries(categoryLabels).map(([category, label]) => ({
  text: label,
  items: componentRegistry
    .filter((c) => c.category === category)
    .map((c) => ({
      text: c.name,
      link: `/components/${c.slug}`,
    })),
}));

export default defineConfig({
  title: 'Var UI',
  description: 'An open-source design system built on TypeStyles and React Aria.',
  sidebar: [{ text: 'Introduction', link: '/' }, ...sidebar],
});
