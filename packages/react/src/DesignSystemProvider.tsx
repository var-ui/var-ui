import type { JSX, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  ColorModeContext,
  type ColorMode,
  type ColorModeContextValue,
  readStoredColorMode,
  useIsomorphicLayoutEffect,
  useResolvedColorMode,
} from './color-mode';
import { defaultTheme as baseTheme } from './tokens';

export type DesignSystemProviderProps = {
  children: ReactNode;
  defaultColorMode?: ColorMode;
  colorMode?: ColorMode;
  onColorModeChange?: (colorMode: ColorMode) => void;
  customThemeClassName?: string;
  /** Prefer this over `customThemeClassName` when you have a `createDesignTheme` return. */
  customTheme?: { className: string };
  /**
   * When true, apply the design theme class, `data-mode`, and `color-scheme` on
   * `document.documentElement` instead of a wrapper, so page chrome (`body` background /
   * text from `globalBody`) and portals resolve the same color mode as the app.
   * @default false
   */
  applyToDocument?: boolean;
  /**
   * When set (and the provider is uncontrolled), persists the color mode to `localStorage` under
   * this key: read as the initial color mode on mount, written on every `setColorMode` call.
   */
  storageKey?: string;
};

export function DesignSystemProvider({
  children,
  defaultColorMode = 'light',
  colorMode: controlledColorMode,
  onColorModeChange,
  customThemeClassName,
  customTheme,
  applyToDocument = false,
  storageKey,
}: DesignSystemProviderProps): JSX.Element {
  // Starts at defaultColorMode on every render pass, matching what SSR renders — corrected from
  // localStorage in the layout effect below (client-only, before paint) rather than read here,
  // since reading it synchronously would diverge from the server render and trip React's
  // hydration-mismatch diffing.
  const [uncontrolledColorMode, setUncontrolledColorMode] = useState<ColorMode>(defaultColorMode);
  // When persistence is enabled, stay "not ready" until the layout effect has applied storage
  // so consumers can avoid painting `defaultColorMode` for a frame.
  const [colorModeReady, setColorModeReady] = useState(
    () => controlledColorMode !== undefined || !storageKey,
  );

  useIsomorphicLayoutEffect(() => {
    if (controlledColorMode !== undefined) {
      setColorModeReady(true);
      return;
    }
    if (!storageKey) {
      setColorModeReady(true);
      return;
    }
    const stored = readStoredColorMode(storageKey);
    if (stored !== undefined) {
      setUncontrolledColorMode(stored);
    }
    setColorModeReady(true);
    // Runs once per mount (and again only if storageKey itself changes) — deliberately excludes
    // controlledColorMode/defaultColorMode so it doesn't fight later setColorMode calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const colorMode = controlledColorMode ?? uncontrolledColorMode;
  const resolvedColorMode = useResolvedColorMode(colorMode);
  const setColorMode = (nextColorMode: ColorMode): void => {
    if (controlledColorMode === undefined) {
      setUncontrolledColorMode(nextColorMode);
      if (storageKey && typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, nextColorMode);
      }
    }
    onColorModeChange?.(nextColorMode);
  };

  const value = useMemo<ColorModeContextValue>(
    () => ({
      colorMode,
      resolvedColorMode,
      setColorMode,
      toggleColorMode: () =>
        setColorMode(colorMode === 'light' ? 'dark' : colorMode === 'dark' ? 'system' : 'light'),
      colorModeReady,
    }),
    [colorMode, resolvedColorMode, colorModeReady],
  );

  const themeClassName = customTheme?.className ?? customThemeClassName ?? baseTheme.className;

  useIsomorphicLayoutEffect(() => {
    if (!applyToDocument || typeof document === 'undefined') return;
    const root = document.documentElement;

    // When `storageKey` is set, React state still starts at `defaultColorMode` for SSR
    // hydration safety. Reading storage here (before writing the document) avoids stomping
    // `getColorModeInitScript`'s pre-paint attrs with that default for one frame.
    const stored =
      controlledColorMode === undefined && storageKey ? readStoredColorMode(storageKey) : undefined;
    const modeForDocument = stored ?? colorMode;
    const colorScheme =
      modeForDocument === 'system'
        ? ''
        : modeForDocument === colorMode
          ? resolvedColorMode
          : modeForDocument;

    root.classList.add(themeClassName);
    root.setAttribute('data-mode', modeForDocument);
    root.style.colorScheme = colorScheme;

    return () => {
      // Only remove the theme class we manage. Leave `data-mode` / `color-scheme` in place so
      // Strict Mode remounts (and the init script's correct attrs) aren't cleared mid-flash.
      root.classList.remove(themeClassName);
    };
  }, [
    applyToDocument,
    themeClassName,
    colorMode,
    resolvedColorMode,
    storageKey,
    controlledColorMode,
  ]);

  if (applyToDocument) {
    return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
  }

  return (
    <ColorModeContext.Provider value={value}>
      <div className={themeClassName} data-mode={colorMode} style={{ display: 'contents' }}>
        {children}
      </div>
    </ColorModeContext.Provider>
  );
}
