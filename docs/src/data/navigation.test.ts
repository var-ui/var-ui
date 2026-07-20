import { describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from './components';
import { componentSidebar, docsSidebar, themingSidebar, topNav } from './navigation';

describe('navigation', () => {
  it('exposes top-nav destinations', () => {
    expect(topNav.map((item) => item.link)).toEqual([
      '/docs/getting-started',
      '/components',
      '/theming',
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

  it('lists theming guide pages', () => {
    expect(themingSidebar.map((item) => item.link)).toEqual([
      '/theming',
      '/theming/customize',
      '/theming/themes',
      '/theming/tokens',
    ]);
  });
});
