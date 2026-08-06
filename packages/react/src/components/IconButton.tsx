import type { JSX, ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button, resolveButtonProps, type ButtonVariantProps, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { recipeProps } from './utils';

export type IconButtonProps = Omit<RACButtonProps, 'className' | 'children'> & {
  'aria-label': string;
  name: IconName;
  className?: string;
  icon?: ReactNode;
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
  ...props
}: IconButtonProps): JSX.Element {
  const recipeProps_ = button(
    resolveButtonProps(
      tone != null
        ? { tone, appearance, size, layout: 'icon', elevated }
        : { intent, appearance, size, layout: 'icon', elevated },
    ),
  );
  return (
    <AriaButton {...props} {...recipeProps(recipeProps_, className)}>
      {icon ?? <Icon name={name} size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />}
    </AriaButton>
  );
}
