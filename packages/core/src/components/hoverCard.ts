import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Non-modal rich preview card chrome — surface treatment like `popover`, with
 * slightly richer padding to accommodate denser preview content (avatars,
 * links, multi-line copy).
 *
 * ```ts
 * const hc = hoverCard();
 * <div className={hc.root}>…</div>
 * ```
 */
export const hoverCard = typestyles.styles.component(
  'hover-card',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: false,
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      titleForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'title', 'content'],
      root: {
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.md.var,
        minWidth: '14rem',
        maxWidth: '22rem',
        outline: 'none',
      },
      title: {
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.titleForeground.var,
        margin: 0,
        padding: `${t.space[4].var} ${t.space[4].var} ${t.space[3].var}`,
      },
      content: {
        padding: `${t.space[3].var} ${t.space[4].var} ${t.space[4].var}`,
        outline: 'none',
      },
    };
  },
  { layer: 'components' },
);
