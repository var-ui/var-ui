import { keyframes } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { semanticTone, type SemanticToneKey } from './semanticTone';

const pulse = keyframes.create('var-ui-status-pulse', {
  from: { boxShadow: '0 0 0 0 color-mix(in srgb, currentColor 45%, transparent)' },
  to: { boxShadow: '0 0 0 6px color-mix(in srgb, currentColor 0%, transparent)' },
});

function toneColor(key: SemanticToneKey) {
  return { color: semanticTone[key].semantic };
}

/**
 * Semantic presence/status indicator. Pair with visible text or an
 * `aria-label` on the host element — the dot alone is decorative.
 *
 * ```tsx
 * <span className={statusDot({ tone: 'success', pulse: 'true' })} />
 * ```
 */
export const statusDot = styles.component(
  'status-dot',
  (c) => {
    const v = c.vars({
      size: { value: '8px', syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'inline-block',
        width: v.size.var,
        height: v.size.var,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        color: t.color.text.secondary,
        flexShrink: 0,
      },
      variants: {
        tone: {
          neutral: {},
          accent: toneColor('accent'),
          success: toneColor('success'),
          warning: toneColor('warning'),
          danger: toneColor('danger'),
          info: toneColor('info'),
        },
        pulse: {
          true: {
            animation: `${pulse} 1400ms ease-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          },
          false: {},
        },
      },
      defaultVariants: { tone: 'neutral', pulse: 'false' },
    };
  },
  { layer: 'components' },
);
