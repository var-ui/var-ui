import { CalendarDate } from '@internationalized/date';
import { DateRangeInput } from '@var-ui/react';

export default function Preview() {
  return (
    <DateRangeInput
      label="Trip"
      defaultValue={{
        start: new CalendarDate(2026, 8, 10),
        end: new CalendarDate(2026, 8, 20),
      }}
    />
  );
}
