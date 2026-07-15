import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const typeahead = styles.component(
  'typeahead',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      descriptionColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      errorColor: {
        value: `${t.color.danger.default}`,
        syntax: '<color>',
        inherits: false,
      },
      inputBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      inputBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      inputForeground: {
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
        gap: t.space[2],
        border: `1px solid ${v.inputBorder.var}`,
        borderRadius: t.radius.md,
        padding: `${t.space[2]} ${t.space[3]}`,
        backgroundColor: v.inputBackground.var,
        '&:focus-within': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
          [v.inputBorder.name]: t.color.border.focus,
        },
      },
      input: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        flex: 1,
        fontSize: t.fontSize.md,
        color: v.inputForeground.var,
      },
      clearButton: {
        display: 'inline-flex',
        flexShrink: 0,
        color: t.color.text.secondary,
        cursor: 'pointer',
        borderRadius: t.radius.sm,
        padding: t.space[1],
        '&[data-hovered]': {
          backgroundColor: t.color.background.subtle,
        },
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
