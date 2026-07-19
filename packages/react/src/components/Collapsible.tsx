import type { JSX, ReactNode } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';
import { collapsible } from '@var-ui/core';
import { Icon } from '../icons';
import { recipeProps } from './utils';

export type CollapsibleProps = {
  /** Stable id when used inside `CollapsibleGroup` (maps to RAC `Disclosure` id / expanded keys). */
  id?: string;
  /** Default trigger label when `trigger` is omitted. */
  title?: ReactNode;
  /** Overrides the default title + chevron trigger contents. */
  trigger?: ReactNode;
  children: ReactNode;
  /** Controlled expanded state. */
  isExpanded?: boolean;
  /** Uncontrolled initial expanded state. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Visual treatment. @default flush */
  variant?: 'flush' | 'bordered';
  className?: string;
};

export type CollapsibleGroupProps = {
  children: ReactNode;
  /**
   * When true, multiple panels may stay open.
   * When false (default), opening one panel collapses the others.
   */
  allowsMultipleExpanded?: boolean;
  className?: string;
};

/**
 * Expand/collapse panel built on RAC `Disclosure` / `DisclosurePanel`.
 *
 * ```tsx
 * <Collapsible title="Show code" defaultExpanded={false}>
 *   <pre>{code}</pre>
 * </Collapsible>
 * ```
 */
export function Collapsible({
  id,
  title,
  trigger,
  children,
  isExpanded,
  defaultExpanded,
  onExpandedChange,
  variant = 'flush',
  className,
}: CollapsibleProps): JSX.Element {
  const c = collapsible({ variant });
  return (
    <Disclosure
      id={id}
      isExpanded={isExpanded}
      defaultExpanded={defaultExpanded}
      onExpandedChange={onExpandedChange}
      {...recipeProps(c.root, className)}
    >
      <Heading level={3} style={{ margin: 0 }}>
        <AriaButton slot="trigger" {...recipeProps(c.trigger)}>
          {trigger ?? (
            <>
              <span {...recipeProps(c.triggerIcon)}>
                <Icon name="chevronDown" size="sm" />
              </span>
              {title}
            </>
          )}
        </AriaButton>
      </Heading>
      <DisclosurePanel {...recipeProps(c.panel)}>{children}</DisclosurePanel>
    </Disclosure>
  );
}

/**
 * Groups related `Collapsible` panels (accordion). Pass matching `id` on each child.
 *
 * ```tsx
 * <CollapsibleGroup>
 *   <Collapsible id="a" title="Alpha">…</Collapsible>
 *   <Collapsible id="b" title="Beta">…</Collapsible>
 * </CollapsibleGroup>
 * ```
 */
export function CollapsibleGroup({
  children,
  allowsMultipleExpanded = false,
  className,
}: CollapsibleGroupProps): JSX.Element {
  return (
    <DisclosureGroup allowsMultipleExpanded={allowsMultipleExpanded} className={className}>
      {children}
    </DisclosureGroup>
  );
}
