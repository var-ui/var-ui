import type { ToneAppearance } from '@var-ui/core';
import { recipeClassName } from '@var-ui/react';
import { configuratorStyles } from '@/styles/configurator';
import { APPEARANCE_OPTIONS } from './buttonCode';

export type AppearancePickerProps = {
  value: ToneAppearance;
  onChange: (appearance: ToneAppearance) => void;
};

export function AppearancePicker({ value, onChange }: AppearancePickerProps) {
  const c = configuratorStyles();

  return (
    <div className={recipeClassName(c.appearanceGrid)} role="radiogroup" aria-label="Appearance">
      {APPEARANCE_OPTIONS.map((appearance) => {
        const isActive = appearance.id === value;
        return (
          <button
            key={appearance.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={appearance.label}
            title={appearance.label}
            className={recipeClassName(isActive ? c.optionButtonActive : c.optionButton)}
            onClick={() => onChange(appearance.id)}
          >
            {appearance.label}
          </button>
        );
      })}
    </div>
  );
}
