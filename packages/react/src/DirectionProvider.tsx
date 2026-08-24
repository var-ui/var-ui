import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { I18nProvider } from 'react-aria-components';
import { useIsomorphicLayoutEffect } from './color-mode';
import { type Direction, resolveDirection, resolveI18nProviderLocale } from './direction';

export type { Direction };

export type DirectionProviderProps = {
  direction?: Direction;
  locale?: string;
  applyToDocument?: boolean;
  children: ReactNode;
};

type DirectionContextValue = { direction: Direction; isRtl: boolean };

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function useDirection(): DirectionContextValue {
  return useContext(DirectionContext) ?? { direction: 'ltr', isRtl: false };
}

export function DirectionProvider({
  direction: directionProp,
  locale,
  applyToDocument = false,
  children,
}: DirectionProviderProps): JSX.Element {
  const direction = resolveDirection({ direction: directionProp, locale });
  const value = useMemo<DirectionContextValue>(
    () => ({ direction, isRtl: direction === 'rtl' }),
    [direction],
  );
  const i18nLocale = resolveI18nProviderLocale({ direction, locale });

  useIsomorphicLayoutEffect(() => {
    if (!applyToDocument || typeof document === 'undefined') return;
    const root = document.documentElement;
    const previousDir = root.getAttribute('dir');
    const previousLang = root.getAttribute('lang');
    root.setAttribute('dir', direction);
    if (locale) root.setAttribute('lang', locale);
    return () => {
      if (previousDir == null) root.removeAttribute('dir');
      else root.setAttribute('dir', previousDir);
      if (locale) {
        if (previousLang == null) root.removeAttribute('lang');
        else root.setAttribute('lang', previousLang);
      }
    };
  }, [applyToDocument, direction, locale]);

  let content: ReactNode = children;
  if (!applyToDocument) {
    content = (
      <div dir={direction} lang={locale} style={{ display: 'contents' }}>
        {children}
      </div>
    );
  }
  if (i18nLocale) {
    content = <I18nProvider locale={i18nLocale}>{content}</I18nProvider>;
  }

  return <DirectionContext.Provider value={value}>{content}</DirectionContext.Provider>;
}
