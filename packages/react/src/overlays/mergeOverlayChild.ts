import { cloneElement, isValidElement, type ReactElement, type Ref, type RefCallback } from 'react';
import { cx } from 'typestyles';

type OverlayChildProps = Record<string, unknown> & { ref?: Ref<unknown> };

const composedHandlerNames = ['onPress', 'onClick', 'onKeyDown', 'onPointerDown'] as const;

function setRef<T>(ref: NonNullable<Ref<T>>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else {
    (ref as { current: T | null }).current = value;
  }
}

function composeRefs<T>(first: NonNullable<Ref<T>>, second: NonNullable<Ref<T>>): RefCallback<T> {
  return (value) => {
    setRef(first, value);
    setRef(second, value);
  };
}

function composeHandlers(childHandler: unknown, overlayHandler: unknown): unknown {
  if (typeof childHandler !== 'function') {
    return overlayHandler;
  }
  if (typeof overlayHandler !== 'function') {
    return childHandler;
  }

  return (...args: unknown[]) => {
    childHandler(...args);
    overlayHandler(...args);
  };
}

export function mergeOverlayChild(child: ReactElement, props: OverlayChildProps): ReactElement {
  if (!isValidElement(child)) {
    throw new Error('Overlay Trigger and Close require a single React element child');
  }

  const childProps = child.props as OverlayChildProps;
  const mergedProps: OverlayChildProps = {
    ...props,
    className: cx(
      childProps.className as string | undefined,
      props.className as string | undefined,
    ),
  };

  for (const handlerName of composedHandlerNames) {
    mergedProps[handlerName] = composeHandlers(childProps[handlerName], props[handlerName]);
  }

  if (childProps.ref && props.ref) {
    mergedProps.ref = composeRefs(childProps.ref, props.ref);
  } else {
    mergedProps.ref = props.ref ?? childProps.ref;
  }

  return cloneElement(child, mergedProps);
}
