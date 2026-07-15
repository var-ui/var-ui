import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const tokenizer = styles.component(
  'tokenizer',
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
      groupBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      groupBorder: {
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
      itemFocusedBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      tokenBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      tokenForeground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      tokenRemoveHoverBackground: {
        value: `${t.color.background.elevated}`,
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
        'group',
        'tokenList',
        'token',
        'tokenLabel',
        'tokenRemoveButton',
        'input',
        'popover',
        'item',
      ],
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      label: chrome.label,
      description: chrome.description,
      error: chrome.error,
      group: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: t.space[1],
        border: `1px solid ${v.groupBorder.var}`,
        borderRadius: t.radius.md,
        padding: t.space[2],
        backgroundColor: v.groupBackground.var,
        '&[data-focus-within]': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
          [v.groupBorder.name]: t.color.border.focus,
        },
        '&[data-disabled]': {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
      },
      tokenList: {
        display: 'contents',
      },
      token: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        padding: `${t.space[1]} ${t.space[2]}`,
        borderRadius: t.radius.full,
        backgroundColor: v.tokenBackground.var,
        color: v.tokenForeground.var,
        fontSize: t.fontSize.sm,
      },
      tokenLabel: {},
      tokenRemoveButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        color: 'inherit',
        '&[data-hovered]': {
          backgroundColor: v.tokenRemoveHoverBackground.var,
        },
      },
      input: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        flex: 1,
        minWidth: '4rem',
        fontSize: t.fontSize.md,
        color: v.inputForeground.var,
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
      },
    };
  },
  { layer: 'components' },
);
