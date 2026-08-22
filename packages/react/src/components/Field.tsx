import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
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

type FieldPart = 'description' | 'error';

type FieldContextValue = {
  name?: string;
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  setNativeInvalid: (invalid: boolean, message: string) => void;
  describedBy: string | undefined;
  errorMessageId: string | undefined;
  registerControlId: (id: string) => void;
  registerPart: (part: FieldPart) => void;
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

function visitElements(node: ReactNode, visit: (element: ReactElement) => boolean): boolean {
  const list = Children.toArray(node);
  for (const child of list) {
    if (!isValidElement(child)) continue;
    if (visit(child)) return true;
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested != null && visitElements(nested, visit)) return true;
  }
  return false;
}

function treeHasPart(node: ReactNode, type: typeof FieldDescription | typeof FieldError): boolean {
  return visitElements(node, (child) => {
    if (child.type !== type) return false;
    return type === FieldError ? errorPartMounts(child.props as FieldErrorProps) : true;
  });
}

function findControlChildId(node: ReactNode): string | undefined {
  let found: string | undefined;
  visitElements(node, (child) => {
    if (child.type !== FieldControl) return false;
    const controlChild = (child.props as FieldControlProps).children;
    if (isValidElement(controlChild)) {
      found = (controlChild.props as ControlChildProps).id;
    }
    return Boolean(found);
  });
  return found;
}

function FieldRoot({
  name,
  children,
  className,
  invalid,
  onInvalidChange,
  htmlFor,
}: FieldRootProps & { htmlFor?: string }): JSX.Element {
  const generatedId = useId();
  const walkedControlId = findControlChildId(children);
  const [registeredControlId, setRegisteredControlId] = useState<string | undefined>();
  const [parts, setParts] = useState<Set<FieldPart>>(() => {
    const next = new Set<FieldPart>();
    if (treeHasPart(children, FieldDescription)) next.add('description');
    if (treeHasPart(children, FieldError)) next.add('error');
    return next;
  });

  const controlId = htmlFor ?? registeredControlId ?? walkedControlId ?? generatedId;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const isInvalid = Boolean(invalid);
  const errorMessageId = isInvalid && parts.has('error') ? errorId : undefined;
  const describedBy =
    [parts.has('description') ? descriptionId : undefined, errorMessageId]
      .filter(Boolean)
      .join(' ') || undefined;

  const setNativeInvalid = useCallback(
    (nextInvalid: boolean, _message: string) => {
      onInvalidChange?.(nextInvalid);
    },
    [onInvalidChange],
  );

  // Render-phase register (React 18+): wrappers that render Description/Error
  // (or Control) are invisible to the tree walk. Bail if already present so
  // SSR retries stay stable.
  const registerControlId = (id: string) => {
    if (id === controlId) return;
    setRegisteredControlId(id);
  };

  const registerPart = (part: FieldPart) => {
    if (parts.has(part)) return;
    setParts((prev) => {
      if (prev.has(part)) return prev;
      const next = new Set(prev);
      next.add(part);
      return next;
    });
  };

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
      registerControlId,
      registerPart,
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
      parts,
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
  const { name, controlId, invalid, describedBy, errorMessageId, registerControlId } =
    useFieldContext();
  const childProps = children.props as ControlChildProps;
  const childId = childProps.id;
  if (childId) {
    registerControlId(childId);
  }
  return cloneElement(children, {
    id: childId ?? controlId,
    name: childProps.name ?? name,
    className: cx(childProps.className, className) || undefined,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-errormessage': errorMessageId,
  } as Partial<ControlChildProps>);
}

function FieldDescription({ children, className }: FieldDescriptionProps): JSX.Element {
  const { descriptionId, registerPart } = useFieldContext();
  registerPart('description');
  const f = field();
  return (
    <p {...recipeProps(f.description, className)} id={descriptionId}>
      {children}
    </p>
  );
}

function FieldError({ children, className, forceMount }: FieldErrorProps): JSX.Element | null {
  const { errorId, registerPart } = useFieldContext();
  const shouldMount = errorPartMounts({ children, forceMount });
  if (shouldMount) {
    registerPart('error');
  }
  if (!shouldMount) {
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
    <FieldRoot className={className} invalid={Boolean(errorMessage)} htmlFor={htmlFor}>
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
