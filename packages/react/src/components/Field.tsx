import type { JSX, ReactNode } from 'react';
import { field } from '@var-ui/core';
import { cx } from './utils';

export type FieldProps = {
  /** Visible label rendered above the control. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  /** id of the wrapped control, wired to the label's `htmlFor`. */
  htmlFor?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** The input or custom control to wrap with field chrome. */
  children: ReactNode;
};

/**
 * Field chrome for custom inputs: label, description, and error message
 * around any control that isn't one of the built-in field components.
 *
 * ```tsx
 * <Field label="Amount" description="In USD" htmlFor="amount">
 *   <MyCurrencyInput id="amount" />
 * </Field>
 * ```
 */
export function Field({
  label,
  description,
  errorMessage,
  htmlFor,
  className,
  children,
}: FieldProps): JSX.Element {
  const f = field();
  return (
    <div className={cx(f.root, className)}>
      {label ? (
        <label className={f.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {description ? <p className={f.description}>{description}</p> : null}
      {errorMessage ? (
        <p className={f.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
