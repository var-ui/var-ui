'use client';

import { Link, SegmentedControl, Select, Text, recipeClassName } from '@var-ui/react';
import type { Selection as AriaSelection } from 'react-aria-components';
import { themePlaygroundStyles } from '@/styles/themePlayground';
import {
  BASE_SIZE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  PLAYGROUND_COLOR_FIELDS,
  SPACING_PRESET_OPTIONS,
  TYPE_SCALE_OPTIONS,
} from './themePlaygroundTokens';
import type {
  ThemePlaygroundBaseSize,
  ThemePlaygroundFontFamilyId,
  ThemePlaygroundSpacingPreset,
  ThemePlaygroundState,
  ThemePlaygroundTypeScale,
  ThemePlaygroundTypography,
} from './themePlaygroundState';
import { ColorTokenField } from './ColorTokenField';

type ThemePlaygroundBaseStylesProps = {
  state: ThemePlaygroundState;
  onChange: (patch: Partial<ThemePlaygroundState>) => void;
};

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const s = themePlaygroundStyles();
  return (
    <div className={recipeClassName(s.controlGroup)}>
      <span className={recipeClassName(s.controlLabel)}>{label}</span>
      {children}
    </div>
  );
}

export function ThemePlaygroundBaseStyles({ state, onChange }: ThemePlaygroundBaseStylesProps) {
  const s = themePlaygroundStyles();

  const setTypography = (patch: Partial<ThemePlaygroundTypography>) => {
    onChange({ typography: { ...state.typography, ...patch } });
  };

  return (
    <div className={recipeClassName(s.baseStyles)}>
      <ControlGroup label="Colors">
        <div className={recipeClassName(s.colorList)}>
          {PLAYGROUND_COLOR_FIELDS.map((field) => (
            <div key={field.path} className={recipeClassName(s.colorField)}>
              <span className={recipeClassName(s.colorFieldLabel)}>{field.label}</span>
              <ColorTokenField
                field={field}
                value={state.colors[field.path]}
                onChange={(path, value) => {
                  const colors = { ...state.colors };
                  if (!value.trim()) {
                    delete colors[path];
                  } else {
                    colors[path] = value.trim();
                  }
                  onChange({ colors });
                }}
              />
            </div>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup label="Preset">
        <SegmentedControl
          aria-label="Spacing preset"
          options={[...SPACING_PRESET_OPTIONS]}
          selectedKeys={[state.spacingPreset]}
          onSelectionChange={(keys: AriaSelection) => {
            if (keys === 'all') return;
            const id = [...keys][0] as ThemePlaygroundSpacingPreset;
            if (id) onChange({ spacingPreset: id });
          }}
        />
      </ControlGroup>

      <ControlGroup label="Heading font">
        <Select
          aria-label="Heading font"
          options={FONT_FAMILY_OPTIONS.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
          selectedKey={state.typography.headingFont}
          onSelectionChange={(key) => {
            if (key) setTypography({ headingFont: key as ThemePlaygroundFontFamilyId });
          }}
        />
      </ControlGroup>

      <ControlGroup label="Body font">
        <Select
          aria-label="Body font"
          options={FONT_FAMILY_OPTIONS.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
          selectedKey={state.typography.bodyFont}
          onSelectionChange={(key) => {
            if (key) setTypography({ bodyFont: key as ThemePlaygroundFontFamilyId });
          }}
        />
      </ControlGroup>

      <ControlGroup label="Type scale">
        <Select
          aria-label="Type scale"
          options={TYPE_SCALE_OPTIONS.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
          selectedKey={state.typography.typeScale}
          onSelectionChange={(key) => {
            if (key) setTypography({ typeScale: key as ThemePlaygroundTypeScale });
          }}
        />
      </ControlGroup>

      <ControlGroup label="Type size">
        <SegmentedControl
          aria-label="Base type size"
          options={[...BASE_SIZE_OPTIONS]}
          selectedKeys={[state.typography.baseSize]}
          onSelectionChange={(keys: AriaSelection) => {
            if (keys === 'all') return;
            const id = [...keys][0] as ThemePlaygroundBaseSize;
            if (id) setTypography({ baseSize: id });
          }}
        />
      </ControlGroup>
    </div>
  );
}

export function ThemePlaygroundComponentsTab() {
  const s = themePlaygroundStyles();

  return (
    <div className={recipeClassName(s.deferredTab)}>
      <Text size="sm">
        Per-component overrides use the same recipe API as themes. See{' '}
        <Link href="/theming/customize">Customize</Link> for{' '}
        <code>createDesignTheme({`{ components }`})</code> examples.
      </Text>
    </div>
  );
}

export function ThemePlaygroundAdvancedTab() {
  const s = themePlaygroundStyles();

  return (
    <div className={recipeClassName(s.deferredTab)}>
      <Text size="sm">
        Custom <code>extend</code> namespaces and mode-conditional overrides are exported in v3. For
        now, use <Link href="/theming/customize">Customize</Link> for advanced token patches.
      </Text>
    </div>
  );
}
