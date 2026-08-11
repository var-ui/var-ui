import { useCallback, useEffect, useRef, useState } from 'react';

export type UseCopyOptions = {
  /** Milliseconds before `copied` resets to false. @default 2000 */
  timeout?: number;
};

export type UseCopyResult = {
  /** Whether the last copy attempt succeeded within the timeout window. */
  copied: boolean;
  /** Error from the last failed copy attempt, if any. */
  error: Error | null;
  /** Write `value` to the clipboard. */
  copy: (value: string) => Promise<void>;
  /** Reset copied/error state without copying. */
  reset: () => void;
};

/**
 * Clipboard copy state machine. Pair with `CopyButton` or wire to any control.
 */
export function useCopy({ timeout = 2000 }: UseCopyOptions = {}): UseCopyResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setCopied(false);
    setError(null);
  }, [clearTimer]);

  const copy = useCallback(
    async (value: string) => {
      clearTimer();
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setError(null);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, timeout);
      } catch (cause) {
        setCopied(false);
        setError(cause instanceof Error ? cause : new Error('Copy failed'));
      }
    },
    [clearTimer, timeout],
  );

  return { copied, error, copy, reset };
}
