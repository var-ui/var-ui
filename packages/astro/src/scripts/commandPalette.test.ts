import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { getCommandPaletteController, initCommandPalette } from './commandPalette';

describe('initCommandPalette', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('opens from the controller API and renders grouped results', () => {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      this.open = false;
    };

    document.body.innerHTML = `
      <div
        id="palette"
        data-var-ui-command-palette-root
        data-command-palette-id="palette"
        data-class-result-link="result-link"
        data-class-result-link-active="result-link-active"
        data-class-result-title="result-title"
        data-class-result-meta="result-meta"
        data-class-empty="empty"
        data-class-group="group"
        data-class-group-label="group-label"
        data-hotkey="false"
      >
        <dialog data-var-ui-command-palette-dialog aria-label="Search">
          <div data-var-ui-command-palette-panel>
            <input data-var-ui-command-palette-input />
            <div data-var-ui-command-palette-results role="listbox"></div>
          </div>
        </dialog>
        <script type="application/json" data-var-ui-command-palette-items>
          [
            { "id": "/docs", "title": "Docs", "group": "Docs" },
            { "id": "/button", "title": "Button", "group": "Components" }
          ]
        </script>
      </div>
    `;

    const root = document.getElementById('palette') as HTMLElement;
    initCommandPalette(root);

    const controller = getCommandPaletteController(root);
    expect(controller).toBeTruthy();

    controller?.open();

    const dialog = root.querySelector('dialog');
    expect(dialog?.open).toBe(true);
    expect(root.querySelectorAll('[data-var-ui-command-palette-item]')).toHaveLength(2);
    expect(root.querySelector('.group-label')?.textContent).toBe('Docs');
  });

  it('does not double-bind handlers', () => {
    document.body.innerHTML = `
      <div
        id="palette"
        data-var-ui-command-palette-root
        data-command-palette-id="palette"
        data-hotkey="false"
      >
        <dialog data-var-ui-command-palette-dialog aria-label="Search">
          <div data-var-ui-command-palette-panel>
            <input data-var-ui-command-palette-input />
            <div data-var-ui-command-palette-results role="listbox"></div>
          </div>
        </dialog>
        <script type="application/json" data-var-ui-command-palette-items>[]</script>
      </div>
    `;

    const root = document.getElementById('palette') as HTMLElement;
    initCommandPalette(root);
    initCommandPalette(root);

    expect(root.hasAttribute('data-var-ui-command-palette-initialized')).toBe(true);
  });
});
