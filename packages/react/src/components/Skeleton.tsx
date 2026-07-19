import type { CSSProperties, JSX } from 'react';
import { skeleton } from '@var-ui/core';
import { recipeProps } from './utils';

export type SkeletonProps = {
  shape?: 'text' | 'rect' | 'circle';
  className?: string;
  style?: CSSProperties;
};

/** Loading placeholder. Size with `style` width/height. */
export function Skeleton({ shape = 'text', className, style }: SkeletonProps): JSX.Element {
  return <div {...recipeProps(skeleton({ shape }), className)} aria-hidden="true" style={style} />;
}
