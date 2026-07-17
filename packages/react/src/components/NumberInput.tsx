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
import { recipeProps } from './utils';
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
    <AriaNumberField {...props} {...recipeProps(n.root, className)}>
      {label ? <Label {...recipeProps(n.label)}>{label}</Label> : null}
      <Group {...recipeProps(n.group)}>
        <Input {...recipeProps(n.input)} placeholder={placeholder} />
        <div {...recipeProps(n.stepper)}>
          <StepperButton slot="decrement" aria-label="Decrease">
            −
          </StepperButton>
          <StepperButton slot="increment" aria-label="Increase">
            +
          </StepperButton>
        </div>
      </Group>
      {description ? <p {...recipeProps(n.description)}>{description}</p> : null}
      <FieldError {...recipeProps(n.error)}>{errorMessage ?? ''}</FieldError>
    </AriaNumberField>
  );
}
