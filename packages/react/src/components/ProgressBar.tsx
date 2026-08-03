import type { JSX } from 'react';
import {
  Label,
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as RACProgressBarProps,
} from 'react-aria-components';
import { progressBar, type ProgressBarVariantProps } from '@var-ui/core';
import { recipeProps } from './utils';

export type { ProgressBarTone, ProgressBarAppearance } from '@var-ui/core';

export type ProgressBarProps = Omit<RACProgressBarProps, 'children' | 'className'> &
  ProgressBarVariantProps & {
    /** Label rendered above the track. */
    label?: string;
    /** Show the formatted value (e.g. "40%") next to the label. @default true */
    showValueText?: boolean;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
  };

/**
 * Linear progress bar on react-aria ProgressBar (determinate or
 * indeterminate).
 *
 * ```tsx
 * <ProgressBar label="Uploading" value={40} />
 * <ProgressBar label="Working" isIndeterminate />
 * ```
 */
export function ProgressBar({
  label,
  tone = 'accent',
  appearance = 'solid',
  showValueText = true,
  className,
  ...props
}: ProgressBarProps): JSX.Element {
  const p = progressBar({
    tone,
    appearance,
    indeterminate: props.isIndeterminate ? 'true' : 'false',
  });
  const showValue = showValueText && !props.isIndeterminate;
  return (
    <AriaProgressBar {...props} {...recipeProps(p.root, className)}>
      {({ percentage, valueText }) => (
        <>
          {label || showValue ? (
            <div {...recipeProps(p.header)}>
              {label ? <Label {...recipeProps(p.label)}>{label}</Label> : <span />}
              {showValue ? <span {...recipeProps(p.valueText)}>{valueText}</span> : null}
            </div>
          ) : null}
          <div {...recipeProps(p.track)}>
            <div
              {...recipeProps(p.fill)}
              style={props.isIndeterminate ? undefined : { width: `${percentage ?? 0}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
