import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const steps = styles.component(
  'steps',
  (c) => {
    const v = c.vars({
      stepForeground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      indicatorBackground: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      indicatorForeground: {
        value: `${t.color.text.onAccent}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root'],
      /** Use with `<ol class={steps.root}><li>…</li></ol>` (see `Steps.astro`). */
      root: {
        listStyle: 'none',
        padding: 0,
        margin: `${t.space[4]} 0`,
        counterReset: 'docs-step',
        '& > li': {
          position: 'relative',
          listStyle: 'none',
          paddingLeft: `calc(${t.space[5]} + ${t.space[3]})`,
          marginBottom: t.space[5],
          counterIncrement: 'docs-step',
          fontSize: t.fontSize.md,
          color: v.stepForeground.var,
          lineHeight: 1.6,
          '&:last-child': {
            marginBottom: 0,
          },
          '&::before': {
            content: 'counter(docs-step)',
            position: 'absolute',
            left: 0,
            top: 0,
            width: t.space[5],
            height: t.space[5],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: t.fontSize.sm,
            fontWeight: t.fontWeight.semibold,
            color: v.indicatorForeground.var,
            backgroundColor: v.indicatorBackground.var,
            borderRadius: t.radius.full,
            lineHeight: 1,
          },
          '& :first-child': {
            marginTop: 0,
          },
          '& :last-child': {
            marginBottom: 0,
          },
        },
      },
    };
  },
  { layer: 'utilities' },
);
