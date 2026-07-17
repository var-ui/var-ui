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
import { recipeProps } from './utils';

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
    <AriaDatePicker {...props} {...recipeProps(di.root, className)}>
      {label ? <Label {...recipeProps(di.label)}>{label}</Label> : null}
      <Group {...recipeProps(di.group)}>
        <AriaDateInput>
          {(segment) => <DateSegment segment={segment} {...recipeProps(di.segment)} />}
        </AriaDateInput>
        <Button {...recipeProps(di.trigger)}>
          <Icon name="chevronDown" size="sm" />
        </Button>
      </Group>
      {description ? (
        <Text slot="description" {...recipeProps(di.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...recipeProps(di.error)}>{errorMessage ?? ''}</FieldError>
      <Popover {...recipeProps(di.popover)}>
        <Dialog>
          <AriaCalendar>
            <header {...recipeProps(di.calendarHeader)}>
              <Button slot="previous" {...recipeProps(di.calendarNavButton)}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading {...recipeProps(di.calendarHeading)} />
              <Button slot="next" {...recipeProps(di.calendarNavButton)}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid {...recipeProps(di.calendarGrid)}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell {...recipeProps(di.calendarHeaderCell)}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} {...recipeProps(di.calendarCell)} />}
              </CalendarGridBody>
            </CalendarGrid>
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
