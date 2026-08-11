import type { ButtonHTMLAttributes, JSX } from 'react';
import { colorSwatch, type ControlSize } from '@var-ui/core';
import { recipeProps } from './utils';

export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** CSS color shown in the swatch. */
  color: string;
  size?: ControlSize;
  /** Highlights the swatch as the active selection. */
  selected?: boolean;
};

/**
 * Compact color chip for palettes and picker swatch rows. Mantine
 * `ColorSwatch` equivalent.
 */
export function ColorSwatch({
  color,
  size = 'md',
  selected,
  className,
  style,
  ...props
}: ColorSwatchProps): JSX.Element {
  const cs = colorSwatch({ size });
  return (
    <button
      type="button"
      {...props}
      {...recipeProps(cs.root, className)}
      data-selected={selected || undefined}
      style={{ ...style, backgroundColor: color }}
      aria-pressed={selected}
    />
  );
}
