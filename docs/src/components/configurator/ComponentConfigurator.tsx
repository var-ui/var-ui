import type { ReactNode } from 'react';
import { HighlightedCodeBlock } from '../HighlightedCodeBlock';
import { recipeClassName } from '@var-ui/react';
import { configuratorStyles } from '@/styles/configurator';

export type ComponentConfiguratorProps = {
  preview: ReactNode;
  controls: ReactNode;
  code: string;
  language: string;
  filename: string;
};

export function ComponentConfigurator({
  preview,
  controls,
  code,
  language,
  filename,
}: ComponentConfiguratorProps) {
  const c = configuratorStyles();

  return (
    <div className={recipeClassName(c.root)} data-component-configurator>
      <div className={recipeClassName(c.workspace)}>
        <div className={recipeClassName(c.preview)}>
          <div className={recipeClassName(c.previewInner)}>{preview}</div>
        </div>
        <aside className={recipeClassName(c.controls)} aria-label="Component options">
          {controls}
        </aside>
      </div>
      <div className={recipeClassName(c.code)}>
        <HighlightedCodeBlock code={code} language={language} filename={filename} />
      </div>
    </div>
  );
}
