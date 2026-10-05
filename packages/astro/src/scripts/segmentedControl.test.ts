import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  initSegmentedControl,
  initSegmentedControls,
  SEGMENTED_CONTROL_CHANGE_EVENT,
} from './segmentedControl';

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

function mountSegments(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div data-var-ui-segmented-control>
      <button type="button" data-segment-id="list" aria-pressed="true" data-selected>List</button>
      <button type="button" data-segment-id="grid" aria-pressed="false">Grid</button>
      <button type="button" data-segment-id="table" aria-pressed="false">Table</button>
    </div>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-var-ui-segmented-control]') as HTMLElement;
}

function segment(root: HTMLElement, id: string): HTMLButtonElement {
  return root.querySelector(`[data-segment-id="${id}"]`) as HTMLButtonElement;
}

describe('initSegmentedControl', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  it('selects the clicked segment and deselects the rest', () => {
    const root = mountSegments();
    initSegmentedControl(root);

    segment(root, 'grid').click();

    expect(segment(root, 'grid').getAttribute('aria-pressed')).toBe('true');
    expect(segment(root, 'grid').hasAttribute('data-selected')).toBe(true);
    expect(segment(root, 'list').getAttribute('aria-pressed')).toBe('false');
    expect(segment(root, 'list').hasAttribute('data-selected')).toBe(false);
  });

  it('dispatches a change event with the selected id', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    const onChange = vi.fn();
    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, onChange);

    segment(root, 'table').click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: 'table' });
  });

  it('moves focus with arrow keys without changing selection', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    const list = segment(root, 'list');

    list.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(segment(root, 'grid'));
    expect(list.getAttribute('aria-pressed')).toBe('true');
  });

  it('wraps focus around both ends', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    const list = segment(root, 'list');
    const table = segment(root, 'table');

    list.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).toBe(table);

    table.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(list);
  });

  it('focuses first and last segments with Home and End', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    const list = segment(root, 'list');

    list.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(segment(root, 'table'));

    segment(root, 'table').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    expect(document.activeElement).toBe(list);
  });

  it('does not double-bind handlers', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    initSegmentedControl(root);
    const onChange = vi.fn();
    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, onChange);

    segment(root, 'grid').click();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('initSegmentedControls initializes every root on the page', () => {
    mountSegments();
    mountSegments();
    initSegmentedControls();
    expect(document.querySelectorAll('[data-var-ui-segmented-control-initialized]')).toHaveLength(
      2,
    );
  });
});
