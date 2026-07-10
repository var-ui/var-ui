'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type MobileNavContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

export function useMobileNav() {
  const value = useContext(MobileNavContext);
  if (!value) {
    throw new Error('useMobileNav must be used within MobileNavProvider');
  }
  return value;
}

export function useOptionalMobileNav() {
  return useContext(MobileNavContext);
}
