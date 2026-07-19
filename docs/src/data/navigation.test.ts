import { describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from './components';
import { componentSidebar, docsSidebar, topNav } from './navigation';

describe('navigation', () => {
  it('exposes top-nav destinations', () => {
    expect(topNav.map((item) => item.link)).toEqual([
      '/docs/getting-started',
      '/components/button',
    ]);
  });

  it('lists all component registry entries in the sidebar', () => {
    expect(docsSidebar.map((item) => item.link)).toEqual(['/docs/getting-started']);
    expect(componentSidebar).toEqual(
      componentRegistry.map((entry) => ({
        text: entry.name,
        link: `/components/${entry.slug}`,
      })),
    );
  });
});
