import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const select = typestyles.styles.component(
  'select',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      triggerBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      triggerBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      triggerForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      popoverBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      popoverBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      itemSelectedColor: {
        value: t.color.accent.default.var,
        syntax: '<color>',
      },
      itemFocusedBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
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
        gap: t.space[2].var,
        textAlign: 'left',
        border: `1px solid ${v.triggerBorder.var}`,
        borderRadius: t.radius.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        backgroundColor: v.triggerBackground.var,
        color: v.triggerForeground.var,
        fontSize: t.fontSize.md.var,
        cursor: 'pointer',
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
          [v.triggerBorder.name]: t.color.border.focus.var,
        },
      },
      triggerIcon: {
        display: 'inline-flex',
        flexShrink: 0,
        color: t.color.text.secondary.var,
      },
      popover: {
        border: `1px solid ${v.popoverBorder.var}`,
        borderRadius: t.radius.md.var,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md.var,
        padding: t.space[1].var,
      },
      item: {
        fontSize: t.fontSize.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.sm.var,
        cursor: 'pointer',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
        '&[data-selected]': {
          color: v.itemSelectedColor.var,
          fontWeight: t.fontWeight.semibold.var,
        },
      },
    };
  },
  { layer: 'components' },
);
