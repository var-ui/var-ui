import { ColorModeToggle } from '@var-ui/react';
import { useState } from 'react';
import type { ColorMode } from '@var-ui/react';

export default function Preview() {
  const [mode, setMode] = useState<ColorMode>('light');
  return <ColorModeToggle colorMode={mode} onColorModeChange={setMode} />;
}
