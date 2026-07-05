import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const card = styles.component(
  'card',
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
      titleColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      bodyColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      linkTitleColor: {
        value: `${t.color.accent.default}`,
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
        gap: t.space[2],
        padding: t.space[4],
        borderRadius: t.radius.md,
        border: `1px solid ${v.border.var}`,
        backgroundColor: v.background.var,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.lg,
        fontWeight: t.fontWeight.semibold,
        color: v.titleColor.var,
        lineHeight: 1.3,
      },
      body: {
        margin: 0,
        fontSize: t.fontSize.md,
        color: v.bodyColor.var,
        lineHeight: 1.55,
      },
      grid: {
        display: 'grid',
        gap: t.space[4],
        gridTemplateColumns: '1fr',
        '@media (min-width: 640px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
      },
      linkRoot: {
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          [v.border.name]: t.color.border.strong,
          boxShadow: t.shadow.xs,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
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
        fontSize: t.fontSize.md,
        color: v.bodyColor.var,
        lineHeight: 1.55,
      },
      linkHint: {
        marginTop: 'auto',
        paddingTop: t.space[2],
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.medium,
        color: v.bodyColor.var,
      },
    };
  },
  { layer: 'components' },
);
