import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { layout } from '@var-ui/core';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from './Layout';
import type { UseResizableResult } from '../hooks';

/** Stubs `window.matchMedia` so `useMediaQuery` reports a fixed `matches` value for every query. */
function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function fakeResizable(width: number): UseResizableResult {
  return {
    width,
    isCollapsed: false,
    setCollapsed: () => {},
    collapse: () => {},
    expand: () => {},
    resize: () => {},
    handleProps: {
      direction: 'horizontal',
      value: width,
      minValue: 0,
      maxValue: 999,
      onChange: () => {},
      isCollapsed: false,
    },
  };
}

describe('Layout', () => {
  it('renders header, content, and end panel landmarks', () => {
    render(
      <Layout
        header={<LayoutHeader>Header content</LayoutHeader>}
        content={<LayoutContent label="Main">Main content</LayoutContent>}
        end={<LayoutPanel label="Inspector">Panel content</LayoutPanel>}
        footer={<LayoutFooter>Footer content</LayoutFooter>}
      />,
    );

    expect(screen.getByText('Header content')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Main' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Inspector' })).toBeTruthy();
    expect(screen.getByText('Footer content')).toBeTruthy();
  });

  it('sets data-has-* attributes on the root only for provided slots', () => {
    const { container } = render(
      <Layout header={<LayoutHeader>Header</LayoutHeader>} content={<div>Content</div>} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-has-header')).toBe(true);
    expect(root.hasAttribute('data-has-footer')).toBe(false);
    expect(root.hasAttribute('data-has-start')).toBe(false);
    expect(root.hasAttribute('data-has-end')).toBe(false);
  });

  it('prefers content over children when both are provided', () => {
    render(
      <Layout content={<div>From content</div>}>
        <div>From children</div>
      </Layout>,
    );
    expect(screen.getByText('From content')).toBeTruthy();
    expect(screen.queryByText('From children')).toBeNull();
  });

  it('falls back to children when content is omitted', () => {
    render(<Layout>{<div>From children</div>}</Layout>);
    expect(screen.getByText('From children')).toBeTruthy();
  });

  it('binds a resizable result width to LayoutPanel as an inline style', () => {
    const resizable = fakeResizable(380);
    render(
      <Layout
        content={<div>Main</div>}
        end={<LayoutPanel resizable={resizable}>Panel</LayoutPanel>}
      />,
    );
    const panel = screen.getByText('Panel').closest('[data-side="end"]') as HTMLElement;
    expect(panel.style.width).toBe('380px');
  });

  it('prefers the resizable width over an explicit width prop', () => {
    const resizable = fakeResizable(420);
    render(
      <Layout content={<div>Main</div>} end={<LayoutPanel width={200} resizable={resizable} />} />,
    );
    const panel = document.querySelector('[data-side="end"]') as HTMLElement;
    expect(panel.style.width).toBe('420px');
  });

  it('sets data-side="start" or "end" on LayoutPanel based on its slot', () => {
    render(
      <Layout
        content={<div>Main</div>}
        start={<LayoutPanel>Start panel</LayoutPanel>}
        end={<LayoutPanel>End panel</LayoutPanel>}
      />,
    );
    expect(screen.getByText('Start panel').closest('[data-side]')?.getAttribute('data-side')).toBe(
      'start',
    );
    expect(screen.getByText('End panel').closest('[data-side]')?.getAttribute('data-side')).toBe(
      'end',
    );
  });

  it('maps a numeric padding prop to the layout recipe string variant key', () => {
    const { container } = render(<Layout padding={2} content={<div>Main</div>} />);
    const root = container.firstElementChild as HTMLElement;
    const expectedResult = layout({ height: 'fill', padding: '2' }).root;
    const expectedClassName =
      typeof expectedResult === 'string' ? expectedResult : expectedResult.className;
    expect(root.className).toBe(expectedClassName);
  });

  it('uses the layout recipe default padding variant when padding is omitted', () => {
    const { container } = render(<Layout content={<div>Main</div>} />);
    const root = container.firstElementChild as HTMLElement;
    const expectedResult = layout({ height: 'fill', padding: '4' }).root;
    const expectedClassName =
      typeof expectedResult === 'string' ? expectedResult : expectedResult.className;
    expect(root.className).toBe(expectedClassName);
  });

  it('sets the content-width CSS variable when contentWidth is provided', () => {
    const { container } = render(<Layout contentWidth={720} content={<div>Main</div>} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--var-ui-layout-content-width')).toBe('720px');
  });

  it('sets data-divider on LayoutHeader/LayoutFooter when hasDivider is explicit', () => {
    render(
      <Layout
        header={<LayoutHeader hasDivider>Header</LayoutHeader>}
        content={<div>Main</div>}
        footer={<LayoutFooter hasDivider={false}>Footer</LayoutFooter>}
      />,
    );
    expect(screen.getByText('Header').closest('[data-divider]')).toBeTruthy();
    expect(screen.getByText('Footer').closest('[data-divider]')).toBeNull();
  });

  it('defaults LayoutHeader/LayoutFooter dividers from Layout.defaultHasDividers', () => {
    render(
      <Layout
        defaultHasDividers
        header={<LayoutHeader>Header</LayoutHeader>}
        content={<div>Main</div>}
        footer={<LayoutFooter>Footer</LayoutFooter>}
      />,
    );
    expect(screen.getByText('Header').closest('[data-divider]')).toBeTruthy();
    expect(screen.getByText('Footer').closest('[data-divider]')).toBeTruthy();
  });

  it('lets an explicit hasDivider prop override Layout.defaultHasDividers', () => {
    render(
      <Layout
        defaultHasDividers
        header={<LayoutHeader hasDivider={false}>Header</LayoutHeader>}
        content={<div>Main</div>}
      />,
    );
    expect(screen.getByText('Header').closest('[data-divider]')).toBeNull();
  });
});

