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
      '/components/card',
      '/components/clickable-card',
      '/components/carousel',
      '/components/thumbnail',
      '/components/timestamp',
      '/components/field',
      '/components/text-field',
      '/components/text-area-field',
      '/components/checkbox',
      '/components/radio-group',
      '/components/switch',
      '/components/select',
      '/components/tabs',
      '/components/dialog',
      '/components/chat-layout',
      '/components/chat-message-list',
      '/components/chat-message',
      '/components/chat-message-bubble',
      '/components/chat-message-metadata',
      '/components/chat-composer',
      '/components/chat-send-button',
      '/components/chat-system-message',
      '/components/chat-tool-calls',
    ]);
  });
});
