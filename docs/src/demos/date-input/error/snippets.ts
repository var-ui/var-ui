import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CalendarDate } from '@internationalized/date';
import { DateInput } from '@var-ui/react';

<DateInput
  label="Deadline"
  description="Must be a weekday"
  errorMessage="Pick a weekday"
  defaultValue={new CalendarDate(2026, 8, 15)}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
