import { reset } from 'typestyles/globals';
import { designTokens as t } from './tokens';
import { atReducedMotion } from './theme-conditions';
import { typestyles } from './runtime';

const resetLayer = 'reset';
const baseLayer = 'base';

/**
 * CSS reset (Josh Comeau) plus token-driven defaults for bare HTML elements (`p`, `code`,
 * headings, links, lists, tables, etc.). Registered in the `reset` and `base` cascade layers
 * so component recipes in higher layers can override.
 *
 * Side effect on import: styles register when this module loads (via `@var-ui/core` or
 * `@var-ui/core/base-styles`). Pair with {@link registerGlobals} after `reset()` in tests.
 */
export function registerBaseStyles(): void {
  typestyles.global.apply(...reset({ layer: resetLayer, includeAppRootIsolation: false }));

  typestyles.global.style(
    'html',
    {
      scrollBehavior: 'smooth',
      ...atReducedMotion({ scrollBehavior: 'auto' }),
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'body',
    {
      margin: 0,
      minHeight: '100%',
      fontFamily: t.fontFamily.body.var,
      fontSize: t.fontSize.md.var,
      lineHeight: t.lineHeight.normal.var,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      // Resolves when the design theme surface lives on `<html>`
      // (`DesignSystemProvider applyToDocument`). Otherwise these vars fall back until an
      // ancestor defines the theme tokens.
      backgroundColor: t.color.background.app.var,
      color: t.color.text.primary.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'h1, h2, h3, h4, h5, h6',
    {
      fontFamily: t.fontFamily.display.var,
      fontWeight: t.fontWeight.semibold.var,
      lineHeight: t.lineHeight.tight.var,
      color: t.color.text.primary.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'h1',
    {
      fontSize: t.fontSize['3xl'].var,
      fontWeight: t.fontWeight.bold.var,
      marginBottom: t.space[3].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'h2',
    {
      fontSize: t.fontSize['2xl'].var,
      fontWeight: t.fontWeight.bold.var,
      marginTop: t.space[6].var,
      marginBottom: t.space[2].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'h3',
    {
      fontSize: t.fontSize.xl.var,
      marginTop: t.space[5].var,
      marginBottom: t.space[2].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'h4, h5, h6',
    {
      fontSize: t.fontSize.lg.var,
      marginTop: t.space[4].var,
      marginBottom: t.space[1].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'p',
    {
      marginBottom: t.space[3].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'p:last-child',
    {
      marginBottom: 0,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'a',
    {
      color: t.color.link.default.var,
      textDecoration: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '2px',
      fontWeight: t.fontWeight.medium.var,
      transition: t.transition.colorShift.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'a:hover',
    {
      color: t.color.link.hover.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'a:focus-visible',
    {
      outline: `2px solid ${t.color.border.focus.var}`,
      outlineOffset: '2px',
      borderRadius: t.radius.sm.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'code',
    {
      fontFamily: t.fontFamily.mono.var,
      fontSize: '0.9em',
      fontWeight: t.fontWeight.medium.var,
      color: t.color.link.hover.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'a code',
    {
      color: 'inherit',
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'pre:not([data-codeblock-pre])',
    {
      fontFamily: t.fontFamily.mono.var,
      fontSize: t.fontSize.sm.var,
      lineHeight: 1.6,
      backgroundColor: t.color.background.subtle.var,
      padding: t.space[3].var,
      borderRadius: t.radius.md.var,
      borderWidth: t.borderWidth.default.var,
      borderStyle: 'solid',
      borderColor: t.color.border.default.var,
      overflow: 'auto',
      marginBottom: t.space[3].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'pre code',
    {
      backgroundColor: 'transparent',
      padding: 0,
      border: 'none',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      color: 'inherit',
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'strong, b',
    {
      fontWeight: t.fontWeight.semibold.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'em, i',
    {
      fontStyle: 'italic',
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'small',
    {
      fontSize: t.fontSize.sm.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'hr',
    {
      border: 'none',
      borderTopWidth: t.borderWidth.default.var,
      borderTopStyle: 'solid',
      borderTopColor: t.color.border.default.var,
      margin: `${t.space[5].var} 0`,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'ul, ol',
    {
      marginBottom: t.space[3].var,
      paddingLeft: t.space[4].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'li',
    {
      marginBottom: t.space[1].var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'li:last-child',
    {
      marginBottom: 0,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'blockquote',
    {
      margin: `${t.space[4].var} 0`,
      paddingLeft: t.space[4].var,
      borderLeftWidth: t.borderWidth.thick.var,
      borderLeftStyle: 'solid',
      borderLeftColor: t.color.border.strong.var,
      color: t.color.text.secondary.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'table',
    {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: t.space[4].var,
      fontSize: t.fontSize.sm.var,
      borderWidth: t.borderWidth.default.var,
      borderStyle: 'solid',
      borderColor: t.color.border.default.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'th, td',
    {
      textAlign: 'left',
      padding: `${t.space[2].var} ${t.space[3].var}`,
      borderBottomWidth: t.borderWidth.default.var,
      borderBottomStyle: 'solid',
      borderBottomColor: t.color.border.default.var,
      verticalAlign: 'top',
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'th',
    {
      fontWeight: t.fontWeight.semibold.var,
      backgroundColor: t.color.background.subtle.var,
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'tr:last-child td',
    {
      borderBottom: 'none',
    },
    { layer: baseLayer },
  );

  typestyles.global.style(
    'caption',
    {
      captionSide: 'bottom',
      paddingTop: t.space[2].var,
      fontSize: t.fontSize.sm.var,
      color: t.color.text.secondary.var,
      textAlign: 'left',
    },
    { layer: baseLayer },
  );
}

registerBaseStyles();
