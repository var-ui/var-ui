import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const tabs = typestyles.styles.component(
  'tabs',
  (c) => {
    const v = c.vars({
      listBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      tabColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      tabSelectedColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      tabIndicatorColor: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: false,
      },
      panelBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      panelBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'list', 'tab', 'panel'],
      root: {
        display: 'grid',
        gap: t.space[3].var,
      },
      list: {
        display: 'inline-flex',
        gap: t.space[1].var,
        borderBottom: `1px solid ${v.listBorder.var}`,
      },
      tab: {
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: `${t.borderWidth.default.var} solid transparent`,
        backgroundColor: 'transparent',
        padding: `${t.space[2].var} ${t.space[3].var}`,
        color: v.tabColor.var,
        cursor: 'pointer',
        fontSize: t.fontSize.md.var,
        '&[data-selected]': {
          color: v.tabSelectedColor.var,
          borderBottomColor: v.tabIndicatorColor.var,
          fontWeight: t.fontWeight.semibold.var,
        },
      },
      panel: {
        padding: t.space[3].var,
        backgroundColor: v.panelBackground.var,
        borderRadius: t.radius.md.var,
        border: `1px solid ${v.panelBorder.var}`,
      },
    };
  },
  { layer: 'components' },
);
