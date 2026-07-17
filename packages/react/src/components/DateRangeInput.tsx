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
import { recipeProps } from './utils';

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
    <AriaDateRangePicker {...props} {...recipeProps(dr.root, className)}>
      {label ? <Label {...recipeProps(dr.label)}>{label}</Label> : null}
      <Group {...recipeProps(dr.group)}>
        <AriaDateInput slot="start">
          {(segment) => <DateSegment segment={segment} {...recipeProps(dr.segment)} />}
        </AriaDateInput>
        <span {...recipeProps(dr.separator)}>–</span>
        <AriaDateInput slot="end">
          {(segment) => <DateSegment segment={segment} {...recipeProps(dr.segment)} />}
        </AriaDateInput>
        <Button {...recipeProps(dr.trigger)}>
          <Icon name="chevronDown" size="sm" />
        </Button>
      </Group>
      {description ? (
        <Text slot="description" {...recipeProps(dr.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...recipeProps(dr.error)}>{errorMessage ?? ''}</FieldError>
      <Popover {...recipeProps(dr.popover)}>
        <Dialog>
          <RangeCalendar>
            <header {...recipeProps(dr.calendarHeader)}>
              <Button slot="previous" {...recipeProps(dr.calendarNavButton)}>
                <Icon name="chevronLeft" size="sm" />
              </Button>
              <Heading {...recipeProps(dr.calendarHeading)} />
              <Button slot="next" {...recipeProps(dr.calendarNavButton)}>
                <Icon name="chevronRight" size="sm" />
              </Button>
            </header>
            <CalendarGrid {...recipeProps(dr.calendarGrid)}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell {...recipeProps(dr.calendarHeaderCell)}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} {...recipeProps(dr.calendarCell)} />}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
