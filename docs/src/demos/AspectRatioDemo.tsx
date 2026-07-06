'use client';

import { AspectRatio } from '@var-ui/react';

export function AspectRatioDemo() {
  return (
    <AspectRatio
      ratio={16 / 9}
      style={{ background: 'var(--color-surface-muted)', maxWidth: '320px' }}
    />
  );
}
