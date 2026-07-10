import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Select } from './Select';

const OPTIONS = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
];

describe('Select', () => {
  it('renders the label and placeholder', () => {
    render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );
    expect(screen.getByText('Fruit')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Fruit/ })).toBeTruthy();
  });

  it('portals the listbox into a custom portalContainer when provided', async () => {
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'custom-portal');
    document.body.appendChild(container);

    render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} portalContainer={container} />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));

    const option = await screen.findByRole('option', { name: 'Apple' });
    expect(container.contains(option)).toBe(true);

    document.body.removeChild(container);
  });
});
