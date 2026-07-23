import { color } from 'typestyles/color';
import { createDesignTheme } from '../create-theme';
import { tokens } from '../runtime';
import { designTokens as p } from '../tokens';
import type { DesignTokenPack } from '../types';
import { defaultDarkSyntaxValues, defaultLightSyntaxValues } from './default-values';

const newWaveLightSyntaxValues = {
  ...defaultLightSyntaxValues,
  keyword: '#D934B6',
  title: '#243CFF',
  string: '#00845F',
  builtIn: '#F06C00',
  section: '#5D5FEF',
};

const newWaveDarkSyntaxValues = {
  ...defaultDarkSyntaxValues,
  keyword: '#FF7FE6',
  title: '#8BFF5C',
  string: '#70F7D3',
  builtIn: '#FFF45C',
  section: '#00D7FF',
};

const newWaveLightColorValues = {
  background: {
    app: '#FFF45C',
    surface: '#FFFDF0',
    subtle: '#FFE1F8',
    elevated: '#FFFFFF',
    popover: '#FFFFFF',
    muted: '#FFE1F8',
  },
  text: {
    primary: '#151329',
    secondary: '#4F3D7A',
    onAccent: '#151329',
    onDanger: p.palette['neutral-1'],
    onSuccess: p.palette['neutral-1'],
    onWarning: '#151329',
    onInfo: p.palette['neutral-1'],
  },
  accent: { default: '#FF4FD8', hover: '#D934B6' },
  border: {
    default: '#151329',
    strong: '#151329',
    focus: '#00D7FF',
  },
  shadow: { offset: '#00D7FF' },
  danger: { default: p.palette['red-7'], solid: p.palette['red-8'] },
  success: { default: '#00A878', solid: '#00845F' },
  warning: { default: '#F06C00', onSolid: '#151329' },
  info: { default: '#5D5FEF', onSolid: p.palette['neutral-1'] },
  overlay: {
    default: color.alpha('#151329', 0.55, 'oklch'),
    panel: '#FFFFFF',
  },
  link: { default: '#FF4FD8', hover: '#D934B6' },
  syntax: newWaveLightSyntaxValues,
};

const newWaveDarkColorValues = {
  background: {
    app: '#131129',
    surface: '#1E1B3F',
    subtle: '#2D2256',
    elevated: '#25204E',
    popover: '#25204E',
    muted: '#2D2256',
  },
  text: {
    primary: '#FFF8A8',
    secondary: '#B9B0F7',
    onAccent: '#151329',
    onDanger: p.palette['neutral-1'],
    onSuccess: p.palette['neutral-1'],
    onWarning: '#151329',
    onInfo: '#151329',
  },
  accent: { default: '#8BFF5C', hover: '#B9FF66' },
  border: {
    default: '#00D7FF',
    strong: '#00D7FF',
    focus: '#FF4FD8',
  },
  shadow: { offset: '#FF4FD8' },
  danger: { default: p.palette['red-4'], solid: p.palette['red-7'] },
  success: { default: '#8BFF5C', solid: '#00A878' },
  warning: { default: '#FFF45C', onSolid: '#151329' },
  info: { default: '#00D7FF', onSolid: '#151329' },
  overlay: {
    default: color.alpha('#05040F', 0.78, 'oklch'),
    panel: '#25204E',
  },
  link: { default: '#8BFF5C', hover: '#B9FF66' },
  syntax: newWaveDarkSyntaxValues,
};

const newWavePrimitiveValues = {
  fontFamily: {
    display: '"Arial Black", Impact, "Space Grotesk", system-ui, sans-serif',
    sans: '"Trebuchet MS", "Space Grotesk", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "SF Mono", Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    md: '15px',
    lg: '18px',
    xl: '24px',
    '2xl': '30px',
    '3xl': '38px',
  },
  fontWeight: {
    normal: '500',
    medium: '700',
    semibold: '800',
    bold: '900',
  },
  radius: {
    none: '0',
    sm: '6px',
    md: '14px',
    lg: '22px',
    xl: '30px',
    full: '999px',
  },
  borderWidth: {
    thin: '1px',
    default: '2px',
    thick: '3px',
  },
  duration: {
    fast: '90ms',
    medium: '120ms',
    slow: '180ms',
  },
  shadow: {
    xs: '2px 2px 0 0 #00D7FF',
    sm: '3px 3px 0 0 #00D7FF',
    md: '6px 6px 0 0 #00D7FF',
    lg: '8px 8px 0 0 #00D7FF',
    xl: '10px 10px 0 0 #00D7FF',
  },
  transition: {
    overlayFade: 'opacity 180ms ease, visibility 180ms ease',
    panelEnter: 'opacity 180ms cubic-bezier(0.16, 1, 0.3, 1)',
    backdrop: 'opacity 180ms ease',
    surfaceFast: 'background-color 90ms ease',
    colorShift: 'color 120ms ease, text-decoration-color 120ms ease',
    controlSurface: 'background-color 120ms ease, border-color 120ms ease',
  },
};

const newWaveDarkShadow = {
  xs: '2px 2px 0 0 #FF4FD8',
  sm: '3px 3px 0 0 #FF4FD8',
  md: '6px 6px 0 0 #FF4FD8',
  lg: '8px 8px 0 0 #FF4FD8',
  xl: '10px 10px 0 0 #FF4FD8',
};

export const newWaveTokens: DesignTokenPack = {
  tokens: {
    ...newWavePrimitiveValues,
    color: newWaveLightColorValues,
  },
  darkColor: newWaveDarkColorValues,
};

export const newWaveTheme = createDesignTheme({
  name: 'new-wave',
  from: newWaveTokens,
  modes: [
    {
      id: 'dark-elevation-shadow',
      overrides: { shadow: newWaveDarkShadow },
      when: tokens.when.or(
        tokens.when.attr('data-mode', 'dark', { scope: 'self' }),
        tokens.when.and(
          tokens.when.not(tokens.when.attr('data-mode', 'light', { scope: 'self' })),
          tokens.when.prefersDark,
        ),
      ),
    },
  ],
});
