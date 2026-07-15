import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

type ChatMessageListSlots = readonly ['root', 'inner', 'emptyState'];
type ChatMessageListVariants = {
  density: Record<'compact' | 'balanced' | 'spacious', SlotStyles<ChatMessageListSlots[number]>>;
};

/**
 * Presentational scroll container for chat messages. `density` controls
 * inner gap/padding; scroll/auto-scroll behavior is owned by `ChatLayout`
 * (or wire `useChatStreamScroll` yourself when used standalone).
 *
 * ```tsx
 * <div className={chatMessageList({ density: 'balanced' }).root}>…</div>
 * ```
 */
// Overload pinning: this recipe's slot names (`root`, `inner`, `emptyState`)
// don't collide with known CSS properties, so TypeScript resolves the config
// against typestyles' flat-variant overload and types the call as a class
// string. Runtime behavior is correct (typestyles branches on `slots` at
// runtime); assert the slot signature until typestyles' ComponentConfig
// forbids `slots` the way FlatComponentConfig does. See
// packages/core/src/components/avatar.ts.
const chatMessageListRecipe = styles.component(
  'chat-message-list',
  () => ({
    slots: ['root', 'inner', 'emptyState'],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      inner: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      emptyState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 0,
      },
    },
    variants: {
      density: {
        compact: { inner: { gap: t.space[2], padding: t.space[2] } },
        balanced: { inner: { gap: t.space[4], padding: t.space[4] } },
        spacious: { inner: { gap: t.space[6], padding: t.space[6] } },
      },
    },
    defaultVariants: { density: 'balanced' },
  }),
  { layer: 'components' },
);

export const chatMessageList = chatMessageListRecipe as unknown as SlotComponentFunction<
  ChatMessageListSlots,
  ChatMessageListVariants
>;
