import type { JSX } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  type CalendarProps as RACCalendarProps,
} from 'react-aria-components';
import { calendar } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type CalendarProps<T extends DateValue = DateValue> = Omit<
  RACCalendarProps<T>,
  'children'
> & {
  className?: string;
};

/**
 * Standalone month-grid date picker — no popover, no text input. Composes
 * RAC's `Calendar` with the shared `calendarGridChrome` styling also used by
 * the popover calendars embedded in date-field components.
 *
 * ```tsx
 * <Calendar aria-label="Appointment date" value={value} onChange={setValue} />
 * ```
 */
export function Calendar<T extends DateValue = DateValue>({
  className,
  ...props
}: CalendarProps<T>): JSX.Element {
  const c = calendar();
  return (
    <AriaCalendar {...props} className={cx(c.root, className)}>
      <header className={c.header}>
        <Button slot="previous" className={c.navButton}>
          <Icon name="chevronLeft" size="sm" />
        </Button>
        <Heading className={c.heading} />
        <Button slot="next" className={c.navButton}>
          <Icon name="chevronRight" size="sm" />
        </Button>
      </header>
      <CalendarGrid className={c.grid}>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell className={c.headerCell}>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} className={c.cell} />}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}
