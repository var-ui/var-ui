import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CalendarDateTime } from '@internationalized/date';
import { DateTimeInput } from '@var-ui/react';

<DateTimeInput label="Appointment" defaultValue={new CalendarDateTime(2026, 8, 12, 14, 30)} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
