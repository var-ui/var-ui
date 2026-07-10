import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Scroll-snap carousel. CSS does the snapping; the React wrapper only adds
 * prev/next buttons that nudge `scrollLeft`. Keyboard users can scroll the
 * viewport natively (the wrapper makes it focusable).
 *
 * ```tsx
 * const s = carousel();
 * <div className={s.viewport}>{items.map(i => <div className={s.item}>{i}</div>)}</div>
 * ```
 */
export const carousel = styles.component(
  'carousel',
  (c) => {
    const v = c.vars({
      itemWidth: { value: '280px', syntax: '<length>', inherits: false },
      controlBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      controlBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'viewport', 'item', 'controls', 'control'],
      root: { display: 'grid', gap: t.space[3] },
      viewport: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: v.itemWidth.var,
        gap: t.space[3],
        overflowX: 'auto',
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: t.space[1],
        paddingBlock: t.space[1],
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
      },
      item: { scrollSnapAlign: 'start', minWidth: 0 },
      controls: { display: 'flex', gap: t.space[2], justifyContent: 'flex-end' },
      control: {
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: t.radius.md,
        border: `1px solid ${v.controlBorder.var}`,
        backgroundColor: v.controlBackground.var,
        cursor: 'pointer',
        '&:hover': { backgroundColor: t.color.background.subtle },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
        },
      },
    };
  },
  { layer: 'components' },
);
