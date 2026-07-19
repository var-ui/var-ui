import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Outline } from './Outline';

describe('Outline', () => {
  it('renders title and links from items', () => {
    render(
      <Outline
        items={[
          { id: 'intro', text: 'Intro', level: 2 },
          { id: 'details', text: 'Details', level: 3 },
        ]}
      />,
    );
    expect(screen.getByText('On this page')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Intro' }).getAttribute('href')).toBe('#intro');
    expect(screen.getByRole('link', { name: 'Details' }).getAttribute('href')).toBe('#details');
  });

  it('marks the controlled activeId link', () => {
    render(
      <Outline
        activeId="intro"
        scrollSpy={false}
        items={[{ id: 'intro', text: 'Intro', level: 2 }]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Intro' });
    expect(link.getAttribute('data-active')).toBe('');
  });

  it('uses scroll-spy IntersectionObserver when activeId is omitted', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = observe;
        unobserve = () => {};
        disconnect = disconnect;
        constructor(public cb: IntersectionObserverCallback) {}
      },
    );
    document.body.innerHTML = '<h2 id="intro">Intro</h2>';
    render(<Outline items={[{ id: 'intro', text: 'Intro', level: 2 }]} />);
    expect(observe).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('renders Outline.Item children when items is omitted', () => {
    render(
      <Outline activeId="intro" scrollSpy={false}>
        <Outline.Item id="intro">Intro</Outline.Item>
        <Outline.Item id="details" level={3}>
          Details
        </Outline.Item>
      </Outline>,
    );
    expect(screen.getByRole('link', { name: 'Intro' }).getAttribute('data-active')).toBe('');
    expect(screen.getByRole('link', { name: 'Details' }).getAttribute('data-active')).toBeNull();
  });
});
