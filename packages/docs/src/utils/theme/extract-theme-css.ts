/**
 * Must match `layers` in `packages/core/src/runtime.ts`.
 * Declared first so a lazy theme stylesheet that loads before `/typestyles.css`
 * cannot invent `tokens`/`overrides` ahead of `reset`/`base`/`components`.
 */
const TYPESTYLES_CASCADE_LAYER_ORDER =
  '@layer reset, base, tokens, components, overrides, utilities;';

/** Drop duplicated core/component CSS; keep @font-face + theme class rules only. */
export function extractThemeOnlyCss(css: string, themeId: string): string {
  const themeClass = `.theme-var-ui-${themeId}`;
  const fontFaceIdx = css.indexOf('@font-face');
  const themeIdx = css.indexOf(themeClass);
  const candidates = [fontFaceIdx, themeIdx].filter((index) => index >= 0);
  if (candidates.length === 0) {
    throw new Error(`No theme CSS found for "${themeId}"`);
  }
  const start = Math.min(...candidates);
  const extracted = css.slice(start).trim();
  if (extracted.startsWith(TYPESTYLES_CASCADE_LAYER_ORDER)) return extracted;
  return `${TYPESTYLES_CASCADE_LAYER_ORDER}\n${extracted}`;
}
