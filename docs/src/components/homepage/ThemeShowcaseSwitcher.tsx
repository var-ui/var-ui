'use client';

import { recipeClassName } from '@var-ui/react';
import {
  aiGlowTheme,
  amberTheme,
  classicSystemTheme,
  defaultTheme,
  forestTheme,
  newWaveTheme,
  roseTheme,
  windows95Theme,
} from '@var-ui/core';
import { homeBento } from '@/styles/homeBento';

export type ShowcaseThemeId =
  | 'default'
  | 'forest'
  | 'rose'
  | 'amber'
  | 'ai-glow'
  | 'new-wave'
  | 'windows-95'
  | 'classic-system';

type ShowcaseTheme = {
  id: ShowcaseThemeId;
  label: string;
  className: string;
  swatch: string;
};

/** All 8 built-in themes from `@var-ui/core`'s `themes/index.ts` — see specs/theme-gallery.md. */
export const SHOWCASE_THEMES: ShowcaseTheme[] = [
  { id: 'default', label: 'Default', className: defaultTheme.className, swatch: '#64748b' },
  { id: 'forest', label: 'Forest', className: forestTheme.className, swatch: '#16a34a' },
  { id: 'rose', label: 'Rose', className: roseTheme.className, swatch: '#e11d48' },
  { id: 'amber', label: 'Amber', className: amberTheme.className, swatch: '#d97706' },
  { id: 'ai-glow', label: 'AI Glow', className: aiGlowTheme.className, swatch: '#0ea5e9' },
  { id: 'new-wave', label: 'New Wave', className: newWaveTheme.className, swatch: '#ff4fd8' },
  {
    id: 'windows-95',
    label: 'Windows 95',
    className: windows95Theme.className,
    swatch: '#000080',
  },
  {
    id: 'classic-system',
    label: 'Classic System',
    className: classicSystemTheme.className,
    swatch: '#000000',
  },
];

export type ThemeShowcaseSwitcherProps = {
  selected: ShowcaseThemeId;
  onSelect: (id: ShowcaseThemeId) => void;
};

export function ThemeShowcaseSwitcher({ selected, onSelect }: ThemeShowcaseSwitcherProps) {
  const b = homeBento();

  return (
    <div className={recipeClassName(b.switcher)} role="radiogroup" aria-label="Preview theme">
      {SHOWCASE_THEMES.map((theme) => {
        const isActive = theme.id === selected;
        return (
          <button
            key={theme.id}
            aria-checked={isActive}
            className={recipeClassName(isActive ? b.switcherPillActive : b.switcherPill)}
            onClick={() => onSelect(theme.id)}
            role="radio"
            type="button"
          >
            <span
              className={recipeClassName(b.switcherSwatch)}
              style={{ backgroundColor: theme.swatch }}
            />
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
