import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const outline = styles.component(
  'outline',
  (c) => {
    const v = c.vars({
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      titleColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      linkColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      linkActiveColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'title', 'list', 'link', 'linkActive', 'linkNested'],
      root: {
        paddingInlineStart: t.space[2],
        borderInlineStart: `1px solid ${v.border.var}`,
      },
      title: {
        margin: 0,
        marginBottom: t.space[2],
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.semibold,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: v.titleColor.var,
      },
      list: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
      },
      link: {
        display: 'block',
        fontSize: t.fontSize.sm,
        color: v.linkColor.var,
        textDecoration: 'none',
        '&:hover': {
          color: v.linkActiveColor.var,
        },
      },
      linkActive: {
        display: 'block',
        fontSize: t.fontSize.sm,
        color: v.linkActiveColor.var,
        fontWeight: t.fontWeight.semibold,
        textDecoration: 'none',
      },
      linkNested: {
        paddingInlineStart: t.space[3],
      },
    };
  },
  { layer: 'components' },
);
