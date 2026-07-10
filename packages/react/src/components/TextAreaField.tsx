import type { JSX } from 'react';
import { FieldError, Label, TextArea, TextField as AriaTextField } from 'react-aria-components';
import { textAreaField } from '@var-ui/core';
import type { BaseTextFieldProps } from './utils';

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
    <AriaTextField {...props} className={field.root}>
      {label ? <Label className={field.label}>{label}</Label> : null}
      <TextArea className={field.input} placeholder={placeholder} />
      {description ? <p className={field.description}>{description}</p> : null}
      <FieldError className={field.error}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
