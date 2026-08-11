import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ColorInput } from './ColorInput';

describe('ColorInput', () => {
  it('renders label and hex value', () => {
    render(<ColorInput label="Brand" value="#ff00aa" onChange={() => {}} />);
    expect(screen.getByText('Brand')).toBeTruthy();
    expect((screen.getByLabelText('Brand') as HTMLInputElement).value).toBe('#ff00aa');
  });
});
