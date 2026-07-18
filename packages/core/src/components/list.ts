import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type ListSlots = readonly [
  'root',
  'header',
  'item',
  'label',
  'description',
  'start',
  'end',
  'divider',
];
type ListVariants = {
  density: Record<'compact' | 'balanced' | 'spacious', SlotStyles<ListSlots[number]>>;
  listStyle: Record<'none' | 'disc' | 'decimal', SlotStyles<ListSlots[number]>>;
  hasDividers: Record<'true' | 'false', SlotStyles<ListSlots[number]>>;
};

/**
 * Generic vertical list chrome for settings rows, member lists, and static
 * content. Pair with the React `List` compound, which drives variant data
 * attributes on the root and interactive/disabled state on items.
 *
 * ```tsx
 * const s = list({ density: 'compact', hasDividers: true });
 * <ul className={s.root.className} {...s.root.attrs}>
 *   <li className={s.item.className} data-interactive>
 *     <span className={s.start.className}>…</span>
 *     <span className={s.label.className}>Ada</span>
 *     <span className={s.description.className}>Admin</span>
 *     <span className={s.end.className}>…</span>
 *   </li>
 * </ul>
 * ```
 */
const listRecipe = styles.component(
  'list',
  (c) => {
    const v = c.vars({
      root: { value: 'transparent', syntax: '<color>', inherits: false },
      labelColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      hoverBg: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      pressBg: {
        value: `${t.color.background.elevated}`,
        syntax: '<color>',
        inherits: false,
      },
      dividerColor: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      itemPaddingY: { value: t.space[2], syntax: '<length>', inherits: false },
      itemPaddingX: { value: t.space[3], syntax: '<length>', inherits: false },
    });
    return {
      slots: ['root', 'header', 'item', 'label', 'description', 'start', 'end', 'divider'],
      base: {
        root: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: v.root.var,
          '&[data-list-style="disc"]': { listStyle: 'disc', paddingLeft: t.space[5] },
          '&[data-list-style="decimal"]': { listStyle: 'decimal', paddingLeft: t.space[5] },
        },
        header: {
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.semibold,
          color: v.labelColor.var,
          padding: `${t.space[2]} ${v.itemPaddingX.var}`,
        },
        item: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[3],
          position: 'relative',
          padding: `${v.itemPaddingY.var} ${v.itemPaddingX.var}`,
          color: v.labelColor.var,
          '&[data-interactive]': { cursor: 'pointer' },
          '&[data-interactive]:hover': { backgroundColor: v.hoverBg.var },
          '&[data-interactive]:active': { backgroundColor: v.pressBg.var },
          '&[data-disabled]': { opacity: 0.5, pointerEvents: 'none' },
          '[data-has-dividers] >&:not(:last-child)': {
            borderBottom: `1px solid ${v.dividerColor.var}`,
          },
        },
        label: {
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.medium,
          color: v.labelColor.var,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        description: {
          fontSize: t.fontSize.sm,
          color: v.descriptionColor.var,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        start: { display: 'flex', flexShrink: 0, alignItems: 'center' },
        end: { display: 'flex', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' },
        divider: { display: 'none' },
      },
      variants: {
        density: {
          compact: {
            item: {
              padding: `${t.space[1]} ${t.space[2]}`,
            },
          },
          balanced: {},
          spacious: {
            item: {
              padding: `${t.space[3]} ${t.space[4]}`,
            },
          },
        },
        listStyle: { none: {}, disc: {}, decimal: {} },
        hasDividers: { true: {}, false: {} },
      },
      defaultVariants: { density: 'balanced', listStyle: 'none', hasDividers: false },
    };
  },
  { layer: 'components' },
);

export const list = listRecipe as unknown as SlotComponentFunction<ListSlots, ListVariants>;
