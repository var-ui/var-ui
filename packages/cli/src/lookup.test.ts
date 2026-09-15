import { describe, expect, it } from 'vite-plus/test';
import type { Catalog, ComponentRecord, GuideRecord } from './types';
import { findComponent, findGuide } from './lookup';

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

function miniCatalog(): Catalog {
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
  };
}

describe('findComponent', () => {
  const catalog = miniCatalog();

  it('returns a component by exact name, case-insensitive', () => {
    expect(findComponent(catalog, 'Button')?.name).toBe('Button');
    expect(findComponent(catalog, 'button')?.name).toBe('Button');
  });

  it('returns a component by exact slug, case-insensitive', () => {
    expect(findComponent(catalog, 'BANNER')?.slug).toBe('banner');
  });

  it('does not match substrings', () => {
    expect(findComponent(catalog, 'btn')).toBeUndefined();
  });
});

describe('findGuide', () => {
  const catalog = miniCatalog();

  it('returns a guide by exact id, case-insensitive', () => {
    expect(findGuide(catalog, 'getting-started')?.id).toBe('getting-started');
    expect(findGuide(catalog, 'Getting-Started')?.id).toBe('getting-started');
  });

  it('returns a guide by exact title, case-insensitive', () => {
    expect(findGuide(catalog, 'Getting started')?.id).toBe('getting-started');
    expect(findGuide(catalog, 'getting started')?.id).toBe('getting-started');
  });

  it('returns undefined when no id or title matches', () => {
    expect(findGuide(catalog, 'install')).toBeUndefined();
  });
});
