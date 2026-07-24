import { createTypeStyles } from 'typestyles';

const scopeId = 'var-ui';
const layers = ['tokens', 'components', 'overrides', 'utilities'] as const;
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
});

/**
 * Self-hosted Space Grotesk (Latin, wght 300–700) from each host’s `public/fonts/`.
 * Root-relative `url('/fonts/…')` matches Astro, Vite, and Next static serving and typestyles extract.
 */
typestyles.global.fontFace('Space Grotesk', {
  src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
  fontWeight: '300 700',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
});

/**
 * Self-hosted JetBrains Mono (Latin, wght 100–800) from each host's `public/fonts/`.
 */
typestyles.global.fontFace('JetBrains Mono', {
  src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
  fontWeight: '100 800',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
});