describe('LayoutContent', () => {
  it('renders its children and stays labeled after toggling isScrollable', () => {
    const { rerender } = render(<LayoutContent label="Main">Body</LayoutContent>);
    expect(screen.getByRole('region', { name: 'Main' }).textContent).toBe('Body');

    rerender(
      <LayoutContent label="Main" isScrollable={false}>
        Body
      </LayoutContent>,
    );
    expect(screen.getByRole('region', { name: 'Main' }).textContent).toBe('Body');
  });
});

describe('LayoutPanel', () => {
  it('renders children with an accessible label when provided', () => {
    render(<LayoutPanel label="Details">Panel body</LayoutPanel>);
    const panel = screen.getByRole('region', { name: 'Details' });
    expect(panel.textContent).toBe('Panel body');
  });

  describe('responsive', () => {
    it('hidden mode: panel not in DOM when closed below breakpoint', () => {
      mockMatchMedia(true);
      render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} defaultOpen={false}>
          Inspector
        </LayoutPanel>,
      );
      expect(screen.queryByText('Inspector')).toBeNull();
      vi.unstubAllGlobals();
    });

    it('hidden mode: panel visible when isOpen below breakpoint', () => {
      mockMatchMedia(true);
      render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} isOpen>
          Inspector
        </LayoutPanel>,
      );
      expect(screen.getByText('Inspector')).toBeTruthy();
      vi.unstubAllGlobals();
    });

    it('overlay mode: complementary landmark in modal when isOpen below breakpoint', () => {
      mockMatchMedia(true);
      render(
        <LayoutPanel
          responsive={{ below: 'lg', mode: 'overlay' }}
          isOpen
          label="Details"
          role="complementary"
        >
          Inspector
        </LayoutPanel>,
      );
      expect(screen.getByRole('dialog')).toBeTruthy();
      expect(screen.getByRole('complementary', { name: 'Details' })).toBeTruthy();
      expect(screen.getByText('Inspector')).toBeTruthy();
      vi.unstubAllGlobals();
    });

    it('above breakpoint: responsive is inert and the panel always renders inline', () => {
      mockMatchMedia(false);
      render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} defaultOpen={false}>
          Inspector
        </LayoutPanel>,
      );
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('Inspector')).toBeTruthy();

      const { unmount } = render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'overlay' }} isOpen={false}>
          Overlay panel
        </LayoutPanel>,
      );
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('Overlay panel')).toBeTruthy();
      unmount();
      vi.unstubAllGlobals();
    });
  });
});
