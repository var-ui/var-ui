import { useContext, type JSX, type ReactNode } from 'react';
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
  type ListBoxItemProps,
  type PopoverProps,
} from 'react-aria-components';
import { combobox } from '@var-ui/core';
import { Icon } from '../icons';
import { recipeClassName, recipeProps } from './utils';

export type ComboboxOption = {
  id: string;
  label: string;
};

export type ComboboxRootProps<T extends ComboboxOption = ComboboxOption> = Omit<
  RACComboBoxProps<T>,
  'children'
> & {
  children: ReactNode;
  className?: string;
};

/** Alias for docs and consumers referring to the root combobox props. */
export type ComboboxProps<T extends ComboboxOption = ComboboxOption> = ComboboxRootProps<T>;

function ComboboxRoot<T extends ComboboxOption>({
  children,
  className,
  ...props
}: ComboboxRootProps<T>): JSX.Element {
  const styles = combobox();
  return (
    <AriaComboBox {...props} {...recipeProps(styles.root, className)}>
      {children}
    </AriaComboBox>
  );
}

export type ComboboxLabelProps = { children: ReactNode; className?: string };

function ComboboxLabel({ children, className }: ComboboxLabelProps): JSX.Element {
  const styles = combobox();
  return <Label {...recipeProps(styles.label, className)}>{children}</Label>;
}

export type ComboboxInputProps = {
  placeholder?: string;
  className?: string;
  clearable?: boolean;
};

function ComboboxInput({
  placeholder,
  className,
  clearable = false,
}: ComboboxInputProps): JSX.Element {
  const styles = combobox();
  return (
    <Group {...recipeProps(styles.inputWrapper, className)}>
      <Input {...recipeProps(styles.input)} placeholder={placeholder} />
      {clearable ? <ComboboxClearButton /> : null}
    </Group>
  );
}

function ComboboxClearButton(): JSX.Element {
  const state = useContext(ComboBoxStateContext);
  const styles = combobox();
  const isEmpty = !state?.selectedKey && !state?.inputValue;
  return (
    <Button
      className={recipeClassName(styles.clearButton)}
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

export type ComboboxDescriptionProps = { children: ReactNode; className?: string };

function ComboboxDescription({ children, className }: ComboboxDescriptionProps): JSX.Element {
  const styles = combobox();
  return (
    <Text slot="description" {...recipeProps(styles.description, className)}>
      {children}
    </Text>
  );
}

export type ComboboxErrorProps = { children?: ReactNode; className?: string };

function ComboboxError({ children, className }: ComboboxErrorProps): JSX.Element {
  const styles = combobox();
  return <FieldError {...recipeProps(styles.error, className)}>{children ?? ''}</FieldError>;
}

export type ComboboxPopoverProps = PopoverProps & { className?: string };

function ComboboxPopover({ children, className, ...props }: ComboboxPopoverProps): JSX.Element {
  const styles = combobox();
  return (
    <Popover {...props} {...recipeProps(styles.popover, className)}>
      {children}
    </Popover>
  );
}

export type ComboboxListBoxProps<T extends ComboboxOption = ComboboxOption> = {
  items: Iterable<T>;
  children: (item: T) => ReactNode;
  emptyContent?: ReactNode;
};

function ComboboxListBox<T extends ComboboxOption>({
  items,
  children,
  emptyContent = 'No results',
}: ComboboxListBoxProps<T>): JSX.Element {
  const styles = combobox();
  return (
    <ListBox
      {...recipeProps(styles.listbox)}
      items={items}
      renderEmptyState={() => <div {...recipeProps(styles.empty)}>{emptyContent}</div>}
    >
      {children}
    </ListBox>
  );
}

export type ComboboxItemProps = ListBoxItemProps & { className?: string };

function ComboboxItem({ children, className, ...props }: ComboboxItemProps): JSX.Element {
  const styles = combobox();
  return (
    <ListBoxItem {...props} {...recipeProps(styles.item, className)}>
      {children}
    </ListBoxItem>
  );
}

/**
 * Headless combobox primitive for search-as-you-type inputs, autocompletes, and
 * custom select variants. Compose `Root`, `Label`, `Input`, `Popover`, `ListBox`, and `Item`.
 */
export const Combobox = Object.assign(ComboboxRoot, {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  Input: ComboboxInput,
  ClearButton: ComboboxClearButton,
  Description: ComboboxDescription,
  Error: ComboboxError,
  Popover: ComboboxPopover,
  ListBox: ComboboxListBox,
  Item: ComboboxItem,
});
