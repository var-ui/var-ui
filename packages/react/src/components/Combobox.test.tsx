import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Combobox } from './Combobox';

const OPTIONS = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];

describe('Combobox', () => {
  it('renders compound parts with combobox recipe class', () => {
    render(
      <IconProvider icons={{}}>
        <Combobox.Root aria-label="Search">
          <Combobox.Input placeholder="Search…" clearable />
          <Combobox.Popover>
            <Combobox.ListBox items={OPTIONS}>
              {(item) => <Combobox.Item id={item.id}>{item.label}</Combobox.Item>}
            </Combobox.ListBox>
          </Combobox.Popover>
        </Combobox.Root>
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Search' });
    expect(input.className).toContain('var-ui-combobox');
  });
});
