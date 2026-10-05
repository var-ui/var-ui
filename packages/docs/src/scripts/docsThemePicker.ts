import { createDocsThemeController, type DocsThemeController } from '../utils/theme/docs-theme';
import type { DocsThemePreset } from '../utils/theme/presets';

export type DocsThemePickerPreset = Pick<
  DocsThemePreset,
  'id' | 'label' | 'className' | 'swatch' | 'lazyCss'
>;

function parsePresets(raw: string | null): DocsThemePickerPreset[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DocsThemePickerPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getItems(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-theme-id]'));
}

function getTrigger(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector('[data-docs-theme-picker-trigger]');
}

function getMenu(root: HTMLElement): HTMLElement | null {
  return root.querySelector('[data-docs-theme-picker-menu]');
}

export function applyDocsThemePickerSelection(
  root: HTMLElement,
  presets: DocsThemePickerPreset[],
  selectedId: string,
): void {
  const selected = presets.find((theme) => theme.id === selectedId) ?? presets[0];
  if (!selected) return;

  const triggerSwatch = root.querySelector('[data-docs-theme-picker-swatch]');
  if (triggerSwatch instanceof Element && triggerSwatch.localName === 'rect') {
    triggerSwatch.setAttribute('fill', selected.swatch ?? '#64748b');
  }

  for (const item of getItems(root)) {
    const id = item.getAttribute('data-theme-id');
    const isSelected = id === selectedId;
    item.setAttribute('aria-checked', String(isSelected));
  }
}

function syncRoot(
  root: HTMLElement,
  controller: DocsThemeController,
  presets: DocsThemePickerPreset[],
  selectedId = controller.readStoredThemeId(),
): void {
  applyDocsThemePickerSelection(root, presets, selectedId);
}

function closeMenu(root: HTMLElement): void {
  const menu = getMenu(root);
  const trigger = getTrigger(root);
  if (menu) {
    menu.hidden = true;
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
  root.removeAttribute('data-docs-theme-picker-open');
}

function openMenu(root: HTMLElement): void {
  const menu = getMenu(root);
  const trigger = getTrigger(root);
  if (menu) {
    menu.hidden = false;
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'true');
  }
  root.setAttribute('data-docs-theme-picker-open', '');

  const selected =
    getItems(root).find((item) => item.getAttribute('aria-checked') === 'true') ??
    getItems(root)[0];
  selected?.focus();
}

function focusItem(items: HTMLElement[], index: number): void {
  items[index]?.focus();
}

function handleMenuKeydown(root: HTMLElement, event: KeyboardEvent): void {
  const items = getItems(root);
  const currentIndex = items.indexOf(event.target as HTMLElement);
  if (currentIndex === -1) return;

  let nextIndex: number | null = null;
  switch (event.key) {
    case 'ArrowDown':
      nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      break;
    case 'ArrowUp':
      nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = items.length - 1;
      break;
    case 'Tab':
      closeMenu(root);
      return;
    default:
      return;
  }

  event.preventDefault();
  if (nextIndex != null) focusItem(items, nextIndex);
}

export function initDocsThemePicker(root: Element): void {
  if (!(root instanceof HTMLElement)) return;
  if (root.hasAttribute('data-docs-theme-picker-initialized')) return;
  root.setAttribute('data-docs-theme-picker-initialized', '');

  const presets = parsePresets(root.getAttribute('data-presets'));
  if (presets.length === 0) return;

  const storageKey = root.getAttribute('data-storage-key') ?? undefined;
  const fallbackClassName = root.getAttribute('data-fallback-class') ?? undefined;
  const controller = createDocsThemeController(presets, { storageKey, fallbackClassName });

  syncRoot(root, controller, presets);

  const trigger = getTrigger(root);
  const menu = getMenu(root);

  trigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (root.getAttribute('data-docs-theme-picker-open') === '') {
      closeMenu(root);
    } else {
      openMenu(root);
    }
  });

  for (const item of getItems(root)) {
    item.addEventListener('focus', () => {
      item.setAttribute('data-focused', '');
    });
    item.addEventListener('blur', () => {
      item.removeAttribute('data-focused');
    });
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-theme-id');
      if (!controller.isThemeId(id)) return;
      controller.setTheme(id);
      syncRoot(root, controller, presets);
      closeMenu(root);
      trigger?.focus();
    });
  }

  menu?.addEventListener('keydown', (event) => {
    if (event instanceof KeyboardEvent) {
      handleMenuKeydown(root, event);
    }
  });

  root.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'Escape' && root.getAttribute('data-docs-theme-picker-open') === '') {
      closeMenu(root);
      trigger?.focus();
    }
  });

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (root.getAttribute('data-docs-theme-picker-open') !== '') return;
      if (event.target instanceof Node && root.contains(event.target)) return;
      closeMenu(root);
    },
    true,
  );

  window.addEventListener('storage', (event) => {
    if (event.key !== controller.storageKey) return;
    const nextId = controller.isThemeId(event.newValue)
      ? event.newValue
      : controller.readStoredThemeId();
    if (controller.isThemeId(nextId)) {
      controller.applyThemeToDocument(nextId);
    }
    syncRoot(root, controller, presets, nextId);
  });
}

export function initDocsThemePickers(root: ParentNode = document): void {
  root.querySelectorAll('[data-docs-theme-picker]').forEach((node) => {
    initDocsThemePicker(node);
  });
}
