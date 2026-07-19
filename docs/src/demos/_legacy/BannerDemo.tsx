'use client';

import { Banner } from '@var-ui/react';

export function BannerDemo() {
  return (
    <Banner tone="success" appearance="solid">
      Deploy finished in 42s.
    </Banner>
  );
}
