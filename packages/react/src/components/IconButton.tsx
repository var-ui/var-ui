import type { JSX, ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button, resolveButtonProps, type ButtonVariantProps, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from './utils';

export type IconButtonProps = Omit<RACButtonProps, 'className' | 'children'> & {
  'aria-label': string;
  name: IconName;
  className?: string;
  icon?: ReactNode;
  'data-mirror'?: boolean | '';
} & ButtonVariantProps;

export function IconButton({
  name,
  icon,
  intent = 'secondary',
  tone,
  appearance,
  size = 'md',
  elevated,
  className,
  'data-mirror': dataMirror,
  ...props
}: IconButtonProps): JSX.Element {
  const styles = button(
    resolveButtonProps(
      tone != null
        ? { tone, appearance, size, layout: 'icon', elevated }
        : { intent, appearance, size, layout: 'icon', elevated },
    ),
  );
  return (
    <AriaButton {...props} {...mergeProps(styles, className)}>
      {icon ?? (
        <Icon
          name={name}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          data-mirror={dataMirror}
        />
      )}
    </AriaButton>
  );
}
