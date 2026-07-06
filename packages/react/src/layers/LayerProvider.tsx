import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo, useRef, useState } from 'react';

type LayerContextValue = {
  baseZIndex: number;
  allocate: () => number;
};

const DEFAULT_BASE = 100;
const STEP = 10;

const LayerContext = createContext<LayerContextValue | null>(null);

export type LayerProviderProps = {
  children: ReactNode;
  /** z-index of the first floating layer; each subsequent layer adds 10. */
  baseZIndex?: number;
};

/**
 * Coordinates z-index for floating UI (dialogs, toasts, popovers) so layers
 * stack in mount order instead of by hard-coded constants. Optional — layers
 * fall back to a base of 100 without it.
 *
 * ```tsx
 * <LayerProvider>{app}</LayerProvider>
 * ```
 */
export function LayerProvider({
  children,
  baseZIndex = DEFAULT_BASE,
}: LayerProviderProps): JSX.Element {
  const counter = useRef(0);
  const value = useMemo<LayerContextValue>(
    () => ({
      baseZIndex,
      allocate: () => baseZIndex + counter.current++ * STEP,
    }),
    [baseZIndex],
  );
  return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}

/** Allocate a stable z-index for one floating layer (stable across re-renders). */
export function useLayer(): { zIndex: number; style: { zIndex: number } } {
  const context = useContext(LayerContext);
  const [zIndex] = useState(() => (context ? context.allocate() : DEFAULT_BASE));
  return { zIndex, style: { zIndex } };
}
