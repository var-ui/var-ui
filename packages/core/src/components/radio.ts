import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const radio = typestyles.styles.component(
  'radio',
  (c) => {
    const v = c.vars({
      controlBorder: {
        value: t.color.border.strong.var,
        syntax: '<color>',
        inherits: false,
      },
      indicatorBackground: {
        value: 'transparent',
        syntax: '<color>',
        inherits: false,
      },
      groupLabelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['group', 'item', 'control', 'label', 'groupLabel'],
      group: {
        display: 'grid',
        gap: t.space[1].var,
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2].var,
        cursor: 'pointer',
      },
      control: {
        width: '18px',
        height: '18px',
        borderRadius: t.radius.full.var,
        border: `1px solid ${v.controlBorder.var}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          width: '8px',
          height: '8px',
          borderRadius: t.radius.full.var,
          backgroundColor: v.indicatorBackground.var,
          transition: 'background-color 120ms ease',
        },
        '&[data-selected]::before': {
          [v.indicatorBackground.name]: t.color.accent.default.var,
        },
      },
      label: {
        fontSize: t.fontSize.md.var,
      },
      groupLabel: {
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        color: v.groupLabelColor.var,
      },
    };
  },
  { layer: 'components' },
);
