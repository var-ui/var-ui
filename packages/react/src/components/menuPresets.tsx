import type { JSX, MouseEvent, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { MenuTrigger, Popover, Pressable, type MenuTriggerProps } from 'react-aria-components';
import { menu } from '@var-ui/core';
import { IconButton } from './IconButton';
import { MenuContent, type MenuContentProps } from './menuContent';
import { mergeProps } from './utils';

export type MenuFromSectionsProps = Omit<MenuTriggerProps, 'children' | 'trigger'> &
  MenuContentProps & {
    /** Trigger element (usually a `Button`). */
    trigger: JSX.Element;
  };

/** Data preset: pass a `trigger` and `sections` of items. */
export function MenuFromSections({
  trigger,
  sections,
  ...props
}: MenuFromSectionsProps): JSX.Element {
  const m = menu();
  return (
    <MenuTrigger {...props}>
      {trigger}
      <Popover {...mergeProps(m.popover)}>
        <MenuContent sections={sections} />
      </Popover>
    </MenuTrigger>
  );
}

export type MenuContextMenuProps = MenuContentProps & {
  /** A single host element (e.g. `<div>`) — `Pressable` requires a DOM element it can forward a ref to. */
  children: ReactElement<any, string>;
};

/** Right-click menu anchored to the wrapped surface. */
export function MenuContextMenu({ children, sections }: MenuContextMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const m = menu();

  const trigger = cloneElement(children, {
    onContextMenu: (event: MouseEvent) => {
      event.preventDefault();
      setOpen(true);
    },
  }) as ReactElement<any, string>;

  return (
    <MenuTrigger isOpen={open} onOpenChange={setOpen}>
      <Pressable>{trigger}</Pressable>
      <Popover {...mergeProps(m.popover)}>
        <MenuContent sections={sections} />
      </Popover>
    </MenuTrigger>
  );
}

export type MenuOverflowProps = MenuContentProps & {
  /** Accessible label for the overflow trigger. @default More options */
  'aria-label'?: string;
};

/** Icon-only overflow menu using the `moreHorizontal` registry glyph. */
export function MenuOverflow({
  sections,
  'aria-label': ariaLabel = 'More options',
}: MenuOverflowProps): JSX.Element {
  return (
    <MenuFromSections
      sections={sections}
      trigger={<IconButton name="moreHorizontal" aria-label={ariaLabel} intent="ghost" size="sm" />}
    />
  );
}
