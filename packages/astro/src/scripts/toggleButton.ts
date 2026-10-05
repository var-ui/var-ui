/**
 * Event dispatched (bubbling) from the button after the pressed state changes.
 * `event.detail.pressed` holds the new state.
 */
export const TOGGLE_BUTTON_CHANGE_EVENT = 'var-ui:toggle-button-change';

export function initToggleButton(button: Element): void {
  if (button.hasAttribute('data-var-ui-toggle-button-initialized')) return;
  button.setAttribute('data-var-ui-toggle-button-initialized', '');

  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    if (pressed) {
      button.setAttribute('data-selected', '');
    } else {
      button.removeAttribute('data-selected');
    }
    button.dispatchEvent(
      new CustomEvent(TOGGLE_BUTTON_CHANGE_EVENT, { bubbles: true, detail: { pressed } }),
    );
  });
}

export function initToggleButtons(root: ParentNode = document): void {
  root.querySelectorAll('[data-var-ui-toggle-button]').forEach((node) => {
    initToggleButton(node);
  });
}
