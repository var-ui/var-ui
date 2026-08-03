import { getCommandPaletteController } from './commandPalette';

const TRIGGER_SELECTOR = '[data-var-ui-search-input][data-variant="command"]';
const INITIALIZED_ATTR = 'data-var-ui-search-input-initialized';

export function initSearchInput(root: HTMLElement): () => void {
  if (root.hasAttribute(INITIALIZED_ATTR)) {
    return () => {};
  }
  root.setAttribute(INITIALIZED_ATTR, '');

  const paletteId = root.dataset.commandPalette;
  if (!paletteId) return () => {};

  const palette = document.getElementById(paletteId);
  if (!palette) return () => {};

  const openPalette = () => {
    const controller = getCommandPaletteController(palette);
    controller?.open();
  };

  root.addEventListener('click', openPalette);

  return () => {};
}

export function initSearchInputs(): void {
  document.querySelectorAll(TRIGGER_SELECTOR).forEach((node) => {
    if (node instanceof HTMLElement) initSearchInput(node);
  });
}
