import type { JSX, ReactNode } from 'react';
import { Switch as AriaSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { switchStyles } from '@var-ui/core';
import { recipeProps } from './utils';

export type SwitchProps = Omit<RACSwitchProps, 'children'> & {
  /** Label rendered beside the switch control. */
  children?: ReactNode;
};

export function Switch({ children, ...props }: SwitchProps): JSX.Element {
  const sw = switchStyles();
  return (
    <AriaSwitch {...props} {...recipeProps(sw.root)}>
      {({ isSelected }) => (
        <>
          <span {...recipeProps(sw.track)} data-selected={isSelected || undefined}>
            <span {...recipeProps(sw.thumb)} data-selected={isSelected || undefined} />
          </span>
          <span {...recipeProps(sw.label)}>{children}</span>
        </>
      )}
    </AriaSwitch>
  );
}
