import { useEffect, useRef, useState } from 'react';

export type OverlayPresenceAttrs = {
  'data-open'?: '';
  'data-closed'?: '';
  'data-starting-style'?: '';
  'data-ending-style'?: '';
};

export type UseOverlayPresenceOptions = {
  isOpen: boolean;
  reducedMotion?: boolean;
  getAnimatedElements: () => readonly (HTMLElement | null)[];
};

export type UseOverlayPresenceResult = {
  mounted: boolean;
  attrs: OverlayPresenceAttrs;
};

export function useOverlayPresence({
  isOpen,
  reducedMotion,
  getAnimatedElements,
}: UseOverlayPresenceOptions): UseOverlayPresenceResult {
  const [mounted, setMounted] = useState(isOpen);
  const [attrs, setAttrs] = useState<OverlayPresenceAttrs>(
    isOpen ? { 'data-open': '', 'data-starting-style': '' } : {},
  );
  const generationRef = useRef(0);
  const getAnimatedElementsRef = useRef(getAnimatedElements);
  getAnimatedElementsRef.current = getAnimatedElements;

  const prefersReducedMotion =
    reducedMotion ??
    (typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true);

  useEffect(() => {
    const generation = ++generationRef.current;

    if (isOpen) {
      setMounted(true);
      setAttrs({ 'data-open': '', 'data-starting-style': '' });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (generationRef.current === generation) {
            setAttrs({ 'data-open': '' });
          }
        });
      });
    } else {
      setAttrs({
        'data-open': '',
        'data-closed': '',
        'data-ending-style': '',
      });

      if (prefersReducedMotion) {
        setMounted(false);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (generationRef.current !== generation) {
              return;
            }

            const finishedAnimations = getAnimatedElementsRef
              .current()
              .filter((element): element is HTMLElement => element !== null)
              .flatMap((element) =>
                (element.getAnimations?.() ?? []).map((animation) => animation.finished),
              );

            if (finishedAnimations.length === 0) {
              setMounted(false);
            } else {
              void Promise.allSettled(finishedAnimations).then(() => {
                if (generationRef.current === generation) {
                  setMounted(false);
                }
              });
            }
          });
        });
      }
    }

    return () => {
      if (generationRef.current === generation) {
        generationRef.current += 1;
      }
    };
  }, [isOpen, prefersReducedMotion]);

  return { mounted, attrs };
}
