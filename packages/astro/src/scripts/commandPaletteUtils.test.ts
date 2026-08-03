import { describe, expect, it } from 'vite-plus/test';
import {
  filterCommandPaletteItems,
  groupCommandPaletteResults,
  moveCommandPaletteActiveIndex,
  type CommandPaletteItem,
} from './commandPaletteUtils';

const items: CommandPaletteItem[] = [
  {
    id: '/docs/getting-started',
    title: 'Getting started',
    meta: 'Docs',
    group: 'Docs',
  },
  {
    id: '/components/button',
    title: 'Button',
    meta: 'Actions',
    group: 'Components',
    keywords: ['click'],
  },
  {
    id: '/theming/tokens',
    title: 'Tokens',
    meta: 'Theming',
    group: 'Theming',
  },
];

describe('filterCommandPaletteItems', () => {
  it('returns all items for empty query', () => {
    expect(filterCommandPaletteItems(items, '')).toHaveLength(items.length);
    expect(filterCommandPaletteItems(items, '   ')).toHaveLength(items.length);
  });

  it('matches title, meta, and keywords case-insensitively', () => {
    expect(filterCommandPaletteItems(items, 'button').map((i) => i.id)).toEqual([
      '/components/button',
    ]);
    expect(filterCommandPaletteItems(items, 'ACTIONS').map((i) => i.id)).toEqual([
      '/components/button',
    ]);
    expect(filterCommandPaletteItems(items, 'click').map((i) => i.id)).toEqual([
      '/components/button',
    ]);
  });
});

describe('groupCommandPaletteResults', () => {
  it('groups items by group label in first-seen order', () => {
    const groups = groupCommandPaletteResults(items);
    expect(groups.map((g) => g.label)).toEqual(['Docs', 'Components', 'Theming']);
    expect(groups[1]?.items.map((item) => item.id)).toEqual(['/components/button']);
  });

  it('omits empty groups', () => {
    const groups = groupCommandPaletteResults([items[0]!]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.label).toBe('Docs');
  });

  it('returns a single unlabeled group when items have no group field', () => {
    const groups = groupCommandPaletteResults([{ id: 'a', title: 'Alpha' }]);
    expect(groups).toEqual([{ id: 'default', label: '', items: [{ id: 'a', title: 'Alpha' }] }]);
  });
});

describe('moveCommandPaletteActiveIndex', () => {
  it('wraps in both directions', () => {
    expect(moveCommandPaletteActiveIndex(0, 3, 'down')).toBe(1);
    expect(moveCommandPaletteActiveIndex(2, 3, 'down')).toBe(0);
    expect(moveCommandPaletteActiveIndex(0, 3, 'up')).toBe(2);
    expect(moveCommandPaletteActiveIndex(1, 3, 'up')).toBe(0);
  });

  it('returns -1 when there are no items', () => {
    expect(moveCommandPaletteActiveIndex(-1, 0, 'down')).toBe(-1);
    expect(moveCommandPaletteActiveIndex(0, 0, 'up')).toBe(-1);
  });
});
