import { CalendarDate } from '@internationalized/date';
import { DateInput } from '@var-ui/react';

export default function Preview() {
  return <DateInput label="Date" defaultValue={new CalendarDate(2026, 8, 12)} />;
}
