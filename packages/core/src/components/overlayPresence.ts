import { atReducedMotion } from '../theme-conditions';
import { designTokens as t } from '../tokens';

export function overlayPresenceStyles(options: { scale?: boolean } = {}) {
  const scale = options.scale ?? false;
  return {
    transition: scale
      ? `${t.transition.panelEnter.var}, transform ${t.duration.slow.var} ${t.easing.emphasized.var}`
      : t.transition.backdrop.var,
    transformOrigin: 'var(--var-ui-transform-origin, center)',
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      ...(scale ? { transform: 'scale(0.98)' } : {}),
    },
    ...atReducedMotion({
      transition: 'none',
      transform: 'none',
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 1,
      },
    }),
  };
}

export const overlayIosAbsoluteBackdrop = {
  '@supports (-webkit-touch-callout: none)': {
    position: 'absolute',
    height: '100dvh',
  },
} as const;
