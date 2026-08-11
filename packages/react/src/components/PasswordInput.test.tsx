import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('toggles password visibility', async () => {
    render(
      <IconProvider icons={{}}>
        <PasswordInput label="Password" defaultValue="secret" />
      </IconProvider>,
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input.type).toBe('text');

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.type).toBe('password');
  });
});
