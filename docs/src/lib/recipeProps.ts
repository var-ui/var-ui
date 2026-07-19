import type { ComponentAttrsResult } from 'typestyles';
import { cx } from 'typestyles';

export type RecipeClass = string | ComponentAttrsResult;

/** Copied from `@var-ui/astro` utils — barrel import pulls `.astro` files and breaks Vitest. */
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
