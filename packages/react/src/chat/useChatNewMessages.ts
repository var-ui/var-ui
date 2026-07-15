import { useCallback, useRef, useState } from 'react';

export type UseChatNewMessagesOptions = {
  /** Current lock state from `useChatStreamScroll`. */
  isLocked: boolean;
  /** Called when content grows while locked — typically `scroll.scrollIfLocked`. */
  onResize?: () => void;
};

export type UseChatNewMessagesReturn = {
  /** Whether content grew while unlocked (drives a "New messages" button). */
  hasNewMessages: boolean;
  /** Callback ref — attach to the element whose height grows as messages stream in. */
  contentRef: (el: HTMLElement | null) => void;
  /** Clear `hasNewMessages` — call when the user scrolls to the latest message. */
  dismiss: () => void;
};

/**
 * Tracks content growth via `ResizeObserver`. While locked, calls
 * `onResize` (typically re-triggering auto-scroll); while unlocked, flags
 * `hasNewMessages` so a caller can surface a "New messages" affordance.
 */
export function useChatNewMessages({
  isLocked,
  onResize,
}: UseChatNewMessagesOptions): UseChatNewMessagesReturn {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);
  const lastHeightRef = useRef(0);

  const contentRef = useCallback(
    (el: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el) {
        return;
      }
      lastHeightRef.current = el.scrollHeight;
      const observer = new ResizeObserver(() => {
        const nextHeight = el.scrollHeight;
        if (nextHeight > lastHeightRef.current) {
          if (isLocked) {
            onResize?.();
          } else {
            setHasNewMessages(true);
          }
        }
        lastHeightRef.current = nextHeight;
      });
      observer.observe(el);
      observerRef.current = observer;
    },
    [isLocked, onResize],
  );

  const dismiss = useCallback(() => setHasNewMessages(false), []);

  return { hasNewMessages, contentRef, dismiss };
}
