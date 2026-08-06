import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Slider } from '@var-ui/react';

<Slider label="Volume" defaultValue={40} />`,
  astro: `---
// No @var-ui/astro Slider — core recipe markup + native range input pattern.
import { slider } from '@var-ui/core';

const s = slider();
const value = 40;
---

<div class:list={[s.root]} role="group" aria-label="Volume">
  <label class:list={[s.label]}>
    <span>Volume</span>
    <span class:list={[s.output]}>{value}</span>
  </label>
  <div class:list={[s.control]}>
    <div class:list={[s.track]}>
      <div class:list={[s.fill]} style="width: 40%"></div>
    </div>
    <div
      class:list={[s.thumb]}
      role="slider"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
      tabindex="0"
      style="top: 50%; left: 40%; transform: translate(-50%, -50%)"
    ></div>
  </div>
</div>`,
  html: `<div class="var-ui-slider" role="group" aria-label="Volume"><label class="var-ui-slider__label"><span>Volume</span><span class="var-ui-slider__output">40</span></label><div class="var-ui-slider__control"><div class="var-ui-slider__track"><div class="var-ui-slider__fill" style="width: 40%"></div></div><div class="var-ui-slider__thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" tabindex="0" style="top: 50%; left: 40%; transform: translate(-50%, -50%)"></div></div></div>`,
} satisfies DemoSnippets;
