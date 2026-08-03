import type { FormRule } from './types';

export const isNotEmpty: FormRule<unknown> = (value) => {
  if (value == null) return 'This field is required';
  if (typeof value === 'string' && value.trim().length === 0) return 'This field is required';
  if (Array.isArray(value) && value.length === 0) return 'This field is required';
  return null;
};

export const isEmail: FormRule<string> = (value) => {
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address';
};

export function hasLength(min: number, max?: number): FormRule<string> {
  return (value) => {
    if (!value) return null;
    if (value.length < min) return `Must be at least ${min} characters`;
    if (max != null && value.length > max) return `Must be at most ${max} characters`;
    return null;
  };
}

export const matchesField =
  <Values extends Record<string, unknown>, K extends keyof Values>(
    otherField: K,
    message = 'Fields do not match',
  ): FormRule<unknown> =>
  (value, values) =>
    value === values[otherField as string] ? null : message;

export function isInRange(min: number, max: number): FormRule<number> {
  return (value) => {
    if (value == null || Number.isNaN(value)) return null;
    if (value < min || value > max) return `Must be between ${min} and ${max}`;
    return null;
  };
}

export const isUrl: FormRule<string> = (value) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return 'Invalid URL';
  }
};
