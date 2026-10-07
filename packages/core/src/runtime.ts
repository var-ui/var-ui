import { colorModes, createTypeStyles } from 'typestyles';
import { designBreakpoints } from './tokens/defaults/breakpoint';

const scopeId = 'var-ui';
const layers = ['reset', 'base', 'tokens', 'components', 'overrides', 'utilities'] as const;
const tokenLayer = 'tokens';

/**
 * Shared TypeStyles instance: scope, attribute mode, and cascade layer stack for
 * classes, tokens, and global CSS. Omit `layers` for flat CSS; enable layers when
 * integrating with global CSS that uses `@layer`.
 */
export const typestyles = createTypeStyles({
  scopeId,
  mode: 'attribute',
  layers,
  tokenLayer,
  globalLayer: tokenLayer,
  colorModes,
  breakpoints: designBreakpoints,
});

/** Var UI's configured TypeStyles `styles` API (`component`, `override`, `scope`, …). */
export const { styles, global } = typestyles;
