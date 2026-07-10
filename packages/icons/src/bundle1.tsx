import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Bundle 1 — the 11 semantic glyphs required by existing + Phase 1 components.
 * Hand-authored inline SVGs (24×24, `currentColor`), no icon-library dependency.
 */
export const bundle1Icons: Partial<Record<IconName, ReactNode>> = {
  close: (
    <Glyph>
      <path d="M6 6l12 12M18 6L6 18" />
    </Glyph>
  ),
  chevronDown: (
    <Glyph>
      <path d="M6 9.5l6 6 6-6" />
    </Glyph>
  ),
  chevronLeft: (
    <Glyph>
      <path d="M14.5 6l-6 6 6 6" />
    </Glyph>
  ),
  chevronRight: (
    <Glyph>
      <path d="M9.5 6l6 6-6 6" />
    </Glyph>
  ),
  check: (
    <Glyph>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </Glyph>
  ),
  copy: (
    <Glyph>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" />
    </Glyph>
  ),
  search: (
    <Glyph>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </Glyph>
  ),
  info: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Glyph>
  ),
  success: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </Glyph>
  ),
  warning: (
    <Glyph>
      <path d="M12 3.5L2.8 19.5a1 1 0 0 0 .87 1.5h16.66a1 1 0 0 0 .87-1.5L12 3.5z" />
      <path d="M12 9.5v5M12 17.5h.01" />
    </Glyph>
  ),
  error: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </Glyph>
  ),
};
