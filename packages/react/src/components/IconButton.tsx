import type { JSX, ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { recipeProps } from './utils';

export type IconButtonProps = Omit<RACButtonProps, 'className' | 'children'> & {
  /** Accessible label — required because the control has no visible text. */
  'aria-label': string;
  /** Semantic icon resolved through `IconProvider`. */
  name: IconName;
  className?: string;
  intent?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Override the registry glyph with a custom node. */
  icon?: ReactNode;
};

/**
 * Square icon-only button. Always pass `aria-label` for screen readers.
 *
 * ```tsx
 * <IconButton name="close" aria-label="Close" onPress={onClose} />
 * ```
 */
export function IconButton({
  name,
  icon,
  intent = 'secondary',
  size = 'md',
  className,
  ...props
}: IconButtonProps): JSX.Element {
  return (
    <AriaButton {...props} {...recipeProps(button({ intent, size, layout: 'icon' }), className)}>
      {icon ?? <Icon name={name} size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />}
    </AriaButton>
  );
}
