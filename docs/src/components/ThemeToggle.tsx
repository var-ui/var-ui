'use client';

import { Button, useDesignSystemTheme } from '@var-ui/react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useDesignSystemTheme();
  return (
    <Button intent="ghost" onPress={toggleTheme}>
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </Button>
  );
}
