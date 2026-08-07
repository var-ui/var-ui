import { recipeClassName } from '@var-ui/react';
import { configuratorStyles } from '@/styles/configurator';
import { SIZE_OPTIONS } from './buttonCode';

export type SizePickerProps = {
  value: (typeof SIZE_OPTIONS)[number];
  onChange: (size: (typeof SIZE_OPTIONS)[number]) => void;
};

const SIZE_LABELS: Record<(typeof SIZE_OPTIONS)[number], string> = {
  sm: 'S',
  md: 'M',
  lg: 'L',
};

export function SizePicker({ value, onChange }: SizePickerProps) {
  const c = configuratorStyles();

  return (
    <div className={recipeClassName(c.sizeGrid)} role="radiogroup" aria-label="Size">
      {SIZE_OPTIONS.map((size) => {
        const isActive = size === value;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={size}
            title={size}
            className={recipeClassName(isActive ? c.optionButtonActive : c.optionButton)}
            onClick={() => onChange(size)}
          >
            {SIZE_LABELS[size]}
          </button>
        );
      })}
    </div>
  );
}
