import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Layout chrome for a toolbar: a flex (or grid, when `layout: 'grid'`) row of
 * start/center/end slots. Purely visual — no keyboard navigation logic lives
 * here, that's the React wrapper's concern.
 */
export const toolbar = typestyles.styles.component(
  'toolbar',
  () => ({
    slots: ['root', 'startSlot', 'centerSlot', 'endSlot'],
    base: {
      root: {
        display: 'flex',
        alignItems: 'center',
      },
      startSlot: {
        display: 'flex',
        alignItems: 'center',
      },
      centerSlot: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        overflow: 'hidden',
      },
      endSlot: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    variants: {
      size: {
        sm: {
          root: { gap: t.space[2].var, minHeight: '2rem' },
          startSlot: { gap: t.space[2].var },
          endSlot: { gap: t.space[2].var },
        },
        md: {
          root: { gap: t.space[3].var, minHeight: '2.5rem' },
          startSlot: { gap: t.space[3].var },
          endSlot: { gap: t.space[3].var },
        },
        lg: {
          root: { gap: t.space[4].var, minHeight: '3rem' },
          startSlot: { gap: t.space[4].var },
          endSlot: { gap: t.space[4].var },
        },
      },
      orientation: {
        horizontal: {},
        vertical: {
          root: { flexDirection: 'column', alignItems: 'stretch' },
        },
      },
      layout: {
        flex: {},
        grid: {
          root: { display: 'grid', gridTemplateColumns: '1fr auto 1fr' },
        },
      },
    },
    defaultVariants: { size: 'md', orientation: 'horizontal', layout: 'flex' },
  }),
  { layer: 'components' },
);
