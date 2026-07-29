/** Position the shared TOC indicator to match the active link's row. */
export function positionTocIndicator(list: HTMLElement, activeLink: HTMLElement | null): void {
  const indicator = list.querySelector<HTMLElement>('[data-toc-indicator]');
  if (!indicator) return;

  if (!activeLink) {
    indicator.style.opacity = '0';
    return;
  }

  const item = activeLink.closest('li');
  if (!item || item.parentElement !== list) {
    indicator.style.opacity = '0';
    return;
  }

  indicator.style.opacity = '1';
  indicator.style.height = `${item.offsetHeight}px`;
  indicator.style.transform = `translateY(${item.offsetTop}px)`;
}
