import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const select = styles.component(
  'select',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      triggerBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      triggerBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      triggerForeground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      popoverBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      popoverBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      itemSelectedColor: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      itemFocusedBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    // Select has no description/error slots — reuse only the shared root/label chrome.
    const chrome = fieldChrome({ label: v.labelColor.var, description: '', error: '' });
    return {
      slots: ['root', 'label', 'trigger', 'triggerIcon', 'popover', 'item'],
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      label: chrome.label,
      trigger: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[2],
        textAlign: 'left',
        border: `1px solid ${v.triggerBorder.var}`,
        borderRadius: t.radius.md,
        padding: `${t.space[2]} ${t.space[3]}`,
        backgroundColor: v.triggerBackground.var,
        color: v.triggerForeground.var,
        fontSize: t.fontSize.md,
        cursor: 'pointer',
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
          [v.triggerBorder.name]: t.color.border.focus,
        },
      },
      triggerIcon: {
        display: 'inline-flex',
        flexShrink: 0,
        color: t.color.text.secondary,
      },
      popover: {
        border: `1px solid ${v.popoverBorder.var}`,
        borderRadius: t.radius.md,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md,
        padding: t.space[1],
      },
      item: {
        fontSize: t.fontSize.md,
        padding: `${t.space[2]} ${t.space[3]}`,
        borderRadius: t.radius.sm,
        cursor: 'pointer',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
        '&[data-selected]': {
          color: v.itemSelectedColor.var,
          fontWeight: t.fontWeight.semibold,
        },
      },
    };
  },
  { layer: 'components' },
);
