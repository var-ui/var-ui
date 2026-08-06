import { DEFAULT_THEME_PLAYGROUND_STATE, type ThemePlaygroundState } from './themePlaygroundState';

const STORAGE_KEY = 'theme-playground-draft';

type Listener = () => void;

let state: ThemePlaygroundState = loadStoredState();
const listeners = new Set<Listener>();

function loadStoredState(): ThemePlaygroundState {
  if (typeof window === 'undefined') return DEFAULT_THEME_PLAYGROUND_STATE;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_PLAYGROUND_STATE;
    const parsed = JSON.parse(raw) as ThemePlaygroundState;
    return { ...DEFAULT_THEME_PLAYGROUND_STATE, ...parsed, colors: parsed.colors ?? {} };
  } catch {
    return DEFAULT_THEME_PLAYGROUND_STATE;
  }
}

function persistState(next: ThemePlaygroundState): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getThemePlaygroundState(): ThemePlaygroundState {
  return state;
}

export function setThemePlaygroundState(
  patch: Partial<ThemePlaygroundState> | ((prev: ThemePlaygroundState) => ThemePlaygroundState),
): void {
  state =
    typeof patch === 'function'
      ? patch(state)
      : {
          ...state,
          ...patch,
          colors: patch.colors ?? state.colors,
          typography: patch.typography ?? state.typography,
        };
  persistState(state);
  notify();
}

export function subscribeThemePlayground(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetThemePlaygroundStore(): void {
  state = DEFAULT_THEME_PLAYGROUND_STATE;
  persistState(state);
  notify();
}
