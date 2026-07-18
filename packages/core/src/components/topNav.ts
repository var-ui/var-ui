import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Top navigation bar chrome with optional centered content and mega menu.
 * Pair with the React `TopNav` compound, which sets `data-layout="grid"` on
 * the root when `centerContent` is present and `data-selected` / `data-disabled`
 * on items.
 *
 * ```tsx
 * const s = topNav();
 * <nav className={s.root} data-layout={hasCenter ? 'grid' : undefined}>
 *   <div className={s.heading}>Acme</div>
 *   <div className={s.start}>
 *     <a className={s.item} data-selected href="/">Home</a>
 *     <button className={s.menuTrigger}>Products</button>
 *   </div>
 *   <div className={s.center}>…</div>
 *   <div className={s.end}>…</div>
 *   <div className={s.megaPanel}>
 *     <a className={s.megaItem} href="/solutions/a">…</a>
 *     <div className={s.featuredCard}>…</div>
 *   </div>
 * </nav>
 * ```
 */
export const topNav = styles.component(
  'top-nav',
  (c) => {
    const v = c.vars({
      background: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      headingColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      itemColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      itemHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      itemSelectedBackground: {
        value: `${t.color.accent.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      itemSelectedColor: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      menuTriggerColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      megaPanelBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      megaPanelBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      megaItemColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      megaItemHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      featuredCardBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      featuredCardBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: [
        'root',
        'heading',
        'start',
        'center',
        'end',
        'item',
        'menuTrigger',
        'megaPanel',
        'megaItem',
        'featuredCard',
      ],
      root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: t.space[4],
        minHeight: '3.5rem',
        padding: `0 ${t.space[4]}`,
        backgroundColor: v.background.var,
        borderBottom: `1px solid ${v.border.var}`,
        '&[data-layout="grid"]': {
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        },
      },
      heading: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2],
        flexShrink: 0,
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        color: v.headingColor.var,
      },
      start: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1],
        minWidth: 0,
        '[data-layout="grid"] &': {
          justifySelf: 'start',
        },
      },
      center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        '[data-layout="grid"] &': {
          justifySelf: 'center',
        },
      },
      end: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2],
        flexShrink: 0,
        marginInlineStart: 'auto',
        '[data-layout="grid"] &': {
          justifySelf: 'end',
          marginInlineStart: 0,
        },
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2],
        padding: `${t.space[2]} ${t.space[3]}`,
        borderRadius: t.radius.md,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.itemColor.var,
        fontSize: t.fontSize.md,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
        '&[data-selected]': {
          backgroundColor: v.itemSelectedBackground.var,
          color: v.itemSelectedColor.var,
          fontWeight: t.fontWeight.medium,
        },
        '&[data-disabled]': {
          color: v.itemColor.var,
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      menuTrigger: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[1],
        padding: `${t.space[2]} ${t.space[3]}`,
        borderRadius: t.radius.md,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.menuTriggerColor.var,
        fontSize: t.fontSize.md,
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      megaPanel: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: t.space[6],
        padding: t.space[6],
        backgroundColor: v.megaPanelBackground.var,
        borderBottom: `1px solid ${v.megaPanelBorder.var}`,
        boxShadow: t.shadow.md,
        zIndex: 1,
      },
      megaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
        padding: t.space[3],
        borderRadius: t.radius.md,
        color: v.megaItemColor.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        '&:hover': {
          backgroundColor: v.megaItemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      featuredCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2],
        padding: t.space[4],
        borderRadius: t.radius.lg,
        backgroundColor: v.featuredCardBackground.var,
        border: `1px solid ${v.featuredCardBorder.var}`,
        minWidth: '16rem',
      },
    };
  },
  { layer: 'components' },
);
