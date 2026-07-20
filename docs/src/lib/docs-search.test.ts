import { describe, expect, it } from 'vite-plus/test';
import type { DocsSearchItem } from './search-index';
import {
  filterDocsSearchItems,
  groupDocsSearchResults,
  moveDocsSearchActiveIndex,
  type DocsSearchGroupId,
} from './docs-search';

const items: DocsSearchItem[] = [
  { id: '/docs/getting-started', title: 'Getting started', meta: 'Docs' },
  { id: '/docs/installation', title: 'Installation', meta: 'Docs' },
  { id: '/theming/tokens', title: 'Tokens', meta: 'Theming' },
  {
    id: '/components/button',
    title: 'Button',
    meta: 'Actions',
    keywords: ['button', 'actions', 'click me'],
  },
  {
    id: '/components/alert',
    title: 'Alert',
    meta: 'Feedback',
    keywords: ['alert', 'feedback'],
  },
];

describe('filterDocsSearchItems', () => {
  it('returns all items for empty query', () => {
    expect(filterDocsSearchItems(items, '')).toHaveLength(items.length);
    expect(filterDocsSearchItems(items, '   ')).toHaveLength(items.length);
  });

  it('matches title, meta, and keywords case-insensitively', () => {
    expect(filterDocsSearchItems(items, 'button').map((i) => i.id)).toEqual(['/components/button']);
    expect(filterDocsSearchItems(items, 'FEEDBACK').map((i) => i.id)).toEqual([
      '/components/alert',
    ]);
    expect(filterDocsSearchItems(items, 'click').map((i) => i.id)).toEqual(['/components/button']);
  });
});

describe('groupDocsSearchResults', () => {
  it('groups into docs, components, and theming in that order', () => {
    const groups = groupDocsSearchResults(items);
    expect(groups.map((g) => g.id)).toEqual<DocsSearchGroupId[]>(['docs', 'components', 'theming']);
    expect(groups.find((g) => g.id === 'docs')?.items.map((i) => i.id)).toEqual([
      '/docs/getting-started',
      '/docs/installation',
    ]);
    expect(groups.find((g) => g.id === 'components')?.items.map((i) => i.id)).toEqual([
      '/components/button',
      '/components/alert',
    ]);
    expect(groups.find((g) => g.id === 'theming')?.items.map((i) => i.id)).toEqual([
      '/theming/tokens',
    ]);
  });

  it('omits empty groups', () => {
    const groups = groupDocsSearchResults([items[0]!]);
    expect(groups.map((g) => g.id)).toEqual(['docs']);
  });
});

describe('moveDocsSearchActiveIndex', () => {
  it('wraps within bounds', () => {
    expect(moveDocsSearchActiveIndex(0, 3, 'down')).toBe(1);
    expect(moveDocsSearchActiveIndex(2, 3, 'down')).toBe(0);
    expect(moveDocsSearchActiveIndex(0, 3, 'up')).toBe(2);
    expect(moveDocsSearchActiveIndex(1, 3, 'up')).toBe(0);
  });

  it('stays at -1 when there are no items', () => {
    expect(moveDocsSearchActiveIndex(-1, 0, 'down')).toBe(-1);
    expect(moveDocsSearchActiveIndex(0, 0, 'up')).toBe(-1);
  });
});
