export type FormErrors<Values> = Partial<Record<keyof Values, string>>;
export type FormTouched<Values> = Partial<Record<keyof Values, boolean>>;

export type FormRule<Value> = (
  value: Value,
  values: Record<string, unknown>,
) => string | null | undefined;

export type FormRules<Values extends Record<string, unknown>> = {
  [K in keyof Values]?: FormRule<Values[K]>;
};

export type UseFormInput<Values extends Record<string, unknown>> = {
  initialValues: Values;
  validate?: FormRules<Values>;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
};

export type FieldInputProps<Value> = {
  name: string;
  value: Value;
  onChange: (value: Value) => void;
  onBlur: () => void;
  errorMessage?: string;
  isInvalid?: boolean;
};

export type UseFormReturn<Values extends Record<string, unknown>> = {
  values: Values;
  errors: FormErrors<Values>;
  touched: FormTouched<Values>;
  isValid: boolean;
  isDirty: boolean;
  setFieldValue: <K extends keyof Values>(field: K, value: Values[K]) => void;
  setValues: (values: Partial<Values>) => void;
  setFieldError: <K extends keyof Values>(field: K, error: string | undefined) => void;
  clearErrors: () => void;
  validateField: <K extends keyof Values>(field: K) => string | undefined;
  validate: () => boolean;
  reset: () => void;
  getInputProps: <K extends keyof Values>(field: K) => FieldInputProps<Values[K]>;
  handleSubmit: (
    onValid: (values: Values) => void | Promise<void>,
  ) => (event?: { preventDefault?: () => void }) => Promise<void>;
};
