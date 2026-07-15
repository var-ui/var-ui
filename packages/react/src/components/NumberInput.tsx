import type { JSX } from 'react';
import {
  Button as StepperButton,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  type NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components';
import { numberInput } from '@var-ui/core';
import { cx } from './utils';
import type { FieldMeta } from './utils';

export type NumberInputProps = Omit<RACNumberFieldProps, 'className'> &
  FieldMeta & {
    className?: string;
    placeholder?: string;
  };

export function NumberInput({
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ...props
}: NumberInputProps): JSX.Element {
  const n = numberInput();
  return (
    <AriaNumberField {...props} className={cx(n.root, className)}>
      {label ? <Label className={n.label}>{label}</Label> : null}
      <Group className={n.group}>
        <Input className={n.input} placeholder={placeholder} />
        <div className={n.stepper}>
          <StepperButton slot="decrement" aria-label="Decrease">
            −
          </StepperButton>
          <StepperButton slot="increment" aria-label="Increase">
            +
          </StepperButton>
        </div>
      </Group>
      {description ? <p className={n.description}>{description}</p> : null}
      <FieldError className={n.error}>{errorMessage ?? ''}</FieldError>
    </AriaNumberField>
  );
}
