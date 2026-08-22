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

type ControlReport = {
  dirty: boolean;
  filled: boolean;
  nativeInvalid: boolean;
  nativeMessage: string;
  touched?: boolean;
};

type FieldContextValue = {
  name?: string;
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  nativeMessage: string;
  setNativeInvalid: (invalid: boolean, message: string) => void;
  reportControl: (report: ControlReport) => void;
  describedBy: string | undefined;
  errorMessageId: string | undefined;
};

type ControlEvent = {
  currentTarget: EventTarget;
  type: string;
};

type ControlChildProps = {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string | number | readonly string[];
  value?: string | number | readonly string[];
  defaultChecked?: boolean;
  checked?: boolean;
  type?: string;
  onBlur?: (event: ControlEvent) => void;
  onInput?: (event: ControlEvent) => void;
  onChange?: (event: ControlEvent) => void;
  onInvalid?: (event: ControlEvent) => void;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error('Field compound components must be rendered inside <Field.Root>.');
  }
  return ctx;
}

function errorPartMounts(props: FieldErrorProps, nativeMessage = ''): boolean {
  const { children, forceMount } = props;
  return Boolean(
    forceMount ||
    !(children === undefined || children === null || children === false || children === '') ||
    nativeMessage,
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

function treeHasPart(
  node: ReactNode,
  type: typeof FieldDescription | typeof FieldError,
  nativeMessage = '',
): boolean {
  return visitElements(node, (child) => {
    if (child.type !== type) return false;
    return type === FieldError
      ? errorPartMounts(child.props as FieldErrorProps, nativeMessage)
      : true;
  });
}

function isWalkedFilled(props: ControlChildProps): boolean {
  if (props.type === 'checkbox' || props.type === 'radio') {
    return Boolean(props.checked ?? props.defaultChecked);
  }
  const value = props.value ?? props.defaultValue;
  if (value == null) return false;
  if (typeof value === 'number') return true;
  if (typeof value === 'string') return value !== '';
  return value.length > 0;
}

function findControlChild(node: ReactNode): {
  id?: string;
  disabled: boolean;
  filled: boolean;
} {
  let found: { id?: string; disabled: boolean; filled: boolean } = {
    disabled: false,
    filled: false,
  };
  visitElements(node, (child) => {
    if (child.type !== FieldControl) return false;
    const controlChild = (child.props as FieldControlProps).children;
    if (!isValidElement(controlChild)) return false;
    const props = controlChild.props as ControlChildProps;
    found = {
      id: props.id,
      disabled: Boolean(props.disabled),
      filled: isWalkedFilled(props),
    };
    return true;
  });
  return found;
}

function asConstraintElement(
  target: EventTarget | null,
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  ) {
    return target;
  }
  return null;
}

function controlIsFilled(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    return el.checked;
  }
  return el.value !== '';
}

function controlIsDirty(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    return el.checked !== el.defaultChecked;
  }
  const defaultValue = 'defaultValue' in el ? String(el.defaultValue) : '';
  return el.value !== defaultValue;
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
  const walkedControl = findControlChild(children);
  const controlId = walkedControl.id ?? htmlFor ?? generatedId;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const [nativeInvalid, setNativeInvalidState] = useState(false);
  const [nativeMessage, setNativeMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [filledOverride, setFilledOverride] = useState<boolean | undefined>(undefined);
  const hasErrorChildren = treeHasPart(children, FieldError);
  const isInvalid = Boolean(invalid) || nativeInvalid || hasErrorChildren;
  const hasDescription = treeHasPart(children, FieldDescription);
  const hasError = treeHasPart(children, FieldError, nativeMessage);
  const errorMessageId = isInvalid && hasError ? errorId : undefined;
  const describedBy =
    [hasDescription ? descriptionId : undefined, errorMessageId].filter(Boolean).join(' ') ||
    undefined;
  const isFilled = filledOverride ?? walkedControl.filled;
  const isValid = (touched || dirty) && !isInvalid;

  const setNativeInvalid = useCallback(
    (nextInvalid: boolean, message: string) => {
      setNativeInvalidState(nextInvalid);
      setNativeMessage(message);
      onInvalidChange?.(nextInvalid);
    },
    [onInvalidChange],
  );

  const reportControl = useCallback(
    (report: ControlReport) => {
      setNativeInvalidState(report.nativeInvalid);
      setNativeMessage(report.nativeMessage);
      setDirty(report.dirty);
      setFilledOverride(report.filled);
      if (report.touched) setTouched(true);
      onInvalidChange?.(report.nativeInvalid);
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
      nativeMessage,
      setNativeInvalid,
      reportControl,
      describedBy,
      errorMessageId,
    }),
    [
      name,
      controlId,
      descriptionId,
      errorId,
      isInvalid,
      nativeMessage,
      setNativeInvalid,
      reportControl,
      describedBy,
      errorMessageId,
    ],
  );

  const f = field();
  return (
    <FieldContext.Provider value={value}>
      <div
        {...recipeProps(f.root, className)}
        data-invalid={isInvalid ? '' : undefined}
        data-valid={isValid ? '' : undefined}
        data-dirty={dirty ? '' : undefined}
        data-touched={touched ? '' : undefined}
        data-filled={isFilled ? '' : undefined}
        data-disabled={walkedControl.disabled ? '' : undefined}
      >
        {children}
      </div>
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
  const { name, controlId, invalid, describedBy, errorMessageId, reportControl } =
    useFieldContext();
  const childProps = children.props as ControlChildProps;

  const reportFromEvent = (event: ControlEvent) => {
    const el = asConstraintElement(event.currentTarget);
    if (!el) return;
    reportControl({
      dirty: controlIsDirty(el),
      filled: controlIsFilled(el),
      nativeInvalid: !el.validity.valid,
      nativeMessage: el.validationMessage,
      touched: event.type === 'blur',
    });
  };

  return cloneElement(children, {
    id: childProps.id ?? controlId,
    name: childProps.name ?? name,
    className: cx(childProps.className, className) || undefined,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-errormessage': errorMessageId,
    onBlur: (event: ControlEvent) => {
      childProps.onBlur?.(event);
      reportFromEvent(event);
    },
    onInput: (event: ControlEvent) => {
      childProps.onInput?.(event);
      reportFromEvent(event);
    },
    onChange: (event: ControlEvent) => {
      childProps.onChange?.(event);
      reportFromEvent(event);
    },
    onInvalid: (event: ControlEvent) => {
      childProps.onInvalid?.(event);
      reportFromEvent(event);
    },
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
  const { errorId, nativeMessage } = useFieldContext();
  const hasExplicitChildren = !(children === undefined || children === null || children === false);
  const content = hasExplicitChildren ? children : nativeMessage;
  if (!errorPartMounts({ children: content, forceMount })) {
    return null;
  }
  const f = field();
  return (
    <p {...recipeProps(f.error, className)} id={errorId} role="alert">
      {content}
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
