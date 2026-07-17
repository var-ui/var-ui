import type { JSX } from 'react';
import { FieldError, Label, TextArea, TextField as AriaTextField } from 'react-aria-components';
import { textAreaField } from '@var-ui/core';
import type { BaseTextFieldProps } from './utils';
import { recipeProps } from './utils';

export type TextAreaFieldProps = BaseTextFieldProps & {
  /** Placeholder text shown when the textarea is empty. */
  placeholder?: string;
};

export function TextAreaField({
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: TextAreaFieldProps): JSX.Element {
  const field = textAreaField();
  return (
    <AriaTextField {...props} {...recipeProps(field.root)}>
      {label ? <Label {...recipeProps(field.label)}>{label}</Label> : null}
      <TextArea {...recipeProps(field.input)} placeholder={placeholder} />
      {description ? <p {...recipeProps(field.description)}>{description}</p> : null}
      <FieldError {...recipeProps(field.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
