import { CalendarDateTime } from '@internationalized/date';
import { DateTimeInput } from '@var-ui/react';

export default function Preview() {
  return (
    <DateTimeInput label="Appointment" defaultValue={new CalendarDateTime(2026, 8, 12, 14, 30)} />
  );
}
