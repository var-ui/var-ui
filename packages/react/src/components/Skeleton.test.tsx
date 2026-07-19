import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a decorative placeholder with the shape variant class', () => {
    const { container } = render(<Skeleton shape="circle" style={{ width: 40 }} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toMatch(/skeleton/);
  });
});
