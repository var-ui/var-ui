import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TextAreaField } from '@var-ui/react';

<TextAreaField label="Notes" placeholder="Add a note…" />`,
  astro: `---
// No @var-ui/astro TextAreaField — use core recipe markup + native textarea.
import { textAreaField } from '@var-ui/core';

const taf = textAreaField();
---

<div class:list={[taf.root]}>
  <label class:list={[taf.label]} for="notes">Notes</label>
  <textarea class:list={[taf.input]} id="notes" placeholder="Add a note…"></textarea>
</div>`,
  html: `<div class="var-ui-text-area-field"><label class="var-ui-text-area-field__label" for="notes">Notes</label><textarea class="var-ui-text-area-field__input" id="notes" placeholder="Add a note…"></textarea></div>`,
} satisfies DemoSnippets;
