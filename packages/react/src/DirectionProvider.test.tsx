import { describe, expect, it } from 'vite-plus/test';
import { render, renderHook, screen } from '@testing-library/react';
import { DirectionProvider, useDirection } from './DirectionProvider';

describe('useDirection', () => {
  it('defaults to ltr outside a provider', () => {
    const { result } = renderHook(() => useDirection());
    expect(result.current).toEqual({ direction: 'ltr', isRtl: false });
  });

  it('reads rtl from DirectionProvider', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: ({ children }) => <DirectionProvider direction="rtl">{children}</DirectionProvider>,
    });
    expect(result.current).toEqual({ direction: 'rtl', isRtl: true });
  });
});

describe('DirectionProvider applyToDocument', () => {
  function cleanup() {
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
  }

  it('sets dir on html and lang only when locale is passed', () => {
    render(
      <DirectionProvider direction="rtl" applyToDocument>
        <span>a</span>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBeNull();
    cleanup();
  });

  it('sets lang on html when locale is passed', () => {
    render(
      <DirectionProvider direction="rtl" locale="he-IL" applyToDocument>
        <span>a</span>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('he-IL');
    cleanup();
  });

  it('does not set lang=ar for the I18n fallback', () => {
    render(
      <DirectionProvider direction="rtl" applyToDocument>
        <span>a</span>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('lang')).not.toBe('ar');
    cleanup();
  });
});

describe('DirectionProvider wrapper', () => {
  it('sets dir on a contents wrapper when applyToDocument is false', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <span>island</span>
      </DirectionProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('dir')).toBe('rtl');
    expect(wrapper.style.display).toBe('contents');
    expect(screen.getByText('island')).toBeTruthy();
  });

  it('does not clobber html when nested without applyToDocument', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    render(
      <DirectionProvider direction="ltr" applyToDocument>
        <DirectionProvider direction="rtl">
          <span>island</span>
        </DirectionProvider>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    document.documentElement.removeAttribute('dir');
  });
});
