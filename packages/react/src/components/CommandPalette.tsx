import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Dialog as AriaDialog,
  Input,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  TextField,
} from 'react-aria-components';
import { commandPalette } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { cx } from './utils';

export type CommandPaletteItem = {
  /** Unique item identifier passed to `onAction`. */
  id: string;
  /** Primary label shown in the results list. */
  title: string;
  /** Secondary text shown below the title (also searched by the default filter). */
  meta?: string;
  /** Extra search terms matched by the default filter but never rendered. */
  keywords?: string[];
};

export type CommandPaletteProps = {
  /** Controls the open state. */
  isOpen?: boolean;
  /** Called when the open state changes (Escape, backdrop click, hotkey, or item selection). */
  onOpenChange?: (open: boolean) => void;
  /** Commands shown in the results list. */
  items: CommandPaletteItem[];
  /** Called with the selected item's `id` on Enter/click; the palette does not close itself. */
  onAction: (id: string) => void;
  /** Input placeholder. @default 'Search…' */
  placeholder?: string;
  /** Message shown when no items match the query. @default 'No results' */
  emptyLabel?: string;
  /** Toggles open state on ⌘K / Ctrl+K. @default true */
  hotkey?: boolean;
  /** Overrides the default case-insensitive title/meta/keywords match. */
  filter?: (item: CommandPaletteItem, query: string) => boolean;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

type CommandPaletteSlot =
  | 'root'
  | 'backdrop'
  | 'dialog'
  | 'inputRow'
  | 'inputIcon'
  | 'input'
  | 'results'
  | 'result'
  | 'resultLink'
  | 'resultLinkActive'
  | 'resultTitle'
  | 'resultMeta'
  | 'mark'
  | 'empty';
type CommandPaletteRecipeFn = (args?: { open?: boolean }) => Record<CommandPaletteSlot, string>;
// `commandPalette` resolves to `styles`'s dimensioned-variant overload at the type level (returns
// `string`) instead of its slot overload, even though it returns a per-slot class map at runtime —
// see packages/core/src/components/commandPalette.ts. Recast until that recipe's overload
// resolution is fixed upstream.
const commandPaletteSlots = commandPalette as unknown as CommandPaletteRecipeFn;

function defaultFilter(item: CommandPaletteItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.title.toLowerCase().includes(q)) return true;
  if (item.meta?.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) return true;
  return false;
}

/**
 * ⌘K-style search overlay: filters a flat list of commands and reports the chosen `id` via
 * `onAction`. Callers own the open state and typically close the palette themselves inside
 * `onAction`.
 */
export function CommandPalette({
  isOpen,
  onOpenChange,
  items,
  onAction,
  placeholder = 'Search…',
  emptyLabel = 'No results',
  hotkey = true,
  filter = defaultFilter,
  portalContainer,
}: CommandPaletteProps): JSX.Element {
  const [query, setQuery] = useState('');
  const cp = commandPaletteSlots({ open: Boolean(isOpen) });
  const { style: layerStyle } = useLayer();

  useEffect(() => {
    if (!hotkey) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange?.(!isOpen);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkey, isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const visibleItems = useMemo(
    () => items.filter((item) => filter(item, query)),
    [items, filter, query],
  );

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={cp.root}
      style={layerStyle}
      UNSTABLE_portalContainer={portalContainer}
    >
      <div className={cp.backdrop} />
      <Modal className={cp.dialog}>
        <AriaDialog aria-label={placeholder}>
          <Autocomplete inputValue={query} onInputChange={setQuery}>
            <div className={cp.inputRow}>
              <span className={cp.inputIcon}>
                <Icon name="search" />
              </span>
              <TextField aria-label={placeholder} style={{ display: 'flex', flex: 1, minWidth: 0 }}>
                <Input className={cp.input} placeholder={placeholder} autoFocus />
              </TextField>
            </div>
            <ListBox
              items={visibleItems}
              className={cp.results}
              aria-label={placeholder}
              renderEmptyState={() => <div className={cp.empty}>{emptyLabel}</div>}
            >
              {(item) => (
                <ListBoxItem
                  id={item.id}
                  textValue={item.title}
                  className={cp.result}
                  onAction={() => onAction(item.id)}
                >
                  {({ isFocused }) => (
                    <span className={cx(cp.resultLink, isFocused && cp.resultLinkActive)}>
                      <span className={cp.resultTitle}>{item.title}</span>
                      {item.meta ? <span className={cp.resultMeta}>{item.meta}</span> : null}
                    </span>
                  )}
                </ListBoxItem>
              )}
            </ListBox>
          </Autocomplete>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
