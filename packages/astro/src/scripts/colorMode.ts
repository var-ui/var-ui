export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

const VALID: ReadonlySet<string> = new Set(['light', 'dark', 'system']);

export function readStoredColorMode(storageKey: string): ColorMode | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(storageKey);
  return raw && VALID.has(raw) ? (raw as ColorMode) : null;
}

export function resolveColorMode(mode: ColorMode): ResolvedColorMode {
  if (mode === 'light' || mode === 'dark') return mode;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function applyColorModeToDocument(mode: ColorMode): void {
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-mode');
  } else {
    document.documentElement.setAttribute('data-mode', mode);
  }
}

export function persistColorMode(storageKey: string, mode: ColorMode): void {
  localStorage.setItem(storageKey, mode);
}

export function setColorMode(mode: ColorMode, storageKey = 'theme-mode'): void {
  persistColorMode(storageKey, mode);
  applyColorModeToDocument(mode);
  syncColorModeToggles(storageKey);
}

/** Boot path used by ThemeScript (class + data-mode). */
export function bootTheme(themeClass: string, storageKey = 'theme-mode'): ColorMode {
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = readStoredColorMode(storageKey);
  const mode: ColorMode = stored ?? (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.add(themeClass);
  applyColorModeToDocument(mode === 'system' ? 'system' : mode);
  if (stored === 'system') {
    applyColorModeToDocument('system');
  } else if (stored === 'light' || stored === 'dark') {
    applyColorModeToDocument(stored);
  } else {
    applyColorModeToDocument(prefersDark ? 'dark' : 'light');
  }
  return mode;
}

function readEffectiveColorMode(storageKey: string): ColorMode {
  const stored = readStoredColorMode(storageKey);
  if (stored) return stored;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function syncToggleRoot(root: Element, storageKey: string): void {
  const includeSystem = root.getAttribute('data-include-system') === 'true';
  const mode = readEffectiveColorMode(storageKey);
  const selected: ColorMode | ResolvedColorMode =
    includeSystem || mode !== 'system' ? mode : resolveColorMode(mode);

  root.querySelectorAll('[data-color-mode]').forEach((button) => {
    const buttonMode = button.getAttribute('data-color-mode');
    const pressed = buttonMode === selected;
    button.setAttribute('aria-pressed', String(pressed));
    if (pressed) {
      button.setAttribute('data-selected', '');
    } else {
      button.removeAttribute('data-selected');
    }
  });
}

function syncColorModeToggles(storageKey?: string): void {
  document.querySelectorAll('[data-var-ui-color-mode-toggle]').forEach((root) => {
    const key = storageKey ?? root.getAttribute('data-storage-key') ?? 'theme-mode';
    syncToggleRoot(root, key);
  });
}

export function initColorModeToggle(): void {
  document.querySelectorAll('[data-var-ui-color-mode-toggle]').forEach((root) => {
    if (root.hasAttribute('data-var-ui-color-mode-initialized')) return;
    root.setAttribute('data-var-ui-color-mode-initialized', '');

    const storageKey = root.getAttribute('data-storage-key') ?? 'theme-mode';

    syncToggleRoot(root, storageKey);

    root.querySelectorAll('[data-color-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.getAttribute('data-color-mode');
        if (mode === 'light' || mode === 'dark' || mode === 'system') {
          setColorMode(mode, storageKey);
        }
      });
    });
  });
}
