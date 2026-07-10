import { describe, expect, it, vi } from 'vite-plus/test';
import { act, render, renderHook, screen } from '@testing-library/react';
import { DesignSystemProvider, getThemeInitScript, useDesignSystemTheme } from './theme';

function stubMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  let changeListener: ((event: { matches: boolean }) => void) | null = null;
  const mql = {
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_event: string, listener: (event: { matches: boolean }) => void) => {
      changeListener = listener;
    },
    removeEventListener: () => {
      changeListener = null;
    },
  };
  vi.stubGlobal('matchMedia', () => mql);
  return {
    setMatches(next: boolean) {
      matches = next;
      changeListener?.({ matches: next });
    },
  };
}

describe('useDesignSystemTheme resolvedTheme', () => {
  it('resolves system to dark when the OS prefers dark', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="system">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
    vi.unstubAllGlobals();
  });

  it('resolves system to light when the OS prefers light', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="system">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.resolvedTheme).toBe('light');
    vi.unstubAllGlobals();
  });

  it('resolvedTheme matches an explicit light/dark preference regardless of OS', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="light">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.resolvedTheme).toBe('light');
    vi.unstubAllGlobals();
  });

  it('updates resolvedTheme live when the OS preference changes while theme is system', () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="system">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.resolvedTheme).toBe('light');
    act(() => {
      media.setMatches(true);
    });
    expect(result.current.resolvedTheme).toBe('dark');
    vi.unstubAllGlobals();
  });
});

describe('useDesignSystemTheme storageKey persistence', () => {
  it('reads the initial theme from localStorage when storageKey is set', () => {
    localStorage.setItem('test-color-mode', 'dark');
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="light" storageKey="test-color-mode">
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(result.current.theme).toBe('dark');
    localStorage.clear();
  });

  it('falls back to defaultTheme when localStorage has nothing stored', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="system" storageKey="test-color-mode">
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(result.current.theme).toBe('system');
  });

  it('writes to localStorage when setTheme is called', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="light" storageKey="test-color-mode">
          {children}
        </DesignSystemProvider>
      ),
    });
    act(() => {
      result.current.setTheme('dark');
    });
    expect(localStorage.getItem('test-color-mode')).toBe('dark');
    localStorage.clear();
  });

  it('does not touch localStorage when storageKey is omitted', () => {
    localStorage.clear();
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="light">{children}</DesignSystemProvider>
      ),
    });
    act(() => {
      result.current.setTheme('dark');
    });
    expect(localStorage.getItem('test-color-mode')).toBeNull();
  });
});

describe('useDesignSystemTheme omitWrapperThemeSurface html sync', () => {
  it('sets data-mode and color-scheme on document.documentElement, not a wrapper div', () => {
    render(
      <DesignSystemProvider defaultTheme="dark" omitWrapperThemeSurface>
        <span>content</span>
      </DesignSystemProvider>,
    );
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.style.colorScheme = '';
  });

  it('clears the inline color-scheme override for system so the CSS default governs', () => {
    render(
      <DesignSystemProvider defaultTheme="system" omitWrapperThemeSurface>
        <span>content</span>
      </DesignSystemProvider>,
    );
    expect(document.documentElement.getAttribute('data-mode')).toBe('system');
    expect(document.documentElement.style.colorScheme).toBe('');
    document.documentElement.removeAttribute('data-mode');
  });

  it('updates document.documentElement when theme changes after mount', () => {
    const { result } = renderHook(() => useDesignSystemTheme(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultTheme="light" omitWrapperThemeSurface>
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
    act(() => {
      result.current.setTheme('dark');
    });
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.style.colorScheme = '';
  });
});

describe('getThemeInitScript', () => {
  function run(storageKey: string, defaultTheme: 'light' | 'dark' | 'system') {
    const script = getThemeInitScript({ storageKey, defaultTheme });
    // eslint-disable-next-line no-new-func
    new Function(script)();
  }

  function cleanup() {
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.style.colorScheme = '';
    localStorage.clear();
    vi.unstubAllGlobals();
  }

  it('applies a stored dark preference', () => {
    localStorage.setItem('test-init', 'dark');
    run('test-init', 'system');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    cleanup();
  });

  it('applies a stored light preference', () => {
    localStorage.setItem('test-init', 'light');
    run('test-init', 'system');
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    cleanup();
  });

  it('resolves a stored system preference against the OS via matchMedia', () => {
    localStorage.setItem('test-init', 'system');
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    run('test-init', 'light');
    expect(document.documentElement.getAttribute('data-mode')).toBe('system');
    expect(document.documentElement.style.colorScheme).toBe('');
    cleanup();
  });

  it('falls back to defaultTheme when nothing is stored', () => {
    run('test-init', 'system');
    expect(document.documentElement.getAttribute('data-mode')).toBe('system');
    cleanup();
  });

  it('falls back to defaultTheme when the stored value is invalid', () => {
    localStorage.setItem('test-init', 'not-a-theme');
    run('test-init', 'dark');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    cleanup();
  });
});
