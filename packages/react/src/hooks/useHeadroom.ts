import { type RefObject, useEffect, useRef, useState } from 'react';

export type UseHeadroomOptions = {
  /** Scroll offset before the header can unpin. @default 0 */
  fixedAt?: number;
  /**
   * Scroll container to observe. When omitted, listens on `window`.
   * Pass the `AppShell` main landmark ref when the shell scrolls internally.
   */
  target?: RefObject<HTMLElement | null>;
};

/**
 * Hides chrome on scroll-down and reveals it on scroll-up — pair with
 * `AppShell` `headroom` or `headerHidden={!pinned}` and `headerOffset={false}`.
 */
export function useHeadroom(options: UseHeadroomOptions = {}): { pinned: boolean } {
  const { fixedAt = 0, target } = options;
  const [pinned, setPinned] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = target?.current;
    const getScrollY = () => (element ? element.scrollTop : window.scrollY);

    const onScroll = () => {
      const current = getScrollY();
      if (current <= fixedAt) {
        setPinned(true);
      } else if (current > lastScrollY.current) {
        setPinned(false);
      } else if (current < lastScrollY.current) {
        setPinned(true);
      }
      lastScrollY.current = current;
    };

    const scrollTarget: HTMLElement | Window = element ?? window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollTarget.removeEventListener('scroll', onScroll);
  }, [fixedAt, target]);

  return { pinned };
}
