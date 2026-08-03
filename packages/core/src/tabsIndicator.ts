/** CSS custom properties updated by `positionTabsIndicator` on the tabs list element. */
export const tabsIndicatorCssVars = {
  x: '--var-ui-tabs-indicatorx',
  width: '--var-ui-tabs-indicatorwidth',
  opacity: '--var-ui-tabs-indicatoropacity',
} as const;

/** Position the shared tabs indicator to match the active tab. */
export function positionTabsIndicator(list: HTMLElement, activeTab: HTMLElement | null): void {
  if (!activeTab || activeTab.parentElement !== list) {
    list.style.setProperty(tabsIndicatorCssVars.opacity, '0');
    return;
  }

  list.style.setProperty(tabsIndicatorCssVars.opacity, '1');
  list.style.setProperty(tabsIndicatorCssVars.width, `${activeTab.offsetWidth}px`);
  list.style.setProperty(tabsIndicatorCssVars.x, `${activeTab.offsetLeft}px`);
}
