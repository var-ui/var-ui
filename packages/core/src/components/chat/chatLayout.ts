import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

type ChatLayoutSlots = readonly ['root', 'messageArea', 'dock'];
type ChatLayoutVariants = {
  appearance: Record<'default', SlotStyles<ChatLayoutSlots[number]>>;
};

/**
 * Structural shell for a full chat interface: a scrollable message area
 * above a sticky composer dock. No JS measurement — density/spacing only.
 *
 * ```tsx
 * <div className={chatLayout().root}>…</div>
 * ```
 */
// Overload pinning: this recipe's slot names (`root`, `messageArea`, `dock`)
// don't collide with known CSS properties, so TypeScript resolves the config
// against typestyles' flat-variant overload and types the call as a class
// string. Runtime behavior is correct (typestyles branches on `slots` at
// runtime); assert the slot signature until typestyles' ComponentConfig
// forbids `slots` the way FlatComponentConfig does. See
// packages/core/src/components/avatar.ts.
const chatLayoutRecipe = styles.component(
  'chat-layout',
  (c) => {
    const v = c.vars({
      background: { value: t.color.background.surface, syntax: '<color>', inherits: false },
      border: { value: t.color.border.default, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'messageArea', 'dock'],
      base: {
        root: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        },
        messageArea: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        },
        dock: {
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2],
          padding: t.space[3],
          backgroundColor: v.background.var,
          borderTop: `1px solid ${v.border.var}`,
        },
      },
      variants: {
        appearance: {
          default: {},
        },
      },
      defaultVariants: { appearance: 'default' },
    };
  },
  { layer: 'components' },
);

export const chatLayout = chatLayoutRecipe as unknown as SlotComponentFunction<
  ChatLayoutSlots,
  ChatLayoutVariants
>;
