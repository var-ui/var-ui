import type { CSSProperties } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Single toggle button and segmented-control item styling. */
export const toggleButton = typestyles.styles.component(
  'toggle-button',
  (c) => {
    const v = c.vars({
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: false,
      },
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      selectedBackground: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: false,
      },
      selectedForeground: {
        value: t.color.text.onAccent.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        appearance: 'none',
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        color: v.foreground.var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        padding: `${t.space[2].var} ${t.space[4].var}`,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        transition: 'background-color 140ms ease, border-color 140ms ease',
        '&:hover': {
          backgroundColor: t.color.background.subtle.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[data-selected]': {
          [v.background.name]: v.selectedBackground.var,
          [v.border.name]: v.selectedBackground.var,
          [v.foreground.name]: v.selectedForeground.var,
          '&:hover': {
            [v.background.name]: t.color.accent.hover.var,
            [v.border.name]: t.color.accent.hover.var,
          },
        } as unknown as CSSProperties,
      },
      variants: {
        size: {
          sm: {
            fontSize: t.fontSize.sm.var,
            padding: `${t.space[1].var} ${t.space[3].var}`,
          },
          md: {},
          lg: {
            fontSize: t.fontSize.lg.var,
            padding: `${t.space[3].var} ${t.space[5].var}`,
          },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
