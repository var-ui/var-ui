/** CSS custom properties updated by `positionSegmentedControlIndicator` on the root element. */
export const segmentedControlIndicatorCssVars = {
  x: '--var-ui-segmented-control-indicatorx',
  width: '--var-ui-segmented-control-indicatorwidth',
  opacity: '--var-ui-segmented-control-indicatoropacity',
} as const;

/** Active segment inside a segmented-control root. */
export function getActiveSegmentedControlSegment(root: HTMLElement): HTMLElement | null {
  return (
    root.querySelector<HTMLElement>(':scope > [data-selected]') ??
    root.querySelector<HTMLElement>(':scope > [aria-pressed="true"]')
  );
}

/** Position the shared segmented-control indicator to match the active segment. */
export function positionSegmentedControlIndicator(
  root: HTMLElement,
  activeSegment: HTMLElement | null,
): void {
  if (!activeSegment || activeSegment.parentElement !== root) {
    root.style.setProperty(segmentedControlIndicatorCssVars.opacity, '0');
    return;
  }

  const width = activeSegment.offsetWidth;
  const x = activeSegment.offsetLeft;

  if (width === 0) {
    return;
  }

  root.style.setProperty(segmentedControlIndicatorCssVars.opacity, '1');
  root.style.setProperty(segmentedControlIndicatorCssVars.width, `${width}px`);
  root.style.setProperty(segmentedControlIndicatorCssVars.x, `${x}px`);
}

/** Find the active segment and position the indicator. */
export function syncSegmentedControlIndicator(root: HTMLElement): void {
  positionSegmentedControlIndicator(root, getActiveSegmentedControlSegment(root));
}

const observedRoots = new WeakMap<HTMLElement, ResizeObserver>();

/**
 * Keep the segmented-control indicator aligned after layout, font, and content changes.
 * Returns a cleanup function that disconnects the observer.
 */
export function observeSegmentedControlIndicator(root: HTMLElement): () => void {
  const update = () => syncSegmentedControlIndicator(root);

  update();
  requestAnimationFrame(() => {
    update();
    requestAnimationFrame(update);
  });

  let observer = observedRoots.get(root);
  if (!observer) {
    observer = new ResizeObserver(() => update());
    observedRoots.set(root, observer);
  }

  observer.disconnect();
  observer.observe(root);
  for (const child of root.children) {
    if (child instanceof HTMLElement) {
      observer.observe(child);
    }
  }

  if (typeof document !== 'undefined' && 'fonts' in document) {
    void document.fonts.ready.then(update);
  }

  return () => {
    observer?.disconnect();
    observedRoots.delete(root);
  };
}
