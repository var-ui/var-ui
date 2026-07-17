import { useCallback, useMemo, useState } from 'react';

/** Shared shape SideNav (and later Phase 6 `Layout*`) consume for single-region resize. */
export type ResizableConfig = {
  /** @default 260 */
  defaultWidth?: number;
  /** @default 180 */
  minWidth?: number;
  /** @default 480 */
  maxWidth?: number;
  /** Persists width to `localStorage` under `var-ui-resizable:${autoSaveId}`. */
  autoSaveId?: string;
  onWidthChange?: (width: number) => void;
  /** Enables the drag-below-threshold collapse behavior. @default false */
  collapsible?: boolean;
  /** Drag threshold below which resizing collapses the region. @default 160 */
  collapsedSize?: number;
};

export type UseResizableResult = {
  width: number;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  collapse: () => void;
  expand: () => void;
  resize: (width: number) => void;
  /** Bind to `ResizeHandle`. */
  handleProps: {
    direction: 'horizontal';
    value: number;
    minValue: number;
    maxValue: number;
    onChange: (next: number) => void;
    onCollapse?: () => void;
    isCollapsed: boolean;
    'aria-label'?: string;
  };
};

const STORAGE_KEY_PREFIX = 'var-ui-resizable:';
const DEFAULT_WIDTH = 260;
const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MAX_WIDTH = 480;
const DEFAULT_COLLAPSED_SIZE = 160;

function normalizeConfig(config: boolean | ResizableConfig | undefined): ResizableConfig {
  return config && config !== true ? config : {};
}

function storageKey(autoSaveId: string): string {
  return `${STORAGE_KEY_PREFIX}${autoSaveId}`;
}

function readStoredWidth(autoSaveId: string | undefined): number | undefined {
  if (!autoSaveId || typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(storageKey(autoSaveId));
    if (raw === null) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredWidth(autoSaveId: string | undefined, width: number): void {
  if (!autoSaveId || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(autoSaveId), String(width));
  } catch {
    // Storage disabled/full — width still tracked in memory for this session.
  }
}

/**
 * Single-region resize state: clamped width, drag-to-collapse, keyboard/pointer
 * handle bindings, and optional `localStorage` persistence. Multi-region split
 * panes are a Phase 6 concern; this hook's exports are stable for that reuse.
 */
export function useResizable(config?: boolean | ResizableConfig): UseResizableResult {
  const {
    defaultWidth = DEFAULT_WIDTH,
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
    autoSaveId,
    onWidthChange,
    collapsible = false,
    collapsedSize = DEFAULT_COLLAPSED_SIZE,
  } = normalizeConfig(config);

  const [width, setWidth] = useState<number>(() => {
    const stored = readStoredWidth(autoSaveId);
    if (stored === undefined) return defaultWidth;
    return Math.min(Math.max(stored, minWidth), maxWidth);
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const resize = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, minWidth), maxWidth);
      setWidth(clamped);
      writeStoredWidth(autoSaveId, clamped);
      onWidthChange?.(clamped);
      if (collapsible) {
        setIsCollapsed(next < collapsedSize);
      }
    },
    [autoSaveId, collapsedSize, collapsible, maxWidth, minWidth, onWidthChange],
  );

  const collapse = useCallback(() => setIsCollapsed(true), []);
  const expand = useCallback(() => setIsCollapsed(false), []);
  const setCollapsed = useCallback((next: boolean) => setIsCollapsed(next), []);

  const handleProps = useMemo(
    () => ({
      direction: 'horizontal' as const,
      value: width,
      minValue: minWidth,
      maxValue: maxWidth,
      onChange: resize,
      onCollapse: collapsible ? collapse : undefined,
      isCollapsed,
    }),
    [collapse, collapsible, isCollapsed, maxWidth, minWidth, resize, width],
  );

  return { width, isCollapsed, setCollapsed, collapse, expand, resize, handleProps };
}
