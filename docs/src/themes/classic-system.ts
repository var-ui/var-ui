import { color } from 'typestyles/color';
import {
  createDesignTheme,
  createToneFace,
  designTokens as p,
  darkSyntaxValues,
  lightSyntaxValues,
  typestyles,
  type DesignThemePreset,
} from '@var-ui/core';

const classicTone = {
  accent: createToneFace({
    light: {
      foreground: '#000000',
      background: '#000000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: '#FFFFFF',
      background: '#FFFFFF',
      darkForeground: '#000000',
    },
  }),
  danger: createToneFace({
    light: {
      foreground: '#000000',
      background: '#000000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['red-3'].var,
      background: p.color.palette['red-3'].var,
      darkForeground: '#000000',
    },
  }),
  success: createToneFace({
    light: {
      foreground: '#000000',
      background: '#000000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['green-3'].var,
      background: p.color.palette['green-3'].var,
      darkForeground: '#000000',
    },
  }),
  warning: createToneFace({
    light: {
      foreground: '#000000',
      background: '#000000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['amber-3'].var,
      background: p.color.palette['amber-3'].var,
      darkForeground: '#000000',
    },
  }),
  info: createToneFace({
    light: {
      foreground: '#000000',
      background: '#000000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: '#FFFFFF',
      background: '#FFFFFF',
      darkForeground: '#000000',
    },
  }),
};

const classicLightColorValues = {
  background: {
    app: '#FFFFFF',
    surface: '#FFFFFF',
    subtle: '#EEEEEE',
    elevated: '#FFFFFF',
    popover: '#FFFFFF',
    muted: '#EEEEEE',
  },
  text: {
    primary: '#000000',
    secondary: '#333333',
  },
  tone: classicTone,
  border: {
    default: '#000000',
    strong: '#000000',
    focus: '#000000',
  },
  shadow: { offset: '#000000' },
  overlay: {
    default: color.alpha('#000000', 0.45, 'srgb'),
    panel: '#FFFFFF',
  },
  link: { default: '#000000', hover: '#333333' },
  code: lightSyntaxValues,
};

const classicDarkColorValues = {
  background: {
    app: '#101010',
    surface: '#181818',
    subtle: '#252525',
    elevated: '#202020',
    popover: '#202020',
    muted: '#252525',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#D8D8D8',
  },
  border: {
    default: '#FFFFFF',
    strong: '#FFFFFF',
    focus: '#FFFFFF',
  },
  shadow: { offset: '#FFFFFF' },
  overlay: {
    default: color.alpha('#000000', 0.72, 'srgb'),
    panel: '#202020',
  },
  link: { default: '#FFFFFF', hover: '#E0E0E0' },
  code: darkSyntaxValues,
};

const classicPrimitiveValues = {
  fontFamily: {
    display: 'Chicago, "Geneva", Monaco, "Courier New", ui-monospace, monospace',
    body: 'Chicago, "Geneva", Monaco, "Courier New", ui-monospace, monospace',
    mono: 'Monaco, "Courier New", ui-monospace, monospace',
  },
  fontSize: {
    xs: '10px',
    sm: '12px',
    md: '13px',
    lg: '15px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '28px',
  },
  fontWeight: {
    normal: '400',
    medium: '600',
    semibold: '700',
    bold: '700',
  },
  radius: {
    none: '0',
    sm: '0',
    md: '0',
    lg: '0',
    xl: '0',
    full: '999px',
  },
  borderWidth: {
    thin: '1px',
    default: '1px',
    thick: '2px',
  },
  shadow: {
    xs: '1px 1px 0 0 #000000',
    sm: '1px 1px 0 0 #000000',
    md: '2px 2px 0 0 #000000',
    lg: '3px 3px 0 0 #000000',
    xl: '4px 4px 0 0 #000000',
  },
  duration: {
    fast: '80ms',
    medium: '100ms',
    slow: '140ms',
  },
  transition: {
    overlayFade: 'opacity 100ms steps(2, end), visibility 100ms steps(2, end)',
    panelEnter: 'opacity 100ms steps(2, end)',
    backdrop: 'opacity 100ms steps(2, end)',
    surfaceFast: 'background-color 80ms steps(2, end)',
    colorShift: 'color 80ms steps(2, end), text-decoration-color 80ms steps(2, end)',
    controlSurface: 'background-color 80ms steps(2, end), border-color 80ms steps(2, end)',
  },
};

const classicDarkShadow = {
  xs: '1px 1px 0 0 #FFFFFF',
  sm: '1px 1px 0 0 #FFFFFF',
  md: '2px 2px 0 0 #FFFFFF',
  lg: '3px 3px 0 0 #FFFFFF',
  xl: '4px 4px 0 0 #FFFFFF',
};

export const classicSystemPreset: DesignThemePreset = {
  tokens: {
    ...classicPrimitiveValues,
    color: classicLightColorValues,
  },
  colorMode: {
    dark: classicDarkColorValues,
  },
};

export const classicSystemTheme = createDesignTheme({
  name: 'classic-system',
  ...classicSystemPreset,
  modes: [
    {
      id: 'dark-elevation-shadow',
      overrides: { shadow: classicDarkShadow },
      when: typestyles.tokens.when.or(
        typestyles.tokens.when.attr('data-mode', 'dark', { scope: 'self' }),
        typestyles.tokens.when.and(
          typestyles.tokens.when.not(
            typestyles.tokens.when.attr('data-mode', 'light', { scope: 'self' }),
          ),
          typestyles.tokens.when.prefersDark,
        ),
      ),
    },
  ],
});
