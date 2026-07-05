import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const tabs = styles.component(
  'tabs',
  (c) => {
    const v = c.vars({
      listBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      tabColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      tabSelectedColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      tabIndicatorColor: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      panelBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      panelBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'list', 'tab', 'panel'],
      root: {
        display: 'grid',
        gap: t.space[3],
      },
      list: {
        display: 'inline-flex',
        gap: t.space[1],
        borderBottom: `1px solid ${v.listBorder.var}`,
      },
      tab: {
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: `${t.borderWidth.default} solid transparent`,
        backgroundColor: 'transparent',
        padding: `${t.space[2]} ${t.space[3]}`,
        color: v.tabColor.var,
        cursor: 'pointer',
        fontSize: t.fontSize.md,
        '&[data-selected]': {
          color: v.tabSelectedColor.var,
          borderBottomColor: v.tabIndicatorColor.var,
          fontWeight: t.fontWeight.semibold,
        },
      },
      panel: {
        padding: t.space[3],
        backgroundColor: v.panelBackground.var,
        borderRadius: t.radius.md,
        border: `1px solid ${v.panelBorder.var}`,
      },
    };
  },
  { layer: 'components' },
);
