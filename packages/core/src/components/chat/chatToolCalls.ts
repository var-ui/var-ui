import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { semanticTone } from '../semanticTone';

type ChatToolCallsSlots = readonly [
  'root',
  'header',
  'statusIcon',
  'name',
  'target',
  'duration',
  'chevron',
  'list',
  'detail',
];
type ChatToolCallsVariants = {
  status: Record<
    'pending' | 'running' | 'complete' | 'error',
    SlotStyles<ChatToolCallsSlots[number]>
  >;
  expanded: Record<'true' | 'false', SlotStyles<ChatToolCallsSlots[number]>>;
};

/**
 * Tool/function call display. One call renders inline; the React wrapper
 * collapses 2+ calls into an expandable group using the `expanded` variant
 * here for the chevron rotation only (the show/hide of the list itself is
 * plain conditional rendering in React — no CSS transition in v1).
 *
 * ```tsx
 * <div className={chatToolCalls({ status: 'running' }).root}>…</div>
 * ```
 */
// Overload pinning: this recipe's slot names (`root`, `header`, `statusIcon`,
// `name`, `target`, `duration`, `chevron`, `list`, `detail`) don't collide
// with known CSS properties, so TypeScript resolves the config against
// typestyles' flat-variant overload and types the call as a class string.
// Runtime behavior is correct (typestyles branches on `slots` at runtime);
// assert the slot signature until typestyles' ComponentConfig forbids
// `slots` the way FlatComponentConfig does. See
// packages/core/src/components/avatar.ts.
const chatToolCallsRecipe = typestyles.styles.component(
  'chat-tool-calls',
  () => ({
    slots: [
      'root',
      'header',
      'statusIcon',
      'name',
      'target',
      'duration',
      'chevron',
      'list',
      'detail',
    ],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        marginTop: t.space[2].var,
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1].var,
        minHeight: '24px',
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
      },
      statusIcon: {
        display: 'inline-flex',
        flexShrink: 0,
      },
      name: {
        fontSize: t.fontSize.sm.var,
        fontFamily: t.fontFamily.mono.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.secondary.var,
      },
      target: {
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      duration: {
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        flexShrink: 0,
      },
      chevron: {
        display: 'inline-flex',
        marginLeft: 'auto',
        transition: 'transform 0.15s ease',
      },
      list: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        paddingLeft: t.space[4].var,
      },
      detail: {
        paddingLeft: t.space[4].var,
        paddingBottom: t.space[2].var,
      },
    },
    variants: {
      status: {
        pending: { statusIcon: { color: t.color.text.secondary.var } },
        running: { statusIcon: { color: semanticTone.accent.semantic } },
        complete: { statusIcon: { color: semanticTone.success.semantic } },
        error: { statusIcon: { color: semanticTone.danger.semantic } },
      },
      expanded: {
        true: { chevron: { transform: 'rotate(180deg)' } },
        false: {},
      },
    },
    defaultVariants: { status: 'complete', expanded: 'false' },
  }),
  { layer: 'components' },
);

export const chatToolCalls = chatToolCallsRecipe as unknown as SlotComponentFunction<
  ChatToolCallsSlots,
  ChatToolCallsVariants
>;
