import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';

type ChatComposerSlots = readonly ['root', 'inputRow', 'input', 'actions'];
type ChatComposerVariants = {
  appearance: Record<'default', SlotStyles<ChatComposerSlots[number]>>;
};

/**
 * Composer chrome: a bordered container around the message textarea and a
 * trailing actions slot (typically the send button).
 *
 * ```tsx
 * const c = chatComposer();
 * <div className={c.root}>
 *   <div className={c.inputRow}><textarea className={c.input} /></div>
 *   <div className={c.actions}>{sendButton}</div>
 * </div>
 * ```
 */
// Overload pinning: this recipe's slot names (`root`, `inputRow`, `input`,
// `actions`) don't collide with known CSS properties, so TypeScript resolves
// the config against typestyles' flat-variant overload and types the call as
// a class string. Runtime behavior is correct (typestyles branches on
// `slots` at runtime); assert the slot signature until typestyles'
// ComponentConfig forbids `slots` the way FlatComponentConfig does. See
// packages/core/src/components/avatar.ts.
const chatComposerRecipe = typestyles.styles.component(
  'chat-composer',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>', inherits: false },
      background: { value: t.color.background.surface.var, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'inputRow', 'input', 'actions'],
      base: {
        root: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: t.space[2].var,
          padding: t.space[2].var,
          border: `1px solid ${v.border.var}`,
          borderRadius: t.radius.lg.var,
          backgroundColor: v.background.var,
        },
        inputRow: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
        },
        input: {
          flex: 1,
          minWidth: 0,
          resize: 'none',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'inherit',
          fontSize: t.fontSize.md.var,
          lineHeight: '22px',
          color: t.color.text.primary.var,
          padding: t.space[1].var,
          '&::placeholder': { color: t.color.text.secondary.var },
        },
        actions: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1].var,
          flexShrink: 0,
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

export const chatComposer = chatComposerRecipe as unknown as SlotComponentFunction<
  ChatComposerSlots,
  ChatComposerVariants
>;
