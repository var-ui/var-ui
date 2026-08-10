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
  return css.slice(start).trim();
}
