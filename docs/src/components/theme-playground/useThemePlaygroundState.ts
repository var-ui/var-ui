import { useSyncExternalStore } from 'react';
import {
  getThemePlaygroundState,
  setThemePlaygroundState,
  subscribeThemePlayground,
} from './themePlaygroundStore';
import type { ThemePlaygroundState } from './themePlaygroundState';

export function useThemePlaygroundState(): {
  state: ThemePlaygroundState;
  patchState: (patch: Partial<ThemePlaygroundState>) => void;
} {
  const state = useSyncExternalStore(subscribeThemePlayground, getThemePlaygroundState, () =>
    getThemePlaygroundState(),
  );

  return {
    state,
    patchState: (patch) => setThemePlaygroundState(patch),
  };
}
