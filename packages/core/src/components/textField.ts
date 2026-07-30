import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const textField = typestyles.styles.component(
  'text-field',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
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
      placeholderColor: {
        value: t.color.text.secondary.var,
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
        borderRadius: t.radius.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        fontSize: t.fontSize.md.var,
        backgroundColor: v.inputBackground.var,
        color: v.inputForeground.var,
        '&:focus': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
          [v.inputBorder.name]: t.color.border.focus.var,
        },
        '&::placeholder': {
          color: v.placeholderColor.var,
        },
      },
    };
  },
  { layer: 'components' },
);
