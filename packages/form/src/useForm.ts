import { useCallback, useMemo, useRef, useState } from 'react';
import type { FormErrors, FormTouched, UseFormInput, UseFormReturn } from './types';

function runFieldValidation<Values extends Record<string, unknown>>(
  field: keyof Values,
  value: Values[keyof Values],
  values: Values,
  validate: UseFormInput<Values>['validate'],
): string | undefined {
  const rule = validate?.[field];
  if (!rule) return undefined;
  const result = rule(value, values);
  return result ?? undefined;
}

function validateAll<Values extends Record<string, unknown>>(
  values: Values,
  validate: UseFormInput<Values>['validate'],
): FormErrors<Values> {
  if (!validate) return {};
  const errors: FormErrors<Values> = {};
  for (const field of Object.keys(validate) as (keyof Values)[]) {
    const message = runFieldValidation(field, values[field], values, validate);
    if (message) errors[field] = message;
  }
  return errors;
}

/**
 * Lightweight form state for var-ui field components. Returns `getInputProps()`
 * compatible with `TextField`, `TextAreaField`, and other `FieldMeta` consumers.
 */
export function useForm<Values extends Record<string, unknown>>({
  initialValues,
  validate,
  validateOnBlur = true,
  validateOnChange = false,
}: UseFormInput<Values>): UseFormReturn<Values> {
  const [values, setValuesState] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<Values>>({});
  const [touched, setTouched] = useState<FormTouched<Values>>({});
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [initialValues, values],
  );

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const setFieldValue = useCallback(
    <K extends keyof Values>(field: K, value: Values[K]) => {
      setValuesState((current) => {
        const next = { ...current, [field]: value };
        if (validateOnChange && validate?.[field]) {
          const message = runFieldValidation(field, value, next, validate);
          setErrors((prev) => {
            const updated = { ...prev };
            if (message) updated[field] = message;
            else delete updated[field];
            return updated;
          });
        }
        return next;
      });
    },
    [validate, validateOnChange],
  );

  const setValues = useCallback((patch: Partial<Values>) => {
    setValuesState((current) => ({ ...current, ...patch }));
  }, []);

  const setFieldError = useCallback(
    <K extends keyof Values>(field: K, error: string | undefined) => {
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[field] = error;
        else delete next[field];
        return next;
      });
    },
    [],
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  const validateField = useCallback(
    <K extends keyof Values>(field: K) => {
      const message = runFieldValidation(
        field,
        valuesRef.current[field],
        valuesRef.current,
        validate,
      );
      setFieldError(field, message);
      return message;
    },
    [setFieldError, validate],
  );

  const validateForm = useCallback(() => {
    const nextErrors = validateAll(valuesRef.current, validate);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [validate]);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const getInputProps = useCallback(
    <K extends keyof Values>(field: K) => ({
      name: String(field),
      value: values[field],
      onChange: (value: Values[K]) => setFieldValue(field, value),
      onBlur: () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (validateOnBlur) validateField(field);
      },
      errorMessage: touched[field] ? errors[field] : undefined,
      isInvalid: touched[field] ? Boolean(errors[field]) : undefined,
    }),
    [errors, setFieldValue, touched, validateField, validateOnBlur, values],
  );

  const handleSubmit = useCallback(
    (onValid: (values: Values) => void | Promise<void>) =>
      async (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.();
        const allTouched = Object.keys(initialValues).reduce<FormTouched<Values>>((acc, key) => {
          acc[key as keyof Values] = true;
          return acc;
        }, {});
        setTouched(allTouched);
        if (!validateForm()) return;
        await onValid(valuesRef.current);
      },
    [initialValues, validateForm],
  );

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setFieldValue,
    setValues,
    setFieldError,
    clearErrors,
    validateField,
    validate: validateForm,
    reset,
    getInputProps,
    handleSubmit,
  };
}
