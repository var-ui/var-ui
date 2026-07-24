import { typestyles } from '../runtime';
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
export const topNav = typestyles.styles.component(
  'top-nav',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: true,
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: true,
      },
      headingColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: true,
      },
      itemColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: true,
      },
      itemHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: true,
      },
      itemSelectedBackground: {
        value: t.color.accent.subtle.var,
        syntax: '<color>',
        inherits: true,
      },
      itemSelectedColor: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: true,
      },
      menuTriggerColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: true,
      },
      megaPanelBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: true,
      },
      megaPanelBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: true,
      },
      megaItemColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: true,
      },
      megaItemHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: true,
      },
      featuredCardBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: true,
      },
      featuredCardBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: true,
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
        [v.background.name]: t.color.background.surface.var,
        [v.border.name]: t.color.border.default.var,
        [v.headingColor.name]: t.color.text.primary.var,
        [v.itemColor.name]: t.color.text.secondary.var,
        [v.itemHoverBackground.name]: t.color.background.subtle.var,
        [v.itemSelectedBackground.name]: t.color.accent.subtle.var,
        [v.itemSelectedColor.name]: t.color.accent.default.var,
        [v.menuTriggerColor.name]: t.color.text.secondary.var,
        [v.megaPanelBackground.name]: t.color.background.surface.var,
        [v.megaPanelBorder.name]: t.color.border.default.var,
        [v.megaItemColor.name]: t.color.text.primary.var,
        [v.megaItemHoverBackground.name]: t.color.background.subtle.var,
        [v.featuredCardBackground.name]: t.color.background.subtle.var,
        [v.featuredCardBorder.name]: t.color.border.default.var,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: t.space[4].var,
        minHeight: '3.5rem',
        padding: `0 ${t.space[4].var}`,
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
        gap: t.space[2].var,
        flexShrink: 0,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.headingColor.var,
      },
      start: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1].var,
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
        gap: t.space[2].var,
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
        gap: t.space[2].var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.md.var,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.itemColor.var,
        fontSize: t.fontSize.md.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[data-selected]': {
          backgroundColor: v.itemSelectedBackground.var,
          color: v.itemSelectedColor.var,
          fontWeight: t.fontWeight.medium.var,
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
        gap: t.space[1].var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.md.var,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.menuTriggerColor.var,
        fontSize: t.fontSize.md.var,
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
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
        gap: t.space[6].var,
        padding: t.space[6].var,
        backgroundColor: v.megaPanelBackground.var,
        borderBottom: `1px solid ${v.megaPanelBorder.var}`,
        boxShadow: t.shadow.md.var,
        zIndex: 1,
      },
      megaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        padding: t.space[3].var,
        borderRadius: t.radius.md.var,
        color: v.megaItemColor.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        '&:hover': {
          backgroundColor: v.megaItemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
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
        gap: t.space[2].var,
        padding: t.space[4].var,
        borderRadius: t.radius.lg.var,
        backgroundColor: v.featuredCardBackground.var,
        border: `1px solid ${v.featuredCardBorder.var}`,
        minWidth: '16rem',
      },
    };
  },
  { layer: 'components' },
);
