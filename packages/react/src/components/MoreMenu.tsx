import type { JSX } from 'react';
import { IconButton } from './IconButton';
import { DropdownMenu, type MenuContentProps } from './DropdownMenu';

export type MoreMenuProps = MenuContentProps & {
  /** Accessible label for the overflow trigger. @default More options */
  'aria-label'?: string;
};

/**
 * Icon-only overflow menu using the `moreHorizontal` registry glyph.
 */
export function MoreMenu({
  sections,
  'aria-label': ariaLabel = 'More options',
}: MoreMenuProps): JSX.Element {
  return (
    <DropdownMenu
      sections={sections}
      trigger={<IconButton name="moreHorizontal" aria-label={ariaLabel} intent="ghost" size="sm" />}
    />
  );
}
