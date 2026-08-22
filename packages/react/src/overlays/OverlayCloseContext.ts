import { createContext, useContext } from 'react';

export const OverlayCloseContext = createContext<(() => void) | null>(null);

export function useOverlayClose(): () => void {
  const close = useContext(OverlayCloseContext);

  if (close === null) {
    throw new Error('Close must be rendered inside a Popup');
  }

  return close;
}
