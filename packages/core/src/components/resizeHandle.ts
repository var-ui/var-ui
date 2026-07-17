import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Draggable/keyboard-resizable separator. Pair with the React `ResizeHandle`
 * (and `useResizable`), which drives `data-orientation` + drag/keyboard math.
 *
 * ```tsx
 * <div className={resizeHandle().root}>
 *   <div className={resizeHandle().pill} />
 * </div>
 * ```
 */
export const resizeHandle = styles.component(
  'resize-handle',
  (c) => {
    const v = c.vars({
      lineColor: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      pillColor: {
        value: `${t.color.border.strong}`,
        syntax: '<color>',
        inherits: false,
      },
      focusRing: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'pill'],
      root: {
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: v.lineColor.var,
        outline: 'none',
        '&[data-orientation="horizontal"]': {
          width: '1px',
          alignSelf: 'stretch',
          cursor: 'col-resize',
        },
        '&[data-orientation="vertical"]': {
          height: '1px',
          width: '100%',
          cursor: 'row-resize',
        },
        '&[data-collapsed]': {
          display: 'none',
        },
        '&:focus-visible': {
          outline: `2px solid ${v.focusRing.var}`,
          outlineOffset: '2px',
        },
      },
      pill: {
        width: '4px',
        height: '24px',
        borderRadius: t.radius.sm,
        backgroundColor: v.pillColor.var,
        pointerEvents: 'none',
        '[data-orientation="vertical"] &': {
          width: '24px',
          height: '4px',
        },
      },
    };
  },
  { layer: 'components' },
);
