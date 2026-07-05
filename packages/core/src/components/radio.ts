import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const radio = styles.component(
  'radio',
  (c) => {
    const v = c.vars({
      controlBorder: {
        value: `${t.color.border.strong}`,
        syntax: '<color>',
        inherits: false,
      },
      indicatorBackground: {
        value: 'transparent',
        syntax: '<color>',
        inherits: false,
      },
      groupLabelColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['group', 'item', 'control', 'label', 'groupLabel'],
      group: {
        display: 'grid',
        gap: t.space[1],
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2],
        cursor: 'pointer',
      },
      control: {
        width: '18px',
        height: '18px',
        borderRadius: t.radius.full,
        border: `1px solid ${v.controlBorder.var}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          width: '8px',
          height: '8px',
          borderRadius: t.radius.full,
          backgroundColor: v.indicatorBackground.var,
          transition: 'background-color 120ms ease',
        },
        '&[data-selected]::before': {
          [v.indicatorBackground.name]: t.color.accent.default,
        },
      },
      label: {
        fontSize: t.fontSize.md,
      },
      groupLabel: {
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.medium,
        color: v.groupLabelColor.var,
      },
    };
  },
  { layer: 'components' },
);
