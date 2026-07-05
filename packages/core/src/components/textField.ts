import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

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
    return {
      slots: ['root', 'label', 'input', 'description', 'error'],
      root: {
        display: 'grid',
        gap: t.space[1],
        minWidth: '240px',
      },
      label: {
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.medium,
        color: v.labelColor.var,
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
      description: {
        fontSize: t.fontSize.sm,
        color: v.descriptionColor.var,
      },
      error: {
        fontSize: t.fontSize.sm,
        color: v.errorColor.var,
      },
    };
  },
  { layer: 'components' },
);
