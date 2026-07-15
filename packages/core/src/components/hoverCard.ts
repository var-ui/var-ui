import { styles } from '../runtime';
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
export const hoverCard = styles.component(
  'hover-card',
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
        minWidth: '14rem',
        maxWidth: '22rem',
        outline: 'none',
      },
      title: {
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        color: v.titleForeground.var,
        margin: 0,
        padding: `${t.space[4]} ${t.space[4]} ${t.space[3]}`,
      },
      content: {
        padding: `${t.space[3]} ${t.space[4]} ${t.space[4]}`,
        outline: 'none',
      },
    };
  },
  { layer: 'components' },
);
