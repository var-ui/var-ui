import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const multiSelector = styles.component(
  'multiSelector',
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
      itemCheckboxBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    // MultiSelector has no description/error slots — reuse only the shared root/label chrome.
    const chrome = fieldChrome({ label: v.labelColor.var, description: '', error: '' });
    return {
      slots: [
        'root',
        'label',
        'trigger',
        'triggerIcon',
        'popover',
        'item',
        'itemCheckbox',
        'itemLabel',
      ],
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
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2],
        fontSize: t.fontSize.md,
        padding: `${t.space[2]} ${t.space[3]}`,
        borderRadius: t.radius.sm,
        cursor: 'pointer',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
      },
      itemCheckbox: {
        width: '1rem',
        height: '1rem',
        borderRadius: t.radius.sm,
        border: `1px solid ${v.itemCheckboxBorder.var}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        '&[data-selected]': {
          backgroundColor: v.itemSelectedColor.var,
        },
      },
      itemLabel: {
        flex: 1,
        minWidth: 0,
      },
    };
  },
  { layer: 'components' },
);
