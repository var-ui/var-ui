import type { JSX } from 'react';
import {
  Button as AriaButton,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Text,
  type SelectProps as RACSelectProps,
} from 'react-aria-components';
import { select } from '@var-ui/core';
import { Icon } from '../icons';
import type { FieldMeta } from './utils';
import { recipeProps } from './utils';

export type SelectOption = {
  /** Unique option identifier passed to the select value. */
  id: string;
  /** Visible label in the trigger and listbox. */
  label: string;
};

export type SelectProps = Omit<RACSelectProps<SelectOption>, 'children'> &
  FieldMeta & {
    /** Options shown in the dropdown listbox. */
    options: SelectOption[];
    /** Placeholder text when no value is selected. @default Select… */
    placeholder?: string;
    /**
     * Element the dropdown listbox portals into instead of `document.body`. Needed when a
     * subtree renders under a different theme than the page ambient (the theme's CSS custom
     * properties only cascade to descendants of the themed element).
     */
    portalContainer?: Element;
  };

export function Select({
  label,
  description,
  errorMessage,
  options,
  placeholder = 'Select…',
  portalContainer,
  ...props
}: SelectProps): JSX.Element {
  const s = select();
  return (
    <AriaSelect {...props} {...recipeProps(s.root)} isInvalid={errorMessage ? true : undefined}>
      {label ? <Label {...recipeProps(s.label)}>{label}</Label> : null}
      <AriaButton {...recipeProps(s.trigger)}>
        <SelectValue {...recipeProps(s.selectValue)}>
          {({ defaultChildren, isPlaceholder }) => (isPlaceholder ? placeholder : defaultChildren)}
        </SelectValue>
        <span {...recipeProps(s.triggerIcon)} aria-hidden>
          <Icon name="chevronDown" size="sm" />
        </span>
      </AriaButton>
      {description ? (
        <Text slot="description" {...recipeProps(s.description)}>
          {description}
        </Text>
      ) : null}
      {errorMessage ? <FieldError {...recipeProps(s.error)}>{errorMessage}</FieldError> : null}
      <Popover {...recipeProps(s.popover)} UNSTABLE_portalContainer={portalContainer}>
        <ListBox {...recipeProps(s.listbox)}>
          {options.map((option) => (
            <ListBoxItem
              key={option.id}
              id={option.id}
              textValue={option.label}
              {...recipeProps(s.item)}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
