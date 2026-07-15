import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Compact dark-surface tooltip chrome.
 *
 * ```ts
 * const tip = tooltip();
 * <div className={tip.root}>More info</div>
 * ```
 */
export const tooltip = styles.component(
  'tooltip',
  (c) => {
    const v = c.vars({
      background: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      foreground: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root'],
      root: {
        backgroundColor: v.background.var,
        color: v.foreground.var,
        fontSize: t.fontSize.sm,
        padding: `${t.space[1]} ${t.space[2]}`,
        borderRadius: t.radius.sm,
        boxShadow: t.shadow.sm,
        maxWidth: '16rem',
        lineHeight: 1.4,
      },
    };
  },
  { layer: 'components' },
);
