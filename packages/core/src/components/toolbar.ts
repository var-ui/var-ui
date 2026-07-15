import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type ToolbarSlots = readonly ['root', 'startSlot', 'centerSlot', 'endSlot'];
type ToolbarVariants = {
  size: Record<'sm' | 'md' | 'lg', SlotStyles<ToolbarSlots[number]>>;
  orientation: Record<'horizontal' | 'vertical', SlotStyles<ToolbarSlots[number]>>;
  layout: Record<'flex' | 'grid', SlotStyles<ToolbarSlots[number]>>;
};

/**
 * Layout chrome for a toolbar: a flex (or grid, when `layout: 'grid'`) row of
 * start/center/end slots. Purely visual — no keyboard navigation logic lives
 * here, that's the React wrapper's concern.
 */
// Overload pinning: this slot recipe has `variants`, which TypeStyles'
// `styles.component()` resolves against the flat-variant overload (types the
// call as a class string). Runtime behavior is correct; assert the slot
// signature until typestyles' ComponentConfig forbids `slots` the way
// FlatComponentConfig does. See packages/core/src/components/avatar.ts.
const toolbarRecipe = styles.component(
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
          root: { gap: t.space[2], minHeight: '2rem' },
          startSlot: { gap: t.space[2] },
          endSlot: { gap: t.space[2] },
        },
        md: {
          root: { gap: t.space[3], minHeight: '2.5rem' },
          startSlot: { gap: t.space[3] },
          endSlot: { gap: t.space[3] },
        },
        lg: {
          root: { gap: t.space[4], minHeight: '3rem' },
          startSlot: { gap: t.space[4] },
          endSlot: { gap: t.space[4] },
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

export const toolbar = toolbarRecipe as unknown as SlotComponentFunction<
  ToolbarSlots,
  ToolbarVariants
>;
