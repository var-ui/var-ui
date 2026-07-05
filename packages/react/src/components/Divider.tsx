import type { HTMLAttributes, JSX } from 'react';
import { divider } from '@var-ui/core';
import { cx } from './utils';

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Hairline separator. Vertical orientation stretches inside flex rows and
 * exposes `aria-orientation`.
 */
export function Divider({
  orientation = 'horizontal',
  className,
  ...props
}: DividerProps): JSX.Element {
  return (
    <hr
      {...props}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cx(divider({ orientation }), className)}
    />
  );
}
