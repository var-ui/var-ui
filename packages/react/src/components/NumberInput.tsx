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
import { mergeProps } from './utils';
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
    <AriaNumberField {...props} {...mergeProps(n.root, className)}>
      {label ? <Label {...mergeProps(n.label)}>{label}</Label> : null}
      <Group {...mergeProps(n.group)}>
        <Input {...mergeProps(n.input)} placeholder={placeholder} />
        <div {...mergeProps(n.stepper)}>
          <StepperButton slot="decrement" aria-label="Decrease">
            −
          </StepperButton>
          <StepperButton slot="increment" aria-label="Increase">
            +
          </StepperButton>
        </div>
      </Group>
      {description ? <p {...mergeProps(n.description)}>{description}</p> : null}
      <FieldError {...mergeProps(n.error)}>{errorMessage ?? ''}</FieldError>
    </AriaNumberField>
  );
}
