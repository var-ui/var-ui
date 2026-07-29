import { styles, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const card = typestyles.styles.component(
  'card',
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
      titleColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      bodyColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      linkTitleColor: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: [
        'root',
        'title',
        'body',
        'grid',
        'linkRoot',
        'linkTitle',
        'linkDescription',
        'linkHint',
      ],
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
        padding: t.space[4].var,
        borderRadius: t.radius.md.var,
        border: `1px solid ${v.border.var}`,
        backgroundColor: v.background.var,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.lg.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.titleColor.var,
        lineHeight: 1.3,
      },
      body: {
        margin: 0,
        fontSize: t.fontSize.md.var,
        color: v.bodyColor.var,
        lineHeight: 1.55,
      },
      grid: {
        display: 'grid',
        gap: t.space[4].var,
        gridTemplateColumns: '1fr',
        ...styles.media('sm', 'min', {
          gridTemplateColumns: 'repeat(2, 1fr)',
        }),
      },
      linkRoot: {
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          [v.border.name]: t.color.border.strong.var,
          boxShadow: t.shadow.xs.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
      },
      linkTitle: {
        color: v.linkTitleColor.var,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      linkDescription: {
        margin: 0,
        fontSize: t.fontSize.md.var,
        color: v.bodyColor.var,
        lineHeight: 1.55,
      },
      linkHint: {
        marginTop: 'auto',
        paddingTop: t.space[2].var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        color: v.bodyColor.var,
      },
    };
  },
  { layer: 'components' },
);
