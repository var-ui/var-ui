import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const switchStyles = styles.component(
  'switch',
  (c) => {
    const v = c.vars({
      trackBackground: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      thumbBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'track', 'thumb', 'label'],
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2],
        cursor: 'pointer',
      },
      track: {
        position: 'relative',
        width: '40px',
        height: '24px',
        borderRadius: t.radius.full,
        backgroundColor: v.trackBackground.var,
        transition: 'background-color 140ms ease',
        '&[data-selected]': {
          [v.trackBackground.name]: t.color.accent.default,
        },
      },
      thumb: {
        position: 'absolute',
        top: '3px',
        left: '3px',
        width: '18px',
        height: '18px',
        borderRadius: t.radius.full,
        backgroundColor: v.thumbBackground.var,
        transition: 'transform 140ms ease',
        '&[data-selected]': {
          transform: 'translateX(16px)',
        },
      },
      label: {
        fontSize: t.fontSize.md,
      },
    };
  },
  { layer: 'components' },
);
