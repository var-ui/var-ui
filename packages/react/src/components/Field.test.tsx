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
    expect(screen.getByText('In USD').className).toContain('var-ui-field__description');
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

  it('associates Field.Label with Field.Control via generated id', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field.Root>,
    );
    expect(screen.getByLabelText('Email')).toBeTruthy();
  });

  it('does not set aria-describedby when Description is not mounted', () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field.Root>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(input.getAttribute('aria-errormessage')).toBeNull();
  });

  it('associates Field.Label with a nested Field.Control that has an explicit id', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <div>
          <Field.Control>
            <input id="nested-email" />
          </Field.Control>
        </div>
      </Field.Root>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toBeTruthy();
    // Generated controlId overwrites the explicit id so Label/Control match without an effect.
    expect(input.id).not.toBe('nested-email');
  });

  it('sets aria-describedby when Description is nested', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
        <div>
          <Field.Description>Work email</Field.Description>
        </div>
      </Field.Root>,
    );
    const input = screen.getByLabelText('Email');
    const description = screen.getByText('Work email');
    expect(input.getAttribute('aria-describedby')).toBe(description.id);
  });

  it('associates Field.Label with a nested Field.Control via generated id', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <div>
          <Field.Control>
            <input />
          </Field.Control>
        </div>
      </Field.Root>,
    );
    expect(screen.getByLabelText('Email')).toBeTruthy();
  });
});
