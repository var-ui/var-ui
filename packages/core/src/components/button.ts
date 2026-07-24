import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const button = typestyles.styles.component(
  'button',
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
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        transition: 'background-color 140ms ease, border-color 140ms ease, transform 80ms ease',
        '&:hover': {
          borderColor: t.color.border.strong.var,
          backgroundColor: t.color.background.subtle.var,
        },
        '&:active': {
          transform: 'translateY(1px)',
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
      },
      variants: {
        intent: {
          primary: {
            [v.border.name]: t.color.accent.default.var,
            [v.background.name]: t.color.accent.default.var,
            [v.foreground.name]: t.color.text.onAccent.var,
            '&:hover': {
              [v.background.name]: t.color.accent.hover.var,
              [v.border.name]: t.color.accent.hover.var,
            },
          },
          secondary: {
            [v.background.name]: t.color.background.surface.var,
            [v.border.name]: t.color.border.default.var,
            [v.foreground.name]: t.color.text.primary.var,
            '&:hover': {
              borderColor: t.color.border.strong.var,
              backgroundColor: t.color.background.subtle.var,
            },
          },
          ghost: {
            [v.background.name]: 'transparent',
            [v.border.name]: 'transparent',
            [v.foreground.name]: t.color.text.primary.var,
            '&:hover': {
              backgroundColor: t.color.background.subtle.var,
            },
          },
          danger: {
            [v.border.name]: t.color.danger.solid.var,
            [v.background.name]: t.color.danger.solid.var,
            [v.foreground.name]: t.color.text.onDanger.var,
            '&:hover': {
              [v.background.name]: `color-mix(in oklch, ${t.color.danger.solid.var} 88%, black)`,
              [v.border.name]: `color-mix(in oklch, ${t.color.danger.solid.var} 88%, black)`,
            },
          },
        },
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
        layout: {
          default: {},
          icon: {
            padding: t.space[2].var,
            width: '2rem',
            height: '2rem',
            minWidth: '2rem',
            minHeight: '2rem',
          },
        },
      },
      defaultVariants: { intent: 'secondary', size: 'md', layout: 'default' },
    };
  },
  { layer: 'components' },
);

export const linkButton = button;
