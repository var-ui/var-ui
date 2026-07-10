import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { bundle1Icons } from './bundle1';
import { bundle2Icons } from './bundle2';

export { bundle1Icons };
export { bundle2Icons };

/** All shipped bundles merged — pass to `IconProvider` for var-ui defaults. */
export const defaultIcons: Partial<Record<IconName, ReactNode>> = {
  ...bundle1Icons,
  ...bundle2Icons,
};
