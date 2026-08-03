import type { HTMLAttributes, JSX } from 'react';
import { badge, type BadgeVariantProps } from '@var-ui/core';
import { recipeProps } from './utils';

export type { BadgeTone, SurfaceAppearance as BadgeAppearance } from '@var-ui/core';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeVariantProps;

/**
 * Small semantic label chip.
 *
 * ```tsx
 * <Badge tone="success">Active</Badge>
 * ```
 */
export function Badge({
  tone = 'neutral',
  appearance = 'subtle',
  className,
  ...props
}: BadgeProps): JSX.Element {
  return <span {...props} {...recipeProps(badge({ tone, appearance }), className)} />;
}
