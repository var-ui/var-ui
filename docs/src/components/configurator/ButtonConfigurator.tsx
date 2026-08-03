'use client';

import type { ButtonTone, ToneAppearance } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import { Button, IconProvider, Select, Switch, recipeClassName } from '@var-ui/react';
import { useMemo, useState } from 'react';
import type { DocsFramework } from '@/lib/framework';
import { configuratorStyles } from '@/styles/configurator';
import { ComponentConfigurator } from './ComponentConfigurator';
import { APPEARANCE_OPTIONS, generateButtonCode, type ButtonConfiguratorState } from './buttonCode';
import { SizePicker } from './SizePicker';
import { ToneSwatchPicker } from './ToneSwatchPicker';

export type ButtonConfiguratorProps = {
  framework: DocsFramework;
};

const DEFAULT_STATE: ButtonConfiguratorState = {
  appearance: 'subtle',
  tone: 'neutral',
  size: 'md',
  isDisabled: false,
  label: 'Button',
};

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const c = configuratorStyles();
  return (
    <div className={recipeClassName(c.controlGroup)}>
      <span className={recipeClassName(c.controlLabel)}>{label}</span>
      {children}
    </div>
  );
}

export default function ButtonConfigurator({ framework }: ButtonConfiguratorProps) {
  const [state, setState] = useState<ButtonConfiguratorState>(DEFAULT_STATE);

  const codeOutput = useMemo(() => generateButtonCode(framework, state), [framework, state]);

  return (
    <IconProvider icons={defaultIcons}>
      <ComponentConfigurator
        preview={
          <Button
            tone={state.tone}
            appearance={state.appearance}
            size={state.size}
            isDisabled={state.isDisabled}
          >
            {state.label}
          </Button>
        }
        controls={
          <>
            <ControlGroup label="Appearance">
              <Select
                aria-label="Appearance"
                options={APPEARANCE_OPTIONS}
                selectedKey={state.appearance}
                onSelectionChange={(key) => {
                  if (key) setState((s) => ({ ...s, appearance: key as ToneAppearance }));
                }}
              />
            </ControlGroup>

            <ControlGroup label="Tone">
              <ToneSwatchPicker
                value={state.tone}
                onChange={(tone: ButtonTone) => setState((s) => ({ ...s, tone }))}
              />
            </ControlGroup>

            <ControlGroup label="Size">
              <SizePicker
                value={state.size}
                onChange={(size) => setState((s) => ({ ...s, size }))}
              />
            </ControlGroup>

            <ControlGroup label="Disabled">
              <Switch
                aria-label="Disabled"
                isSelected={state.isDisabled}
                onChange={(isDisabled) => setState((s) => ({ ...s, isDisabled }))}
              >
                Disabled
              </Switch>
            </ControlGroup>
          </>
        }
        code={codeOutput.code}
        language={codeOutput.language}
        filename={codeOutput.filename}
      />
    </IconProvider>
  );
}
