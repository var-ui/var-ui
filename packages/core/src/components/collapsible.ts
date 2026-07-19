import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type CollapsibleSlots = readonly ['root', 'trigger', 'triggerIcon', 'panel'];
type CollapsibleVariants = {
  variant: Record<'flush' | 'bordered', SlotStyles<CollapsibleSlots[number]>>;
};

/**
 * Expand/collapse panel chrome for Disclosure-backed Collapsible.
 *
 * Slots: `root`, `trigger`, `triggerIcon`, `panel`.
 * Chevron rotation targets RAC `data-expanded` on the root (and `aria-expanded` on the trigger).
 *
 * ```ts
 * const c = collapsible();
 * <div className={c.root}>
 *   <button className={c.trigger} aria-expanded>…</button>
 *   <div className={c.panel}>…</div>
 * </div>
 * ```
 */
const collapsibleRecipe = styles.component(
  'collapsible',
  (c) => {
    const v = c.vars({
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      background: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
      triggerColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      hoverBg: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'trigger', 'triggerIcon', 'panel'],
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          // RAC Disclosure sets `data-expanded` on the root when open.
          [`&[data-expanded] .var-ui-collapsible__trigger-icon`]: {
            transform: 'rotate(180deg)',
          },
          // Fallback when expanded state is only on the trigger button.
          [`&:has([aria-expanded="true"]) .var-ui-collapsible__trigger-icon`]: {
            transform: 'rotate(180deg)',
          },
        },
        trigger: {
          appearance: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[2],
          width: '100%',
          margin: 0,
          padding: `${t.space[2]} ${t.space[3]}`,
          border: 'none',
          background: 'transparent',
          color: v.triggerColor.var,
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          fontFamily: 'inherit',
          textAlign: 'start',
          cursor: 'pointer',
          borderRadius: t.radius.sm,
          '&:hover': {
            backgroundColor: v.hoverBg.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
        },
        triggerIcon: {
          display: 'inline-flex',
          flexShrink: 0,
          transition: 'transform 0.15s ease',
        },
        panel: {
          padding: `${t.space[2]} ${t.space[3]} ${t.space[3]}`,
          minWidth: 0,
        },
      },
      variants: {
        variant: {
          flush: {},
          bordered: {
            root: {
              border: `1px solid ${v.border.var}`,
              borderRadius: t.radius.md,
              backgroundColor: v.background.var,
            },
          },
        },
      },
      defaultVariants: { variant: 'flush' },
    };
  },
  { layer: 'components' },
);

export const collapsible = collapsibleRecipe as unknown as SlotComponentFunction<
  CollapsibleSlots,
  CollapsibleVariants
>;
