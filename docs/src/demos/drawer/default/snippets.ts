import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Drawer } from '@var-ui/react';

<Button onPress={() => setOpen(true)}>Open drawer</Button>
<Drawer isOpen={open} onOpenChange={setOpen} title="Settings">
  <p>Drawer body content.</p>
</Drawer>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
