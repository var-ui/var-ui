import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { initToggleButton, initToggleButtons, TOGGLE_BUTTON_CHANGE_EVENT } from './toggleButton';

function mountToggle(pressed = false): HTMLButtonElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <button type="button" data-var-ui-toggle-button aria-pressed="${pressed}"${pressed ? ' data-selected' : ''}>Bold</button>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-var-ui-toggle-button]') as HTMLButtonElement;
}

describe('initToggleButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('toggles aria-pressed and data-selected on click', () => {
    const button = mountToggle();
    initToggleButton(button);

    button.click();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.hasAttribute('data-selected')).toBe(true);

    button.click();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.hasAttribute('data-selected')).toBe(false);
  });

  it('starts pressed when mounted pressed', () => {
    const button = mountToggle(true);
    initToggleButton(button);

    button.click();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.hasAttribute('data-selected')).toBe(false);
  });

  it('dispatches a change event with the new pressed state', () => {
    const button = mountToggle();
    initToggleButton(button);
    const onChange = vi.fn();
    button.addEventListener(TOGGLE_BUTTON_CHANGE_EVENT, onChange);

    button.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ pressed: true });
  });

  it('does not double-bind handlers', () => {
    const button = mountToggle();
    initToggleButton(button);
    initToggleButton(button);

    button.click();

    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('initToggleButtons initializes every toggle on the page', () => {
    mountToggle();
    mountToggle();
    initToggleButtons();
    expect(document.querySelectorAll('[data-var-ui-toggle-button-initialized]')).toHaveLength(2);
  });
});
