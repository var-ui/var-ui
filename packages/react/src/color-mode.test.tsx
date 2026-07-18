import { describe, expect, it, vi } from 'vite-plus/test';
import { act, render, renderHook } from '@testing-library/react';
import { DesignSystemProvider } from './DesignSystemProvider';
import { getColorModeInitScript, useColorMode } from './color-mode';

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

describe('useColorMode resolvedColorMode', () => {
  it('resolves system to dark when the OS prefers dark', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="system">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.colorMode).toBe('system');
    expect(result.current.resolvedColorMode).toBe('dark');
    vi.unstubAllGlobals();
  });

  it('resolves system to light when the OS prefers light', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="system">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.resolvedColorMode).toBe('light');
    vi.unstubAllGlobals();
  });

  it('resolvedColorMode matches an explicit light/dark preference regardless of OS', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="light">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.resolvedColorMode).toBe('light');
    vi.unstubAllGlobals();
  });

  it('updates resolvedColorMode live when the OS preference changes while colorMode is system', () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="system">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.resolvedColorMode).toBe('light');
    act(() => {
      media.setMatches(true);
    });
    expect(result.current.resolvedColorMode).toBe('dark');
    vi.unstubAllGlobals();
  });
});

describe('useColorMode storageKey persistence', () => {
  it('reads the initial color mode from localStorage when storageKey is set', () => {
    localStorage.setItem('test-color-mode', 'dark');
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="light" storageKey="test-color-mode">
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(result.current.colorMode).toBe('dark');
    localStorage.clear();
  });

  it('falls back to defaultColorMode when localStorage has nothing stored', () => {
    localStorage.clear();
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="system" storageKey="test-color-mode">
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(result.current.colorMode).toBe('system');
  });

  it('writes to localStorage when setColorMode is called', () => {
    localStorage.clear();
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="light" storageKey="test-color-mode">
          {children}
        </DesignSystemProvider>
      ),
    });
    act(() => {
      result.current.setColorMode('dark');
    });
    expect(localStorage.getItem('test-color-mode')).toBe('dark');
    localStorage.clear();
  });

  it('does not touch localStorage when storageKey is omitted', () => {
    localStorage.clear();
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="light">{children}</DesignSystemProvider>
      ),
    });
    act(() => {
      result.current.setColorMode('dark');
    });
    expect(localStorage.getItem('test-color-mode')).toBeNull();
  });

  it('applies customTheme className instead of the default theme class', () => {
    const { container } = render(
      <DesignSystemProvider defaultColorMode="light" customTheme={{ className: 'theme-fixture' }}>
        <span>child</span>
      </DesignSystemProvider>,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('theme-fixture');
    expect(wrapper?.className).not.toContain('theme-var-ui-default');
  });
});

describe('useColorMode applyToDocument html sync', () => {
  function cleanupDocumentTheme() {
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.style.colorScheme = '';
    document.documentElement.className = '';
  }

  it('sets theme class, data-mode, and color-scheme on document.documentElement', () => {
    render(
      <DesignSystemProvider defaultColorMode="dark" applyToDocument>
        <span>content</span>
      </DesignSystemProvider>,
    );
    expect(document.documentElement.className).toContain('theme-');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    cleanupDocumentTheme();
  });

  it('clears the inline color-scheme override for system so the CSS default governs', () => {
    render(
      <DesignSystemProvider defaultColorMode="system" applyToDocument>
        <span>content</span>
      </DesignSystemProvider>,
    );
    expect(document.documentElement.getAttribute('data-mode')).toBe('system');
    expect(document.documentElement.style.colorScheme).toBe('');
    cleanupDocumentTheme();
  });

  it('updates document.documentElement when color mode changes after mount', () => {
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider defaultColorMode="light" applyToDocument>
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
    act(() => {
      result.current.setColorMode('dark');
    });
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    cleanupDocumentTheme();
  });

  it('does not render a themed wrapper when applyToDocument is set', () => {
    const { container } = render(
      <DesignSystemProvider defaultColorMode="light" applyToDocument>
        <span>child</span>
      </DesignSystemProvider>,
    );
    expect(container.querySelector('[data-mode]')).toBeNull();
    expect(container.textContent).toBe('child');
    cleanupDocumentTheme();
  });

  it('does not stomp init-script data-mode with defaultColorMode before storage hydrates', () => {
    localStorage.setItem('test-color-mode', 'dark');
    document.documentElement.setAttribute('data-mode', 'dark');
    document.documentElement.style.colorScheme = 'dark';
    const setAttribute = vi.spyOn(document.documentElement, 'setAttribute');

    render(
      <DesignSystemProvider applyToDocument defaultColorMode="system" storageKey="test-color-mode">
        <span>content</span>
      </DesignSystemProvider>,
    );

    const dataModeWrites = setAttribute.mock.calls
      .filter(([name]) => name === 'data-mode')
      .map(([, value]) => value);
    expect(dataModeWrites.length).toBeGreaterThan(0);
    expect(dataModeWrites.every((value) => value === 'dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');

    setAttribute.mockRestore();
    localStorage.clear();
    cleanupDocumentTheme();
  });
});

describe('getColorModeInitScript', () => {
  function run(storageKey: string, defaultColorMode: 'light' | 'dark' | 'system') {
    const script = getColorModeInitScript({ storageKey, defaultColorMode });
    // eslint-disable-next-line no-new-func
    new Function(script)();
  }

  function cleanup() {
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.style.colorScheme = '';
    document.documentElement.className = '';
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

  it('falls back to defaultColorMode when nothing is stored', () => {
    run('test-init', 'system');
    expect(document.documentElement.getAttribute('data-mode')).toBe('system');
    cleanup();
  });

  it('falls back to defaultColorMode when the stored value is invalid', () => {
    localStorage.setItem('test-init', 'not-a-color-mode');
    run('test-init', 'dark');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    cleanup();
  });

  it('adds themeClassName to document.documentElement when provided', () => {
    const script = getColorModeInitScript({
      storageKey: 'test-init',
      defaultColorMode: 'light',
      themeClassName: 'theme-fixture',
    });
    // eslint-disable-next-line no-new-func
    new Function(script)();
    expect(document.documentElement.classList.contains('theme-fixture')).toBe(true);
    cleanup();
  });
});
