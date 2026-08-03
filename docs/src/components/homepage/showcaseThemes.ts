import { defaultThemeClassName } from '@var-ui/core';
import {
  aiGlowTheme,
  amberTheme,
  classicSystemTheme,
  forestTheme,
  newWaveTheme,
  roseTheme,
  windows95Theme,
} from '@/themes';

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

/** All showcase themes — default from core, palette/style examples from docs `src/themes`. */
export const SHOWCASE_THEMES: ShowcaseTheme[] = [
  { id: 'default', label: 'Default', className: defaultThemeClassName, swatch: '#64748b' },
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
