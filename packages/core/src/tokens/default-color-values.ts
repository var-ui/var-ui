import { color as colorUtil } from 'typestyles/color';
import { defaultLightSyntaxValues, defaultLightColorValues } from '../themes/default-values';
import { neoBrutalistShadowOffsetLight } from '../themes/neo-brutalist-shadows';
import { color } from './color';
import { paletteTokens } from './primitives';
import type { DesignTokens } from './types';

const defaultLightSubtle = paletteTokens['sand-2'];

/** Complete default color registration — every leaf defined; derived slots use `color.*` refs. */
export const defaultColorTokenValues = {
  background: {
    app: defaultLightColorValues.background!.app,
    surface: defaultLightColorValues.background!.surface,
    subtle: defaultLightColorValues.background!.subtle,
    elevated: defaultLightColorValues.background!.elevated,
    popover: color.background.elevated,
    muted: color.background.subtle,
  },
  text: {
    primary: defaultLightColorValues.text!.primary,
    secondary: defaultLightColorValues.text!.secondary,
    onAccent: defaultLightColorValues.text!.onAccent,
    onDanger: defaultLightColorValues.text!.onDanger,
    onSuccess: defaultLightColorValues.text!.onSuccess,
    onWarning: defaultLightColorValues.text!.onWarning,
    onInfo: defaultLightColorValues.text!.onInfo,
    disabled: `color-mix(in oklch, ${color.text.secondary} 45%, transparent)`,
    placeholder: `color-mix(in oklch, ${color.text.secondary} 55%, transparent)`,
  },
  accent: {
    default: defaultLightColorValues.accent!.default,
    hover: defaultLightColorValues.accent!.hover,
    subtle: `color-mix(in oklch, ${color.accent.default} 24%, ${color.background.app})`,
  },
  border: {
    default: defaultLightColorValues.border!.default,
    strong: defaultLightColorValues.border!.strong,
    focus: defaultLightColorValues.border!.focus,
  },
  shadow: {
    offset: neoBrutalistShadowOffsetLight(defaultLightSubtle),
    color: `color-mix(in oklch, ${color.text.primary} 12%, transparent)`,
  },
  danger: {
    default: defaultLightColorValues.danger!.default,
    solid: defaultLightColorValues.danger!.solid,
    subtle: `color-mix(in oklch, ${color.danger.default} 12%, transparent)`,
    border: `color-mix(in oklch, ${color.danger.default} 40%, transparent)`,
  },
  success: {
    default: defaultLightColorValues.success!.default,
    solid: defaultLightColorValues.success!.solid,
    subtle: `color-mix(in oklch, ${color.success.default} 12%, transparent)`,
    border: `color-mix(in oklch, ${color.success.default} 40%, transparent)`,
  },
  warning: {
    default: defaultLightColorValues.warning!.default,
    onSolid: defaultLightColorValues.warning!.onSolid,
    subtle: `color-mix(in oklch, ${color.warning.default} 12%, transparent)`,
    border: `color-mix(in oklch, ${color.warning.default} 40%, transparent)`,
  },
  info: {
    default: defaultLightColorValues.info!.default,
    onSolid: defaultLightColorValues.info!.onSolid,
    subtle: `color-mix(in oklch, ${color.info.default} 12%, transparent)`,
    border: `color-mix(in oklch, ${color.info.default} 40%, transparent)`,
  },
  link: {
    default: color.accent.default,
    hover: color.accent.hover,
  },
  ring: {
    default: `color-mix(in oklch, ${color.accent.default} 45%, transparent)`,
  },
  overlay: {
    default: colorUtil.alpha(paletteTokens['slate-10'], 0.55, 'oklch'),
    panel: color.background.elevated,
    backdrop: `color-mix(in oklch, ${color.overlay.default} 60%, transparent)`,
    hover: `color-mix(in oklch, ${color.text.primary} 8%, transparent)`,
    pressed: `color-mix(in oklch, ${color.text.primary} 14%, transparent)`,
  },
  skeleton: {
    default: `color-mix(in oklch, ${color.background.subtle} 80%, ${color.border.default})`,
  },
  track: {
    default: `color-mix(in oklch, ${color.background.subtle} 65%, ${color.border.default})`,
  },
  syntax: defaultLightSyntaxValues,
} satisfies DesignTokens['color'];
