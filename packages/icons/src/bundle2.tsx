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
 * Bundle 2 — chat-specific glyphs (send/stop, tool calls, pending status).
 * Hand-authored inline SVGs (24×24, `currentColor`), no icon-library dependency.
 */
export const bundle2Icons: Partial<Record<IconName, ReactNode>> = {
  arrowUp: (
    <Glyph>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </Glyph>
  ),
  stop: (
    <Glyph>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
    </Glyph>
  ),
  wrench: (
    <Glyph>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.65 2.65-2-2z" />
    </Glyph>
  ),
  clock: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Glyph>
  ),
  moreHorizontal: (
    <Glyph>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </Glyph>
  ),
};
