import type { JSX } from 'react';
import {
  Label,
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as RACProgressBarProps,
} from 'react-aria-components';
import { progressBar } from '@var-ui/core';
import { cx } from './utils';

export type ProgressBarProps = Omit<RACProgressBarProps, 'children' | 'className'> & {
  label?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValueText?: boolean;
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
  showValueText = true,
  className,
  ...props
}: ProgressBarProps): JSX.Element {
  const p = progressBar({ tone, indeterminate: props.isIndeterminate ? 'true' : 'false' });
  const showValue = showValueText && !props.isIndeterminate;
  return (
    <AriaProgressBar {...props} className={cx(p.root, className)}>
      {({ percentage, valueText }) => (
        <>
          {label || showValue ? (
            <div className={p.header}>
              {label ? <Label className={p.label}>{label}</Label> : <span />}
              {showValue ? <span className={p.valueText}>{valueText}</span> : null}
            </div>
          ) : null}
          <div className={p.track}>
            <div
              className={p.fill}
              style={props.isIndeterminate ? undefined : { width: `${percentage ?? 0}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
