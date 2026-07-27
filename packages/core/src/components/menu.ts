import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const menu = typestyles.styles.component(
  'menu',
  (c) => {
    const v = c.vars({
      popoverBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: false,
      },
      popoverBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      itemForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      itemFocusedBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      itemDisabledForeground: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      sectionHeaderForeground: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      separatorColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      dangerForeground: {
        value: t.color.danger.default.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: [
        'popover',
        'menu',
        'section',
        'sectionHeader',
        'item',
        'itemDanger',
        'itemLabel',
        'itemShortcut',
        'itemCheck',
        'separator',
        'submenuChevron',
      ],
      popover: {
        border: `1px solid ${v.popoverBorder.var}`,
        borderRadius: t.radius.md.var,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md.var,
        padding: t.space[1].var,
        minWidth: '12rem',
      },
      menu: {
        outline: 'none',
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
      },
      sectionHeader: {
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.sectionHeaderForeground.var,
        padding: `${t.space[1].var} ${t.space[3].var}`,
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        fontSize: t.fontSize.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.sm.var,
        cursor: 'pointer',
        color: v.itemForeground.var,
        outline: 'none',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
        '&[data-disabled]': {
          color: v.itemDisabledForeground.var,
          cursor: 'not-allowed',
        },
      },
      itemDanger: {
        color: v.dangerForeground.var,
      },
      itemLabel: {
        flex: 1,
        minWidth: 0,
      },
      itemShortcut: {
        fontSize: t.fontSize.sm.var,
        color: v.sectionHeaderForeground.var,
      },
      itemCheck: {
        display: 'inline-flex',
        width: '1rem',
        flexShrink: 0,
      },
      separator: {
        height: '1px',
        margin: `${t.space[1].var} 0`,
        backgroundColor: v.separatorColor.var,
      },
      submenuChevron: {
        display: 'inline-flex',
        marginInlineStart: 'auto',
        color: v.sectionHeaderForeground.var,
      },
    };
  },
  { layer: 'components' },
);
