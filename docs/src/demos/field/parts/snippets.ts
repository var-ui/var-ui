import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Field } from '@var-ui/react';

<form
  onSubmit={(event) => {
    event.preventDefault();
  }}
>
  <Field.Root name="amount">
    <Field.Label>Amount</Field.Label>
    <Field.Control>
      <input name="amount" required />
    </Field.Control>
    <Field.Description>In USD</Field.Description>
    <Field.Error />
  </Field.Root>
  <Button type="submit">Save</Button>
</form>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
