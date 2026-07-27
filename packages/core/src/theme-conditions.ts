import {
  conditional,
  type ConditionalOverride,
  type ThemeCondition,
  type VariantOptionStyle,
} from 'typestyles';
import { typestyles } from './runtime';

const tsWhen = typestyles.tokens.when;

/** Canonical `ThemeCondition` presets for var-ui color mode and a11y media queries. */
export const themeWhen = {
  /** Explicit `data-mode="dark"` or system dark when not pinned to light. */
  colorModeResolvedDark: tsWhen.or(
    tsWhen.attr('data-mode', 'dark', { scope: 'ancestor' }),
    tsWhen.and(
      tsWhen.not(tsWhen.attr('data-mode', 'light', { scope: 'ancestor' })),
      tsWhen.prefersDark,
    ),
  ),
  colorModeExplicitDark: tsWhen.attr('data-mode', 'dark', { scope: 'ancestor' }),
  colorModeExplicitLight: tsWhen.attr('data-mode', 'light', { scope: 'ancestor' }),
  colorModeSystemDark: tsWhen.and(
    tsWhen.not(tsWhen.attr('data-mode', 'light', { scope: 'ancestor' })),
    tsWhen.not(tsWhen.attr('data-mode', 'dark', { scope: 'ancestor' })),
    tsWhen.prefersDark,
  ),
  reducedMotion: tsWhen.media('(prefers-reduced-motion: reduce)'),
} as const;

/** Build a `conditions` entry — prefer `{ light, dark }` on color properties when possible. */
export const when = {
  dark: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.colorModeResolvedDark, style, id),
  light: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.colorModeExplicitLight, style, id),
  reducedMotion: (style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(themeWhen.reducedMotion, style, id),
  match: (condition: ThemeCondition, style: VariantOptionStyle, id?: string): ConditionalOverride =>
    conditional(condition, style, id),
};
