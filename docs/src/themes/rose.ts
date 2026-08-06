import { color } from 'typestyles/color';
import {
  createDesignTheme,
  createToneFace,
  designTokens as p,
  darkSyntaxValues,
  lightSyntaxValues,
  shadowElevationValues,
  type DesignThemePreset,
  type DesignTokens,
} from '@var-ui/core';
import {
  neoBrutalistBorderDarkDefault,
  neoBrutalistBorderDarkStrong,
  neoBrutalistShadowOffsetDark,
  neoBrutalistShadowOffsetLight,
  neoBrutalistShadowValues,
  resolvedDarkColorModeWhen,
} from './neo-brutalist-shadows';

const roseDarkHue = 355;

const roseLightSubtle = p.color.palette['rose-2'].var;

const roseTone = {
  accent: createToneFace({
    light: {
      foreground: p.color.palette['crimson-7'].var,
      background: p.color.palette['crimson-7'].var,
      darkForeground: '#000',
    },
    dark: {
      foreground: p.color.palette['rose-3'].var,
      background: p.color.palette['rose-3'].var,
      darkForeground: '#000',
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
      foreground: p.color.palette['plum-7'].var,
      background: p.color.palette['plum-7'].var,
      darkForeground: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: p.color.palette['plum-4'].var,
      background: p.color.palette['plum-4'].var,
      darkForeground: p.color.palette['neutral-1'].var,
    },
  }),
};

const roseLightColorValues = {
  background: {
    app: p.color.palette['rose-1'].var,
    surface: p.color.palette['neutral-1'].var,
    subtle: roseLightSubtle,
    elevated: p.color.palette['neutral-1'].var,
    popover: p.color.palette['neutral-1'].var,
    muted: roseLightSubtle,
  },
  text: {
    primary: p.color.palette['rose-10'].var,
    secondary: p.color.palette['rose-7'].var,
  },
  tone: roseTone,
  border: {
    default: '#000',
    strong: '#000',
    focus: p.color.palette['crimson-5'].var,
  },
  overlay: {
    default: color.alpha(p.color.palette['rose-10'].var, 0.55, 'oklch'),
    panel: p.color.palette['neutral-1'].var,
  },
  link: { default: p.color.palette['crimson-7'].var, hover: p.color.palette['crimson-8'].var },
  code: lightSyntaxValues,
};

const roseDarkColorValues = {
  background: {
    app: color.oklch('23%', 0.024, 355),
    surface: color.oklch('27%', 0.022, 355),
    subtle: color.oklch('31%', 0.02, 355),
    elevated: color.oklch('27%', 0.022, 355),
    popover: color.oklch('27%', 0.022, 355),
    muted: color.oklch('31%', 0.02, 355),
  },
  text: {
    primary: p.color.palette['rose-1'].var,
    secondary: p.color.palette['rose-3'].var,
  },
  border: {
    default: neoBrutalistBorderDarkDefault(roseDarkHue),
    strong: neoBrutalistBorderDarkStrong(roseDarkHue),
    focus: p.color.palette['rose-4'].var,
  },
  overlay: {
    panel: color.oklch('27%', 0.022, 355),
  },
  link: { default: p.color.palette['rose-3'].var, hover: p.color.palette['rose-2'].var },
  code: darkSyntaxValues,
};

const roseLightShadowValues = {
  ...neoBrutalistShadowValues(neoBrutalistShadowOffsetLight(roseLightSubtle)),
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

const roseDarkShadowValues = {
  ...neoBrutalistShadowValues(neoBrutalistShadowOffsetDark(roseDarkHue)),
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

export const rosePreset: DesignThemePreset = {
  tokens: {
    color: roseLightColorValues,
    shadow: roseLightShadowValues,
  },
  colorMode: {
    dark: roseDarkColorValues,
  },
};

export const roseTheme = createDesignTheme({
  name: 'rose',
  ...rosePreset,
  modes: [
    {
      id: 'dark-shadow',
      overrides: { shadow: roseDarkShadowValues },
      when: resolvedDarkColorModeWhen,
    },
  ],
});
