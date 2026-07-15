import type { JSX } from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  Popover,
  Separator,
  type MenuTriggerProps,
} from 'react-aria-components';
import { menu } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type MenuItemDefinition = {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onAction?: () => void;
};

export type MenuSectionDefinition = {
  label?: string;
  items: MenuItemDefinition[];
};

export type MenuContentProps = {
  sections: MenuSectionDefinition[];
};

export function MenuContent({ sections }: MenuContentProps): JSX.Element {
  const m = menu();
  const nodes: JSX.Element[] = [];

  sections.forEach((section, sectionIndex) => {
    if (section.label) {
      nodes.push(
        <Header key={`header-${sectionIndex}`} className={m.sectionHeader}>
          {section.label}
        </Header>,
      );
    }
    section.items.forEach((item) => {
      nodes.push(
        <AriaMenuItem
          key={item.id}
          id={item.id}
          textValue={item.label}
          isDisabled={item.disabled}
          onAction={item.onAction}
          className={cx(m.item, item.danger ? m.itemDanger : undefined)}
        >
          {({ isSelected }) => (
            <>
              <span className={m.itemCheck}>
                {isSelected ? <Icon name="check" size="sm" /> : null}
              </span>
              <span className={m.itemLabel}>{item.label}</span>
              {item.shortcut ? <span className={m.itemShortcut}>{item.shortcut}</span> : null}
            </>
          )}
        </AriaMenuItem>,
      );
    });
    if (sectionIndex < sections.length - 1) {
      nodes.push(<Separator key={`sep-${sectionIndex}`} className={m.separator} />);
    }
  });

  return (
    <AriaMenu className={m.menu} selectionMode="none">
      {nodes}
    </AriaMenu>
  );
}

export type DropdownMenuProps = Omit<MenuTriggerProps, 'children' | 'trigger'> &
  MenuContentProps & {
    /** Trigger element (usually a `Button`). */
    trigger: JSX.Element;
  };

export function DropdownMenu({ trigger, sections, ...props }: DropdownMenuProps): JSX.Element {
  const m = menu();
  return (
    <MenuTrigger {...props}>
      {trigger}
      <Popover className={m.popover}>
        <MenuContent sections={sections} />
      </Popover>
    </MenuTrigger>
  );
}
