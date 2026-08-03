import type { JSX } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button, resolveButtonProps, type ButtonVariantProps } from '@var-ui/core';
import { recipeProps } from './utils';

export type ButtonProps = Omit<RACButtonProps, 'className'> &
  ButtonVariantProps & {
    className?: string;
  };

export function Button({
  intent = 'secondary',
  tone,
  appearance,
  size = 'md',
  className,
  ...props
}: ButtonProps): JSX.Element {
  const recipeProps_ = button(
    resolveButtonProps(tone != null ? { tone, appearance, size } : { intent, appearance, size }),
  );
  return <AriaButton {...props} {...recipeProps(recipeProps_, className)} />;
}
