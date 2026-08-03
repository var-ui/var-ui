import type { JSX, ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { segmentedControl, toggleButton } from '@var-ui/core';
import { observeSegmentedControlIndicator } from '@var-ui/core/internal';
import { recipeProps } from './utils';

export type SegmentedControlOption = {
  id: string;
  label: ReactNode;
  /** Accessible name when `label` is not plain text (e.g. icon-only segments). */
  'aria-label'?: string;
};

export type SegmentedControlProps = Omit<RACToggleButtonGroupProps, 'children' | 'className'> & {
  /** Segment definitions rendered as toggle buttons. */
  options: SegmentedControlOption[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Single-select segmented control built on `ToggleButtonGroup`.
 *
 * ```tsx
 * <SegmentedControl options={[{ id: 'list', label: 'List' }, { id: 'grid', label: 'Grid' }]} />
 * ```
 */
export function SegmentedControl({
  options,
  className,
  size = 'md',
  selectionMode = 'single',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  ...props
}: SegmentedControlProps): JSX.Element {
  const s = segmentedControl({ size });
  const t = toggleButton({ segmented: true });
  const rootRef = useRef<HTMLDivElement>(null);
  const isControlled = selectedKeys !== undefined;
  const [uncontrolledKeys, setUncontrolledKeys] = useState(
    defaultSelectedKeys ?? (options[0] ? [options[0].id] : []),
  );
  const activeKeys = isControlled ? selectedKeys : uncontrolledKeys;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeSegmentedControlIndicator(root);
  }, [activeKeys, options]);

  return (
    <AriaToggleButtonGroup
      {...props}
      ref={rootRef}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={(keys) => {
        if (!isControlled) {
          setUncontrolledKeys([...keys]);
        }
        onSelectionChange?.(keys);
      }}
      {...recipeProps(s.root, className)}
    >
      {options.map((option) => (
        <AriaToggleButton
          key={option.id}
          id={option.id}
          aria-label={option['aria-label']}
          {...recipeProps(t)}
        >
          {option.label}
        </AriaToggleButton>
      ))}
    </AriaToggleButtonGroup>
  );
}

export type ToggleButtonProps = Omit<RACToggleButtonProps, 'className'> & {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

/** Standalone toggle button for toolbars and filters. */
export function ToggleButton({
  className,
  size = 'md',
  children,
  ...props
}: ToggleButtonProps): JSX.Element {
  const t = toggleButton({ size });
  return (
    <AriaToggleButton {...props} {...recipeProps(t, className)}>
      {children}
    </AriaToggleButton>
  );
}
