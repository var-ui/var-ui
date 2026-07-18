import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Mobile slide-out navigation drawer. Pair with the React `MobileNav` compound,
 * which drives open state on the overlay/panel and `data-side` on the panel
 * (`start` | `end`). Reuses SideNav section/item children inside the panel.
 *
 * ```tsx
 * const s = mobileNav();
 * <>
 *   <button className={s.toggle} aria-label="Open navigation">
 *     <Icon name="menu" />
 *   </button>
 *   <div className={s.overlay} data-open={isOpen || undefined}>
 *     <div className={s.panel} data-side="start" data-open={isOpen || undefined}>
 *       <div className={s.header}>
 *         Menu
 *         <button className={s.closeButton} aria-label="Close navigation" />
 *       </div>
 *       {children}
 *     </div>
 *   </div>
 * </>
 * ```
 */
export const mobileNav = styles.component(
  'mobile-nav',
  (c) => {
    const v = c.vars({
      overlayBackground: {
        value: `${t.color.overlay.default}`,
        syntax: '<color>',
        inherits: false,
      },
      panelBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      panelBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      panelWidth: {
        value: '320px',
        syntax: '<length>',
        inherits: false,
      },
      headerColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      toggleColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      toggleHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      closeButtonColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['overlay', 'panel', 'header', 'closeButton', 'toggle'],
      overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: v.overlayBackground.var,
        '&:not([data-open])': {
          display: 'none',
        },
      },
      panel: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        width: `min(${v.panelWidth.var}, 85vw)`,
        maxWidth: '85vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: v.panelBackground.var,
        boxShadow: t.shadow.lg,
        overflowY: 'auto',
        transition: 'transform 200ms ease',
        '&[data-side="start"]': {
          insetInlineStart: 0,
          borderInlineEnd: `1px solid ${v.panelBorder.var}`,
          transform: 'translateX(0)',
          '&:not([data-open])': {
            transform: 'translateX(-100%)',
          },
        },
        '&[data-side="end"]': {
          insetInlineEnd: 0,
          borderInlineStart: `1px solid ${v.panelBorder.var}`,
          transform: 'translateX(0)',
          '&:not([data-open])': {
            transform: 'translateX(100%)',
          },
        },
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[3],
        padding: t.space[4],
        borderBottom: `1px solid ${v.panelBorder.var}`,
        color: v.headerColor.var,
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        flexShrink: 0,
      },
      closeButton: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        color: v.closeButtonColor.var,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[1],
        marginInlineEnd: `calc(${t.space[1]} * -1)`,
        borderRadius: t.radius.sm,
        '&:hover': {
          backgroundColor: v.toggleHoverBackground.var,
          color: v.headerColor.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
        },
      },
      toggle: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        color: v.toggleColor.var,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[2],
        borderRadius: t.radius.sm,
        '&:hover': {
          backgroundColor: v.toggleHoverBackground.var,
          color: v.headerColor.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
        },
      },
    };
  },
  { layer: 'components' },
);
