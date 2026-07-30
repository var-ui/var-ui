import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Command / search palette overlay (⌘K-style).
 *
 * Multi-part UI: use the **slots** API (`commandPalette().dialog`) rather than flat
 * `component({ key: true })`, which is meant for optional style toggles on one surface.
 *
 * Pass `{ open: true }` when the overlay is visible; default is closed.
 */
export const commandPalette = typestyles.styles.component(
  'command-palette',
  (c) => {
    const v = c.vars({
      backdropBackground: {
        value: t.color.overlay.backdrop.var,
        syntax: '<color>',
      },
      dialogBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      dialogBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputRowBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputIconColor: {
        value: t.color.text.placeholder.var,
        syntax: '<color>',
      },
      inputForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      inputPlaceholder: {
        value: t.color.text.placeholder.var,
        syntax: '<color>',
      },
      resultForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      resultHoverBackground: {
        value: t.color.accent.subtle.var,
        syntax: '<color>',
      },
      resultMetaColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      markBackground: {
        value: t.color.accent.subtle.var,
        syntax: '<color>',
      },
      markForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      emptyColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: [
        'root',
        'backdrop',
        'dialog',
        'inputRow',
        'inputIcon',
        'input',
        'results',
        'result',
        'resultLink',
        'resultLinkActive',
        'resultTitle',
        'resultMeta',
        'mark',
        'empty',
      ],
      base: {
        root: {
          [v.backdropBackground.name]: t.color.overlay.backdrop.var,
          [v.dialogBackground.name]: t.color.background.surface.var,
          [v.dialogBorder.name]: t.color.border.default.var,
          [v.inputRowBorder.name]: t.color.border.default.var,
          [v.inputIconColor.name]: t.color.text.placeholder.var,
          [v.inputForeground.name]: t.color.text.primary.var,
          [v.inputPlaceholder.name]: t.color.text.placeholder.var,
          [v.resultForeground.name]: t.color.text.primary.var,
          [v.resultHoverBackground.name]: t.color.accent.subtle.var,
          [v.resultMetaColor.name]: t.color.text.secondary.var,
          [v.markBackground.name]: t.color.accent.subtle.var,
          [v.markForeground.name]: t.color.text.primary.var,
          [v.emptyColor.name]: t.color.text.secondary.var,
          position: 'fixed',
          inset: 0,
          zIndex: t.zIndex.overlay.var,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: `max(12vh, 72px) ${t.space[4].var} ${t.space[5].var}`,
          pointerEvents: 'none',
          opacity: 0,
          visibility: 'hidden',
          transition: t.transition.overlayFade.var,
        },
        backdrop: {
          position: 'absolute',
          inset: 0,
          backgroundColor: v.backdropBackground.var,
          transition: t.transition.backdrop.var,
          '@supports (backdrop-filter: blur(1px))': {
            backdropFilter: 'blur(10px)',
          },
        },
        dialog: {
          position: 'relative',
          zIndex: t.zIndex.raised.var,
          width: 'min(560px, 100%)',
          maxHeight: 'min(72vh, 640px)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: t.fontFamily.sans.var,
          backgroundColor: v.dialogBackground.var,
          borderRadius: t.radius.lg.var,
          border: `${t.borderWidth.default.var} solid ${v.dialogBorder.var}`,
          boxShadow: t.shadow.xl.var,
          overflow: 'hidden',
          opacity: 0,
          transition: t.transition.panelEnter.var,
        },
        inputRow: {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          padding: `${t.space[3].var} ${t.space[4].var}`,
          borderBottom: `${t.borderWidth.default.var} solid ${v.inputRowBorder.var}`,
        },
        inputIcon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          color: v.inputIconColor.var,
          lineHeight: 0,
        },
        input: {
          flex: 1,
          minWidth: 0,
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          fontSize: t.fontSize.lg.var,
          fontFamily: t.fontFamily.sans.var,
          color: v.inputForeground.var,
          outline: 'none',
          '&::placeholder': { color: v.inputPlaceholder.var },
        },
        results: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          margin: 0,
          padding: `${t.space[1].var} 0 ${t.space[2].var}`,
          listStyle: 'none',
        },
        result: {
          margin: 0,
        },
        resultLink: {
          display: 'block',
          padding: `${t.space[2].var} ${t.space[4].var}`,
          textDecoration: 'none',
          color: v.resultForeground.var,
          transition: t.transition.surfaceFast.var,
          '&:hover': {
            backgroundColor: v.resultHoverBackground.var,
          },
        },
        resultLinkActive: {
          backgroundColor: v.resultHoverBackground.var,
        },
        resultTitle: {
          display: 'block',
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          lineHeight: 1.35,
          marginBottom: t.space[1].var,
        },
        resultMeta: {
          display: 'block',
          fontSize: t.fontSize.sm.var,
          color: v.resultMetaColor.var,
          lineHeight: 1.35,
        },
        mark: {
          fontFamily: 'inherit',
          backgroundColor: v.markBackground.var,
          color: v.markForeground.var,
          borderRadius: t.radius.sm.var,
          padding: `0 ${t.space[1].var}`,
        },
        empty: {
          padding: `${t.space[4].var} ${t.space[4].var}`,
          fontSize: t.fontSize.sm.var,
          color: v.emptyColor.var,
          lineHeight: 1.5,
        },
      },
      variants: {
        open: {
          false: {},
          true: {
            root: {
              pointerEvents: 'auto',
              opacity: 1,
              visibility: 'visible',
            },
            dialog: {
              opacity: 1,
            },
          },
        },
      },
      defaultVariants: { open: false },
    };
  },
  { layer: 'components' },
);
