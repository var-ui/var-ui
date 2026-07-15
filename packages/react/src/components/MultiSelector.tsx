import { type JSX, useId, useRef, useState } from 'react';
import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  type Selection,
} from 'react-aria-components';
import { multiSelector } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type MultiSelectorOption = {
  /** Unique option identifier passed to the selected value array. */
  id: string;
  /** Visible label in the trigger summary and listbox. */
  label: string;
};

export type MultiSelectorProps = {
  /** Field label rendered above the trigger. */
  label?: string;
  /** Options shown in the dropdown listbox. */
  options: MultiSelectorOption[];
  /** Currently selected option ids. */
  value: string[];
  /** Called with the updated selected option ids whenever selection changes. */
  onChange: (value: string[]) => void;
  /** Placeholder text when no value is selected. @default Select… */
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
};

export function MultiSelector({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  isDisabled,
  className,
}: MultiSelectorProps): JSX.Element {
  const ms = multiSelector();
  const labelId = useId();
  const triggerTextId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedLabels = options.filter((o) => value.includes(o.id)).map((o) => o.label);
  const triggerText = selectedLabels.length === 0 ? placeholder : selectedLabels.join(', ');

  function handleSelectionChange(keys: Selection) {
    if (keys === 'all') {
      onChange(options.map((o) => o.id));
    } else {
      onChange(Array.from(keys, String));
    }
  }

  return (
    <div className={cx(ms.root, className)}>
      {label ? (
        <Label id={labelId} className={ms.label}>
          {label}
        </Label>
      ) : null}
      <AriaButton
        ref={triggerRef}
        className={ms.trigger}
        isDisabled={isDisabled}
        aria-labelledby={label ? `${labelId} ${triggerTextId}` : undefined}
        onPress={() => setIsOpen((open) => !open)}
      >
        <span id={triggerTextId}>{triggerText}</span>
        <span className={ms.triggerIcon}>
          <Icon name="chevronDown" size="sm" />
        </span>
      </AriaButton>
      <Popover
        className={ms.popover}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <ListBox
          items={options}
          selectionMode="multiple"
          selectedKeys={new Set(value)}
          onSelectionChange={handleSelectionChange}
          aria-labelledby={label ? labelId : undefined}
        >
          {(option) => (
            <ListBoxItem id={option.id} textValue={option.label} className={ms.item}>
              {({ isSelected }) => (
                <>
                  <span className={ms.itemCheckbox} data-selected={isSelected || undefined}>
                    {isSelected ? <Icon name="check" size="sm" /> : null}
                  </span>
                  <span className={ms.itemLabel}>{option.label}</span>
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </div>
  );
}
