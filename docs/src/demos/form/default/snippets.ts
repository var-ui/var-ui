import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Field, Form } from '@var-ui/react';

<Form>
  <Field.Root name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control>
      <input name="email" type="email" required />
    </Field.Control>
    <Field.Error />
  </Field.Root>
  <Field.Root name="name">
    <Field.Label>Name</Field.Label>
    <Field.Control>
      <input name="name" required />
    </Field.Control>
    <Field.Error />
  </Field.Root>
  <Button type="submit">Save</Button>
</Form>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
