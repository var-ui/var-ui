import type { FontFaceDefinition } from '../fonts/types';
import type { basePaletteTokenValues } from './palette';

type TokenLeaf = string | number;

/** Widens literal primitive tables so token refs (`var(--…)`) assign cleanly. */
type WidenLeaves<T> = {
  [K in keyof T]: T[K] extends string | number ? TokenLeaf : WidenLeaves<T[K]>;
};

type DeepPartial<T> = T extends TokenLeaf
  ? TokenLeaf
  : T extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

type ThemeOverridableNamespace = Exclude<keyof DesignTokens, 'palette' | 'stroke'>;

/**
 * Canonical Var UI token tree — single source of truth for namespace structure.
 * Registered under an empty TypeStyles namespace; CSS vars use `scopeId` only (`--var-ui-*`).
 */
export type DesignTokens = {
  palette: WidenLeaves<typeof basePaletteTokenValues>;
  space: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    16: string;
    20: string;
  };
  size: {
    control: { sm: string; md: string; lg: string };
    icon: { sm: string; md: string; lg: string };
  };
  opacity: { disabled: string; muted: string };
  letterSpacing: { tight: string; normal: string; wide: string; caps: string };
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  borderWidth: { thin: string; default: string; thick: string };
  fontFamily: { display: string; sans: string; mono: string };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: { normal: string; medium: string; semibold: string; bold: string };
  lineHeight: { tight: string; normal: string; relaxed: string };
  shadow: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    elevation: { low: string; med: string; high: string };
  };
  duration: {
    fast: string;
    medium: string;
    slow: string;
    'fast-min': string;
    'fast-max': string;
    'medium-min': string;
    'medium-max': string;
    'slow-min': string;
    'slow-max': string;
  };
  easing: { standard: string; emphasized: string };
  transition: {
    overlayFade: string;
    panelEnter: string;
    backdrop: string;
    surfaceFast: string;
    colorShift: string;
    controlSurface: string;
  };
  breakpoint: { sm: string; md: string; lg: string; xl: string };
  zIndex: {
    base: number;
    raised: number;
    sticky: number;
    dropdown: number;
    overlay: number;
    toast: number;
    modal: number;
    max: number;
  };
  color: {
    background: {
      app: string;
      surface: string;
      subtle: string;
      elevated: string;
      popover: string;
      muted: string;
    };
    text: {
      primary: string;
      secondary: string;
      onAccent: string;
      onDanger: string;
      onSuccess: string;
      onWarning: string;
      onInfo: string;
      disabled: string;
      placeholder: string;
    };
    accent: { default: string; hover: string; subtle: string };
    border: { default: string; strong: string; focus: string };
    shadow: { offset: string; color: string };
    danger: { default: string; solid: string; subtle: string; border: string };
    success: { default: string; solid: string; subtle: string; border: string };
    warning: { default: string; onSolid: string; subtle: string; border: string };
    info: { default: string; onSolid: string; subtle: string; border: string };
    link: { default: string; hover: string };
    ring: { default: string };
    overlay: {
      default: string;
      backdrop: string;
      panel: string;
      hover: string;
      pressed: string;
    };
    skeleton: { default: string };
    track: { default: string };
    code: {
      base: string;
      keyword: string;
      title: string;
      attr: string;
      string: string;
      builtIn: string;
      comment: string;
      name: string;
      section: string;
      bullet: string;
      addition: string;
      additionBackground: string;
      deletion: string;
      deletionBackground: string;
    };
  };
  stroke: { default: string; strong: string };
};

/** Token namespaces a theme surface can override. */
export type DesignThemeTokenValues = {
  [K in ThemeOverridableNamespace]?: DeepPartial<DesignTokens[K]>;
};

/** Ambient light/dark color patches — compiled into TypeStyles color modes. */
export type DesignColorValues = DeepPartial<DesignTokens['color']>;

export type DesignThemeColorMode = {
  light?: DesignColorValues;
  dark?: DesignColorValues;
};

/** Reusable `tokens` + `colorMode` defaults for `createDesignTheme({ from })`. */
export type DesignThemePreset = {
  tokens?: DesignThemeTokenValues;
  colorMode?: DesignThemeColorMode;
  fonts?: FontFaceDefinition[];
};
