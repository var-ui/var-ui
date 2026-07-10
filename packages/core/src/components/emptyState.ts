import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Centered placeholder for empty lists/tables/search results: icon well,
 * headline, supporting copy, call to action.
 *
 * ```tsx
 * const e = emptyState();
 * <div className={e.root}>…</div>
 * ```
 */
export const emptyState = styles.component(
  'empty-state',
  (c) => {
    const v = c.vars({
      iconColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      iconBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'icon', 'title', 'description', 'action'],
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: t.space[2],
        padding: `${t.space[8]} ${t.space[4]}`,
      },
      icon: {
        display: 'grid',
        placeItems: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        color: v.iconColor.var,
        backgroundColor: v.iconBackground.var,
        marginBottom: t.space[1],
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.lg,
        fontWeight: t.fontWeight.semibold,
      },
      description: {
        margin: 0,
        fontSize: t.fontSize.md,
        color: t.color.text.secondary,
        maxWidth: '40ch',
      },
      action: {
        marginTop: t.space[2],
      },
    };
  },
  { layer: 'components' },
);
