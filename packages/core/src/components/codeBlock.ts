import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const codeBlock = styles.component(
  'code-block',
  (c) => {
    const v = c.vars({
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      background: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      backgroundInline: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      backgroundHeader: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      filenameColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      languageColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      copyButtonColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      copyButtonHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      feedbackColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      lineNumberColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      lineHighlightBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: [
        'root',
        'rootDefault',
        'rootInline',
        'rootDiff',
        'rootTerminal',
        'header',
        'headerTerminal',
        'title',
        'filename',
        'language',
        'languageTerminal',
        'actions',
        'copyButton',
        'copyButtonIdle',
        'copyButtonCopied',
        'copyButtonError',
        'feedback',
        'feedbackInline',
        'feedbackToast',
        'feedbackSuccess',
        'feedbackError',
        'body',
        'bodyTerminal',
        'bodyScrollable',
        'pre',
        'preTerminal',
        'preWrap',
        'preScrollX',
        'code',
        'lines',
        'line',
        'lineNumber',
        'lineContent',
        'lineHighlighted',
        'lineAdded',
        'lineDeleted',
      ],
      root: {
        border: `${t.borderWidth.default} solid ${v.border.var}`,
        borderRadius: t.radius.lg,
        backgroundColor: v.background.var,
        overflow: 'hidden',
        boxShadow: t.shadow.lg,
      },
      rootDefault: {},
      rootInline: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        borderRadius: t.radius.md,
        border: `${t.borderWidth.default} solid ${v.border.var}`,
        padding: '2px 8px',
        backgroundColor: v.backgroundInline.var,
      },
      rootDiff: {
        borderColor: t.color.border.strong,
      },
      rootTerminal: {
        backgroundColor: t.color.text.primary,
        borderColor: t.color.text.primary,
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[2],
        paddingBlock: t.space[1],
        paddingInline: t.space[3],
        borderBottom: `${t.borderWidth.default} solid ${v.border.var}`,
        backgroundColor: v.backgroundHeader.var,
      },
      headerTerminal: {
        borderBottomColor: t.color.border.strong,
        backgroundColor: v.backgroundHeader.var,
      },
      title: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2],
        minWidth: 0,
      },
      filename: {
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.medium,
        color: v.filenameColor.var,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      language: {
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.bold,
        fontFamily: t.fontFamily.mono,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: v.languageColor.var,
        whiteSpace: 'nowrap',
      },
      languageTerminal: {
        color: t.color.text.onAccent,
        borderColor: 'rgb(255 255 255 / 0.2)',
      },
      actions: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        flexShrink: 0,
      },
      /**
       * Copy button reads as a mono uppercase text action rather than a boxed button. The header
       * already has its own hairline + toolbar tint; a second bordered chip inside it reads as
       * double chrome.
       */
      copyButton: {
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        border: 'none',
        backgroundColor: 'transparent',
        color: v.copyButtonColor.var,
        borderRadius: t.radius.sm,
        paddingBlock: t.space[1],
        paddingInline: t.space[2],
        fontFamily: t.fontFamily.mono,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.semibold,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: t.transition.colorShift,
        '&:hover': {
          color: v.filenameColor.var,
          backgroundColor: v.copyButtonHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `${t.borderWidth.thin} solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
        '&[data-copied]': {
          color: t.color.success.default,
        },
        '&[data-error]': {
          color: t.color.danger.default,
        },
      },
      copyButtonIdle: {},
      copyButtonCopied: {
        color: t.color.success.default,
      },
      copyButtonError: {
        color: t.color.danger.default,
      },
      feedback: {
        fontSize: t.fontSize.sm,
        color: v.feedbackColor.var,
        minHeight: '1lh',
      },
      feedbackInline: {
        display: 'inline-flex',
        alignItems: 'center',
        marginInlineStart: t.space[1],
      },
      feedbackToast: {
        position: 'absolute',
        right: t.space[3],
        top: t.space[3],
        zIndex: 1,
        border: `${t.borderWidth.default} solid ${v.border.var}`,
        backgroundColor: v.background.var,
        borderRadius: t.radius.md,
        padding: `2px ${t.space[2]}`,
        boxShadow: t.shadow.sm,
      },
      feedbackSuccess: {
        color: t.color.success.default,
      },
      feedbackError: {
        color: t.color.danger.default,
      },
      body: {
        padding: 0,
        backgroundColor: v.background.var,
      },
      bodyTerminal: {
        color: t.color.text.onAccent,
      },
      bodyScrollable: {
        overflowX: 'auto',
      },
      pre: {
        margin: 0,
        padding: t.space[4],
        fontFamily: t.fontFamily.mono,
        fontSize: t.fontSize.sm,
        lineHeight: 1.6,
        overflow: 'auto',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
      },
      preTerminal: {
        color: t.color.text.onAccent,
      },
      preWrap: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowX: 'visible',
      },
      preScrollX: {
        whiteSpace: 'pre',
        overflowX: 'auto',
      },
      code: {
        display: 'block',
      },
      lines: {
        display: 'grid',
        gap: '2px',
      },
      line: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'start',
        columnGap: t.space[3],
        borderRadius: t.radius.sm,
        paddingInline: t.space[2],
      },
      lineNumber: {
        minWidth: '2ch',
        textAlign: 'right',
        fontSize: t.fontSize.sm,
        color: v.lineNumberColor.var,
        opacity: 0.8,
        userSelect: 'none',
      },
      lineContent: {
        minWidth: 0,
      },
      lineHighlighted: {
        backgroundColor: v.lineHighlightBackground.var,
      },
      lineAdded: {
        backgroundColor: 'rgb(16 185 129 / 0.12)',
      },
      lineDeleted: {
        backgroundColor: 'rgb(248 113 113 / 0.12)',
      },
    };
  },
  { layer: 'components' },
);
