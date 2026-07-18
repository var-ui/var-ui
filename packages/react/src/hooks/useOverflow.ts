import { useCallback, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';

export type UseOverflowOptions = {
  /** Extra hard cap applied after measurement (e.g. "never show more than 5"). */
  maxVisible?: number;
  /** Gap (px) between items — added between measured widths when reserving space. @default 0 */
  gapPx?: number;
  /** Disable measurement; all items report visible. @default true */
  enabled?: boolean;
};

export type UseOverflowResult<T> = {
  /** Bind to the visible row — its box width constrains the fit. */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * Bind to a hidden, out-of-flow row rendering all `items` (in order) plus a
   * trailing overflow-indicator node — used to measure widths without flicker.
   */
  measureRef: RefObject<HTMLElement | null>;
  visibleItems: T[];
  hiddenItems: T[];
};

function countVisible(
  containerWidth: number,
  itemWidths: number[],
  indicatorWidth: number,
  gapPx: number,
): number {
  const total = itemWidths.length;
  if (total === 0) return 0;

  const fullWidth = itemWidths.reduce((sum, width) => sum + width, 0) + gapPx * (total - 1);
  if (fullWidth <= containerWidth) return total;

  let used = 0;
  let count = 0;
  for (let index = 0; index < total; index += 1) {
    const gapBefore = count > 0 ? gapPx : 0;
    const hiddenAfter = total - (index + 1);
    // Once at least one item is hidden, the indicator must fit too.
    const indicatorReserve = hiddenAfter > 0 ? gapPx + indicatorWidth : 0;
    const next = used + gapBefore + itemWidths[index] + indicatorReserve;
    if (next > containerWidth) break;
    used += gapBefore + itemWidths[index];
    count += 1;
  }
  return count;
}

/**
 * Measures a hidden row of item + overflow-indicator placeholders against a
 * visible container's width and reports how many items fit. Walks widths
 * left-to-right, reserving space for the indicator as soon as any item would
 * be hidden. Re-measures on mount, when `items`/options change, and on
 * container resize.
 *
 * Used internally by `OverflowList`; also usable for custom overflow layouts —
 * render the hidden measure row into `measureRef` yourself.
 */
export function useOverflow<T>(items: T[], options: UseOverflowOptions = {}): UseOverflowResult<T> {
  const { maxVisible, gapPx = 0, enabled = true } = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLElement | null>(null);
  const [measuredCount, setMeasuredCount] = useState(items.length);

  const measure = useCallback(() => {
    if (!enabled || items.length === 0) {
      setMeasuredCount(items.length);
      return;
    }
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container || !measureEl) {
      setMeasuredCount(items.length);
      return;
    }
    const children = Array.from(measureEl.children) as HTMLElement[];
    const itemEls = children.slice(0, items.length);
    const indicatorEl = children[items.length];
    if (itemEls.length < items.length) {
      setMeasuredCount(items.length);
      return;
    }
    const itemWidths = itemEls.map((el) => el.getBoundingClientRect().width);
    const indicatorWidth = indicatorEl ? indicatorEl.getBoundingClientRect().width : 0;
    const containerWidth = container.getBoundingClientRect().width;
    setMeasuredCount(countVisible(containerWidth, itemWidths, indicatorWidth, gapPx));
  }, [enabled, gapPx, items.length]);

  useLayoutEffect(() => {
    measure();
    // Re-measure whenever item identities/count or options change, not just on resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, items]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  const visibleCount = Math.max(0, Math.min(measuredCount, maxVisible ?? Infinity, items.length));

  return useMemo(
    () => ({
      containerRef,
      measureRef,
      visibleItems: items.slice(0, visibleCount),
      hiddenItems: items.slice(visibleCount),
    }),
    [items, visibleCount],
  );
}
