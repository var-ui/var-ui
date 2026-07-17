import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import type { ComponentAttrsResult } from 'typestyles';
import { cx } from 'typestyles';

export { cx };

export type FieldMeta = {
  /** Visible label rendered above the control. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
};

export type BaseTextFieldProps = Omit<AriaTextFieldProps, 'children'> & FieldMeta;

export type RecipeClass = string | ComponentAttrsResult;

/** Coerce a recipe slot/result to a class string (no variant attrs). */
export function recipeClassName(result: RecipeClass, className?: string | false | null): string {
  if (typeof result === 'string') {
    return cx(result, className);
  }
  return cx(result.className, className);
}

/** Merge recipe attribute result with optional extra className for DOM spread. */
export function recipeProps(
  result: RecipeClass,
  className?: string | false | null,
): { className: string } & Record<string, string> {
  if (typeof result === 'string') {
    return { className: cx(result, className) };
  }
  return {
    ...result.attrs,
    className: cx(result.className, className),
  };
}
