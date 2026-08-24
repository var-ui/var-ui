import { type JSX, type ReactNode } from 'react';
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
  type ListBoxItemProps,
  type PopoverProps,
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

export type SelectRootProps = Omit<RACSelectProps<SelectOption>, 'children' | 'className'> & {
  children: ReactNode;
  className?: string;
};

const SelectRoot = ({ children, className, ...props }: SelectRootProps): JSX.Element => {
  const s = select();
  return (
    <AriaSelect {...props} {...recipeProps(s.root, className)}>
      {children}
    </AriaSelect>
  );
};

export type SelectLabelProps = { children: ReactNode; className?: string };

function SelectLabel({ children, className }: SelectLabelProps): JSX.Element {
  const s = select();
  return <Label {...recipeProps(s.label, className)}>{children}</Label>;
}

export type SelectTriggerProps = {
  placeholder?: string;
  className?: string;
};

function SelectTrigger({ placeholder = 'Select…', className }: SelectTriggerProps): JSX.Element {
  const s = select();
  return (
    <AriaButton {...recipeProps(s.trigger, className)}>
      <SelectValue {...recipeProps(s.selectValue)}>
        {({ defaultChildren, isPlaceholder }) => (isPlaceholder ? placeholder : defaultChildren)}
      </SelectValue>
      <span {...recipeProps(s.triggerIcon)} aria-hidden>
        <Icon name="chevronDown" size="sm" />
      </span>
    </AriaButton>
  );
}

export type SelectDescriptionProps = { children: ReactNode; className?: string };

function SelectDescription({ children, className }: SelectDescriptionProps): JSX.Element {
  const s = select();
  return (
    <Text slot="description" {...recipeProps(s.description, className)}>
      {children}
    </Text>
  );
}

export type SelectErrorProps = { children?: ReactNode; className?: string };

function SelectError({ children, className }: SelectErrorProps): JSX.Element {
  const s = select();
  return <FieldError {...recipeProps(s.error, className)}>{children ?? ''}</FieldError>;
}

export type SelectPopoverProps = PopoverProps & {
  className?: string;
  /**
   * Element the dropdown listbox portals into instead of `document.body`. Needed when a
   * subtree renders under a different theme than the page ambient (the theme's CSS custom
   * properties only cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

function SelectPopover({
  children,
  className,
  portalContainer,
  ...props
}: SelectPopoverProps): JSX.Element {
  const s = select();
  return (
    <Popover
      {...props}
      {...recipeProps(s.popover, className)}
      UNSTABLE_portalContainer={portalContainer}
    >
      {children}
    </Popover>
  );
}

export type SelectListBoxProps<T extends object = SelectOption> = {
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
  className?: string;
};

function SelectListBox<T extends object>({
  items,
  children,
  className,
}: SelectListBoxProps<T>): JSX.Element {
  const s = select();
  return (
    <ListBox {...recipeProps(s.listbox, className)} items={items}>
      {children}
    </ListBox>
  );
}

export type SelectItemProps = ListBoxItemProps & { className?: string };

function SelectItem({ children, className, ...props }: SelectItemProps): JSX.Element {
  const s = select();
  return (
    <ListBoxItem {...props} {...recipeProps(s.item, className)}>
      {children}
    </ListBoxItem>
  );
}

export type SelectProps = Omit<RACSelectProps<SelectOption>, 'children' | 'className'> &
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
    className?: string;
  };

function SelectPreset({
  label,
  description,
  errorMessage,
  options,
  placeholder = 'Select…',
  portalContainer,
  className,
  ...props
}: SelectProps): JSX.Element {
  const s = select();
  return (
    <AriaSelect
      {...props}
      {...recipeProps(s.root, className)}
      isInvalid={errorMessage ? true : undefined}
    >
      {label ? <SelectLabel>{label}</SelectLabel> : null}
      <SelectTrigger placeholder={placeholder} />
      {description ? <SelectDescription>{description}</SelectDescription> : null}
      {errorMessage ? <SelectError>{errorMessage}</SelectError> : null}
      <SelectPopover portalContainer={portalContainer}>
        <SelectListBox>
          {options.map((option) => (
            <SelectItem key={option.id} id={option.id} textValue={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectListBox>
      </SelectPopover>
    </AriaSelect>
  );
}

/**
 * Dropdown single-select. `Select` with `options` is the assembled preset.
 * Compose `Root`, `Trigger`, `Popover`, `ListBox`, and `Item` for custom rows.
 */
export const Select = Object.assign(SelectPreset, {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Description: SelectDescription,
  Error: SelectError,
  Popover: SelectPopover,
  ListBox: SelectListBox,
  Item: SelectItem,
});
