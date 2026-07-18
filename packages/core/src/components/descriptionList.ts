import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type DescriptionListSlots = readonly ['root', 'title', 'item', 'term', 'details', 'toggle'];
type DescriptionListVariants = {
  columns: Record<'single' | 'multi', SlotStyles<DescriptionListSlots[number]>>;
  labelPosition: Record<'start' | 'top', SlotStyles<DescriptionListSlots[number]>>;
};

/**
 * Semantic key/value display chrome for `<dl>` / `<dt>` / `<dd>` pairs. Pair with
 * the React `DescriptionList` compound, which drives variant data attributes on
 * the root and item slots and sets `--var-ui-description-list-columns` for numeric
 * column counts.
 *
 * ```tsx
 * const s = descriptionList({ columns: 'single', labelPosition: 'start' });
 * <dl className={s.root.className} {...s.root.attrs}>
 *   <div className={s.title.className}>Details</div>
 *   <div className={s.item.className}>
 *     <dt className={s.term.className}>Owner</dt>
 *     <dd className={s.details.className}>Ada</dd>
 *   </div>
 * </dl>
 * ```
 */
const descriptionListRecipe = styles.component(
  'description-list',
  (c) => {
    const v = c.vars({
      termColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      detailsColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      gap: { value: t.space[4], syntax: '<length>', inherits: false },
      termWidth: { value: '8rem', syntax: '<length>', inherits: false },
      columns: { value: '2', syntax: '<integer>', inherits: false },
    });
    return {
      slots: ['root', 'title', 'item', 'term', 'details', 'toggle'],
      base: {
        root: {
          display: 'grid',
          gap: v.gap.var,
          margin: 0,
        },
        title: {
          gridColumn: '1 / -1',
          margin: 0,
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.semibold,
          color: v.termColor.var,
        },
        item: {
          display: 'grid',
          gap: t.space[1],
          minWidth: 0,
        },
        term: {
          margin: 0,
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          color: v.termColor.var,
        },
        details: {
          margin: 0,
          fontSize: t.fontSize.sm,
          color: v.detailsColor.var,
          minWidth: 0,
        },
        toggle: {
          gridColumn: '1 / -1',
          justifySelf: 'start',
        },
      },
      variants: {
        columns: {
          single: {
            root: { gridTemplateColumns: '1fr' },
          },
          multi: {
            root: {
              gridTemplateColumns: `repeat(${v.columns.var}, minmax(0, 1fr))`,
            },
          },
        },
        labelPosition: {
          start: {
            item: {
              gridTemplateColumns: `${v.termWidth.var} 1fr`,
              alignItems: 'baseline',
            },
          },
          top: {
            item: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          },
        },
      },
      defaultVariants: { columns: 'single', labelPosition: 'start' },
    };
  },
  { layer: 'components' },
);

export const descriptionList = descriptionListRecipe as unknown as SlotComponentFunction<
  DescriptionListSlots,
  DescriptionListVariants
>;
