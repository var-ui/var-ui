import { describe, expect, it } from 'vite-plus/test';
import type { Catalog } from './types';

describe('Catalog', () => {
  it('accepts a minimal valid catalog object', () => {
    const catalog: Catalog = {
      version: '0.1.0',
      components: [
        {
          slug: 'button',
          name: 'Button',
          category: 'action',
          description: 'Triggers an action or event.',
          importLine: "import { Button } from '@var-ui/react';",
          packages: ['react', 'core'],
          docsPath: '/components/button',
          markdown: '# Button\n',
          examples: [{ id: 'button.default', react: '<Button>Click me</Button>' }],
          props: [],
        },
      ],
      guides: [
        {
          id: 'getting-started',
          title: 'Getting started',
          description: 'Install var-ui',
          docsPath: '/docs/getting-started',
          markdown: '# Getting started\n',
        },
      ],
    };
    expect(catalog.components[0]?.slug).toBe('button');
  });
});
