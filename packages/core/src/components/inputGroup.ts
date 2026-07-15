import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

/**
 * Connected-border group for bare `<input>`s and text addons (e.g. a
 * currency symbol or unit label glued to an input's edge).
 *
 * Unlike `textField`/`numberInput`, this recipe intentionally owns its own
 * field chrome rather than delegating to those components — v1 scope wraps
 * plain `<input>` elements and `InputGroupText` addons, not full field
 * components. Direct children of `group` share the buttonGroup border-joining
 * technique: interior borders overlap by 1px and only the first/last child
 * keep the container's outer corner radius.
 */
export const inputGroup = styles.component(
  'input-group',
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
      placeholderColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      textBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      textForeground: {
        value: `${t.color.text.secondary}`,
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
      slots: ['root', 'label', 'description', 'error', 'group', 'input', 'text'],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      group: {
        display: 'inline-flex',
        alignItems: 'stretch',
        '& > *': {
          borderRadius: 0,
          position: 'relative',
        },
        '& > * + *': {
          marginInlineStart: '-1px',
        },
        '& > *:first-child': {
          borderStartStartRadius: t.radius.md,
          borderEndStartRadius: t.radius.md,
        },
        '& > *:last-child': {
          borderStartEndRadius: t.radius.md,
          borderEndEndRadius: t.radius.md,
        },
        '& > *:focus-within, & > *:hover': {
          zIndex: 1,
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      input: {
        flex: 1,
        minWidth: 0,
        border: `1px solid ${v.inputBorder.var}`,
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
        '&:disabled': {
          cursor: 'not-allowed',
        },
      },
      text: {
        display: 'flex',
        alignItems: 'center',
        paddingInline: t.space[2],
        backgroundColor: v.textBackground.var,
        color: v.textForeground.var,
        border: `1px solid ${v.inputBorder.var}`,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      },
    };
  },
  { layer: 'components' },
);
