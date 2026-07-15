import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessageMetadata } from './ChatMessageMetadata';

describe('ChatMessageMetadata', () => {
  it('renders a Timestamp for the given date', () => {
    render(<ChatMessageMetadata date="2024-01-01T00:00:00.000Z" format="date" />);
    expect(screen.getByRole('time', { name: /Dec 31, 2023/i })).toBeTruthy();
  });

  it('renders optional status content alongside the timestamp', () => {
    render(<ChatMessageMetadata date="2024-01-01T00:00:00.000Z" format="date" status="Read" />);
    expect(screen.getByText('Read')).toBeTruthy();
  });
});
