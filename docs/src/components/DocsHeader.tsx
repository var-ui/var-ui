'use client';

import { HStack, Text, recipeClassName } from '@var-ui/react';
import { Link as RouterLink, useRouterState } from '@tanstack/react-router';
import { topNav } from '@/data/navigation';
import { docsShell } from '@/styles/docsShell';
import { DocsHeaderActions } from './DocsHeaderActions';
import { DocsMobileNavButton } from './DocsMobileNav';

function isNavActive(pathname: string, item: { link: string; match?: string }) {
  const match = item.match ?? item.link;
  return pathname === match || pathname.startsWith(`${match}/`);
}

type DocsHeaderProps = {
  showMobileNav?: boolean;
};

export function DocsHeader({ showMobileNav = false }: DocsHeaderProps) {
  const shell = docsShell();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className={recipeClassName(shell.header)}>
      <HStack
        align="center"
        className={recipeClassName(shell.headerInner)}
        gap="lg"
        justify="between"
      >
        <HStack align="center" gap="lg">
          {showMobileNav ? <DocsMobileNavButton /> : null}

          <RouterLink aria-label="Var UI home" className={recipeClassName(shell.headerLogo)} to="/">
            <Text className={recipeClassName(shell.headerLogoText)}>{'var(--ui)'}</Text>
          </RouterLink>

          <nav aria-label="Primary">
            <ul className={recipeClassName(shell.headerNav)}>
              {topNav.map((item) => {
                const active = isNavActive(pathname, item);
                return (
                  <li key={item.link}>
                    <RouterLink
                      aria-current={active ? 'page' : undefined}
                      className={recipeClassName(
                        active ? shell.headerNavLinkActive : shell.headerNavLink,
                      )}
                      to={item.link}
                    >
                      {item.text}
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </HStack>

        <DocsHeaderActions />
      </HStack>
    </header>
  );
}
