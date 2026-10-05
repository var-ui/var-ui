/** CSS custom properties updated by `positionTocIndicator` on the TOC list element. */
export const tocIndicatorCssVars = {
  y: '--var-ui-toc-indicatory',
  height: '--var-ui-toc-indicatorheight',
  opacity: '--var-ui-toc-indicatoropacity',
} as const;

/** Position the shared TOC indicator to match the active link's row. */
export function positionTocIndicator(list: HTMLElement, activeLink: HTMLElement | null): void {
  if (!activeLink) {
    list.style.setProperty(tocIndicatorCssVars.opacity, '0');
    return;
  }

  const item = activeLink.closest('li');
  if (!item || item.parentElement !== list) {
    list.style.setProperty(tocIndicatorCssVars.opacity, '0');
    return;
  }

  list.style.setProperty(tocIndicatorCssVars.opacity, '1');
  list.style.setProperty(tocIndicatorCssVars.height, `${item.offsetHeight}px`);
  list.style.setProperty(tocIndicatorCssVars.y, `${item.offsetTop}px`);
}
