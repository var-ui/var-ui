import { keyframes } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const slide = keyframes.create('var-ui-progress-slide', {
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(400%)' },
});

/**
 * Linear progress. Fill width is set inline by the React wrapper
 * (percentage); the `indeterminate` variant animates a sliding segment.
 */
export const progressBar = typestyles.styles.component(
  'progress-bar',
  (c) => {
    const v = c.vars({
      trackColor: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      fillColor: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: true,
      },
    });
    return {
      slots: ['root', 'header', 'label', 'valueText', 'track', 'fill'],
      base: {
        root: { display: 'grid', gap: t.space[1].var, minWidth: '160px' },
        header: { display: 'flex', justifyContent: 'space-between', gap: t.space[3].var },
        label: { fontSize: t.fontSize.sm.var, fontWeight: t.fontWeight.medium.var },
        valueText: { fontSize: t.fontSize.sm.var, color: t.color.text.secondary.var },
        track: {
          height: '6px',
          borderRadius: t.radius.full.var,
          backgroundColor: v.trackColor.var,
          overflow: 'hidden',
        },
        fill: {
          height: '100%',
          borderRadius: 'inherit',
          backgroundColor: v.fillColor.var,
          transition: `width ${t.duration.medium.var} ${t.easing.standard.var}`,
        },
      },
      variants: {
        tone: {
          accent: {},
          success: { root: { [v.fillColor.name]: t.color.success.solid.var } },
          warning: { root: { [v.fillColor.name]: t.color.warning.default.var } },
          danger: { root: { [v.fillColor.name]: t.color.danger.solid.var } },
        },
        indeterminate: {
          true: {
            fill: {
              width: '25%',
              animation: `${slide} 1200ms ease-in-out infinite`,
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
                width: '100%',
                opacity: 0.5,
              },
            },
          },
          false: {},
        },
      },
      defaultVariants: { tone: 'accent', indeterminate: 'false' },
    };
  },
  { layer: 'components' },
);
