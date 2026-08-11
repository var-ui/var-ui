import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { LoadingOverlay } from './LoadingOverlay';

describe('LoadingOverlay', () => {
  it('shows a loading status when visible', () => {
    render(
      <LoadingOverlay visible label="Saving">
        <p>Content</p>
      </LoadingOverlay>,
    );
    expect(screen.getByText('Content')).toBeTruthy();
    expect(screen.getByText('Saving')).toBeTruthy();
  });

  it('hides the overlay when not visible', () => {
    render(
      <LoadingOverlay visible={false}>
        <p>Content</p>
      </LoadingOverlay>,
    );
    expect(screen.queryByRole('status')).toBeNull();
  });
});
