import type { ComponentAttrsResult } from 'typestyles';
import { cx } from 'typestyles';

export { cx };

export type RecipeClass = string | ComponentAttrsResult;

export function recipeClassName(result: RecipeClass, className?: string | false | null): string {
  if (typeof result === 'string') {
    return cx(result, className);
  }
  return cx(result.className, className);
}

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
