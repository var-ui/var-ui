import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ColorModeToggle, VStack } from '@var-ui/react';
import { useState } from 'react';
import type { ColorMode } from '@var-ui/react';

const [mode, setMode] = useState<ColorMode>('light');

<VStack gap="lg">
  <ColorModeToggle
    appearance="labels"
    includeSystem
    colorMode={mode}
    onColorModeChange={setMode}
  />
  <ColorModeToggle
    appearance="iconsAndLabels"
    includeSystem
    colorMode={mode}
    onColorModeChange={setMode}
  />
</VStack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
