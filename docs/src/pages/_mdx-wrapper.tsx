import { proseContent } from '@var-ui/core';
import type { ReactNode } from 'react';

export default function MdxWrapper({ children }: { children: ReactNode }) {
  return <div className={proseContent().root}>{children}</div>;
}
