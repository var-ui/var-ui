import { designTokens as t, typestyles } from '@var-ui/core';

export const docsThemePicker = typestyles.styles.component(
  'docs-theme-picker',
  () => ({
    slots: ['root', 'itemSwatch'],
    root: {
      position: 'fixed',
      right: t.space[6].var,
      bottom: t.space[6].var,
      zIndex: 40,
    },
    itemSwatch: {
      display: 'block',
      width: '0.875rem',
      height: '0.875rem',
      borderRadius: t.radius.full.var,
      flexShrink: 0,
      boxShadow: `inset 0 0 0 1px ${t.color.border.default.var}`,
    },
  }),
  { layer: 'utilities' },
);
