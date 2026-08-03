import { describe, expect, it } from 'vite-plus/test';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';
import { hasLength, isEmail, isNotEmpty } from './validators';

describe('useForm', () => {
  it('tracks values and validates on submit', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '', name: '' },
        validate: {
          email: (value, values) => {
            const required = isNotEmpty(value, values);
            if (required) return required;
            return isEmail(value as string, values);
          },
          name: (value, values) => {
            const required = isNotEmpty(value, values);
            if (required) return required;
            return hasLength(2)(value as string, values);
          },
        },
      }),
    );

    let submitted: { email: string; name: string } | null = null;
    const submit = result.current.handleSubmit((values) => {
      submitted = values;
    });

    await act(async () => {
      await submit({ preventDefault: () => {} });
    });
    expect(submitted).toBeNull();
    expect(result.current.errors.email).toBe('This field is required');

    act(() => {
      result.current.setFieldValue('email', 'bad');
      result.current.setFieldValue('name', 'Ada');
    });

    await act(async () => {
      await submit({ preventDefault: () => {} });
    });
    expect(result.current.errors.email).toBe('Invalid email address');

    act(() => {
      result.current.setFieldValue('email', 'ada@example.com');
    });

    await act(async () => {
      await submit({ preventDefault: () => {} });
    });
    expect(submitted).toEqual({ email: 'ada@example.com', name: 'Ada' });
  });

  it('exposes getInputProps for field components', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { title: 'Hello' },
        validate: { title: isNotEmpty },
        validateOnBlur: true,
      }),
    );

    const props = result.current.getInputProps('title');
    expect(props.value).toBe('Hello');
    expect(props.name).toBe('title');

    act(() => {
      props.onBlur();
    });
    expect(props.errorMessage).toBeUndefined();

    act(() => {
      result.current.setFieldValue('title', '');
    });
    act(() => {
      result.current.getInputProps('title').onBlur();
    });
    expect(result.current.errors.title).toBe('This field is required');
  });
});
