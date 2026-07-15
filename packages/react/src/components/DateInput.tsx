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
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  type DatePickerProps as RACDatePickerProps,
} from 'react-aria-components';
import { dateInput } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type DateInputProps<T extends DateValue = DateValue> = Omit<
  RACDatePickerProps<T>,
  'children'
> & {
  /** Field label rendered above the segmented input. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  className?: string;
};

/**
 * Single-date field with segmented text entry (month/day/year as separate
 * focusable segments) plus a trigger button that opens a popover
 * month-calendar. Wraps RAC's `DatePicker`.
 *
 * ```tsx
 * <DateInput label="Appointment date" value={value} onChange={setValue} />
 * ```
 */
export function DateInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DateInputProps<T>): JSX.Element {
  const di = dateInput();
  return (
    <AriaDatePicker {...props} className={cx(di.root, className)}>
      {label ? <Label className={di.label}>{label}</Label> : null}
      <Group className={di.group}>
        <AriaDateInput>
          {(segment) => <DateSegment segment={segment} className={di.segment} />}
        </AriaDateInput>
        <Button className={di.trigger}>
          <Icon name="chevronDown" size="sm" />
        </Button>
      </Group>
      {description ? (
        <Text slot="description" className={di.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={di.error}>{errorMessage ?? ''}</FieldError>
      <Popover className={di.popover}>
        <Dialog>
          <AriaCalendar>
            <header className={di.calendarHeader}>
              <Button slot="previous" className={di.calendarNavButton}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading className={di.calendarHeading} />
              <Button slot="next" className={di.calendarNavButton}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid className={di.calendarGrid}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className={di.calendarHeaderCell}>{day}</CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className={di.calendarCell} />}
              </CalendarGridBody>
            </CalendarGrid>
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
