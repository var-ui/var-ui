import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

/**
 * File picker field: dashed dropzone (click or drag-and-drop) around field
 * chrome shared with textField/numberInput. The React wrapper owns file
 * validation and drag state; this recipe only styles the resulting DOM
 * states (`data-drag-over`, `data-disabled`).
 */
export const fileInput = styles.component(
  'file-input',
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
      dropzoneBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      dropzoneBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      placeholderColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      fileNameColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      iconColor: {
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
      slots: [
        'root',
        'label',
        'description',
        'error',
        'dropzone',
        'placeholderText',
        'fileNameText',
        'icon',
        'clearButton',
        'hiddenInput',
      ],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      dropzone: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2],
        border: `1px dashed ${v.dropzoneBorder.var}`,
        borderRadius: t.radius.md,
        padding: `${t.space[6]} ${t.space[4]}`,
        backgroundColor: v.dropzoneBackground.var,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'background-color 140ms ease, border-color 140ms ease',
        '&[data-drag-over]': {
          [v.dropzoneBorder.name]: t.color.accent.default,
          [v.dropzoneBackground.name]: t.color.accent.subtle,
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      placeholderText: {
        fontSize: t.fontSize.sm,
        color: v.placeholderColor.var,
      },
      fileNameText: {
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.medium,
        color: v.fileNameColor.var,
      },
      icon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        color: v.iconColor.var,
      },
      clearButton: {
        appearance: 'none',
        border: 'none',
        borderRadius: t.radius.sm,
        backgroundColor: 'transparent',
        color: v.iconColor.var,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[1],
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: t.color.background.subtle,
        },
      },
      hiddenInput: {
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: 0,
        border: 0,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
