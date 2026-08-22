import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  type JSX,
  type ReactElement,
  type ReactNode,
} from 'react';
import { field } from '@var-ui/core';
import { cx, recipeProps } from './utils';

export type FieldProps = {
  /** Visible label rendered above the control. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  /** id of the wrapped control, wired to the label's `htmlFor`. */
  htmlFor?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** The input or custom control to wrap with field chrome. */
  children: ReactNode;
};

export type FieldRootProps = {
  name?: string;
  children: ReactNode;
  className?: string;
  invalid?: boolean;
  onInvalidChange?: (invalid: boolean) => void;
};

export type FieldLabelProps = { children: ReactNode; className?: string };
export type FieldControlProps = { children: ReactElement; className?: string };
export type FieldDescriptionProps = { children: ReactNode; className?: string };
export type FieldErrorProps = {
  children?: ReactNode;
  className?: string;
  forceMount?: boolean;
};

type FieldContextValue = {
  name?: string;
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  setNativeInvalid: (invalid: boolean, message: string) => void;
  describedBy: string | undefined;
};

type ControlChildProps = {
  id?: string;
  name?: string;
  className?: string;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error('Field compound components must be rendered inside <Field.Root>.');
  }
  return ctx;
}

function controlChildId(children: ReactNode): string | undefined {
  const list = Children.toArray(children);
  for (const child of list) {
    if (!isValidElement(child) || child.type !== FieldControl) continue;
    const controlChild = (child.props as FieldControlProps).children;
    if (isValidElement(controlChild)) {
      return (controlChild.props as ControlChildProps).id;
    }
  }
  return undefined;
}

function FieldRoot({
  name,
  children,
  className,
  invalid,
  onInvalidChange,
}: FieldRootProps): JSX.Element {
  const generatedId = useId();
  const controlId = controlChildId(children) ?? generatedId;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const isInvalid = Boolean(invalid);
  const describedBy = [descriptionId, isInvalid ? errorId : undefined].filter(Boolean).join(' ');

  const setNativeInvalid = useCallback(
    (nextInvalid: boolean, _message: string) => {
      onInvalidChange?.(nextInvalid);
    },
    [onInvalidChange],
  );

  const value = useMemo<FieldContextValue>(
    () => ({
      name,
      controlId,
      descriptionId,
      errorId,
      invalid: isInvalid,
      setNativeInvalid,
      describedBy: describedBy || undefined,
    }),
    [name, controlId, descriptionId, errorId, isInvalid, setNativeInvalid, describedBy],
  );

  const f = field();
  return (
    <FieldContext.Provider value={value}>
      <div {...recipeProps(f.root, className)}>{children}</div>
    </FieldContext.Provider>
  );
}

function FieldLabel({ children, className }: FieldLabelProps): JSX.Element {
  const { controlId } = useFieldContext();
  const f = field();
  return (
    <label {...recipeProps(f.label, className)} htmlFor={controlId}>
      {children}
    </label>
  );
}

function FieldControl({ children, className }: FieldControlProps): ReactElement {
  const { name, controlId, errorId, invalid, describedBy } = useFieldContext();
  const childProps = children.props as ControlChildProps;
  return cloneElement(children, {
    id: childProps.id ?? controlId,
    name: childProps.name ?? name,
    className: cx(childProps.className, className) || undefined,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-errormessage': invalid ? errorId : undefined,
  } as Partial<ControlChildProps>);
}

function FieldDescription({ children, className }: FieldDescriptionProps): JSX.Element {
  const { descriptionId } = useFieldContext();
  const f = field();
  return (
    <p {...recipeProps(f.description, className)} id={descriptionId}>
      {children}
    </p>
  );
}

function FieldError({ children, className, forceMount }: FieldErrorProps): JSX.Element | null {
  const { errorId } = useFieldContext();
  if (
    !forceMount &&
    (children === undefined || children === null || children === false || children === '')
  ) {
    return null;
  }
  const f = field();
  return (
    <p {...recipeProps(f.error, className)} id={errorId} role="alert">
      {children}
    </p>
  );
}

/**
 * Field chrome for custom inputs: label, description, and error message
 * around any control that isn't one of the built-in field components.
 *
 * ```tsx
 * <Field label="Amount" description="In USD" htmlFor="amount">
 *   <MyCurrencyInput id="amount" />
 * </Field>
 *
 * <Field.Root>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control>
 *     <input />
 *   </Field.Control>
 * </Field.Root>
 * ```
 */
function Field({
  label,
  description,
  errorMessage,
  htmlFor,
  className,
  children,
}: FieldProps): JSX.Element {
  return (
    <FieldRoot className={className} invalid={Boolean(errorMessage)}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <FieldControl>
        {isValidElement(children) ? (
          cloneElement(children as ReactElement<ControlChildProps>, {
            id: htmlFor ?? (children.props as ControlChildProps).id,
          })
        ) : (
          <></>
        )}
      </FieldControl>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </FieldRoot>
  );
}

export const FieldNamespace = Object.assign(Field, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});

export { FieldNamespace as Field };
