import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

type ChatMessageBubbleSlots = readonly ['root'];
type ChatMessageBubbleVariants = {
  sender: Record<'user' | 'assistant', SlotStyles<ChatMessageBubbleSlots[number]>>;
  variant: Record<'filled' | 'ghost', SlotStyles<ChatMessageBubbleSlots[number]>>;
  group: Record<'none' | 'first' | 'middle' | 'last', SlotStyles<ChatMessageBubbleSlots[number]>>;
};

/**
 * The chat "bubble." Sender drives background/text color via `c.vars()` so
 * themes can override user vs. assistant independently.
 *
 * Grouped corners (`group`) tighten symmetrically (top and/or bottom
 * uniformly) for consecutive same-sender bubbles — a deliberate
 * simplification vs. a sender-aware compound grid, avoiding a
 * `sender × group` variant matrix. Revisit only if per-side corner
 * tightening becomes a real visual requirement.
 *
 * ```tsx
 * <div className={chatMessageBubble({ sender: 'user' }).root}>Hi!</div>
 * ```
 */
// Overload pinning: this recipe's only slot name (`root`) doesn't collide with
// a known CSS property, so TypeScript resolves the config against typestyles'
// flat-variant overload and types the call as a class string. Runtime
// behavior is correct (typestyles branches on `slots` at runtime); assert the
// slot signature until typestyles' ComponentConfig forbids `slots` the way
// FlatComponentConfig does. See packages/core/src/components/avatar.ts.
const chatMessageBubbleRecipe = styles.component(
  'chat-message-bubble',
  (c) => {
    const v = c.vars({
      senderBackground: {
        value: t.color.background.subtle,
        syntax: '<color>',
        inherits: false,
      },
      senderText: {
        value: t.color.text.primary,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root'],
      base: {
        root: {
          display: 'inline-flex',
          flexDirection: 'column',
          maxWidth: 'min(80%, 480px)',
          padding: `${t.space[3]} ${t.space[4]}`,
          borderRadius: t.radius.lg,
          backgroundColor: v.senderBackground.var,
          color: v.senderText.var,
          fontSize: t.fontSize.md,
          lineHeight: 1.55,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        },
      },
      variants: {
        sender: {
          user: {
            root: {
              [v.senderBackground.name]: t.color.accent.default,
              [v.senderText.name]: t.color.text.onAccent,
            },
          },
          assistant: {
            root: {
              [v.senderBackground.name]: t.color.background.subtle,
              [v.senderText.name]: t.color.text.primary,
            },
          },
        },
        variant: {
          filled: { root: {} },
          ghost: {
            root: {
              backgroundColor: 'transparent',
              color: t.color.text.primary,
              padding: `${t.space[1]} 0`,
            },
          },
        },
        group: {
          none: { root: {} },
          first: {
            root: {
              borderBottomLeftRadius: t.radius.sm,
              borderBottomRightRadius: t.radius.sm,
            },
          },
          middle: {
            root: {
              borderTopLeftRadius: t.radius.sm,
              borderTopRightRadius: t.radius.sm,
              borderBottomLeftRadius: t.radius.sm,
              borderBottomRightRadius: t.radius.sm,
            },
          },
          last: {
            root: {
              borderTopLeftRadius: t.radius.sm,
              borderTopRightRadius: t.radius.sm,
            },
          },
        },
      },
      defaultVariants: { sender: 'assistant', variant: 'filled', group: 'none' },
    };
  },
  { layer: 'components' },
);

export const chatMessageBubble = chatMessageBubbleRecipe as unknown as SlotComponentFunction<
  ChatMessageBubbleSlots,
  ChatMessageBubbleVariants
>;
