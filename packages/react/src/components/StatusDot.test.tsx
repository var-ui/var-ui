import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('exposes the accessible name via aria-label', () => {
    render(<StatusDot tone="success" aria-label="Online" />);
    expect(screen.getByLabelText('Online')).toBeTruthy();
  });
});
