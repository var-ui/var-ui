import { type JSX, type ReactNode } from 'react';
import {
  Button as AriaButton,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  Text,
  type ListBoxItemProps,
  type PopoverProps,
  type SelectProps as RACSelectProps,
  type SelectValueProps as RACSelectValueProps,
} from 'react-aria-components';
import { select } from '@var-ui/core';
import { Icon } from '../icons';
import type { FieldMeta } from './utils';
import { mergeProps } from './utils';

export type SelectOption = {
  /** Unique option identifier passed to the select value. */
  id: string;
  /** Visible label in the trigger and listbox. */
  label: string;
};

export type SelectRootProps<T extends object = SelectOption> = Omit<
  RACSelectProps<T>,
  'children' | 'className'
> & {
  children: ReactNode;
  className?: string;
};

function SelectRoot<T extends object>({
  children,
  className,
  ...props
}: SelectRootProps<T>): JSX.Element {
  const s = select();
  return (
    <AriaSelect {...props} {...mergeProps(s.root, className)}>
      {children}
    </AriaSelect>
  );
}

export type SelectLabelProps = { children: ReactNode; className?: string };

function SelectLabel({ children, className }: SelectLabelProps): JSX.Element {
  const s = select();
  return <Label {...mergeProps(s.label, className)}>{children}</Label>;
}

export type SelectValueProps<T extends object = SelectOption> = {
  /** Placeholder when no value is selected. @default Select… */
  placeholder?: string;
  className?: string;
  /** Custom closed-trigger content. Receives RAC `SelectValue` render props. */
  children?: RACSelectValueProps<T>['children'];
};

function SelectValue<T extends object = SelectOption>({
  placeholder = 'Select…',
  className,
  children,
}: SelectValueProps<T>): JSX.Element {
  const s = select();
  return (
    <AriaSelectValue {...mergeProps(s.selectValue, className)}>
      {children ??
        (({ defaultChildren, isPlaceholder }) => (isPlaceholder ? placeholder : defaultChildren))}
    </AriaSelectValue>
  );
}

export type SelectTriggerProps = {
  /** Placeholder when no value is selected. Ignored when `children` is set. @default Select… */
  placeholder?: string;
  className?: string;
  /** Replace the default `Select.Value`. Compose `Select.Value` for a custom closed value. */
  children?: ReactNode;
};

function SelectTrigger({
  placeholder = 'Select…',
  className,
  children,
}: SelectTriggerProps): JSX.Element {
  const s = select();
  return (
    <AriaButton {...mergeProps(s.trigger, className)}>
      {children ?? <SelectValue placeholder={placeholder} />}
      <span {...mergeProps(s.triggerIcon)} aria-hidden>
        <Icon name="chevronDown" size="sm" />
      </span>
    </AriaButton>
  );
}

export type SelectDescriptionProps = { children: ReactNode; className?: string };

function SelectDescription({ children, className }: SelectDescriptionProps): JSX.Element {
  const s = select();
  return (
    <Text slot="description" {...mergeProps(s.description, className)}>
      {children}
    </Text>
  );
}

export type SelectErrorProps = { children?: ReactNode; className?: string };

function SelectError({ children, className }: SelectErrorProps): JSX.Element {
  const s = select();
  return <FieldError {...mergeProps(s.error, className)}>{children ?? ''}</FieldError>;
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
      {...mergeProps(s.popover, className)}
      UNSTABLE_portalContainer={portalContainer}
    >
      {children}
    </Popover>
  );
}

export type SelectListBoxProps<T extends object = SelectOption> =
  | {
      items: Iterable<T>;
      children: (item: T) => ReactNode;
      className?: string;
    }
  | {
      items?: never;
      children: ReactNode;
      className?: string;
    };

function SelectListBox<T extends object>(props: SelectListBoxProps<T>): JSX.Element {
  const s = select();
  if ('items' in props && props.items != null) {
    const { items, children, className } = props;
    return (
      <ListBox {...mergeProps(s.listbox, className)} items={items}>
        {children}
      </ListBox>
    );
  }
  const { children, className } = props;
  return <ListBox {...mergeProps(s.listbox, className)}>{children}</ListBox>;
}

export type SelectItemProps = ListBoxItemProps & { className?: string };

function SelectItem({ children, className, ...props }: SelectItemProps): JSX.Element {
  const s = select();
  return (
    <ListBoxItem {...props} {...mergeProps(s.item, className)}>
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
    /** Additional CSS class names merged onto the root. */
    className?: string;
  };

/**
 * Dropdown single-select. `Select` with `options` is the assembled preset.
 * Compose `Root`, `Trigger`, `Value`, `Popover`, `ListBox`, and `Item` for custom rows.
 */
function Select({
  label,
  description,
  errorMessage,
  options,
  placeholder = 'Select…',
  portalContainer,
  className,
  ...props
}: SelectProps): JSX.Element {
  return (
    <SelectRoot {...props} className={className} isInvalid={errorMessage ? true : undefined}>
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
    </SelectRoot>
  );
}

export const SelectNamespace = Object.assign(Select, {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Description: SelectDescription,
  Error: SelectError,
  Popover: SelectPopover,
  ListBox: SelectListBox,
  Item: SelectItem,
});

export { SelectNamespace as Select };
