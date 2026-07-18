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
  arrowDown: (
    <Glyph>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Glyph>
  ),
  arrowsUpDown: (
    <Glyph>
      <path d="M12 5v5M8 9l4-4 4 4" />
      <path d="M12 19v-5M8 15l4 4 4-4" />
    </Glyph>
  ),
  colorModeLight: (
    <Glyph>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Glyph>
  ),
  colorModeDark: (
    <Glyph>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </Glyph>
  ),
  colorModeSystem: (
    <Glyph>
      <rect height="12" rx="1.5" width="18" x="3" y="4" />
      <path d="M8 20h8M12 16v4" />
    </Glyph>
  ),
};
