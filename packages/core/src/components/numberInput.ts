import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const numberInput = styles.component(
  'number-input',
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
      stepperBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      stepperForeground: {
        value: `${t.color.text.primary}`,
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
      slots: ['root', 'label', 'group', 'input', 'stepper', 'description', 'error'],
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      label: chrome.label,
      group: {
        display: 'flex',
        alignItems: 'stretch',
      },
      input: {
        flex: 1,
        minWidth: 0,
        border: `1px solid ${v.inputBorder.var}`,
        borderRadius: `${t.radius.md} 0 0 ${t.radius.md}`,
        padding: `${t.space[2]} ${t.space[3]}`,
        fontSize: t.fontSize.md,
        backgroundColor: v.inputBackground.var,
        color: v.inputForeground.var,
        '&:focus': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
          [v.inputBorder.name]: t.color.border.focus,
        },
      },
      stepper: {
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${v.inputBorder.var}`,
        borderInlineStart: 'none',
        borderRadius: `0 ${t.radius.md} ${t.radius.md} 0`,
        overflow: 'hidden',
        '& button': {
          appearance: 'none',
          border: 'none',
          backgroundColor: v.stepperBackground.var,
          color: v.stepperForeground.var,
          padding: `${t.space[1]} ${t.space[2]}`,
          cursor: 'pointer',
          fontSize: t.fontSize.sm,
          lineHeight: 1,
          '&:hover': {
            backgroundColor: t.color.background.subtle,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '-2px',
          },
        },
      },
      description: chrome.description,
      error: chrome.error,
    };
  },
  { layer: 'components' },
);
