import type { JSX, ReactNode } from 'react';
import { surface } from '@var-ui/core';
import { recipeProps } from './utils';

export type SurfaceProps = {
  children: ReactNode;
  className?: string;
  /** @default md */
  padding?: 'sm' | 'md';
};

/** Bordered content box without title/body slots. */
export function Surface({ children, className, padding = 'md' }: SurfaceProps): JSX.Element {
  return <div {...recipeProps(surface({ padding }), className)}>{children}</div>;
}
