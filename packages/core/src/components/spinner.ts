import { keyframes } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

const spin = keyframes.create('var-ui-spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/**
 * Indeterminate loading ring. Use `progressBar` when progress is measurable.
 * Reduced-motion users get a slow, less dizzying rotation.
 *
 * ```tsx
 * <span className={spinner({ size: 'md' })} />
 * ```
 */
export const spinner = styles.component(
  'spinner',
  (c) => {
    const v = c.vars({
      indicatorColor: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      trackColor: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      size: { value: '20px', syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'inline-block',
        width: v.size.var,
        height: v.size.var,
        borderRadius: '50%',
        border: `2px solid ${v.trackColor.var}`,
        borderTopColor: v.indicatorColor.var,
        animation: `${spin} 800ms linear infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animationDuration: '2400ms',
        },
      },
      variants: {
        size: {
          sm: { [v.size.name]: '14px' },
          md: { [v.size.name]: '20px' },
          lg: { [v.size.name]: '32px', borderWidth: '3px' },
        },
        tone: {
          accent: {},
          neutral: { [v.indicatorColor.name]: t.color.text.secondary },
        },
      },
      defaultVariants: { size: 'md', tone: 'accent' },
    };
  },
  { layer: 'components' },
);
