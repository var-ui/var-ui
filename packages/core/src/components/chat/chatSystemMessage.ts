import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { semanticTone, subtleBackgroundColor, type SemanticToneKey } from '../semanticTone';

type ChatSystemMessageSlots = readonly ['root', 'icon', 'text'];
type ChatSystemMessageVariants = {
  tone: Record<
    'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info',
    SlotStyles<ChatSystemMessageSlots[number]>
  >;
};

function tonePaint(
  v: { color: { name: string }; background: { name: string } },
  key: SemanticToneKey,
) {
  const ch = semanticTone[key];
  return {
    root: {
      [v.color.name]: ch.semantic,
      [v.background.name]: subtleBackgroundColor(ch.semantic),
    },
  };
}

/**
 * Centered inline system message ("Alex joined", "Model switched to GPT-5").
 * Same tone vocabulary as `Alert`/`Badge`, plus a `neutral` default.
 *
 * ```tsx
 * <div className={chatSystemMessage({ tone: 'info' }).root}>…</div>
 * ```
 */
// Overload pinning: this recipe's slot names (`root`, `icon`, `text`) don't
// collide with known CSS properties, so TypeScript resolves the config
// against typestyles' flat-variant overload and types the call as a class
// string. Runtime behavior is correct (typestyles branches on `slots` at
// runtime); assert the slot signature until typestyles' ComponentConfig
// forbids `slots` the way FlatComponentConfig does. See
// packages/core/src/components/avatar.ts.
const chatSystemMessageRecipe = styles.component(
  'chat-system-message',
  (c) => {
    const v = c.vars({
      color: { value: t.color.text.secondary, syntax: '<color>', inherits: false },
      background: { value: t.color.background.subtle, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'icon', 'text'],
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space[1],
          alignSelf: 'center',
          padding: `${t.space[1]} ${t.space[3]}`,
          borderRadius: t.radius.full,
          backgroundColor: v.background.var,
          color: v.color.var,
          fontSize: t.fontSize.sm,
        },
        icon: {
          display: 'inline-flex',
          flexShrink: 0,
        },
        text: {
          margin: 0,
        },
      },
      variants: {
        tone: {
          neutral: {},
          accent: tonePaint(v, 'accent'),
          success: tonePaint(v, 'success'),
          warning: tonePaint(v, 'warning'),
          danger: tonePaint(v, 'danger'),
          info: tonePaint(v, 'info'),
        },
      },
      defaultVariants: { tone: 'neutral' },
    };
  },
  { layer: 'components' },
);

export const chatSystemMessage = chatSystemMessageRecipe as unknown as SlotComponentFunction<
  ChatSystemMessageSlots,
  ChatSystemMessageVariants
>;
