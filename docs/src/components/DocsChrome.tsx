'use client';

import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  AppShell,
  HStack,
  Link,
  MobileNav,
  Outline,
  SideNav,
  TopNav,
  useMediaQuery,
  useMobileNav,
} from '@var-ui/react';
import type { ReactNode } from 'react';
import { githubUrl, sidebar, topNav } from '@/data/navigation';
import type { DocHeading } from '@/lib/extract-headings';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { DocsSearch } from './DocsSearch';

/** Matches AppShell `mobileBreakpoint="md"`. */
const APP_SHELL_MD_QUERY = '(max-width: 768px)';

type SidebarSection = (typeof sidebar)[keyof typeof sidebar];
type NavigateFn = ReturnType<typeof useNavigate>;

function getSidebarSection(pathname: string): SidebarSection {
  if (pathname.startsWith('/components')) return sidebar['/components'];
  if (pathname.startsWith('/theming')) return sidebar['/theming'];
  return sidebar['/docs'];
}

function isGroupedSidebar(section: SidebarSection): section is (typeof sidebar)['/components'] {
  return section.length > 0 && 'items' in section[0];
}

function isNavActive(pathname: string, item: { link: string; match?: string }) {
  const match = item.match ?? item.link;
  return pathname === match || pathname.startsWith(`${match}/`);
}

function isSidebarLinkActive(pathname: string, link: string) {
  return pathname === link;
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      focusable="false"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function DocsEndContent({ showMobileToggle }: { showMobileToggle: boolean }) {
  const isMobile = useMediaQuery(APP_SHELL_MD_QUERY);
  return (
    <HStack align="center" gap="xs">
      <DocsSearch />
      {showMobileToggle && isMobile ? <MobileNav.Toggle /> : null}
      <ColorModeSwitcher />
      <Link
        aria-label="View source on GitHub"
        href={githubUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <GitHubIcon />
      </Link>
    </HStack>
  );
}

function renderSideNav(pathname: string, navigate: NavigateFn, onNavigate?: () => void) {
  const section = getSidebarSection(pathname);
  const go = (to: string) => {
    void navigate({ to });
    onNavigate?.();
  };

  if (!isGroupedSidebar(section)) {
    return (
      <SideNav.Section>
        {section.map((item) => (
          <SideNav.Item
            key={item.link}
            isSelected={isSidebarLinkActive(pathname, item.link)}
            label={item.text}
            onPress={() => go(item.link)}
          />
        ))}
      </SideNav.Section>
    );
  }

  return section.map((group) => (
    <SideNav.Section key={group.text} title={group.text}>
      {group.items.map((item) => (
        <SideNav.Item
          key={item.link}
          isSelected={isSidebarLinkActive(pathname, item.link)}
          label={item.text}
          onPress={() => go(item.link)}
        />
      ))}
    </SideNav.Section>
  ));
}

function DocsMobileSideNav({ pathname }: { pathname: string }) {
  const navigate = useNavigate();
  const mobileNav = useMobileNav();
  return <>{renderSideNav(pathname, navigate, () => mobileNav?.close())}</>;
}

function DocsTopNavItems({ pathname, navigate }: { pathname: string; navigate: NavigateFn }) {
  return (
    <>
      {topNav.map((item) => (
        <TopNav.Item
          key={item.link}
          isSelected={isNavActive(pathname, item)}
          label={item.text}
          onPress={() => void navigate({ to: item.link })}
        />
      ))}
    </>
  );
}

export function DocsChrome({
  children,
  headings = [],
}: {
  children: ReactNode;
  headings?: DocHeading[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <AppShell
      variant="wash"
      height="fill"
      mobileBreakpoint="md"
      topNav={
        <TopNav
          heading={<TopNav.Heading heading="var(--ui)" headingHref="/" />}
          endContent={<DocsEndContent showMobileToggle />}
        >
          <DocsTopNavItems navigate={navigate} pathname={pathname} />
        </TopNav>
      }
      sideNav={<SideNav label="Docs">{renderSideNav(pathname, navigate)}</SideNav>}
      aside={headings.length > 0 ? <Outline items={headings} /> : undefined}
      mobileNav={
        <MobileNav header="Menu">
          <DocsMobileSideNav pathname={pathname} />
        </MobileNav>
      }
    >
      {children}
    </AppShell>
  );
}

/** Homepage chrome: TopNav only (no side nav / outline). */
export function DocsHomeChrome({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <AppShell
      variant="wash"
      height="fill"
      mobileBreakpoint="none"
      topNav={
        <TopNav
          heading={<TopNav.Heading heading="var(--ui)" headingHref="/" />}
          endContent={<DocsEndContent showMobileToggle={false} />}
        >
          <DocsTopNavItems navigate={navigate} pathname={pathname} />
        </TopNav>
      }
    >
      {children}
    </AppShell>
  );
}
