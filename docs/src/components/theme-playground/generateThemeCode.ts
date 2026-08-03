import type { ThemePlaygroundState } from './themePlaygroundState';
import type { ShowcaseThemeId } from '../homepage/showcaseThemes';

const PRESET_EXPORTS: Record<
  Exclude<ShowcaseThemeId, 'default'>,
  { preset: string; name: string }
> = {
  forest: { preset: 'forestPreset', name: 'forest' },
  rose: { preset: 'rosePreset', name: 'rose' },
  amber: { preset: 'amberPreset', name: 'amber' },
  'ai-glow': { preset: 'aiGlowPreset', name: 'ai-glow' },
  'new-wave': { preset: 'newWavePreset', name: 'new-wave' },
  'windows-95': { preset: 'windows95Preset', name: 'windows-95' },
  'classic-system': { preset: 'classicSystemPreset', name: 'classic-system' },
};

export function generateThemeCode(state: ThemePlaygroundState): {
  code: string;
  language: string;
  filename: string;
} {
  if (state.presetId === 'default') {
    return {
      code: `import { defaultThemeClassName } from '@var-ui/core';

// Default theme is registered when you import '@var-ui/core'.
// Apply to your app root:
export const themeClassName = defaultThemeClassName;`,
      language: 'ts',
      filename: 'theme.ts',
    };
  }

  const entry = PRESET_EXPORTS[state.presetId];
  const importPath = `./themes/${entry.name}`;

  return {
    code: `import { createDesignTheme } from '@var-ui/core';
import { ${entry.preset} } from '${importPath}';

export const ${entry.name.replace(/-/g, '')}Theme = createDesignTheme({
  name: '${entry.name}',
  ...${entry.preset},
});`,
    language: 'ts',
    filename: 'theme.ts',
  };
}
