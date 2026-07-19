import { describe, expect, it } from 'vite-plus/test';
import { componentSidebar, docsSidebar, topNav } from './navigation';

describe('navigation (Astro foundation slice)', () => {
  it('exposes only working top-nav destinations', () => {
    expect(topNav.map((item) => item.link)).toEqual([
      '/docs/getting-started',
      '/components/button',
    ]);
  });

  it('limits sidebars to shipped pages', () => {
    expect(docsSidebar.map((item) => item.link)).toEqual(['/docs/getting-started']);
    expect(componentSidebar.map((item) => item.link)).toEqual(['/components/button']);
  });
});
