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
  errorMessageId: string | undefined;
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

function errorPartMounts(props: FieldErrorProps): boolean {
  const { children, forceMount } = props;
  return Boolean(
    forceMount ||
    !(children === undefined || children === null || children === false || children === ''),
  );
}

/** Walk the tree so describedby is correct on the first paint, including SSR. */
function treeHasPart(node: ReactNode, type: typeof FieldDescription | typeof FieldError): boolean {
  const list = Children.toArray(node);
  for (const child of list) {
    if (!isValidElement(child)) continue;
    if (child.type === type) {
      return type === FieldError ? errorPartMounts(child.props as FieldErrorProps) : true;
    }
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested != null && treeHasPart(nested, type)) return true;
  }
  return false;
}

function FieldRoot({
  name,
  children,
  className,
  invalid,
  onInvalidChange,
}: FieldRootProps): JSX.Element {
  const controlId = useId();
  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;
  const isInvalid = Boolean(invalid);
  const hasDescription = treeHasPart(children, FieldDescription);
  const hasError = treeHasPart(children, FieldError);
  const errorMessageId = isInvalid && hasError ? errorId : undefined;
  const describedBy =
    [hasDescription ? descriptionId : undefined, errorMessageId].filter(Boolean).join(' ') ||
    undefined;

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
      describedBy,
      errorMessageId,
    }),
    [
      name,
      controlId,
      descriptionId,
      errorId,
      isInvalid,
      setNativeInvalid,
      describedBy,
      errorMessageId,
    ],
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
  const { name, controlId, invalid, describedBy, errorMessageId } = useFieldContext();
  const childProps = children.props as ControlChildProps;
  return cloneElement(children, {
    // Always the Root useId() so Label and Control share one id on first paint
    // (SSR included). An explicit child id is overwritten.
    id: controlId,
    name: childProps.name ?? name,
    className: cx(childProps.className, className) || undefined,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-errormessage': errorMessageId,
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
  if (!errorPartMounts({ children, forceMount })) {
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
