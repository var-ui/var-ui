import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type TableSlots = readonly [
  'root',
  'table',
  'caption',
  'header',
  'headerCell',
  'body',
  'row',
  'cell',
  'footer',
  'empty',
];
type TableVariants = {
  density: Record<'compact' | 'balanced' | 'spacious', SlotStyles<TableSlots[number]>>;
  dividers: Record<'rows' | 'columns' | 'grid' | 'none', SlotStyles<TableSlots[number]>>;
  isStriped: Record<'true' | 'false', SlotStyles<TableSlots[number]>>;
  hasHover: Record<'true' | 'false', SlotStyles<TableSlots[number]>>;
  stickyHeader: Record<'true' | 'false', SlotStyles<TableSlots[number]>>;
  textOverflow: Record<'wrap' | 'truncate', SlotStyles<TableSlots[number]>>;
};

/**
 * Presentational semantic `<table>` chrome for admin data grids. Pair with the
 * React `Table` compound, which drives variant data attributes and renders
 * dual API (compound children or `columns`/`data`). Sort, selection, and
 * pagination are caller-composed via `useTableSort` / `useTableSelection` /
 * `useTablePagination` — this recipe carries no interactive state.
 *
 * ```tsx
 * const s = table({ density: 'compact', dividers: 'rows', stickyHeader: true });
 * <div className={s.root.className}>
 *   <table className={s.table.className}>
 *     <thead className={s.header.className}>
 *       <tr className={s.row.className}>
 *         <th className={s.headerCell.className}>Name</th>
 *       </tr>
 *     </thead>
 *   </table>
 * </div>
 * ```
 */
const tableRecipe = styles.component(
  'table',
  (c) => {
    const v = c.vars({
      headerBg: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
      headerColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      bodyColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      captionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      borderColor: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      stripeBg: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
      hoverBg: { value: `${t.color.background.elevated}`, syntax: '<color>', inherits: false },
      cellPaddingY: { value: t.space[2], syntax: '<length>', inherits: false },
      cellPaddingX: { value: t.space[3], syntax: '<length>', inherits: false },
    });

    const rowDivider = {
      header: { borderBottom: `1px solid ${v.borderColor.var}` },
      row: { borderBottom: `1px solid ${v.borderColor.var}` },
      footer: { borderTop: `1px solid ${v.borderColor.var}` },
    };
    const columnDivider = {
      headerCell: { '&:not(:last-child)': { borderRight: `1px solid ${v.borderColor.var}` } },
      cell: { '&:not(:last-child)': { borderRight: `1px solid ${v.borderColor.var}` } },
    };

    return {
      slots: [
        'root',
        'table',
        'caption',
        'header',
        'headerCell',
        'body',
        'row',
        'cell',
        'footer',
        'empty',
      ],
      base: {
        root: {
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
        },
        table: {
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: t.fontSize.sm,
          color: v.bodyColor.var,
        },
        caption: {
          captionSide: 'top',
          textAlign: 'left',
          padding: `${t.space[2]} ${v.cellPaddingX.var}`,
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          color: v.captionColor.var,
        },
        header: {},
        headerCell: {
          textAlign: 'left',
          fontWeight: t.fontWeight.semibold,
          fontSize: t.fontSize.sm,
          color: v.headerColor.var,
          backgroundColor: v.headerBg.var,
          padding: `${v.cellPaddingY.var} ${v.cellPaddingX.var}`,
          '&[data-align="center"]': { textAlign: 'center' },
          '&[data-align="end"]': { textAlign: 'right' },
        },
        body: {},
        row: {},
        cell: {
          padding: `${v.cellPaddingY.var} ${v.cellPaddingX.var}`,
          color: v.bodyColor.var,
          '&[data-align="center"]': { textAlign: 'center' },
          '&[data-align="end"]': { textAlign: 'right' },
        },
        footer: {
          fontWeight: t.fontWeight.medium,
          color: v.headerColor.var,
        },
        empty: {
          padding: t.space[8],
          textAlign: 'center',
          color: v.captionColor.var,
        },
      },
      variants: {
        density: {
          compact: {
            headerCell: { [v.cellPaddingY.name]: t.space[1], [v.cellPaddingX.name]: t.space[2] },
            cell: { [v.cellPaddingY.name]: t.space[1], [v.cellPaddingX.name]: t.space[2] },
          },
          balanced: {},
          spacious: {
            headerCell: { [v.cellPaddingY.name]: t.space[3], [v.cellPaddingX.name]: t.space[4] },
            cell: { [v.cellPaddingY.name]: t.space[3], [v.cellPaddingX.name]: t.space[4] },
          },
        },
        dividers: {
          rows: rowDivider,
          columns: columnDivider,
          grid: { ...rowDivider, ...columnDivider },
          none: {},
        },
        isStriped: {
          true: { row: { '&:nth-of-type(even)': { backgroundColor: v.stripeBg.var } } },
          false: {},
        },
        hasHover: {
          true: { row: { '&:hover': { backgroundColor: v.hoverBg.var } } },
          false: {},
        },
        stickyHeader: {
          true: {
            headerCell: { position: 'sticky', top: 0, zIndex: 1, backgroundColor: v.headerBg.var },
          },
          false: {},
        },
        textOverflow: {
          wrap: {},
          truncate: {
            headerCell: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 0,
            },
            cell: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 0,
            },
          },
        },
      },
      defaultVariants: {
        density: 'balanced',
        dividers: 'rows',
        isStriped: false,
        hasHover: false,
        stickyHeader: false,
        textOverflow: 'wrap',
      },
    };
  },
  { layer: 'components' },
);

export const table = tableRecipe as unknown as SlotComponentFunction<TableSlots, TableVariants>;
