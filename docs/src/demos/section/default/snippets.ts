import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Section, Text } from '@var-ui/react';

<Section title="Example section">
  <Text>Section content goes here.</Text>
</Section>`,
  astro: `---
import { Section, Text } from '@var-ui/astro';
---

<Section title="Example section">
  <Text>Section content goes here.</Text>
</Section>`,
  html: `<section class="var-ui-section">
  <h2 class="var-ui-section__title">Example section</h2>
  <p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Section content goes here.</p>
</section>`,
} satisfies DemoSnippets;
