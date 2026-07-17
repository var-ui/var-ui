import type { HTMLAttributes, JSX } from 'react';
import { createElement } from 'react';
import { heading, textBlock } from '@var-ui/core';
import { recipeProps } from './utils';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic heading level (document outline). @default 2 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of level. @default md */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'display';
};

/**
 * Semantic heading with decoupled visual size.
 *
 * ```tsx
 * <Heading level={1} size="display">var-ui</Heading>
 * ```
 */
export function Heading({
  level = 2,
  size = 'md',
  className,
  ...props
}: HeadingProps): JSX.Element {
  return createElement(`h${level}`, {
    ...props,
    ...recipeProps(heading({ size }), className),
  });
}

export type TextProps = HTMLAttributes<HTMLElement> & {
  /** HTML element to render. @default p */
  as?: 'p' | 'span' | 'div';
  /** Typographic size. @default md */
  size?: 'sm' | 'md' | 'lg';
  /** Foreground color emphasis. @default primary */
  tone?: 'primary' | 'secondary';
  /** Font weight. @default normal */
  weight?: 'normal' | 'medium' | 'semibold';
};

/**
 * Body text with size/tone/weight axes. Renders a `<p>` by default.
 *
 * ```tsx
 * <Text tone="secondary" size="sm">Supporting copy</Text>
 * ```
 */
export function Text({
  as = 'p',
  size = 'md',
  tone = 'primary',
  weight = 'normal',
  className,
  ...props
}: TextProps): JSX.Element {
  return createElement(as, {
    ...props,
    ...recipeProps(textBlock({ size, tone, weight }), className),
  });
}
