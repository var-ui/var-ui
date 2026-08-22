import { describe, expect, it } from 'vite-plus/test';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('keeps preset htmlFor as the label and control id', () => {
    render(
      <Field label="Email" htmlFor="email">
        <input />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.id).toBe('email');
    expect(document.querySelector('label')?.htmlFor).toBe('email');
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
    expect(input.id).toBe('nested-email');
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

  it('does not leave a dangling aria-describedby after Description unmounts', () => {
    const { rerender } = render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
        <Field.Description>Work email</Field.Description>
      </Field.Root>,
    );
    const describedBy = screen.getByLabelText('Email').getAttribute('aria-describedby');
    expect(describedBy).toBe(screen.getByText('Work email').id);

    rerender(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field.Root>,
    );
    expect(screen.getByLabelText('Email').getAttribute('aria-describedby')).toBeNull();
  });

  it('sets data-invalid and shows native validationMessage on submit-invalid', async () => {
    render(
      <form>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input required />
          </Field.Control>
          <Field.Error />
        </Field.Root>
        <button type="submit">Go</button>
      </form>,
    );
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    act(() => {
      input.checkValidity();
    });
    expect(input.closest('.var-ui-field')?.hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByRole('alert').textContent?.length).toBeGreaterThan(0);
  });

  it('lets explicit Field.Error children win over native message', async () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input required />
        </Field.Control>
        <Field.Error>Taken</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Taken');
  });

  it('sets data-touched after blur', async () => {
    render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field.Root>,
    );
    const input = screen.getByLabelText('Name');
    await userEvent.click(input);
    await userEvent.tab();
    expect(input.closest('.var-ui-field')?.hasAttribute('data-touched')).toBe(true);
  });

  it('sets data-dirty after the value changes from defaultValue', async () => {
    render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input defaultValue="Ada" />
        </Field.Control>
      </Field.Root>,
    );
    const input = screen.getByLabelText('Name');
    expect(input.closest('.var-ui-field')?.hasAttribute('data-dirty')).toBe(false);
    await userEvent.clear(input);
    await userEvent.type(input, 'Grace');
    expect(input.closest('.var-ui-field')?.hasAttribute('data-dirty')).toBe(true);
  });

  it('sets data-filled when the control has a non-empty value', () => {
    render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input defaultValue="Ada" />
        </Field.Control>
      </Field.Root>,
    );
    expect(
      screen.getByLabelText('Name').closest('.var-ui-field')?.hasAttribute('data-filled'),
    ).toBe(true);
  });

  it('sets data-disabled when the control is disabled', () => {
    render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input disabled />
        </Field.Control>
      </Field.Root>,
    );
    expect(
      screen.getByLabelText('Name').closest('.var-ui-field')?.hasAttribute('data-disabled'),
    ).toBe(true);
  });

  it('sets data-valid after blur when the field is not invalid', async () => {
    render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field.Root>,
    );
    const input = screen.getByLabelText('Name');
    await userEvent.click(input);
    await userEvent.tab();
    const root = input.closest('.var-ui-field');
    expect(root?.hasAttribute('data-valid')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(false);
  });

  it('sets data-invalid when Field.Error has children', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
        <Field.Error>Taken</Field.Error>
      </Field.Root>,
    );
    expect(
      screen.getByLabelText('Email').closest('.var-ui-field')?.hasAttribute('data-invalid'),
    ).toBe(true);
  });
});
