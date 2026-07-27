import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Segmented toggle group — connected corners on direct child toggle buttons.
 */
export const segmentedControl = typestyles.styles.component(
  'segmented-control',
  (c) => {
    const v = c.vars({
      trackBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      trackBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root'],
      root: {
        display: 'inline-flex',
        alignItems: 'stretch',
        padding: t.space[1].var,
        gap: t.space[1].var,
        borderRadius: t.radius.md.var,
        border: `1px solid ${v.trackBorder.var}`,
        backgroundColor: v.trackBackground.var,
        '& > *': {
          borderRadius: t.radius.sm.var,
          border: 'none',
        },
        '& > * + *': {
          marginInlineStart: 0,
        },
      },
    };
  },
  { layer: 'components' },
);
