'use client';

import { Alert } from '@var-ui/react';

export function AlertDemo() {
  return (
    <Alert variant="info" title="Registry icons">
      Alerts pull their tone glyph from IconProvider automatically.
    </Alert>
  );
}
