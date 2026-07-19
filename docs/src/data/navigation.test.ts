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
    expect(componentSidebar.map((item) => item.link)).toEqual([
      '/components/button',
      '/components/stack',
      '/components/grid',
      '/components/center',
      '/components/section',
      '/components/divider',
      '/components/aspect-ratio',
      '/components/heading',
      '/components/text',
      '/components/link',
      '/components/code-block',
      '/components/alert',
      '/components/banner',
      '/components/badge',
      '/components/spinner',
      '/components/progress-bar',
      '/components/empty-state',
      '/components/avatar',
    ]);
  });
});
