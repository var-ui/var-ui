import type { ReactNode } from 'react';
import { DocsProviders } from '@/layouts/DocsProviders';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <DocsProviders>{children}</DocsProviders>;
}
