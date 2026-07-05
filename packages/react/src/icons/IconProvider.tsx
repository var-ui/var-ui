import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { IconName } from '@var-ui/core';

export type IconRegistry = Partial<Record<IconName, ReactNode>>;

const IconContext = createContext<IconRegistry>({});

export type IconProviderProps = {
  /** Partial maps are fine — unmapped names render the shared empty fallback. */
  icons: IconRegistry;
  children: ReactNode;
};

/**
 * The only way glyphs reach var-ui components. Nest providers to shallow-merge
 * overrides over the parent registry for a subtree.
 *
 * ```tsx
 * import { defaultIcons } from '@var-ui/icons';
 * <IconProvider icons={defaultIcons}>{app}</IconProvider>
 * ```
 */
export function IconProvider({ icons, children }: IconProviderProps): JSX.Element {
  const parent = useContext(IconContext);
  const merged = useMemo<IconRegistry>(() => ({ ...parent, ...icons }), [parent, icons]);
  return <IconContext.Provider value={merged}>{children}</IconContext.Provider>;
}

/** Read the merged icon registry from context. */
export function useIcons(): IconRegistry {
  return useContext(IconContext);
}
