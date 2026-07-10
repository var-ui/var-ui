import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Shared floating-layer chrome: a dimmed fixed backdrop plus a centered
 * positioner. Dialog, AlertDialog, Lightbox, and CommandPalette overlays
 * compose these instead of re-declaring fixed-inset boxes.
 *
 * ```tsx
 * const o = overlay();
 * <div className={o.backdrop} />
 * <div className={o.positioner}>{panel}</div>
 * ```
 */
export const overlay = styles.component(
  'overlay',
  (c) => {
    const v = c.vars({
      background: { value: `${t.color.overlay.backdrop}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['backdrop', 'positioner'],
      backdrop: {
        position: 'fixed',
        inset: 0,
        backgroundColor: v.background.var,
      },
      positioner: {
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        padding: t.space[4],
      },
    };
  },
  { layer: 'components' },
);
