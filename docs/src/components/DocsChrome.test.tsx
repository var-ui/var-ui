import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider } from '@var-ui/react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, waitFor } from '@testing-library/react';
import { DocsChrome } from './DocsChrome';

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === 'not all' ? false : matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

async function renderDocsChrome(pathname = '/docs') {
  const rootRoute = createRootRoute({
    component: () => (
      <DesignSystemProvider defaultColorMode="light">
        <IconProvider icons={defaultIcons}>
          <LayerProvider>
            <Outlet />
          </LayerProvider>
        </IconProvider>
      </DesignSystemProvider>
    ),
  });
  const docsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/docs',
    component: () => (
      <DocsChrome headings={[{ id: 'intro', text: 'Intro', level: 2 }]}>
        <p>Page body</p>
      </DocsChrome>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([docsRoute]),
    history: createMemoryHistory({ initialEntries: [pathname] }),
  });

  render(<RouterProvider router={router} />);
  await waitFor(() => {
    expect(screen.getByText('Page body')).toBeTruthy();
  });
}

describe('DocsChrome', () => {
  it('renders nav landmarks for top, side, and outline', async () => {
    stubMatchMedia(false);
    await renderDocsChrome();

    expect(screen.getByRole('navigation', { name: 'Top navigation' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Docs' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
    vi.unstubAllGlobals();
  });
});
