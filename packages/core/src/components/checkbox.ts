import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const checkbox = typestyles.styles.component(
  'checkbox',
  (c) => {
    const v = c.vars({
      boxBorder: {
        value: t.color.border.strong.var,
        syntax: '<color>',
      },
      boxBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      boxForeground: {
        value: t.color.text.onAccent.var,
        syntax: '<color>',
      },
      groupLabelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'box', 'label', 'group', 'groupLabel'],
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2].var,
        cursor: 'pointer',
      },
      box: {
        width: '18px',
        height: '18px',
        borderRadius: t.radius.sm.var,
        border: `1px solid ${v.boxBorder.var}`,
        backgroundColor: v.boxBackground.var,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: t.fontWeight.semibold.var,
        color: v.boxForeground.var,
        '&[data-selected]': {
          [v.boxBackground.name]: t.color.accent.default.var,
          [v.boxBorder.name]: t.color.accent.default.var,
        },
      },
      label: {
        fontSize: t.fontSize.md.var,
      },
      group: {
        display: 'grid',
        gap: t.space[1].var,
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
