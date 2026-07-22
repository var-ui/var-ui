import { describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from './components';
import {
  componentSidebar,
  componentSidebarSections,
  docsSidebar,
  themingSidebar,
  themingSidebarSections,
  topNav,
} from './navigation';

describe('navigation', () => {
  it('exposes top-nav destinations', () => {
    expect(topNav.map((item) => item.link)).toEqual([
      '/docs/getting-started',
      '/components',
      '/theming',
    ]);
  });

  it('lists all component registry entries in grouped sidebar sections', () => {
    expect(docsSidebar.map((item) => item.link)).toEqual(['/docs/getting-started']);
    const flatItems = componentSidebarSections.flatMap((section) => section.items);
    expect(flatItems).toEqual(
      componentRegistry.map((entry) => ({
        text: entry.name,
        link: `/components/${entry.slug}`,
      })),
    );
    expect(componentSidebar).toEqual(flatItems);
  });

  it('lists theming guide pages', () => {
    expect(themingSidebarSections[0]?.items.map((item) => item.link)).toEqual([
      '/theming',
      '/theming/customize',
      '/theming/themes',
      '/theming/tokens',
    ]);
    expect(themingSidebar.map((item) => item.link)).toEqual([
      '/theming',
      '/theming/customize',
      '/theming/themes',
      '/theming/tokens',
    ]);
  });
});
