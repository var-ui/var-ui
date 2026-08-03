'use client';

import { recipeClassName } from '@var-ui/react';
import { homeBento } from '@/styles/homeBento';
import { SHOWCASE_THEMES, type ShowcaseThemeId } from './showcaseThemes';

export type { ShowcaseThemeId } from './showcaseThemes';
export { SHOWCASE_THEMES } from './showcaseThemes';

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
