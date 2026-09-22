import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Code } from './Code';

describe('Code', () => {
  it('renders children inside a code element with inline code class', () => {
    render(<Code>theme.className</Code>);
    const el = screen.getByText('theme.className');
    expect(el.tagName).toBe('CODE');
    expect(el.className).toContain('var-ui-inline-code');
  });
});
