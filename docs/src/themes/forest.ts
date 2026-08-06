import { color } from 'typestyles/color';
import {
  createDesignTheme,
  createToneFace,
  designTokens as p,
  groteskMono,
  lightSyntaxValues,
  type DesignThemePreset,
} from '@var-ui/core';

const newsreaderNormalFace = {
  family: 'Newsreader',
  src: "url('/fonts/newsreader-latin.woff2') format('woff2')",
  fontWeight: '200 800',
  fontStyle: 'normal',
  fontDisplay: 'swap',
} as const;

const newsreaderItalicFace = {
  family: 'Newsreader',
  src: "url('/fonts/newsreader-latin-italic.woff2') format('woff2')",
  fontWeight: '200 800',
  fontStyle: 'italic',
  fontDisplay: 'swap',
} as const;

const figtreeNormalFace = {
  family: 'Figtree',
  src: "url('/fonts/figtree-latin.woff2') format('woff2')",
  fontWeight: '300 900',
  fontStyle: 'normal',
  fontDisplay: 'swap',
} as const;

const figtreeItalicFace = {
  family: 'Figtree',
  src: "url('/fonts/figtree-latin-italic.woff2') format('woff2')",
  fontWeight: '300 900',
  fontStyle: 'italic',
  fontDisplay: 'swap',
} as const;

const forestFonts = [
  newsreaderNormalFace,
  newsreaderItalicFace,
  figtreeNormalFace,
  figtreeItalicFace,
  ...groteskMono.fonts.filter((face) => face.family === 'JetBrains Mono'),
];

export const forestPreset: DesignThemePreset = {
  fonts: forestFonts,
  tokens: {
    fontFamily: {
      display: '"Newsreader", Georgia, "Times New Roman", serif',
      body: '"Figtree", ui-sans-serif, system-ui, sans-serif',
      mono: groteskMono.tokens.fontFamily.mono!,
    },
    color: {
      background: {
        app: {
          light: p.color.palette['sage-1'].var,
          dark: p.color.palette['sage-10'].var,
        },
        surface: {
          light: p.color.palette['sage-2'].var,
          dark: p.color.palette['sage-9'].var,
        },
        subtle: {
          light: p.color.palette['sage-3'].var,
          dark: p.color.palette['sage-8'].var,
        },
        elevated: {
          light: p.color.palette['neutral-1'].var,
          dark: color.oklch('27%', 0.02, 165),
        },
        popover: {
          light: p.color.palette['neutral-1'].var,
          dark: color.oklch('27%', 0.02, 165),
        },
        muted: {
          light: p.color.palette['sage-2'].var,
          dark: color.oklch('31%', 0.018, 165),
        },
      },
      text: {
        primary: {
          light: p.color.palette['sage-9'].var,
          dark: p.color.palette['sage-1'].var,
        },
        secondary: {
          light: p.color.palette['sage-7'].var,
          dark: p.color.palette['sage-3'].var,
        },
      },
      navItem: {
        hoverBackground: p.color.palette['sage-3'].var,
      },
      tone: {
        accent: createToneFace({
          light: {
            foreground: p.color.palette['grass-6'].var,
            background: p.color.palette['grass-6'].var,
            darkForeground: p.color.palette['grass-2'].var,
          },
          dark: {
            foreground: p.color.palette['grass-3'].var,
            background: p.color.palette['grass-3'].var,
            darkForeground: p.color.palette['grass-9'].var,
          },
        }),
        danger: createToneFace({
          light: {
            foreground: p.color.palette['red-7'].var,
            background: p.color.palette['red-8'].var,
            darkForeground: p.color.palette['neutral-1'].var,
          },
          dark: {
            foreground: p.color.palette['red-4'].var,
            background: p.color.palette['red-7'].var,
            darkForeground: p.color.palette['neutral-1'].var,
          },
        }),
        success: createToneFace({
          light: {
            foreground: p.color.palette['green-7'].var,
            background: p.color.palette['green-8'].var,
            darkForeground: p.color.palette['neutral-1'].var,
          },
          dark: {
            foreground: p.color.palette['green-4'].var,
            background: p.color.palette['green-7'].var,
            darkForeground: p.color.palette['neutral-1'].var,
          },
        }),
        warning: createToneFace({
          light: {
            foreground: p.color.palette['amber-7'].var,
            background: p.color.palette['amber-7'].var,
            darkForeground: p.color.palette['stone-10'].var,
          },
          dark: {
            foreground: p.color.palette['amber-4'].var,
            background: p.color.palette['amber-4'].var,
            darkForeground: p.color.palette['stone-10'].var,
          },
        }),
        info: createToneFace({
          light: {
            foreground: p.color.palette['jade-7'].var,
            background: p.color.palette['jade-7'].var,
            darkForeground: p.color.palette['neutral-1'].var,
          },
          dark: {
            foreground: p.color.palette['jade-4'].var,
            background: p.color.palette['jade-4'].var,
            darkForeground: p.color.palette['neutral-1'].var,
          },
        }),
      },
      border: {
        subtle: {
          light: p.color.tone.accent.subtleBackground.var,
          dark: p.color.tone.accent.subtleBackground.var,
        },
        default: {
          light: p.color.palette['sage-3'].var,
          dark: p.color.palette['sage-8'].var,
        },
        strong: {
          light: p.color.tone.accent.border.var,
          dark: p.color.tone.accent.border.var,
        },
        focus: {
          light: p.color.palette['green-5'].var,
          dark: p.color.palette['green-4'].var,
        },
      },
      overlay: {
        default: color.alpha(p.color.palette['sage-10'].var, 0.55, 'oklch'),
        panel: {
          light: p.color.palette['neutral-1'].var,
          dark: color.oklch('27%', 0.02, 165),
        },
      },
      link: {
        default: {
          light: p.color.palette['green-6'].var,
          dark: p.color.palette['green-3'].var,
        },
        hover: {
          light: p.color.palette['green-7'].var,
          dark: p.color.palette['green-2'].var,
        },
      },
      code: lightSyntaxValues,
    },
    borderWidth: {
      thin: '0',
      default: '1px',
      thick: '4px',
    },
  },
};

export const forestTheme = createDesignTheme({
  name: 'forest',
  ...forestPreset,
  modes: [],
  components: {
    menu: (t) => ({
      vars: {
        popoverBackground: t.color.background.app.var,
      },
    }),
    segmentedControl: (t) => ({
      vars: {
        indicatorBackground: t.color.background.app.var,
      },
    }),
    topNav: (t) => ({
      vars: {
        border: 'transparent',
      },
      base: {
        root: {
          borderBottomWidth: 0,
          margin: t.space[2].var,
          borderRadius: t.radius.lg.var,
        },
      },
    }),
    sideNav: (t) => ({
      vars: {
        border: t.color.background.app.var,
      },
      base: {
        root: {
          margin: t.space[2].var,
          borderRadius: t.radius.lg.var,
          overflow: 'hidden',
        },
        footer: {
          borderWidth: t.borderWidth.thick.var,
        },
      },
    }),
    layoutPanel: () => ({
      vars: {
        border: 'transparent',
      },
    }),
  },
});
