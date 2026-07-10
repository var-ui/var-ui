import type { ReactNode } from 'react';
import { defaultTheme } from '@var-ui/core';
import { getThemeInitScript } from '@var-ui/react';
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { DocsProviders } from '@/layouts/DocsProviders';
import { COLOR_MODE_STORAGE_KEY } from '@/lib/color-mode';
import rootCss from '@/styles/root.css?url';

const themeInitScript = getThemeInitScript({
  storageKey: COLOR_MODE_STORAGE_KEY,
  defaultTheme: 'system',
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Var UI' },
      {
        name: 'description',
        content: 'An open-source design system built on TypeStyles and React Aria.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: rootCss },
      { rel: 'stylesheet', href: '/typestyles.css' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <DocsProviders>
        <Outlet />
      </DocsProviders>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html className={defaultTheme.className} lang="en">
      <head>
        {/* Must run before HeadContent/CSS so the correct color mode is on <html> before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
