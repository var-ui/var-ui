export type DocsThemePreset = {
  id: string;
  label: string;
  className: string;
  swatch?: string;
  lazyCss?: boolean;
  entry?: string;
};

export type ResolvedDocsThemePreset = DocsThemePreset & {
  lazyCss: boolean;
  entry?: string;
};

/** Resolve lazyCss / entry defaults for each preset. */
export function resolveThemePresets(
  presets: readonly DocsThemePreset[] | undefined | null,
): ResolvedDocsThemePreset[] {
  if (!presets?.length) return [];
  return presets.map((preset, index) => {
    const lazyCss = preset.lazyCss ?? (preset.id === 'default' || index === 0 ? false : true);
    return {
      ...preset,
      lazyCss,
      entry: preset.entry ?? (lazyCss ? `typestyles-themes/${preset.id}.ts` : undefined),
    };
  });
}

export function getLazyThemePresets(
  presets: readonly DocsThemePreset[] | undefined | null,
): ResolvedDocsThemePreset[] {
  return resolveThemePresets(presets).filter((preset) => preset.lazyCss);
}

export function getDocsThemeStylesHref(
  themeId: string,
  presets: readonly DocsThemePreset[] | undefined | null,
): string | undefined {
  const resolved = resolveThemePresets(presets).find((preset) => preset.id === themeId);
  if (!resolved?.lazyCss) return undefined;
  return `/themes/${themeId}.css`;
}

export function createThemeClassMap(
  presets: readonly DocsThemePreset[] | undefined | null,
): Record<string, string> {
  return Object.fromEntries(resolveThemePresets(presets).map((p) => [p.id, p.className]));
}

export function getAllThemeClassNames(
  presets: readonly DocsThemePreset[] | undefined | null,
): string[] {
  return resolveThemePresets(presets).map((p) => p.className);
}
