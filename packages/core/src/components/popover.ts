import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Standalone popover panel chrome (distinct from menu/select popover slots).
 *
 * ```ts
 * const p = popover();
 * <div className={p.root}>…</div>
 * ```
 */
export const popover = typestyles.styles.component(
  'popover',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      titleForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'title', 'content'],
      root: {
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.md.var,
        minWidth: '12rem',
        outline: 'none',
      },
      title: {
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.titleForeground.var,
        margin: 0,
        padding: `${t.space[3].var} ${t.space[3].var} ${t.space[2].var}`,
      },
      content: {
        padding: `${t.space[2].var} ${t.space[3].var} ${t.space[3].var}`,
        outline: 'none',
      },
    };
  },
  { layer: 'components' },
);
