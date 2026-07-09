import type { JSX } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button } from '@var-ui/core';

export type ButtonProps = Omit<RACButtonProps, 'className'> & {
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Visual weight of the button. @default secondary */
  intent?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ intent = 'secondary', className, ...props }: ButtonProps): JSX.Element {
  return <AriaButton {...props} className={`${button({ intent })} ${className || ''}`} />;
}
