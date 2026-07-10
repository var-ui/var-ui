'use client';

import { useDesignSystemTheme } from '@var-ui/react';
import { docsShell } from '@/styles/docsShell';
import { HeaderIconButton } from './HeaderIconButton';

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <rect height="12" rx="1.5" width="18" x="3" y="4" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

const MODES = [
  { id: 'light', label: 'Light', icon: <SunIcon /> },
  { id: 'dark', label: 'Dark', icon: <MoonIcon /> },
  { id: 'system', label: 'System', icon: <SystemIcon /> },
] as const;

export function ColorModeSwitcher() {
  const shell = docsShell();
  const { theme, setTheme } = useDesignSystemTheme();

  return (
    <div className={shell.colorModeGroup}>
      {MODES.map((mode) => {
        const active = theme === mode.id;
        return (
          <HeaderIconButton
            aria-pressed={active}
            className={active ? shell.colorModeButtonActive : shell.colorModeButton}
            key={mode.id}
            label={mode.label}
            onPress={() => setTheme(mode.id)}
          >
            {mode.icon}
          </HeaderIconButton>
        );
      })}
    </div>
  );
}
