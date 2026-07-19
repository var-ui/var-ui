import type { CSSProperties, JSX, ReactNode } from 'react';
import { appShell, designTokens as t } from '@var-ui/core';
import { useMediaQuery } from '../hooks';
import { MobileNavProvider } from './MobileNav';
import { recipeProps } from './utils';

/** `id` of the `<main>` landmark — target of the skip-to-content link. */
export const APP_SHELL_MAIN_ID = 'var-ui-app-shell-main';

const MOBILE_BREAKPOINT_QUERIES = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  none: 'not all',
} as const;

export type AppShellProps = {
  /** Rendered inside the `<main>` landmark. */
  children?: ReactNode;
  /** Rendered in the top bar zone, e.g. a `TopNav`. */
  topNav?: ReactNode;
  /** Rendered in the persistent side column above `mobileBreakpoint`; hidden below it. */
  sideNav?: ReactNode;
  /**
   * A `MobileNav` drawer. Stays mounted at every width — its own `isOpen` (or the
   * shared `MobileNavProvider`) controls visibility. Consumers place a
   * `MobileNav.Toggle` in `topNav`'s `endContent` themselves; `AppShell` doesn't
   * inject one.
   */
  mobileNav?: ReactNode;
  /** Full-width banner above the top nav / content frame. */
  banner?: ReactNode;
  /** Optional right rail (e.g. an `Outline`). Hidden below `mobileBreakpoint`. */
  aside?: ReactNode;
  /** @default 'fill' */
  height?: 'fill' | 'auto';
  /** @default 'elevated' */
  variant?: 'wash' | 'surface' | 'section' | 'elevated';
  /** Main content padding. Values matching a `designTokens.space` step resolve to that token; anything else is treated as raw px. */
  contentPadding?: number;
  /** Viewport width below which `sideNav` hides and `data-mobile` is set on the root. `'none'` never goes mobile. @default 'md' */
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
};

function resolveContentPadding(padding: number | undefined): string | undefined {
  if (padding == null) return undefined;
  const space = t.space as Record<number, string>;
  return space[padding] ?? `${padding}px`;
}

/**
 * Application chrome: optional banner, top nav, side nav, main content, and
 * aside rail in a CSS grid layout, plus a skip-to-content link and the mobile
 * breakpoint that hides the persistent side nav and aside. Wraps its slots in
 * a `MobileNavProvider` so a `MobileNav` + `MobileNav.Toggle` placed anywhere
 * inside stay in sync — `AppShell` itself never renders a toggle.
 *
 * ```tsx
 * <AppShell
 *   topNav={<TopNav endContent={<MobileNav.Toggle />}>…</TopNav>}
 *   sideNav={<SideNav>…</SideNav>}
 *   mobileNav={<MobileNav header="Menu"><SideNav.Section>…</SideNav.Section></MobileNav>}
 *   aside={<Outline items={[…]} />}
 * >
 *   <p>Main content</p>
 * </AppShell>
 * ```
 */
export function AppShell({
  children,
  topNav,
  sideNav,
  mobileNav,
  banner,
  aside,
  height = 'fill',
  variant = 'elevated',
  contentPadding,
  mobileBreakpoint = 'md',
  className,
}: AppShellProps): JSX.Element {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERIES[mobileBreakpoint]);
  const s = appShell({ height, variant });
  const resolvedPadding = resolveContentPadding(contentPadding);
  const mainStyle = resolvedPadding
    ? ({ '--var-ui-app-shell-contentpadding': resolvedPadding } as CSSProperties)
    : undefined;

  return (
    <MobileNavProvider>
      <div
        {...recipeProps(s.root, className)}
        data-mobile={isMobile ? '' : undefined}
        data-aside={aside ? '' : undefined}
      >
        <a href={`#${APP_SHELL_MAIN_ID}`} {...recipeProps(s.skipLink)}>
          Skip to content
        </a>
        {banner ? <div {...recipeProps(s.banner)}>{banner}</div> : null}
        <div {...recipeProps(s.frame)}>
          {topNav ? <header {...recipeProps(s.topNav)}>{topNav}</header> : null}
          {sideNav ? <div {...recipeProps(s.sideNav)}>{sideNav}</div> : null}
          <main id={APP_SHELL_MAIN_ID} {...recipeProps(s.main)} style={mainStyle}>
            {children}
          </main>
          {aside ? <aside {...recipeProps(s.aside)}>{aside}</aside> : null}
        </div>
        {mobileNav}
      </div>
    </MobileNavProvider>
  );
}
