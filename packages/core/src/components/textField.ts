import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const textField = styles.component(
  'text-field',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: `${t.color.text.primary}`,
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
      placeholderColor: {
        value: `${t.color.text.secondary}`,
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
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'input', 'description', 'error'],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      input: {
        border: `1px solid ${v.inputBorder.var}`,
        borderRadius: t.radius.md,
        padding: `${t.space[2]} ${t.space[3]}`,
        fontSize: t.fontSize.md,
        backgroundColor: v.inputBackground.var,
        color: v.inputForeground.var,
        '&:focus': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
          [v.inputBorder.name]: t.color.border.focus,
        },
        '&::placeholder': {
          color: v.placeholderColor.var,
        },
      },
    };
  },
  { layer: 'components' },
);
