import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { SimpleGrid } from './SimpleGrid';

describe('SimpleGrid', () => {
  it('renders children in a grid container', () => {
    const { container } = render(
      <SimpleGrid cols={3} data-testid="grid">
        <span>a</span>
        <span>b</span>
      </SimpleGrid>,
    );
    expect(container.querySelector('[data-testid="grid"]')).toBeTruthy();
  });
});
