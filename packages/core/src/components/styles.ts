import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const layout = styles.component(
  'ds-layout',
  (c) => {
    const v = c.vars({
      foreground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      sectionBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      sectionBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        fontFamily: t.fontFamily.sans,
        color: v.foreground.var,
      },
      stack: {
        display: 'grid',
        gap: t.space[5],
      },
      section: {
        display: 'grid',
        gap: t.space[3],
        padding: t.space[4],
        border: `1px solid ${v.sectionBorder.var}`,
        borderRadius: t.radius.lg,
        backgroundColor: v.sectionBackground.var,
        boxShadow: t.shadow.xs,
      },
      row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: t.space[3],
        alignItems: 'center',
      },
    };
  },
  { layer: 'utilities' },
);

export const text = styles.component(
  'ds-text',
  (c) => {
    const v = c.vars({
      foreground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      secondaryColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        margin: 0,
        color: v.foreground.var,
      },
      title: {
        fontSize: '28px',
        fontWeight: t.fontWeight.semibold,
        letterSpacing: '-0.02em',
      },
      subtitle: {
        fontSize: t.fontSize.lg,
        color: v.secondaryColor.var,
      },
      sectionTitle: {
        fontSize: '20px',
        fontWeight: t.fontWeight.semibold,
      },
      label: {
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.medium,
      },
      caption: {
        fontSize: t.fontSize.sm,
        color: v.secondaryColor.var,
      },
    };
  },
  { layer: 'utilities' },
);
