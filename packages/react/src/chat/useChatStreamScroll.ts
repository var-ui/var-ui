import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type UseChatStreamScrollOptions = {
  /** Ref to the scrollable container element. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Whether scroll behavior is enabled. @default true */
  enabled?: boolean;
  /** Distance from bottom (px) within which scrolling back re-locks. @default 10 */
  lockThreshold?: number;
  /** Distance from bottom (px) beyond which the scroll-to-bottom button should show. @default 100 */
  buttonThreshold?: number;
};

export type UseChatStreamScrollReturn = {
  /** Whether the user has scrolled up past `buttonThreshold`. */
  isScrolledUp: boolean;
  /** Whether auto-scroll is locked (following content). */
  isLocked: boolean;
  /** Scroll to the bottom of the container and re-lock. */
  scrollToBottom: () => void;
  /** Lock auto-scroll and scroll to bottom. */
  lock: () => void;
  /** Unlock auto-scroll. */
  unlock: () => void;
  /** Scroll to bottom if currently locked. Call on content resize. */
  scrollIfLocked: () => void;
};

/**
 * Lock-to-bottom auto-scroll for streaming content. Locked (default)
 * auto-scrolls to bottom as content grows; scrolling up unlocks
 * immediately; scrolling back within `lockThreshold` of the bottom
 * re-locks. Simplified vs. Astryx's hand-rolled rAF spring — uses native
 * `scrollTo({ behavior: 'smooth' })`.
 */
export function useChatStreamScroll({
  scrollRef,
  enabled = true,
  lockThreshold = 10,
  buttonThreshold = 100,
}: UseChatStreamScrollOptions): UseChatStreamScrollReturn {
  const [isLocked, setIsLocked] = useState(true);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const lockedRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const lastScrollHeightRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    lockedRef.current = true;
    setIsLocked(true);
    setIsScrolledUp(false);
    el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' });
  }, [scrollRef]);

  const lock = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    setIsLocked(false);
  }, []);

  const scrollIfLocked = useCallback(() => {
    const el = scrollRef.current;
    if (!enabled || !lockedRef.current || !el) {
      return;
    }
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }, [enabled, scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) {
      return;
    }

    lastScrollTopRef.current = el.scrollTop;
    lastScrollHeightRef.current = el.scrollHeight;

    function onScroll() {
      const target = el as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsScrolledUp(distanceFromBottom > buttonThreshold);

      const scrollHeightChanged = scrollHeight !== lastScrollHeightRef.current;
      lastScrollHeightRef.current = scrollHeight;

      if (scrollHeightChanged) {
        // Synthetic scroll from content resize — don't change lock state.
        lastScrollTopRef.current = scrollTop;
        return;
      }

      const isScrollingUp = scrollTop < lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;

      if (isScrollingUp && lockedRef.current) {
        lockedRef.current = false;
        setIsLocked(false);
      } else if (distanceFromBottom <= lockThreshold && !lockedRef.current) {
        lockedRef.current = true;
        setIsLocked(true);
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, enabled, lockThreshold, buttonThreshold]);

  return { isLocked, isScrolledUp, scrollToBottom, lock, unlock, scrollIfLocked };
}
