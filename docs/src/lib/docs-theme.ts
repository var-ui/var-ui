import { defaultThemeClassName } from '@var-ui/core';
import { docsThemePresets, type ShowcaseThemeId } from '@/themes/presets';
import { createDocsThemeController } from '@var-ui/docs/utils';

const controller = createDocsThemeController(docsThemePresets, {
  fallbackClassName: defaultThemeClassName,
});

export const DOCS_THEME_STORAGE_KEY = controller.storageKey;
export const ALL_DOCS_THEME_CLASS_NAMES = controller.allClassNames;

export function isShowcaseThemeId(value: string | null | undefined): value is ShowcaseThemeId {
  return controller.isThemeId(value);
}

export function readStoredDocsThemeId(): ShowcaseThemeId {
  return controller.readStoredThemeId() as ShowcaseThemeId;
}

export function getDocsThemeClassName(themeId: ShowcaseThemeId): string {
  return controller.getThemeClassName(themeId);
}

export function applyDocsThemeToDocument(themeId: ShowcaseThemeId, doc?: Document): void {
  controller.applyThemeToDocument(themeId, doc);
}

export function setDocsTheme(themeId: ShowcaseThemeId): void {
  controller.setTheme(themeId);
}
