import { ColorModeToggle, VStack } from '@var-ui/react';
import { useState } from 'react';
import type { ColorMode } from '@var-ui/react';

export default function Preview() {
  const [mode, setMode] = useState<ColorMode>('light');

  return (
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
    </VStack>
  );
}
