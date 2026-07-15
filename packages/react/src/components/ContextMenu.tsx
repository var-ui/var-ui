import type { JSX, MouseEvent, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { MenuTrigger, Popover, Pressable } from 'react-aria-components';
import { menu } from '@var-ui/core';
import { MenuContent, type MenuContentProps } from './DropdownMenu';

export type ContextMenuProps = MenuContentProps & {
  /** A single host element (e.g. `<div>`) — `Pressable` requires a DOM element it can forward a ref to. */
  children: ReactElement<any, string>;
};

/**
 * Right-click menu anchored to the wrapped surface.
 */
export function ContextMenu({ children, sections }: ContextMenuProps): JSX.Element {
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
      <Popover className={m.popover}>
        <MenuContent sections={sections} />
      </Popover>
    </MenuTrigger>
  );
}
