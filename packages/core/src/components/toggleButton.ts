import type { CSSProperties } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Single toggle button and segmented-control item styling. */
export const toggleButton = styles.component(
  'toggle-button',
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
      foreground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      selectedBackground: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      selectedForeground: {
        value: `${t.color.text.onAccent}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        appearance: 'none',
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.md,
        backgroundColor: v.background.var,
        color: v.foreground.var,
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.medium,
        padding: `${t.space[2]} ${t.space[4]}`,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2],
        transition: 'background-color 140ms ease, border-color 140ms ease',
        '&:hover': {
          backgroundColor: t.color.background.subtle,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
        '&[data-selected]': {
          [v.background.name]: v.selectedBackground.var,
          [v.border.name]: v.selectedBackground.var,
          [v.foreground.name]: v.selectedForeground.var,
          '&:hover': {
            [v.background.name]: t.color.accent.hover,
            [v.border.name]: t.color.accent.hover,
          },
        } as unknown as CSSProperties,
      },
      variants: {
        size: {
          sm: {
            fontSize: t.fontSize.sm,
            padding: `${t.space[1]} ${t.space[3]}`,
          },
          md: {},
          lg: {
            fontSize: t.fontSize.lg,
            padding: `${t.space[3]} ${t.space[5]}`,
          },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
