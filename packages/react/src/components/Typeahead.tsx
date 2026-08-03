import type { JSX } from 'react';
import { Combobox, type ComboboxOption } from './Combobox';
import type { ComboboxRootProps } from './Combobox';

export type TypeaheadOption = ComboboxOption;

export type TypeaheadProps = Omit<ComboboxRootProps<TypeaheadOption>, 'children'> & {
  /** Field label rendered above the input. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  /** Options filtered as the user types. */
  options: TypeaheadOption[];
  /** Placeholder text shown when the input is empty. @default 'Search…' */
  placeholder?: string;
  className?: string;
};

/**
 * Single-select search-as-you-type combobox built on the shared `Combobox` primitive.
 */
export function Typeahead({
  label,
  description,
  errorMessage,
  options,
  placeholder = 'Search…',
  className,
  ...props
}: TypeaheadProps): JSX.Element {
  return (
    <Combobox.Root {...props} className={className}>
      {label ? <Combobox.Label>{label}</Combobox.Label> : null}
      <Combobox.Input placeholder={placeholder} clearable />
      {description ? <Combobox.Description>{description}</Combobox.Description> : null}
      <Combobox.Error>{errorMessage}</Combobox.Error>
      <Combobox.Popover>
        <Combobox.ListBox items={options}>
          {(option) => (
            <Combobox.Item id={option.id} textValue={option.label}>
              {option.label}
            </Combobox.Item>
          )}
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  );
}
