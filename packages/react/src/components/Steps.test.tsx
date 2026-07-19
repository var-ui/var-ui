import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Steps } from './Steps';

describe('Steps', () => {
  it('renders an ordered list of steps', () => {
    render(
      <Steps>
        <li>Install</li>
        <li>Import</li>
      </Steps>,
    );
    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
