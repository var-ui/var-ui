import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { defaultTheme as baseTheme } from './tokens';

type ThemeName = 'light' | 'dark' | 'system';
type ResolvedThemeName = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeName;
  resolvedTheme: ResolvedThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

/**
 * `useLayoutEffect` on the client, `useEffect` on the server (where layout effects warn and are
 * no-ops). Used here so client-only corrections (localStorage, matchMedia) land before the
 * browser paints — avoiding both a visible flash and a hydration-mismatch warning, since the
 * correction lands after React's hydration diff already matched the server's deterministic output.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function hasMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function useResolvedTheme(theme: ThemeName): ResolvedThemeName {
  // Starts false (matching what SSR would compute) on every environment; corrected client-side
  // in the layout effect below before paint, never read synchronously from matchMedia here.
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (theme !== 'system' || !hasMatchMedia()) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: { matches: boolean }) => setSystemPrefersDark(event.matches);
    setSystemPrefersDark(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [theme]);

  if (theme === 'system') return systemPrefersDark ? 'dark' : 'light';
  return theme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type DesignSystemProviderProps = {
  children: ReactNode;
  defaultTheme?: ThemeName;
  theme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  customThemeClassName?: string;
  /** Prefer this over `customThemeClassName` when you have a `createDesignTheme` return. */
  customTheme?: { className: string };
  /**
   * When true, skip applying `defaultTheme` / `data-mode` on the wrapper — use when the theme
   * surface already lives on `document.documentElement` (docs-style appearance bootstrap).
   */
  omitWrapperThemeSurface?: boolean;
  /**
   * When set (and the provider is uncontrolled), persists the theme to `localStorage` under
   * this key: read as the initial theme on mount, written on every `setTheme` call.
   */
  storageKey?: string;
};

const VALID_THEMES: ThemeName[] = ['light', 'dark', 'system'];

function readStoredTheme(storageKey: string | undefined): ThemeName | undefined {
  if (!storageKey || typeof window === 'undefined') return undefined;
  const stored = window.localStorage.getItem(storageKey);
  return VALID_THEMES.includes(stored as ThemeName) ? (stored as ThemeName) : undefined;
}

export function DesignSystemProvider({
  children,
  defaultTheme = 'light',
  theme: controlledTheme,
  onThemeChange,
  customThemeClassName,
  customTheme,
  omitWrapperThemeSurface = false,
  storageKey,
}: DesignSystemProviderProps): JSX.Element {
  // Starts at defaultTheme on every render pass, matching what SSR renders — corrected from
  // localStorage in the layout effect below (client-only, before paint) rather than read here,
  // since reading it synchronously would diverge from the server render and trip React's
  // hydration-mismatch diffing.
  const [uncontrolledTheme, setUncontrolledTheme] = useState<ThemeName>(defaultTheme);

  useIsomorphicLayoutEffect(() => {
    if (controlledTheme !== undefined || !storageKey) return;
    const stored = readStoredTheme(storageKey);
    if (stored !== undefined) {
      setUncontrolledTheme(stored);
    }
    // Runs once per mount (and again only if storageKey itself changes) — deliberately excludes
    // controlledTheme/defaultTheme so it doesn't fight later setTheme calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const theme = controlledTheme ?? uncontrolledTheme;
  const resolvedTheme = useResolvedTheme(theme);
  const setTheme = (nextTheme: ThemeName): void => {
    if (controlledTheme === undefined) {
      setUncontrolledTheme(nextTheme);
      if (storageKey && typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, nextTheme);
      }
    }
    onThemeChange?.(nextTheme);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () =>
        setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'),
    }),
    [theme, resolvedTheme],
  );

  const dataMode = theme;

  useIsomorphicLayoutEffect(() => {
    if (!omitWrapperThemeSurface || typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-mode', theme);
    document.documentElement.style.colorScheme = theme === 'system' ? '' : resolvedTheme;
  }, [omitWrapperThemeSurface, theme, resolvedTheme]);

  const resolvedCustomClassName = customTheme?.className ?? customThemeClassName;

  const surfaceClassName = omitWrapperThemeSurface
    ? resolvedCustomClassName
    : (resolvedCustomClassName ?? baseTheme.className);

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={surfaceClassName}
        data-mode={omitWrapperThemeSurface ? undefined : dataMode}
        style={{ display: 'contents' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export type GetThemeInitScriptOptions = {
  storageKey: string;
  defaultTheme: ThemeName;
};

/**
 * Returns an inline `<script>` body that reproduces {@link DesignSystemProvider}'s theme
 * resolution synchronously, before first paint. Render it as the first child of `<head>` in an
 * SSR app (before any other head content) to eliminate flash-of-wrong-theme on load.
 *
 * Built as a plain string template rather than via `Function.prototype.toString()` — a real
 * function's stringified source isn't guaranteed byte-identical between an app's SSR and client
 * bundles (different transform passes), which caused a hydration mismatch on this script's
 * `dangerouslySetInnerHTML` content. Keep this logic in sync with {@link useResolvedTheme} and
 * the `omitWrapperThemeSurface` effect below by hand — they intentionally implement the same
 * light/dark/system resolution.
 */
export function getThemeInitScript({
  storageKey,
  defaultTheme,
}: GetThemeInitScriptOptions): string {
  var storageKeyJson = JSON.stringify(storageKey);
  var defaultThemeJson = JSON.stringify(defaultTheme);
  return (
    '(function(){' +
    'var VALID=["light","dark","system"];' +
    'var stored=null;' +
    'try{stored=window.localStorage.getItem(' +
    storageKeyJson +
    ')}catch(e){}' +
    'var theme=VALID.indexOf(stored)!==-1?stored:' +
    defaultThemeJson +
    ';' +
    'var resolved=theme;' +
    'if(theme==="system"){' +
    'var prefersDark=false;' +
    'try{prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}' +
    'resolved=prefersDark?"dark":"light";' +
    '}' +
    'document.documentElement.setAttribute("data-mode",theme);' +
    'document.documentElement.style.colorScheme=theme==="system"?"":resolved;' +
    '})();'
  );
}

export function useDesignSystemTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDesignSystemTheme must be used inside DesignSystemProvider');
  }
  return context;
}
