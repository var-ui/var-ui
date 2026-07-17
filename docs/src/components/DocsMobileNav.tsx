'use client';

import { recipeClassName } from '@var-ui/react';
import { useOptionalMobileNav } from '@/contexts/MobileNavContext';
import { docsShell } from '@/styles/docsShell';
import { DocsSidebar } from './DocsSidebar';

export function DocsMobileNav() {
  const shell = docsShell();
  const mobileNav = useOptionalMobileNav();

  if (!mobileNav?.isOpen) return null;

  return (
    <>
      <button
        aria-label="Close navigation"
        className={recipeClassName(shell.mobileNavOverlay)}
        onClick={mobileNav.close}
        type="button"
      />
      <div className={recipeClassName(shell.mobileNavPanel)}>
        <DocsSidebar onNavigate={mobileNav.close} />
      </div>
    </>
  );
}

export function DocsMobileNavButton() {
  const shell = docsShell();
  const mobileNav = useOptionalMobileNav();

  if (!mobileNav) return null;

  return (
    <button
      aria-label="Open navigation"
      className={recipeClassName(shell.headerMenuButton)}
      onClick={mobileNav.open}
      type="button"
    >
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
