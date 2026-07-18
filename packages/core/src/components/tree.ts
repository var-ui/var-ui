import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type TreeSlots = readonly [
  'root',
  'item',
  'row',
  'toggle',
  'label',
  'description',
  'group',
  'start',
  'end',
];
type TreeVariants = {
  density: Record<'compact' | 'balanced' | 'spacious', SlotStyles<TreeSlots[number]>>;
};

/**
 * Hierarchical expandable list chrome for file explorers and nested navigation.
 * Pair with the React `Tree` compound, which drives density on the root,
 * `data-expanded` on toggles, `data-selected` / `data-disabled` on rows, and
 * nests child items inside the `group` slot.
 *
 * ```tsx
 * const s = tree({ density: 'compact' });
 * <ul className={s.root.className} {...s.root.attrs} role="tree">
 *   <li className={s.item.className} role="treeitem">
 *     <div className={s.row.className} tabIndex={0}>
 *       <button className={s.toggle.className} data-expanded type="button" />
 *       <span className={s.start.className}>…</span>
 *       <span className={s.label.className}>src</span>
 *       <span className={s.description.className}>Directory</span>
 *       <span className={s.end.className}>…</span>
 *     </div>
 *     <ul className={s.group.className} role="group">…</ul>
 *   </li>
 * </ul>
 * ```
 */
const treeRecipe = styles.component(
  'tree',
  (c) => {
    const v = c.vars({
      labelColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      hoverBg: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      selectedBg: {
        value: `${t.color.accent.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      indentSize: { value: t.space[4], syntax: '<length>', inherits: false },
      rowPaddingY: { value: t.space[2], syntax: '<length>', inherits: false },
      rowPaddingX: { value: t.space[2], syntax: '<length>', inherits: false },
    });
    return {
      slots: ['root', 'item', 'row', 'toggle', 'label', 'description', 'group', 'start', 'end'],
      base: {
        root: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        },
        item: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
        },
        row: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2],
          padding: `${v.rowPaddingY.var} ${v.rowPaddingX.var}`,
          borderRadius: t.radius.md,
          color: v.labelColor.var,
          cursor: 'default',
          outline: 'none',
          minWidth: 0,
          '&:hover': { backgroundColor: v.hoverBg.var },
          '&[data-selected]': {
            backgroundColor: v.selectedBg.var,
            fontWeight: t.fontWeight.medium,
          },
          '&[data-disabled]': { opacity: 0.5, pointerEvents: 'none' },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
        },
        toggle: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
          transition: 'transform 0.15s ease',
          '&[data-expanded]': { transform: 'rotate(90deg)' },
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
        group: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          paddingLeft: v.indentSize.var,
        },
        start: { display: 'flex', flexShrink: 0, alignItems: 'center' },
        end: { display: 'flex', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' },
      },
      variants: {
        density: {
          compact: {
            row: {
              [v.rowPaddingY.name]: t.space[1],
              [v.rowPaddingX.name]: t.space[2],
            },
          },
          balanced: {},
          spacious: {
            row: {
              [v.rowPaddingY.name]: t.space[3],
              [v.rowPaddingX.name]: t.space[4],
            },
          },
        },
      },
      defaultVariants: { density: 'balanced' },
    };
  },
  { layer: 'components' },
);

export const tree = treeRecipe as unknown as SlotComponentFunction<TreeSlots, TreeVariants>;
