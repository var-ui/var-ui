import type { JSX } from 'react';
import { useState } from 'react';
import { FieldError, Input, Label, TextField as AriaTextField } from 'react-aria-components';
import { passwordField, type ControlSize } from '@var-ui/core';
import { Icon } from '../icons';
import type { BaseTextFieldProps } from './utils';
import { recipeProps } from './utils';

export type PasswordInputProps = BaseTextFieldProps & {
  placeholder?: string;
  size?: ControlSize;
};

/**
 * Password field with show/hide visibility toggle. Mantine `PasswordInput`
 * equivalent built on the `passwordField` recipe.
 */
export function PasswordInput({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  isDisabled,
  ...props
}: PasswordInputProps): JSX.Element {
  const pf = passwordField({ size });
  const [visible, setVisible] = useState(false);

  return (
    <AriaTextField
      {...props}
      isDisabled={isDisabled}
      isInvalid={errorMessage ? true : undefined}
      {...recipeProps(pf.root)}
    >
      {label ? <Label {...recipeProps(pf.label)}>{label}</Label> : null}
      <div {...recipeProps(pf.inputWrapper)} data-disabled={isDisabled || undefined}>
        <Input
          {...recipeProps(pf.input)}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
        />
        <button
          type="button"
          {...recipeProps(pf.visibilityToggle)}
          onClick={() => setVisible((v) => !v)}
          disabled={isDisabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size="sm" />
        </button>
      </div>
      {description ? <p {...recipeProps(pf.description)}>{description}</p> : null}
      <FieldError {...recipeProps(pf.error)}>{errorMessage ?? ''}</FieldError>
    </AriaTextField>
  );
}
