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
import { useCallback, useEffect, useState } from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import {
  DOCS_THEME_STORAGE_KEY,
  isShowcaseThemeId,
  readStoredDocsThemeId,
  setDocsTheme,
} from '@/lib/docs-theme';
import { docsThemePicker } from '@/styles/docsThemePicker';
import { SHOWCASE_THEMES, type ShowcaseThemeId } from './homepage/showcaseThemes';

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
  selectedId,
  onSelect,
  itemSwatchClassName,
}: {
  selectedId: ShowcaseThemeId;
  onSelect: (id: ShowcaseThemeId) => void;
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
        if (isShowcaseThemeId(nextId)) {
          onSelect(nextId);
        }
      }}
    >
      <Header {...recipeProps(m.sectionHeader)}>Theme</Header>
      {SHOWCASE_THEMES.map((theme) => (
        <AriaMenuItem key={theme.id} id={theme.id} textValue={theme.label} {...recipeProps(m.item)}>
          {({ isSelected }) => (
            <>
              <span {...recipeProps(m.itemCheck)}>
                {isSelected ? <Icon name="check" size="sm" /> : null}
              </span>
              <span className={itemSwatchClassName} style={{ backgroundColor: theme.swatch }} />
              <span {...recipeProps(m.itemLabel)}>{theme.label}</span>
            </>
          )}
        </AriaMenuItem>
      ))}
    </AriaMenu>
  );
}

export default function DocsThemePicker() {
  const s = docsThemePicker();
  const [selectedId, setSelectedId] = useState<ShowcaseThemeId>(() => readStoredDocsThemeId());

  const handleSelect = useCallback((themeId: ShowcaseThemeId) => {
    setDocsTheme(themeId);
    setSelectedId(themeId);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === DOCS_THEME_STORAGE_KEY) {
        setSelectedId(readStoredDocsThemeId());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const selected = SHOWCASE_THEMES.find((theme) => theme.id === selectedId) ?? SHOWCASE_THEMES[0];

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
                  <ThemePickerIcon swatch={selected.swatch} />
                </Icon>
              }
            />
            <Popover {...recipeProps(menu().popover)} placement="top end" offset={10}>
              <ThemePickerMenu
                selectedId={selectedId}
                onSelect={handleSelect}
                itemSwatchClassName={recipeClassName(s.itemSwatch)}
              />
            </Popover>
          </MenuTrigger>
        </div>
      </LayerProvider>
    </IconProvider>
  );
}
