import type { ButtonTone } from '@var-ui/core';
import { Icon, recipeClassName } from '@var-ui/react';
import { configuratorStyles } from '@/styles/configurator';
import { TONE_OPTIONS } from './buttonCode';

export type ToneSwatchPickerProps = {
  value: ButtonTone;
  onChange: (tone: ButtonTone) => void;
};

export function ToneSwatchPicker({ value, onChange }: ToneSwatchPickerProps) {
  const c = configuratorStyles();

  return (
    <div className={recipeClassName(c.toneGrid)} role="radiogroup" aria-label="Tone">
      {TONE_OPTIONS.map((tone) => {
        const isActive = tone.id === value;
        return (
          <button
            key={tone.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={tone.label}
            title={tone.label}
            className={recipeClassName(isActive ? c.toneSwatchActive : c.toneSwatch)}
            style={{ backgroundColor: tone.swatch }}
            onClick={() => onChange(tone.id)}
          >
            {isActive ? (
              <span className={recipeClassName(c.toneCheck)} aria-hidden="true">
                <Icon name="check" size="sm" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
