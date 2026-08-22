import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { OverlayCloseContext, useOverlayClose } from './OverlayCloseContext';
import { mergeOverlayChild } from './mergeOverlayChild';

describe('mergeOverlayChild', () => {
  it('forwards onClick onto a single child', async () => {
    const parent = vi.fn();
    const child = vi.fn();
    const merged = mergeOverlayChild(
      <button type="button" onClick={child}>
        Go
      </button>,
      { onClick: parent },
    );
    render(merged);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(child).toHaveBeenCalled();
    expect(parent).toHaveBeenCalled();
  });

  it('composes handlers child first', () => {
    const calls: string[] = [];
    const merged = mergeOverlayChild(
      <button
        type="button"
        onClick={() => calls.push('child-click')}
        onKeyDown={() => calls.push('child-keydown')}
      />,
      {
        onClick: () => calls.push('parent-click'),
        onKeyDown: () => calls.push('parent-keydown'),
      },
    );

    merged.props.onClick();
    merged.props.onKeyDown();

    expect(calls).toEqual(['child-click', 'parent-click', 'child-keydown', 'parent-keydown']);
  });

  it('merges class names and refs', () => {
    const childRef = createRef<HTMLButtonElement>();
    const parentRef = createRef<HTMLButtonElement>();
    const merged = mergeOverlayChild(<button ref={childRef} className="child" type="button" />, {
      className: 'parent',
      ref: parentRef,
    });

    render(merged);

    expect(screen.getByRole('button').className.split(' ')).toEqual(['child', 'parent']);
    expect(childRef.current).toBe(screen.getByRole('button'));
    expect(parentRef.current).toBe(screen.getByRole('button'));
  });

  it('throws when the child is not a valid element', () => {
    expect(() => mergeOverlayChild('not an element' as never, {})).toThrow();
  });
});

describe('useOverlayClose', () => {
  it('returns the close callback from context', () => {
    const close = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <OverlayCloseContext.Provider value={close}>{children}</OverlayCloseContext.Provider>
    );

    const { result } = renderHook(() => useOverlayClose(), { wrapper });

    expect(result.current).toBe(close);
  });

  it('throws outside Dialog.Popup', () => {
    expect(() => renderHook(() => useOverlayClose())).toThrow(
      'Dialog.Close must be rendered inside Dialog.Popup',
    );
  });
});
