import type { basePaletteTokenValues } from './palette';
import type {
  borderWidthValues,
  durationValues,
  easingValues,
  fontFamilyValues,
  fontSizeValues,
  fontWeightValues,
  letterSpacingValues,
  lineHeightValues,
  opacityValues,
  radiusValues,
  shadowValues,
  sizeValues,
  spaceValues,
  transitionValues,
} from './primitive';

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
 * Primitive namespaces mirror `tokens.create` registrations.
 */
export type DesignTokens = {
  palette: WidenLeaves<typeof basePaletteTokenValues>;
  space: WidenLeaves<typeof spaceValues>;
  size: WidenLeaves<typeof sizeValues>;
  opacity: WidenLeaves<typeof opacityValues>;
  letterSpacing: WidenLeaves<typeof letterSpacingValues>;
  radius: WidenLeaves<typeof radiusValues>;
  borderWidth: WidenLeaves<typeof borderWidthValues>;
  fontFamily: WidenLeaves<typeof fontFamilyValues>;
  fontSize: WidenLeaves<typeof fontSizeValues>;
  fontWeight: WidenLeaves<typeof fontWeightValues>;
  lineHeight: WidenLeaves<typeof lineHeightValues>;
  shadow: WidenLeaves<typeof shadowValues>;
  duration: WidenLeaves<typeof durationValues>;
  easing: WidenLeaves<typeof easingValues>;
  transition: WidenLeaves<typeof transitionValues>;
  color: {
    background: {
      app: string;
      surface: string;
      subtle: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      onAccent: string;
      onDanger: string;
      disabled: string;
      placeholder: string;
    };
    accent: { default: string; hover: string; subtle: string };
    border: { default: string; strong: string; focus: string };
    shadow: { offset: string };
    danger: { default: string; solid: string; subtle: string; border: string };
    success: { default: string; solid: string; subtle: string; border: string };
    warning: { default: string; onSolid: string; subtle: string; border: string };
    info: { default: string; onSolid: string; subtle: string; border: string };
    overlay: { default: string; backdrop: string };
    syntax: {
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

/** Built-in token pack: mode-invariant theme tokens + dark color face. */
export type DesignTokenPack = {
  tokens: DesignThemeTokenValues;
  darkColor: DeepPartial<DesignTokens['color']>;
};
