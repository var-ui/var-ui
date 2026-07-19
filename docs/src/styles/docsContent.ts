import { designTokens as t, styles } from '@var-ui/core';

/** Docs-local article column measure — not shell chrome. */
export const docsContent = styles.component(
  'docs-content',
  () => ({
    slots: ['article'],
    article: {
      maxWidth: '48rem',
      marginInline: 'auto',
      width: '100%',
      paddingBlock: t.space[6],
      paddingInline: t.space[4],
    },
  }),
  { layer: 'utilities' },
);
