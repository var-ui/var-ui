import type { JSX, ReactNode } from 'react';
import { kbd } from '@var-ui/core';
import { recipeProps } from './utils';

export type KbdProps = {
  children: ReactNode;
  className?: string;
};

/** Keyboard key cap for shortcut hints. */
export function Kbd({ children, className }: KbdProps): JSX.Element {
  return <kbd {...recipeProps(kbd(), className)}>{children}</kbd>;
}
