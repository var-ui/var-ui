import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Visually groups adjacent buttons with shared borders and connected corners.
 * Apply `root` to a wrapper; direct child buttons pick up grouped styling.
 */
export const buttonGroup = styles.component(
  'button-group',
  () => ({
    slots: ['root'],
    root: {
      display: 'inline-flex',
      alignItems: 'stretch',
      '& > *': {
        borderRadius: 0,
        position: 'relative',
      },
      '& > * + *': {
        marginInlineStart: '-1px',
      },
      '& > *:first-child': {
        borderStartStartRadius: t.radius.md,
        borderEndStartRadius: t.radius.md,
      },
      '& > *:last-child': {
        borderStartEndRadius: t.radius.md,
        borderEndEndRadius: t.radius.md,
      },
      '& > *:hover, & > *:focus-visible': {
        zIndex: 1,
      },
    },
  }),
  { layer: 'components' },
);
