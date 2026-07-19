import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Card, Carousel } from '@var-ui/react';

<Carousel label="Featured themes" itemWidth="220px">
  <Card title="Default">Scroll-snap slide.</Card>
  <Card title="Forest">Scroll-snap slide.</Card>
  <Card title="Rose">Scroll-snap slide.</Card>
</Carousel>`,
  astro: `---
// No @var-ui/astro Carousel — use core recipe markup (scroll-snap; controls are decorative).
import { card, carousel } from '@var-ui/core';

const s = carousel();
const c = card();
---

<section class:list={[s.root]} role="region" aria-label="Featured themes">
  <div class:list={[s.viewport]} data-carousel-viewport tabindex="0" style="grid-auto-columns: 220px">
    <div class:list={[s.item]} data-carousel-item>
      <div class:list={[c.root]}>
        <h3 class:list={[c.title]}>Default</h3>
        <div class:list={[c.body]}>Scroll-snap slide.</div>
      </div>
    </div>
  </div>
</section>`,
  html: `<section class="var-ui-carousel" role="region" aria-label="Featured themes"><div class="var-ui-carousel__viewport" data-carousel-viewport tabindex="0" style="grid-auto-columns: 220px"><div class="var-ui-carousel__item" data-carousel-item><div class="var-ui-card"><h3 class="var-ui-card__title">Default</h3><div class="var-ui-card__body">Scroll-snap slide.</div></div></div><div class="var-ui-carousel__item" data-carousel-item><div class="var-ui-card"><h3 class="var-ui-card__title">Forest</h3><div class="var-ui-card__body">Scroll-snap slide.</div></div></div><div class="var-ui-carousel__item" data-carousel-item><div class="var-ui-card"><h3 class="var-ui-card__title">Rose</h3><div class="var-ui-card__body">Scroll-snap slide.</div></div></div></div><div class="var-ui-carousel__controls"><button type="button" class="var-ui-carousel__control" aria-label="Previous" disabled></button><button type="button" class="var-ui-carousel__control" aria-label="Next" disabled></button></div></section>`,
} satisfies DemoSnippets;
