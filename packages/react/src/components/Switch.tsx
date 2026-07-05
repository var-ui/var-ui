import type { JSX, ReactNode } from 'react';
import { Switch as AriaSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { switchStyles } from '@var-ui/core';

export type SwitchProps = Omit<RACSwitchProps, 'children'> & {
  children?: ReactNode;
};

export function Switch({ children, ...props }: SwitchProps): JSX.Element {
  const sw = switchStyles();
  return (
    <AriaSwitch {...props} className={sw.root}>
      {({ isSelected }) => (
        <>
          <span className={sw.track} data-selected={isSelected || undefined}>
            <span className={sw.thumb} data-selected={isSelected || undefined} />
          </span>
          <span className={sw.label}>{children}</span>
        </>
      )}
    </AriaSwitch>
  );
}
