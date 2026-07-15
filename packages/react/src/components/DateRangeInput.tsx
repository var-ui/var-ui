import type { JSX } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput as AriaDateInput,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  Text,
  type DateRangePickerProps as RACDateRangePickerProps,
} from 'react-aria-components';
import { dateRangeInput } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type DateRangeInputProps<T extends DateValue = DateValue> = Omit<
  RACDateRangePickerProps<T>,
  'children'
> & {
  /** Field label rendered above the segmented start/end groups. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  className?: string;
};

/**
 * A start-date/end-date field with segmented text entry for both, plus a
 * trigger button that opens a popover range-calendar. Wraps RAC's
 * `DateRangePicker` + `RangeCalendar`.
 *
 * ```tsx
 * <DateRangeInput
 *   label="Trip dates"
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export function DateRangeInput<T extends DateValue = DateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DateRangeInputProps<T>): JSX.Element {
  const dr = dateRangeInput();
  return (
    <AriaDateRangePicker {...props} className={cx(dr.root, className)}>
      {label ? <Label className={dr.label}>{label}</Label> : null}
      <Group className={dr.group}>
        <AriaDateInput slot="start">
          {(segment) => <DateSegment segment={segment} className={dr.segment} />}
        </AriaDateInput>
        <span className={dr.separator}>–</span>
        <AriaDateInput slot="end">
          {(segment) => <DateSegment segment={segment} className={dr.segment} />}
        </AriaDateInput>
        <Button className={dr.trigger}>
          <Icon name="chevronDown" size="sm" />
        </Button>
      </Group>
      {description ? (
        <Text slot="description" className={dr.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={dr.error}>{errorMessage ?? ''}</FieldError>
      <Popover className={dr.popover}>
        <Dialog>
          <RangeCalendar>
            <header className={dr.calendarHeader}>
              <Button slot="previous" className={dr.calendarNavButton}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading className={dr.calendarHeading} />
              <Button slot="next" className={dr.calendarNavButton}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid className={dr.calendarGrid}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className={dr.calendarHeaderCell}>{day}</CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className={dr.calendarCell} />}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
