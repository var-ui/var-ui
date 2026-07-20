import { describe, expect, it } from 'vite-plus/test';
import { buildDocsSearchIndex } from './search-index';

describe('buildDocsSearchIndex', () => {
  it('includes getting started, theming, and at least one component', () => {
    const items = buildDocsSearchIndex();
    expect(items.some((i) => i.id === '/docs/getting-started')).toBe(true);
    expect(items.some((i) => i.id.startsWith('/components/'))).toBe(true);
    expect(items.some((i) => i.id.startsWith('/theming/'))).toBe(true);
  });
});
