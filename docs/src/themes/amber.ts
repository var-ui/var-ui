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

const amberDarkHue = 65;

const amberLightSubtle = p.color.palette['sand-2'].var;

const amberTone = {
  accent: createToneFace({
    light: {
      foreground: p.color.palette['orange-7'].var,
      background: p.color.palette['orange-7'].var,
      darkForeground: '#000',
    },
    dark: {
      foreground: p.color.palette['amber-3'].var,
      background: p.color.palette['amber-3'].var,
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
      foreground: p.color.palette['orange-7'].var,
      background: p.color.palette['orange-7'].var,
      darkForeground: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: p.color.palette['orange-4'].var,
      background: p.color.palette['orange-4'].var,
      darkForeground: p.color.palette['neutral-1'].var,
    },
  }),
};

const amberLightColorValues = {
  background: {
    app: p.color.palette['sand-1'].var,
    surface: p.color.palette['neutral-1'].var,
    subtle: amberLightSubtle,
    elevated: p.color.palette['neutral-1'].var,
    popover: p.color.palette['neutral-1'].var,
    muted: amberLightSubtle,
  },
  text: {
    primary: p.color.palette['sand-10'].var,
    secondary: p.color.palette['sand-7'].var,
  },
  tone: amberTone,
  border: {
    default: '#000',
    strong: '#000',
    focus: p.color.palette['orange-5'].var,
  },
  overlay: {
    default: color.alpha(p.color.palette['sand-10'].var, 0.55, 'oklch'),
    panel: p.color.palette['neutral-1'].var,
  },
  link: { default: p.color.palette['orange-7'].var, hover: p.color.palette['orange-8'].var },
  code: lightSyntaxValues,
};

const amberDarkColorValues = {
  background: {
    app: color.oklch('23%', 0.016, 65),
    surface: color.oklch('27%', 0.014, 65),
    subtle: color.oklch('31%', 0.013, 65),
    elevated: color.oklch('27%', 0.014, 65),
    popover: color.oklch('27%', 0.014, 65),
    muted: color.oklch('31%', 0.013, 65),
  },
  text: {
    primary: p.color.palette['sand-1'].var,
    secondary: p.color.palette['sand-3'].var,
  },
  border: {
    default: neoBrutalistBorderDarkDefault(amberDarkHue),
    strong: neoBrutalistBorderDarkStrong(amberDarkHue),
    focus: p.color.palette['amber-4'].var,
  },
  overlay: {
    panel: color.oklch('27%', 0.014, 65),
  },
  link: { default: p.color.palette['amber-3'].var, hover: p.color.palette['amber-2'].var },
  code: darkSyntaxValues,
};

const amberLightShadowValues = {
  ...neoBrutalistShadowValues(neoBrutalistShadowOffsetLight(amberLightSubtle)),
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

const amberDarkShadowValues = {
  ...neoBrutalistShadowValues(neoBrutalistShadowOffsetDark(amberDarkHue)),
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

export const amberPreset: DesignThemePreset = {
  tokens: {
    color: amberLightColorValues,
    shadow: amberLightShadowValues,
  },
  colorMode: {
    dark: amberDarkColorValues,
  },
};

export const amberTheme = createDesignTheme({
  name: 'amber',
  ...amberPreset,
  modes: [
    {
      id: 'dark-shadow',
      overrides: { shadow: amberDarkShadowValues },
      when: resolvedDarkColorModeWhen,
    },
  ],
});
