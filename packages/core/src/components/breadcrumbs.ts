import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Breadcrumb trail chrome. Pair with the React `Breadcrumbs` wrapper, which
 * composes this on top of RAC `Breadcrumbs`/`Breadcrumb`/`Link`.
 *
 * ```ts
 * const b = breadcrumbs();
 * <nav className={b.root}><ol className={b.list}>…</ol></nav>
 * ```
 */
export const breadcrumbs = styles.component(
  'breadcrumbs',
  (c) => {
    const v = c.vars({
      separator: { value: '"/"', syntax: '*', inherits: false },
      textColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      currentColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'list', 'item', 'ellipsisItem', 'link'],
      root: {
        display: 'block',
      },
      list: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: t.space[1],
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        fontSize: t.fontSize.sm,
        color: v.textColor.var,
        '&:not(:last-child)::after': {
          content: v.separator.var,
          marginLeft: t.space[1],
          color: v.textColor.var,
        },
        '&[data-current]': {
          color: v.currentColor.var,
          fontWeight: t.fontWeight.medium,
        },
      },
      ellipsisItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        fontSize: t.fontSize.sm,
        color: v.textColor.var,
        '&:not(:last-child)::after': {
          content: v.separator.var,
          marginLeft: t.space[1],
          color: v.textColor.var,
        },
      },
      link: {
        color: 'inherit',
        textDecoration: 'none',
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline',
        },
        '&[data-disabled]': {
          cursor: 'default',
          textDecoration: 'none',
        },
      },
    };
  },
  { layer: 'components' },
);
