import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Card, Grid } from '@var-ui/react';

<Grid columns={2} gap="md">
  <Card title="Static card">Plain content surface.</Card>
  <Card title="Another card">Second grid cell.</Card>
</Grid>`,
  astro: `---
import { Card, Grid } from '@var-ui/astro';
---

<Grid columns={2} gap="md">
  <Card title="Static card">Plain content surface.</Card>
  <Card title="Another card">Second grid cell.</Card>
</Grid>`,
  html: `<div data-columns="two" data-gap="md" class="var-ui-grid">
  <div class="var-ui-card">
    <h3 class="var-ui-card__title">Static card</h3>
    <div class="var-ui-card__body">Plain content surface.</div>
  </div>
  <div class="var-ui-card">
    <h3 class="var-ui-card__title">Another card</h3>
    <div class="var-ui-card__body">Second grid cell.</div>
  </div>
</div>`,
} satisfies DemoSnippets;
