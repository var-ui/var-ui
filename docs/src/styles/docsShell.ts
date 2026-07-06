import { styles } from '@var-ui/core';

export const docsShell = styles.component(
  'docs-shell',
  () => ({
    slots: ['root'],
    root: {
      minHeight: '100dvh',
      '& .vocs_DocsLayout': {
        '--vocs-content-width': '48rem',
      },
    },
  }),
  { layer: 'utilities' },
);
