import { CalendarDate } from '@internationalized/date';
import { DateInput } from '@var-ui/react';

export default function Preview() {
  return (
    <DateInput
      label="Deadline"
      description="Must be a weekday"
      errorMessage="Pick a weekday"
      defaultValue={new CalendarDate(2026, 8, 15)}
    />
  );
}
