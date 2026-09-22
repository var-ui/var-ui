import { describe, expect, it } from 'vite-plus/test';
import type { Catalog, ComponentRecord, GuideRecord } from './types';
import { scoreText, searchCatalog } from './search';

function component(
  partial: Pick<ComponentRecord, 'slug' | 'name' | 'category' | 'description'>,
): ComponentRecord {
  return {
    importLine: `import { ${partial.name} } from '@var-ui/react';`,
    packages: ['react', 'core'],
    docsPath: `/components/${partial.slug}`,
    markdown: `# ${partial.name}\n`,
    examples: [],
    props: [],
    ...partial,
  };
}

function guide(partial: Pick<GuideRecord, 'id' | 'title' | 'description'>): GuideRecord {
  return {
    docsPath: `/docs/${partial.id}`,
    markdown: `# ${partial.title}\n`,
    ...partial,
  };
}

function miniCatalog(overrides: Partial<Catalog> = {}): Catalog {
  return {
    version: '0.1.0',
    components: [
      component({
        slug: 'button',
        name: 'Button',
        category: 'action',
        description: 'Triggers an action',
      }),
      component({
        slug: 'banner',
        name: 'Banner',
        category: 'feedback',
        description: 'Highlights a message',
      }),
    ],
    guides: [
      guide({
        id: 'getting-started',
        title: 'Getting started',
        description: 'Install var-ui',
      }),
    ],
    ...overrides,
  };
}

describe('scoreText', () => {
  it('scores exact name or slug as 100', () => {
    expect(scoreText('button', 'Button', 'button', 'Triggers an action', 'action')).toBe(100);
    expect(scoreText('Button', 'Button', 'button', 'Triggers an action', 'action')).toBe(100);
  });

  it('scores name or slug starts-with as 50', () => {
    expect(scoreText('ban', 'Banner', 'banner', 'Highlights a message', 'feedback')).toBe(50);
  });

  it('scores name or slug contains as 25', () => {
    expect(scoreText('ton', 'Button', 'button', 'Triggers an action', 'action')).toBe(25);
  });

  it('scores description or category contains as 10', () => {
    expect(scoreText('action', 'Button', 'button', 'Triggers an action', 'action')).toBe(10);
    expect(scoreText('message', 'Banner', 'banner', 'Highlights a message', 'feedback')).toBe(10);
  });

  it('scores no match as 0', () => {
    expect(scoreText('nope', 'Button', 'button', 'Triggers an action', 'action')).toBe(0);
  });

  it('trims the query before scoring', () => {
    expect(scoreText('  button  ', 'Button', 'button', 'Triggers an action', 'action')).toBe(100);
  });
});

describe('searchCatalog', () => {
  const catalog = miniCatalog();

  it('ranks an exact component name as 100', () => {
    const hits = searchCatalog(catalog, 'button');
    expect(hits[0]?.kind).toBe('component');
    expect(hits[0]?.component?.name).toBe('Button');
    expect(hits[0]?.score).toBe(100);
  });

  it('ranks a starts-with match first', () => {
    const hits = searchCatalog(catalog, 'ban');
    expect(hits[0]?.component?.name).toBe('Banner');
    expect(hits[0]?.score).toBe(50);
  });

  it('hits a component via category at score 10', () => {
    const hits = searchCatalog(catalog, 'action');
    expect(hits.some((hit) => hit.component?.name === 'Button' && hit.score === 10)).toBe(true);
  });

  it('omits score 0 results', () => {
    expect(searchCatalog(catalog, 'nope')).toEqual([]);
  });

  it('returns an empty list for empty or whitespace queries', () => {
    expect(searchCatalog(catalog, '')).toEqual([]);
    expect(searchCatalog(catalog, '   ')).toEqual([]);
  });

  it('scores guides using title as name and id as slug', () => {
    const hits = searchCatalog(catalog, 'getting-started');
    expect(hits[0]?.kind).toBe('guide');
    expect(hits[0]?.guide?.id).toBe('getting-started');
    expect(hits[0]?.score).toBe(100);
  });

  it('sorts equal scores by component name or guide title', () => {
    const tied = miniCatalog({
      components: [
        component({
          slug: 'zebra',
          name: 'Zebra',
          category: 'misc',
          description: 'shared token',
        }),
        component({
          slug: 'apple',
          name: 'Apple',
          category: 'misc',
          description: 'shared token',
        }),
      ],
      guides: [
        guide({
          id: 'mango',
          title: 'Mango',
          description: 'shared token',
        }),
      ],
    });
    const hits = searchCatalog(tied, 'shared');
    expect(
      hits.map((hit) => (hit.kind === 'component' ? hit.component?.name : hit.guide?.title)),
    ).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  it('returns at most 10 hits', () => {
    const components = Array.from({ length: 12 }, (_, index) =>
      component({
        slug: `item-${String(index).padStart(2, '0')}`,
        name: `Item ${String(index).padStart(2, '0')}`,
        category: 'list',
        description: 'numbered item',
      }),
    );
    const hits = searchCatalog(miniCatalog({ components, guides: [] }), 'item');
    expect(hits).toHaveLength(10);
  });
});
