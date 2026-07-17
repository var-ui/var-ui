import type { JSX } from 'react';
import { FieldError, Input, Label, TextField as AriaTextField } from 'react-aria-components';
import { textField } from '@var-ui/core';
import type { BaseTextFieldProps } from './utils';
import { recipeProps } from './utils';

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
    <AriaTextField {...props} {...recipeProps(tf.root)}>
      {label ? <Label {...recipeProps(tf.label)}>{label}</Label> : null}
      <Input {...recipeProps(tf.input)} placeholder={placeholder} />
      {description ? <p {...recipeProps(tf.description)}>{description}</p> : null}
      <FieldError {...recipeProps(tf.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
