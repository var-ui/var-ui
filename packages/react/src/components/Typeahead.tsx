import { useContext, type JSX } from 'react';
import {
  Button,
  ComboBox as AriaComboBox,
  ComboBoxStateContext,
  FieldError,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
  type ComboBoxProps as RACComboBoxProps,
} from 'react-aria-components';
import { typeahead } from '@var-ui/core';
import { Icon } from '../icons';
import { recipeClassName, recipeProps } from './utils';

export type TypeaheadOption = {
  /** Unique option identifier passed to the combobox value. */
  id: string;
  /** Visible label in the input and listbox. */
  label: string;
};

export type TypeaheadProps = Omit<RACComboBoxProps<TypeaheadOption>, 'children' | 'items'> & {
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
 * Clears the combobox's selection and input text. Rendered with `slot={null}`
 * so it opts out of the `Button` context RAC's `ComboBox` wires up for its
 * built-in open/close trigger — this button's `onPress` only clears state via
 * `ComboBoxStateContext`, matching RAC's documented "clearable combobox"
 * pattern.
 */
function ClearButton({ className }: { className: string }): JSX.Element {
  const state = useContext(ComboBoxStateContext);
  const isEmpty = !state?.selectedKey && !state?.inputValue;
  return (
    <Button
      className={className}
      slot={null}
      excludeFromTabOrder
      aria-label="Clear"
      isDisabled={isEmpty}
      onPress={() => {
        state?.setSelectedKey(null);
        state?.setInputValue('');
      }}
    >
      <Icon name="close" size="sm" />
    </Button>
  );
}

/**
 * Single-select search-as-you-type combobox: a text input that filters a
 * popover listbox of matches. Wraps RAC's `ComboBox` (single-selection mode).
 * `selectedKey`/`onSelectionChange`/`inputValue`/`onInputChange` are RAC's
 * own props, forwarded transparently — use them for controlled usage.
 *
 * ```tsx
 * <Typeahead
 *   label="Assignee"
 *   options={[{ id: '1', label: 'Ada Lovelace' }, { id: '2', label: 'Alan Turing' }]}
 * />
 * ```
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
  const ta = typeahead();
  return (
    <AriaComboBox {...props} {...recipeProps(ta.root, className)}>
      {label ? <Label {...recipeProps(ta.label)}>{label}</Label> : null}
      <Group {...recipeProps(ta.inputWrapper)}>
        <Input {...recipeProps(ta.input)} placeholder={placeholder} />
        <ClearButton className={recipeClassName(ta.clearButton)} />
      </Group>
      {description ? (
        <Text slot="description" {...recipeProps(ta.description)}>
          {description}
        </Text>
      ) : null}
      <FieldError {...recipeProps(ta.error)}>{errorMessage ?? ''}</FieldError>
      <Popover {...recipeProps(ta.popover)}>
        <ListBox items={options}>
          {(option) => (
            <ListBoxItem id={option.id} textValue={option.label} {...recipeProps(ta.item)}>
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
