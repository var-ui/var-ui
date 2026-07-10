import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and applies the intent recipe class', () => {
    render(<Button intent="primary">Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toContain('var-ui-button-base');
    expect(button.className).toContain('var-ui-button-intent-primary');
  });
});
