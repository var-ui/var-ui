import { describe, expect, it } from 'vite-plus/test';
import type { ComponentRecord } from '../types';
import { formatComponent } from './component';

function button(markdown: string): ComponentRecord {
  return {
    slug: 'button',
    name: 'Button',
    category: 'action',
    description: 'Triggers an action',
    importLine: "import { Button } from '@var-ui/react';",
    packages: ['react', 'core'],
    docsPath: '/components/button',
    markdown,
    examples: [],
    props: [],
  };
}

describe('formatComponent', () => {
  it('prints heading then import then body when markdown already has an H1', () => {
    const out = formatComponent(button('\n\n# Button\n\nTriggers an action.\n'), false);
    expect(out).toBe(
      "# Button\n\nimport { Button } from '@var-ui/react';\n\nTriggers an action.\n",
    );
  });

  it('prints heading then import when markdown has no H1', () => {
    const out = formatComponent(button('Triggers an action.\n'), false);
    expect(out).toBe(
      "# Button\n\nimport { Button } from '@var-ui/react';\n\nTriggers an action.\n",
    );
  });
});
