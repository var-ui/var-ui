import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticChannelAssignments,
  subtleBackgroundColor,
  subtleBorderColor,
} from './semanticTone';

/**
 * Toast viewport + toast item chrome.
 *
 * ```ts
 * const t = toast({ tone: 'success', placement: 'bottom-end' });
 * <div className={t.region}><div className={t.item}>…</div></div>
 * ```
 */
export const toast = styles.component(
  'toast',
  (c) => {
    const v = c.vars({
      semantic: { value: t.color.accent.default, syntax: '<color>', inherits: true },
      solidBg: { value: t.color.accent.default, syntax: '<color>', inherits: false },
      solidFg: { value: t.color.text.onAccent, syntax: '<color>', inherits: false },
      surface: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      titleColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      closeColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['region', 'item', 'icon', 'body', 'title', 'description', 'close'],
      base: {
        region: {
          position: 'fixed',
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2],
          padding: t.space[4],
          pointerEvents: 'none',
          maxWidth: 'min(24rem, calc(100vw - 2rem))',
        },
        item: {
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: t.space[3],
          padding: t.space[3],
          borderRadius: t.radius.md,
          backgroundColor: subtleBackgroundColor(v.semantic.var),
          border: `1px solid ${subtleBorderColor(v.semantic.var)}`,
          boxShadow: t.shadow.md,
          color: t.color.text.primary,
          outline: 'none',
          '&[data-focus-visible]': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '2px',
          color: v.semantic.var,
        },
        body: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: t.space[1] },
        title: {
          margin: 0,
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.semibold,
          color: v.titleColor.var,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm,
          color: v.descriptionColor.var,
        },
        close: {
          flexShrink: 0,
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: v.closeColor.var,
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1],
          borderRadius: t.radius.sm,
          '&:hover': {
            backgroundColor: t.color.background.subtle,
            color: t.color.text.primary,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        tone: {
          info: { item: semanticChannelAssignments(v, 'accent') },
          success: { item: semanticChannelAssignments(v, 'success') },
          warning: { item: semanticChannelAssignments(v, 'warning') },
          danger: { item: semanticChannelAssignments(v, 'danger') },
        },
        placement: {
          'top-end': { region: { top: 0, right: 0 } },
          'top-start': { region: { top: 0, left: 0 } },
          'bottom-end': { region: { bottom: 0, right: 0 } },
          'bottom-start': { region: { bottom: 0, left: 0 } },
        },
      },
      defaultVariants: { tone: 'info', placement: 'bottom-end' },
    };
  },
  { layer: 'components' },
);
