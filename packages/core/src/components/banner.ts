import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticChannelAssignments,
  subtleBackgroundColor,
  subtleBorderColor,
} from './semanticTone';

/**
 * Page-level announcement bar. Same tone system as `alert`, but full-width
 * with horizontal layout, inline actions, and an optional dismiss control.
 *
 * ```tsx
 * const b = banner({ tone: 'warning' });
 * <div className={b.root} role="alert">…</div>
 * ```
 */
export const banner = styles.component(
  'banner',
  (c) => {
    const v = c.vars({
      semantic: { value: t.color.accent.default, syntax: '<color>', inherits: true },
      solidBg: { value: t.color.accent.default, syntax: '<color>', inherits: false },
      solidFg: { value: t.color.text.onAccent, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'icon', 'content', 'title', 'actions', 'dismiss'],
      base: {
        root: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[3],
          width: '100%',
          padding: `${t.space[3]} ${t.space[4]}`,
          fontSize: t.fontSize.md,
          lineHeight: 1.5,
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          color: v.semantic.var,
        },
        content: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: t.space[2],
        },
        title: {
          fontWeight: t.fontWeight.semibold,
          color: v.semantic.var,
        },
        actions: {
          display: 'flex',
          gap: t.space[2],
          flexShrink: 0,
        },
        dismiss: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1],
          borderRadius: t.radius.sm,
          '&:hover': { backgroundColor: subtleBackgroundColor(v.semantic.var) },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        tone: {
          info: { root: semanticChannelAssignments(v, 'accent') },
          success: { root: semanticChannelAssignments(v, 'success') },
          warning: { root: semanticChannelAssignments(v, 'warning') },
          danger: { root: semanticChannelAssignments(v, 'danger') },
        },
        appearance: {
          subtle: {
            root: {
              backgroundColor: subtleBackgroundColor(v.semantic.var),
              borderBlock: `1px solid ${subtleBorderColor(v.semantic.var)}`,
              color: t.color.text.primary,
            },
          },
          solid: {
            root: { backgroundColor: v.solidBg.var, color: v.solidFg.var },
            icon: { color: 'inherit' },
            title: { color: 'inherit' },
          },
        },
      },
      defaultVariants: { tone: 'info', appearance: 'subtle' },
    };
  },
  { layer: 'components' },
);
