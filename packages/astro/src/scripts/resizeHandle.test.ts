import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createResizeHandle } from './resizeHandle';

function mountHandle(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

describe('createResizeHandle', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders separator semantics and syncs aria values', () => {
    const root = mountHandle();
    createResizeHandle(root, {
      getValue: () => 260,
      minValue: 180,
      maxValue: 480,
      onChange: () => {},
      'aria-label': 'Resize sidebar',
    });

    expect(root.getAttribute('role')).toBe('separator');
    expect(root.getAttribute('aria-orientation')).toBe('horizontal');
    expect(root.getAttribute('aria-valuenow')).toBe('260');
    expect(root.getAttribute('aria-label')).toBe('Resize sidebar');
  });

  it('nudges value on arrow keys', () => {
    const onChange = vi.fn();
    const root = mountHandle();
    createResizeHandle(root, {
      getValue: () => 260,
      minValue: 180,
      maxValue: 480,
      onChange,
    });

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(270);
  });

  it('calls onCollapse on Enter when provided', () => {
    const onCollapse = vi.fn();
    const root = mountHandle();
    createResizeHandle(root, {
      getValue: () => 260,
      minValue: 180,
      maxValue: 480,
      onChange: () => {},
      onCollapse,
    });

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onCollapse).toHaveBeenCalled();
  });
});
