import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const typeahead = typestyles.styles.component(
  'typeahead',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      errorColor: {
        value: t.color.danger.default.var,
        syntax: '<color>',
      },
      inputBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      inputBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputForeground: {
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
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: [
        'root',
        'label',
        'description',
        'error',
        'inputWrapper',
        'input',
        'clearButton',
        'popover',
        'item',
      ],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        border: `1px solid ${v.inputBorder.var}`,
        borderRadius: t.radius.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        backgroundColor: v.inputBackground.var,
        '&:focus-within': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
          [v.inputBorder.name]: t.color.border.focus.var,
        },
      },
      input: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        flex: 1,
        fontSize: t.fontSize.md.var,
        color: v.inputForeground.var,
      },
      clearButton: {
        display: 'inline-flex',
        flexShrink: 0,
        color: t.color.text.secondary.var,
        cursor: 'pointer',
        borderRadius: t.radius.sm.var,
        padding: t.space[1].var,
        '&[data-hovered]': {
          backgroundColor: t.color.background.subtle.var,
        },
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
