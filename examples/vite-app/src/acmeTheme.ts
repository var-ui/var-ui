import { createDesignTheme } from '@var-ui/core';

/**
 * Demo theme for the vite example app — exercises V7 `extend` + `components`.
 * Violet accent palette with pill buttons, brand glow, and uppercase primary labels.
 *
 * Entries may be factories `(t) => …` or plain objects; factories enable split files
 * typed with `DesignThemeTokens<typeof extend>`.
 */
export const acmeTheme = createDesignTheme({
  name: 'acme',
  light: {
    color: {
      accent: {
        default: 'oklch(55% 0.2 290)',
        hover: 'oklch(48% 0.2 290)',
      },
      border: {
        focus: 'oklch(55% 0.18 290)',
      },
    },
  },
  dark: {
    color: {
      accent: {
        default: 'oklch(72% 0.16 290)',
        hover: 'oklch(78% 0.14 290)',
      },
      border: {
        focus: 'oklch(72% 0.16 290)',
      },
    },
  },

  extend: {
    brand: {
      glow: {
        light: '0 0 0 3px oklch(90% 0.08 290)',
        dark: '0 0 16px oklch(70% 0.18 290)',
      },
      halo: 'radial-gradient(circle, oklch(70% 0.18 290 / 0.35), transparent 70%)',
    },
  },

  components: {
    button: (t) => ({
      base: {
        borderRadius: '999px',
        boxShadow: t.brand.glow,
        '&:hover': { boxShadow: 'none' },
      },
      variants: {
        intent: {
          primary: { textTransform: 'uppercase', letterSpacing: '0.04em' },
        },
      },
      compoundVariants: [
        {
          variants: { intent: 'primary', size: 'lg' },
          style: { letterSpacing: '0.08em' },
        },
      ],
    }),
    badge: (t) => ({
      base: {
        borderRadius: '999px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontSize: t.fontSize.xs,
      },
    }),
    card: (t) => ({
      base: {
        root: {
          borderRadius: '16px',
          backgroundImage: t.brand.halo,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          backgroundSize: '40% 40%',
        },
      },
    }),
  },
});
