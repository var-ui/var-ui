import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Keyboard key cap for shortcut hints.
 *
 * ```tsx
 * <kbd className={kbd()}>⌘K</kbd>
 * ```
 */
export const kbd = styles.component(
  'kbd',
  (c) => {
    const v = c.vars({
      background: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        display: 'inline-block',
        padding: `1px ${t.space[1]}`,
        fontFamily: t.fontFamily.mono,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.medium,
        lineHeight: t.lineHeight.normal,
        color: t.color.text.secondary,
        backgroundColor: v.background.var,
        border: `1px solid ${v.border.var}`,
        borderBottomWidth: '2px',
        borderRadius: t.radius.sm,
        whiteSpace: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
