import type { JSX, ReactNode } from 'react';
import { steps } from '@var-ui/core';
import { recipeProps } from './utils';

export type StepsProps = {
  children: ReactNode;
  className?: string;
};

/** Numbered steps list (`<ol>`). Children should be `<li>` elements. */
export function Steps({ children, className }: StepsProps): JSX.Element {
  return <ol {...recipeProps(steps().root, className)}>{children}</ol>;
}
