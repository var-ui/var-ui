'use client';

import { TextField } from '@var-ui/react';

export function TextFieldDemo() {
  return (
    <TextField
      label="Project name"
      description="Shown on the dashboard."
      placeholder="My project"
    />
  );
}
