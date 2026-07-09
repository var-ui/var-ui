import type { JSX } from 'react';
import { FieldError, Input, Label, TextField as AriaTextField } from 'react-aria-components';
import { textField } from '@var-ui/core';
import type { BaseTextFieldProps } from './utils';

export type TextFieldProps = BaseTextFieldProps & {
  /** Placeholder text shown when the input is empty. */
  placeholder?: string;
};

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: TextFieldProps): JSX.Element {
  const tf = textField();
  return (
    <AriaTextField {...props} className={tf.root}>
      {label ? <Label className={tf.label}>{label}</Label> : null}
      <Input className={tf.input} placeholder={placeholder} />
      {description ? <p className={tf.description}>{description}</p> : null}
      <FieldError className={tf.error}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
