import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
export { cx } from 'typestyles';

export type FieldMeta = {
  /** Visible label rendered above the control. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
};

export type BaseTextFieldProps = Omit<AriaTextFieldProps, 'children'> & FieldMeta;
