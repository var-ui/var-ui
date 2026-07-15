import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Standalone popover panel chrome (distinct from menu/select popover slots).
 *
 * ```ts
 * const p = popover();
 * <div className={p.root}>…</div>
 * ```
 */
export const popover = styles.component(
  'popover',
  (c) => {
    const v = c.vars({
      background: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      titleForeground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'title', 'content'],
      root: {
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.md,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.md,
        minWidth: '12rem',
        outline: 'none',
      },
      title: {
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        color: v.titleForeground.var,
        margin: 0,
        padding: `${t.space[3]} ${t.space[3]} ${t.space[2]}`,
      },
      content: {
        padding: `${t.space[2]} ${t.space[3]} ${t.space[3]}`,
        outline: 'none',
      },
    };
  },
  { layer: 'components' },
);
