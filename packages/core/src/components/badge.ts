import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { badgeTonePaint } from './semanticTone';

/**
 * Flat component: one node, `tone` swaps `c.vars()` assignments on that same element.
 *
 * **Next step:** see `alert.ts` for slots plus a second variant axis (`appearance`) where
 * tone only supplies tokens on `root` and another axis applies recipes—still no compound grid.
 *
 * **Shared:** `semanticTone.ts` holds the semantic palette + subtle `color-mix` recipe (same as alert).
 */
export const badge = typestyles.styles.component(
  'badge',
  (c) => {
    const v = c.vars({
      borderColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      backgroundColor: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      textColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: 1,
        padding: `${t.space[1].var} ${t.space[2].var}`,
        borderRadius: t.radius.full.var,
        border: `1px solid ${v.borderColor.var}`,
        backgroundColor: v.backgroundColor.var,
        color: v.textColor.var,
      },
      variants: {
        tone: {
          neutral: {},
          accent: badgeTonePaint(v, 'accent'),
          success: badgeTonePaint(v, 'success'),
          warning: badgeTonePaint(v, 'warning'),
          danger: badgeTonePaint(v, 'danger'),
          tip: badgeTonePaint(v, 'info'),
        },
      },
      defaultVariants: { tone: 'neutral' },
    };
  },
  { layer: 'components' },
);
