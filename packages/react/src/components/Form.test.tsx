import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './Field';
import { Form } from './Form';

describe('Form', () => {
  it('does not call onSubmit when required input is empty and focuses the control', async () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name="email" required />
          </Field.Control>
          <Field.Error />
        </Field.Root>
        <button type="submit">Save</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByLabelText('Email'));
  });

  it('calls onSubmit with FormData when valid', async () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name="email" defaultValue="ada@example.com" />
          </Field.Control>
        </Field.Root>
        <button type="submit">Save</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalled();
    const data = onSubmit.mock.calls[0][1] as FormData;
    expect(data.get('email')).toBe('ada@example.com');
  });

  it('shows Form errors map on the matching Field', () => {
    render(
      <Form errors={{ email: 'Taken' }}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name="email" />
          </Field.Control>
          <Field.Error />
        </Field.Root>
      </Form>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Taken');
  });
});
