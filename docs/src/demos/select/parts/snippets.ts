import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Select } from '@var-ui/react';

<Select.Root>
  <Select.Label>Assignee</Select.Label>
  <Select.Trigger placeholder="Select a person…" />
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="ada" textValue="Ada Lovelace">
        <span aria-hidden>A</span>
        Ada Lovelace
      </Select.Item>
      <Select.Item id="grace" textValue="Grace Hopper">
        <span aria-hidden>G</span>
        Grace Hopper
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>`,
  astro: `<!-- Custom item rows are React-only — use @var-ui/react -->`,
  html: `<!-- Custom item rows are React-only — use @var-ui/react -->`,
} satisfies DemoSnippets;
