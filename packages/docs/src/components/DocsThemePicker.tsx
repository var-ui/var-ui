'use client';

import { menu } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import {
  Icon,
  IconButton,
  IconProvider,
  LayerProvider,
  recipeClassName,
  recipeProps,
} from '@var-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import { createDocsThemeController, type DocsThemeController } from '../utils/theme/docs-theme';
import type { DocsThemePreset } from '../utils/theme/presets';
import { docsThemePicker } from '../styles/docsThemePicker';

export type DocsThemePickerProps = {
  presets: DocsThemePreset[];
  storageKey?: string;
  defaultThemeId?: string;
  fallbackClassName?: string;
};

function ThemePickerIcon({ swatch }: { swatch: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="4"
        width="7"
        height="7"
        rx="1.75"
        fill={swatch}
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect x="13" y="4" width="7" height="7" rx="1.75" fill="currentColor" opacity="0.22" />
      <rect x="4" y="13" width="7" height="7" rx="1.75" fill="currentColor" opacity="0.38" />
      <rect x="13" y="13" width="7" height="7" rx="1.75" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function ThemePickerMenu({
  presets,
  selectedId,
  onSelect,
  isThemeId,
  itemSwatchClassName,
}: {
  presets: DocsThemePreset[];
  selectedId: string;
  onSelect: (id: string) => void;
  isThemeId: DocsThemeController['isThemeId'];
  itemSwatchClassName: string;
}) {
  const m = menu();

  return (
    <AriaMenu
      {...recipeProps(m.menu)}
      aria-label="Site theme"
      selectionMode="single"
      selectedKeys={[selectedId]}
      onSelectionChange={(keys) => {
        const nextId = keys === 'all' ? null : String(Array.from(keys)[0]);
        if (isThemeId(nextId)) {
          onSelect(nextId);
        }
      }}
    >
      <Header {...recipeProps(m.sectionHeader)}>Theme</Header>
      {presets.map((theme) => (
        <AriaMenuItem key={theme.id} id={theme.id} textValue={theme.label} {...recipeProps(m.item)}>
          {({ isSelected }) => (
            <>
              <span {...recipeProps(m.itemCheck)}>
                {isSelected ? <Icon name="check" size="sm" /> : null}
              </span>
              <span
                className={itemSwatchClassName}
                style={{ backgroundColor: theme.swatch ?? 'currentColor' }}
              />
              <span {...recipeProps(m.itemLabel)}>{theme.label}</span>
            </>
          )}
        </AriaMenuItem>
      ))}
    </AriaMenu>
  );
}

export default function DocsThemePicker({
  presets,
  storageKey,
  defaultThemeId,
  fallbackClassName,
}: DocsThemePickerProps) {
  const controller = useMemo(
    () =>
      createDocsThemeController(presets, {
        storageKey,
        defaultThemeId,
        fallbackClassName,
      }),
    [presets, storageKey, defaultThemeId, fallbackClassName],
  );

  const s = docsThemePicker();
  const [selectedId, setSelectedId] = useState(() => controller.readStoredThemeId());

  const handleSelect = useCallback(
    (themeId: string) => {
      controller.setTheme(themeId);
      setSelectedId(themeId);
    },
    [controller],
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === controller.storageKey) {
        setSelectedId(controller.readStoredThemeId());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [controller]);

  if (presets.length === 0) return null;

  const selected = presets.find((theme) => theme.id === selectedId) ?? presets[0]!;

  return (
    <IconProvider icons={defaultIcons}>
      <LayerProvider>
        <div className={recipeClassName(s.root)} data-docs-theme-picker>
          <MenuTrigger>
            <IconButton
              aria-label="Choose site theme"
              name="wrench"
              appearance="filled"
              size="lg"
              elevated
              tone="accent"
              icon={
                <Icon size="lg">
                  <ThemePickerIcon swatch={selected.swatch ?? '#64748b'} />
                </Icon>
              }
            />
            <Popover {...recipeProps(menu().popover)} placement="top end" offset={10}>
              <ThemePickerMenu
                presets={presets}
                selectedId={selectedId}
                onSelect={handleSelect}
                isThemeId={controller.isThemeId}
                itemSwatchClassName={recipeClassName(s.itemSwatch)}
              />
            </Popover>
          </MenuTrigger>
        </div>
      </LayerProvider>
    </IconProvider>
  );
}
