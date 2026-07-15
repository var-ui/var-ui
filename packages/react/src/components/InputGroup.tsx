import type { InputHTMLAttributes, JSX, ReactNode, Ref } from 'react';
import { useId } from 'react';
import { inputGroup } from '@var-ui/core';
import { cx } from './utils';

export type InputGroupProps = {
  /** Visible label rendered above the group. */
  label: string;
  /** Helper text shown below the group when there is no error. */
  description?: string;
  /** Validation message; when set, the group is shown in an error state. */
  errorMessage?: string;
  /** Disables the whole group (visually and via `aria-disabled`). */
  isDisabled?: boolean;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Plain `<input>`s (see `InputGroupInput`) and `InputGroupText` addons. */
  children: ReactNode;
};

/**
 * Connected-border group for bare inputs and text addons — e.g. a currency
 * symbol glued to the edge of a price input. Unlike `TextField`/`NumberInput`,
 * this owns its own field chrome rather than delegating to those components;
 * children are rendered verbatim inside a `role="group"` container.
 *
 * ```tsx
 * <InputGroup label="Price">
 *   <InputGroupText>$</InputGroupText>
 *   <InputGroupInput aria-label="Price" value={price} onChange={onChange} />
 * </InputGroup>
 * ```
 */
export function InputGroup({
  label,
  description,
  errorMessage,
  isDisabled,
  className,
  children,
}: InputGroupProps): JSX.Element {
  const g = inputGroup();
  const labelId = useId();
  return (
    <div className={cx(g.root, className)}>
      <span id={labelId} className={g.label}>
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-disabled={isDisabled || undefined}
        data-disabled={isDisabled || undefined}
        className={g.group}
      >
        {children}
      </div>
      {description ? <p className={g.description}>{description}</p> : null}
      {errorMessage ? (
        <p className={g.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export type InputGroupInputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
};

/**
 * Thin `<input>` wrapper applying `InputGroup`'s bare-input chrome. Use it
 * (rather than a raw `<input>`) for form controls rendered inside
 * `InputGroup` so their border radius joins with sibling addons.
 */
export function InputGroupInput({ className, ref, ...props }: InputGroupInputProps): JSX.Element {
  const g = inputGroup();
  return <input {...props} ref={ref} className={cx(g.input, className)} />;
}
