import type { JSX } from 'react';
import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  type SelectProps as RACSelectProps,
} from 'react-aria-components';
import { select } from '@var-ui/core';
import { Icon } from '../icons';

export type SelectOption = {
  id: string;
  label: string;
};

export type SelectProps = Omit<RACSelectProps<SelectOption>, 'children'> & {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  label,
  options,
  placeholder = 'Select…',
  ...props
}: SelectProps): JSX.Element {
  const s = select();
  return (
    <AriaSelect {...props} className={s.root}>
      {label ? <Label className={s.label}>{label}</Label> : null}
      <AriaButton className={s.trigger}>
        <SelectValue>{({ defaultChildren }) => defaultChildren ?? placeholder}</SelectValue>
        <span className={s.triggerIcon}>
          <Icon name="chevronDown" size="sm" />
        </span>
      </AriaButton>
      <Popover className={s.popover}>
        <ListBox>
          {options.map((option) => (
            <ListBoxItem key={option.id} id={option.id} className={s.item}>
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
