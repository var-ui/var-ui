import { defineFonts } from './define-fonts';

const LATIN_UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

export const groteskMono = defineFonts({
  sans: {
    face: {
      family: 'Space Grotesk',
      src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      fontWeight: '300 700',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      unicodeRange: LATIN_UNICODE_RANGE,
    },
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  mono: {
    face: {
      family: 'JetBrains Mono',
      src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
      fontWeight: '100 800',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      unicodeRange: LATIN_UNICODE_RANGE,
    },
    fallback: 'ui-monospace, monospace',
  },
});
