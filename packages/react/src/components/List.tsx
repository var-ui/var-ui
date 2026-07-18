import type { JSX, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { list as listStyles } from '@var-ui/core';
import { recipeProps } from './utils';

export type ListItemData = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  href?: string;
  isDisabled?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type ListProps = {
  density?: 'compact' | 'balanced' | 'spacious';
  listStyle?: 'none' | 'disc' | 'decimal';
  hasDividers?: boolean;
  header?: ReactNode;
  items?: ListItemData[];
  renderStart?: (item: ListItemData) => ReactNode;
  renderEnd?: (item: ListItemData) => ReactNode;
  children?: ReactNode;
  className?: string;
  /** Fired for interactive items without href (items mode / Item onPress). */
  onAction?: (id: string) => void;
};

export type ListItemProps = {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  href?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
};

type ListStyleSlots = ReturnType<typeof listStyles>;

const ListContext = createContext<ListStyleSlots | null>(null);

const interactiveOverlayStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'inherit',
  textDecoration: 'none',
} as const;

function ariaLabelFromNode(node: ReactNode): string | undefined {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  return undefined;
}

function useListStyles(): ListStyleSlots {
  const styles = useContext(ListContext);
  if (styles == null) {
    throw new Error('List.Item must be used within List');
  }
  return styles;
}

type ListItemContentProps = {
  label: ReactNode;
  description?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  href?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
};

function ListItemContent({
  label,
  description,
  startContent,
  endContent,
  href,
  onPress,
  isDisabled = false,
  className,
}: ListItemContentProps): JSX.Element {
  const s = useListStyles();
  const isInteractive = !isDisabled && (href != null || onPress != null);
  const ariaLabel = ariaLabelFromNode(label);

  return (
    <li
      {...recipeProps(s.item, className)}
      data-interactive={isInteractive ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
    >
      {startContent != null ? <span {...recipeProps(s.start)}>{startContent}</span> : null}
      <span {...recipeProps(s.label)}>{label}</span>
      {description != null ? <span {...recipeProps(s.description)}>{description}</span> : null}
      {endContent != null ? <span {...recipeProps(s.end)}>{endContent}</span> : null}
      {isInteractive && href != null ? (
        <a href={href} aria-label={ariaLabel} style={interactiveOverlayStyle} />
      ) : null}
      {isInteractive && href == null && onPress != null ? (
        <button
          type="button"
          aria-label={ariaLabel}
          style={interactiveOverlayStyle}
          onClick={onPress}
        />
      ) : null}
    </li>
  );
}

/**
 * Generic vertical list for settings rows, member lists, and static content.
 * Supports compound `List.Item` children or an `items` array with optional render props.
 *
 * ```tsx
 * <List density="compact" hasDividers header="Members">
 *   <List.Item label="Ada" description="Admin" href="/u/ada" />
 * </List>
 * ```
 */
export function List({
  density = 'balanced',
  listStyle = 'none',
  hasDividers = false,
  header,
  items,
  renderStart,
  renderEnd,
  children,
  className,
  onAction,
}: ListProps): JSX.Element {
  const s = listStyles({ density, listStyle, hasDividers: hasDividers ? true : false });
  const RootTag = listStyle === 'decimal' ? 'ol' : 'ul';

  const itemNodes =
    items?.map((item) => (
      <ListItemContent
        key={item.id}
        label={item.label}
        description={item.description}
        startContent={renderStart?.(item) ?? item.startContent}
        endContent={renderEnd?.(item) ?? item.endContent}
        href={item.href}
        onPress={
          item.href == null && onAction != null && !item.isDisabled
            ? () => onAction(item.id)
            : undefined
        }
        isDisabled={item.isDisabled}
      />
    )) ?? null;

  return (
    <ListContext.Provider value={s}>
      <RootTag {...recipeProps(s.root, className)}>
        {header != null ? <li {...recipeProps(s.header)}>{header}</li> : null}
        {children ?? itemNodes}
      </RootTag>
    </ListContext.Provider>
  );
}

/** Row within a `List` — link or button overlay when `href` / `onPress` is set. */
export function ListItem({
  label,
  description,
  startContent,
  endContent,
  href,
  onPress,
  isDisabled,
  className,
}: ListItemProps): JSX.Element {
  return (
    <ListItemContent
      label={label}
      description={description}
      startContent={startContent}
      endContent={endContent}
      href={href}
      onPress={onPress}
      isDisabled={isDisabled}
      className={className}
    />
  );
}

List.Item = ListItem;
