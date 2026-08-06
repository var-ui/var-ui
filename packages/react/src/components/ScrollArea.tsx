import type { HTMLAttributes, JSX, ReactNode, Ref } from 'react';
import {
  resolveScrollAreaFade,
  scrollArea,
  type ScrollAreaFade,
  type ScrollAreaOrientation,
} from '@var-ui/core';
import { recipeProps } from './utils';

export type ScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  /** @default 'vertical' */
  orientation?: ScrollAreaOrientation;
  /** Edge fade masks. @default false */
  fade?: boolean | ScrollAreaFade;
  className?: string;
  viewportClassName?: string;
  /** Ref for the scrollable viewport element. */
  viewportRef?: Ref<HTMLDivElement>;
};

/**
 * Accessible scroll container with optional edge fade masks.
 *
 * ```tsx
 * <ScrollArea fade="vertical" style={{ maxHeight: 320 }}>
 *   {longContent}
 * </ScrollArea>
 * ```
 */
export function ScrollArea({
  children,
  orientation = 'vertical',
  fade = false,
  className,
  viewportClassName,
  viewportRef,
  ...props
}: ScrollAreaProps): JSX.Element {
  const fadeMode = resolveScrollAreaFade(fade, orientation);
  const s = scrollArea({ fade: fadeMode, orientation });
  const showVerticalFade = fadeMode === 'vertical' || fadeMode === 'both';
  const showHorizontalFade = fadeMode === 'horizontal' || fadeMode === 'both';

  return (
    <div {...props} {...recipeProps(s.root, className)}>
      <div ref={viewportRef} {...recipeProps(s.viewport, viewportClassName)}>
        {showVerticalFade ? (
          <div aria-hidden {...recipeProps(s.fadeTop)} data-edge="block-start" />
        ) : null}
        {showHorizontalFade ? (
          <div aria-hidden {...recipeProps(s.fadeStart)} data-edge="inline-start" />
        ) : null}
        {children}
        {showHorizontalFade ? (
          <div aria-hidden {...recipeProps(s.fadeEnd)} data-edge="inline-end" />
        ) : null}
        {showVerticalFade ? (
          <div aria-hidden {...recipeProps(s.fadeBottom)} data-edge="block-end" />
        ) : null}
      </div>
    </div>
  );
}
