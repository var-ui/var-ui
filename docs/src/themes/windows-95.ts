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

const win95LightSyntaxValues = {
  ...lightSyntaxValues,
  keyword: '#000080',
  title: '#800080',
  attr: '#5F4F00',
  string: '#004F00',
  builtIn: '#800000',
  comment: '#303030',
};

const win95DarkSyntaxValues = {
  ...darkSyntaxValues,
  keyword: '#38A8F0',
  title: '#F0F0F0',
  attr: '#FFFF80',
  string: '#80FF80',
  builtIn: '#FF8080',
  comment: '#B0B0B0',
};

const win95Tone = {
  accent: createToneFace({
    light: {
      foreground: '#000080',
      background: '#000080',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: '#1084D0',
      background: '#1084D0',
      darkForeground: '#FFFFFF',
    },
  }),
  danger: createToneFace({
    light: {
      foreground: '#800000',
      background: '#800000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['red-4'].var,
      background: '#800000',
      darkForeground: '#FFFFFF',
    },
  }),
  success: createToneFace({
    light: {
      foreground: '#008000',
      background: '#008000',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['green-4'].var,
      background: '#008000',
      darkForeground: '#FFFFFF',
    },
  }),
  warning: createToneFace({
    light: {
      foreground: '#808000',
      background: '#808000',
      darkForeground: '#000000',
    },
    dark: {
      foreground: p.color.palette['amber-4'].var,
      background: p.color.palette['amber-4'].var,
      darkForeground: '#000000',
    },
  }),
  info: createToneFace({
    light: {
      foreground: '#000080',
      background: '#000080',
      darkForeground: '#FFFFFF',
    },
    dark: {
      foreground: '#38A8F0',
      background: '#38A8F0',
      darkForeground: '#000000',
    },
  }),
};

const win95LightColorValues = {
  background: {
    app: '#C0C0C0',
    surface: '#C0C0C0',
    subtle: '#E0E0E0',
    elevated: '#F0F0F0',
    popover: '#F0F0F0',
    muted: '#E0E0E0',
  },
  text: {
    primary: '#000000',
    secondary: '#202020',
  },
  tone: win95Tone,
  border: {
    default: '#808080',
    strong: '#000000',
    focus: '#000080',
  },
  overlay: {
    default: color.alpha('#000000', 0.5, 'srgb'),
    panel: '#F0F0F0',
  },
  link: { default: '#000080', hover: '#1084D0' },
  code: win95LightSyntaxValues,
};

const win95DarkColorValues = {
  background: {
    app: '#000040',
    surface: '#303030',
    subtle: '#454545',
    elevated: '#555555',
    popover: '#555555',
    muted: '#454545',
  },
  text: {
    primary: '#F2F2F2',
    secondary: '#CFCFCF',
  },
  border: {
    default: '#808080',
    strong: '#FFFFFF',
    focus: '#38A8F0',
  },
  overlay: {
    default: color.alpha('#000000', 0.7, 'srgb'),
    panel: '#555555',
  },
  link: { default: '#1084D0', hover: '#38A8F0' },
  code: win95DarkSyntaxValues,
};

const win95PrimitiveValues = {
  fontFamily: {
    display: '"MS Sans Serif", "Microsoft Sans Serif", Arial, system-ui, sans-serif',
    body: '"MS Sans Serif", "Microsoft Sans Serif", Arial, system-ui, sans-serif',
    mono: '"Lucida Console", "Courier New", ui-monospace, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '15px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '26px',
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
    full: '0',
  },
  borderWidth: {
    thin: '1px',
    default: '2px',
    thick: '2px',
  },
  shadow: {
    xs: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040',
    sm: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040',
    md: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #404040',
    lg: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #404040',
    xl: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #404040',
  },
  duration: {
    fast: '0ms',
    medium: '0ms',
    slow: '0ms',
  },
  transition: {
    overlayFade: 'none',
    panelEnter: 'none',
    backdrop: 'none',
    surfaceFast: 'none',
    colorShift: 'none',
    controlSurface: 'none',
  },
};

const win95DarkShadow = {
  xs: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #000000',
  sm: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #000000',
  md: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #000000',
  lg: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #000000',
  xl: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #000000',
};

export const windows95Preset: DesignThemePreset = {
  tokens: {
    ...win95PrimitiveValues,
    color: win95LightColorValues,
  },
  colorMode: {
    dark: win95DarkColorValues,
  },
};

export const windows95Theme = createDesignTheme({
  name: 'windows-95',
  ...windows95Preset,
  modes: [
    {
      id: 'dark-elevation-shadow',
      overrides: { shadow: win95DarkShadow },
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
