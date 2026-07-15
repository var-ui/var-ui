import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('renders a labeled toolbar with start and end content', () => {
    render(
      <Toolbar
        label="Document actions"
        startContent={<button type="button">Bold</button>}
        endContent={<button type="button">Share</button>}
      />,
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Document actions' });
    expect(toolbar).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy();
  });

  it('renders center content when provided', () => {
    render(
      <Toolbar
        label="Editor toolbar"
        startContent={<span>Start</span>}
        centerContent={<span>Center</span>}
        endContent={<span>End</span>}
      />,
    );
    expect(screen.getByText('Start')).toBeTruthy();
    expect(screen.getByText('Center')).toBeTruthy();
    expect(screen.getByText('End')).toBeTruthy();
  });

  it('omits slots for content that was not provided', () => {
    render(<Toolbar label="Minimal toolbar" startContent={<span>Only start</span>} />);
    expect(screen.getByText('Only start')).toBeTruthy();
  });

  it('defaults to horizontal orientation', () => {
    render(<Toolbar label="Default orientation" startContent={<span>Item</span>} />);
    expect(screen.getByRole('toolbar').getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('reflects the vertical orientation prop', () => {
    render(
      <Toolbar label="Vertical toolbar" orientation="vertical" startContent={<span>Item</span>} />,
    );
    expect(screen.getByRole('toolbar').getAttribute('aria-orientation')).toBe('vertical');
  });
});
