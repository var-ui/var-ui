import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders saturation, hue, and swatch controls', () => {
    render(<ColorPicker value="#228be6" onChange={() => {}} swatches={['#ff0000', '#00ff00']} />);
    expect(screen.getByLabelText('Saturation and brightness')).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Hue' })).toBeTruthy();
    expect(screen.getByRole('listbox', { name: 'Color swatches' })).toBeTruthy();
  });

  it('selects a swatch color', async () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#228be6" onChange={onChange} swatches={['#ff0000']} />);
    await userEvent.click(screen.getByRole('option', { name: '#ff0000' }));
    expect(onChange).toHaveBeenCalledWith('#ff0000');
  });
});
