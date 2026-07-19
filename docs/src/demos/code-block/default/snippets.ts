import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CodeBlock } from '@var-ui/react';

<CodeBlock code={'const greeting = "hello";'} language="tsx" />`,
  astro: `---
import { CodeBlock } from '@var-ui/astro';
---

<CodeBlock code={'const greeting = "hello";'} language="tsx" />`,
  html: `<div class="var-ui-code-block var-ui-code-block__rootDefault" data-codeblock><div class="var-ui-code-block__header" data-codeblock-header><div class="var-ui-code-block__title"><span class="var-ui-code-block__language">tsx</span></div></div><div class="var-ui-code-block__body var-ui-code-block__bodyScrollable" data-codeblock-body><pre class="var-ui-code-block__pre var-ui-code-block__preScrollX" data-codeblock-pre><code class="var-ui-code-block__code">const greeting = "hello";</code></pre></div></div>`,
} satisfies DemoSnippets;
