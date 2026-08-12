import { docsThemePresets, type ShowcaseThemeId } from '@/themes/presets';

export type { ShowcaseThemeId };

type ShowcaseTheme = {
  id: ShowcaseThemeId;
  label: string;
  className: string;
  swatch: string;
};

/** @deprecated Prefer `docsThemePresets` — kept for homepage / playground imports. */
export const SHOWCASE_THEMES: ShowcaseTheme[] = docsThemePresets.map((preset) => ({
  id: preset.id,
  label: preset.label,
  className: preset.className,
  swatch: preset.swatch ?? '#64748b',
}));
