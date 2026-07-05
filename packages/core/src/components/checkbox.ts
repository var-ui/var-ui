import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const checkbox = styles.component(
  'checkbox',
  (c) => {
    const v = c.vars({
      boxBorder: {
        value: `${t.color.border.strong}`,
        syntax: '<color>',
        inherits: false,
      },
      boxBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      boxForeground: {
        value: `${t.color.text.onAccent}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'box', 'label'],
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2],
        cursor: 'pointer',
      },
      box: {
        width: '18px',
        height: '18px',
        borderRadius: t.radius.sm,
        border: `1px solid ${v.boxBorder.var}`,
        backgroundColor: v.boxBackground.var,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: t.fontWeight.semibold,
        color: v.boxForeground.var,
        '&[data-selected]': {
          [v.boxBackground.name]: t.color.accent.default,
          [v.boxBorder.name]: t.color.accent.default,
        },
      },
      label: {
        fontSize: t.fontSize.md,
      },
    };
  },
  { layer: 'components' },
);
