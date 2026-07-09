import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';

describe('Field', () => {
  it('wires label, description, and error around a custom control', () => {
    render(
      <Field label="Amount" description="In USD" errorMessage="Required" htmlFor="amt">
        <input id="amt" />
      </Field>,
    );
    expect(screen.getByLabelText('Amount')).toBeTruthy();
    expect(screen.getByText('In USD').className).toContain('var-ui-field-description');
    expect(screen.getByRole('alert').textContent).toBe('Required');
  });

  it('renders only the control when no chrome props are set', () => {
    const { container } = render(
      <Field>
        <input aria-label="bare" />
      </Field>,
    );
    expect(container.querySelector('label')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });
});
