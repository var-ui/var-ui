import { describe, expect, it } from 'vite-plus/test';
import {
  getComponentCategoryLabel,
  getComponentDocTabs,
  getComponentEntry,
  getComponentSourceLinks,
  hasComponentPlayground,
  parseComponentDocTab,
} from './component-page';

describe('component-page', () => {
  it('finds registry entries by slug', () => {
    expect(getComponentEntry('button')?.name).toBe('Button');
    expect(getComponentEntry('not-real')).toBeUndefined();
  });

  it('resolves category labels', () => {
    expect(getComponentCategoryLabel('button')).toBe('Action');
    expect(getComponentCategoryLabel('text-field')).toBe('Data Input');
  });

  it('builds source links for button', () => {
    const links = getComponentSourceLinks('button');
    expect(links.map((link) => link.label)).toEqual(['React', 'Astro', 'Core']);
    expect(links[0]?.href).toContain('/packages/react/src/components/Button.tsx');
    expect(links[1]?.href).toContain('/packages/astro/src/components/Button.astro');
    expect(links[2]?.href).toContain('/packages/core/src/components/button.ts');
  });

  it('includes chat react source paths', () => {
    const links = getComponentSourceLinks('chat-message');
    expect(links.some((link) => link.href.includes('/chat/ChatMessage.tsx'))).toBe(true);
    expect(links.some((link) => link.href.includes('/chat/chatMessage.ts'))).toBe(true);
  });

  it('includes playground tab only for supported components', () => {
    expect(hasComponentPlayground('button')).toBe(true);
    expect(hasComponentPlayground('card')).toBe(false);
    expect(getComponentDocTabs('button').map((tab) => tab.id)).toEqual([
      'documentation',
      'playground',
      'props',
      'styles',
    ]);
    expect(getComponentDocTabs('card').map((tab) => tab.id)).toEqual([
      'documentation',
      'props',
      'styles',
    ]);
  });

  it('parses tab ids from query or hash values', () => {
    expect(parseComponentDocTab('props', 'button')).toBe('props');
    expect(parseComponentDocTab('playground', 'button')).toBe('playground');
    expect(parseComponentDocTab('playground', 'card')).toBe('documentation');
    expect(parseComponentDocTab('STYLES', 'button')).toBe('styles');
    expect(parseComponentDocTab('nope', 'button')).toBe('documentation');
    expect(parseComponentDocTab(undefined, 'button')).toBe('documentation');
  });
});
