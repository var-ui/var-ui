import type { JSX, ReactNode } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as RACCheckboxProps,
} from 'react-aria-components';
import { checkbox } from '@var-ui/core';
import { recipeProps } from './utils';

export type CheckboxProps = Omit<RACCheckboxProps, 'children'> & {
  /** Label rendered beside the checkbox control. */
  children?: ReactNode;
};

export function Checkbox({ children, ...props }: CheckboxProps): JSX.Element {
  const cb = checkbox();
  return (
    <AriaCheckbox {...props} {...recipeProps(cb.root)}>
      {({ isSelected }) => (
        <>
          <span {...recipeProps(cb.box)} data-selected={isSelected || undefined}>
            {isSelected ? '✓' : ''}
          </span>
          <span {...recipeProps(cb.label)}>{children}</span>
        </>
      )}
    </AriaCheckbox>
  );
}
