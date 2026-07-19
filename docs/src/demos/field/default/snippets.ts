import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Field } from '@var-ui/react';

<Field
  label="Custom control"
  description="Any input composes the shared field chrome."
  htmlFor="custom-range"
>
  <input id="custom-range" type="range" />
</Field>`,
  astro: `---
// No @var-ui/astro Field — use core recipe markup + native control.
import { field } from '@var-ui/core';

const f = field();
---

<div class:list={[f.root]}>
  <label class:list={[f.label]} for="custom-range">Custom control</label>
  <input id="custom-range" type="range" />
  <p class:list={[f.description]}>Any input composes the shared field chrome.</p>
</div>`,
  html: `<div class="var-ui-field"><label class="var-ui-field__label" for="custom-range">Custom control</label><input id="custom-range" type="range"></input><p class="var-ui-field__description">Any input composes the shared field chrome.</p></div>`,
} satisfies DemoSnippets;
