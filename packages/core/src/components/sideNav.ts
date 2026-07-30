import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Icon-only rail width in px when the nav is collapsed. */
export const SIDE_NAV_COLLAPSED_WIDTH = 56;

/**
 * Persistent side navigation chrome: sticky header, scrollable section list,
 * sticky footer, and a collapsible/resizable root. Pair with the React
 * `SideNav` compound, which drives `data-collapsed` on the root and
 * `data-selected` on items (resize handle reuses the `resizeHandle` recipe).
 *
 * ```tsx
 * const s = sideNav();
 * <nav className={s.root} data-collapsed={isCollapsed || undefined}>
 *   <div className={s.stickyTop}>
 *     <div className={s.heading}>…</div>
 *     <div className={s.topContent}>…</div>
 *   </div>
 *   <div className={s.scrollable}>
 *     <div className={s.section}>
 *       <div className={s.sectionTitle}>Main</div>
 *       <a className={s.item} data-selected>
 *         <span className={s.itemLabel}>Dashboard</span>
 *       </a>
 *     </div>
 *   </div>
 *   <div className={s.footer}>
 *     <div className={s.footerIcons}>…</div>
 *     <button className={s.collapseButton} />
 *   </div>
 * </nav>
 * ```
 */
export const sideNav = typestyles.styles.component(
  'side-nav',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      headingColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      sectionTitleColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      itemColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      itemHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      itemSelectedBackground: {
        value: t.color.accent.subtle.var,
        syntax: '<color>',
      },
      itemSelectedColor: {
        value: t.color.accent.default.var,
        syntax: '<color>',
      },
    });
    return {
      slots: [
        'root',
        'stickyTop',
        'topContent',
        'scrollable',
        'footer',
        'footerIcons',
        'heading',
        'section',
        'sectionTitle',
        'item',
        'itemLabel',
        'collapseButton',
      ],
      root: {
        [v.background.name]: t.color.background.surface.var,
        [v.border.name]: t.color.border.default.var,
        [v.headingColor.name]: t.color.text.primary.var,
        [v.sectionTitleColor.name]: t.color.text.secondary.var,
        [v.itemColor.name]: t.color.text.secondary.var,
        [v.itemHoverBackground.name]: t.color.background.subtle.var,
        [v.itemSelectedBackground.name]: t.color.accent.subtle.var,
        [v.itemSelectedColor.name]: t.color.accent.default.var,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        minHeight: 0,
        minWidth: 0,
        height: '100%',
        backgroundColor: v.background.var,
        borderInlineEnd: `1px solid ${v.border.var}`,
        '&[data-collapsed]': {
          alignItems: 'center',
          width: '3.5rem',
        },
      },
      stickyTop: {
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
        padding: t.space[3].var,
        borderBottom: `1px solid ${v.border.var}`,
        backgroundColor: v.background.var,
        zIndex: 1,
        '[data-collapsed] &': {
          padding: t.space[2].var,
          borderBottom: 'none',
        },
      },
      topContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
      },
      scrollable: {
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[4].var,
        padding: t.space[3].var,
        '[data-collapsed] &': {
          gap: t.space[2].var,
          padding: t.space[2].var,
          overflow: 'hidden',
        },
      },
      footer: {
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[2].var,
        padding: t.space[3].var,
        borderTop: `1px solid ${v.border.var}`,
        backgroundColor: v.background.var,
        '[data-collapsed] &': {
          justifyContent: 'center',
          padding: t.space[2].var,
        },
      },
      footerIcons: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1].var,
      },
      heading: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.headingColor.var,
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        '&:not(:first-child)': {
          marginTop: t.space[2].var,
        },
      },
      sectionTitle: {
        padding: `${t.space[1].var} ${t.space[2].var}`,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: v.sectionTitleColor.var,
        '[data-collapsed] &': {
          display: 'none',
        },
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        padding: `${t.space[2].var} ${t.space[2].var}`,
        borderRadius: t.radius.md.var,
        color: v.itemColor.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: `background-color ${t.duration.fast.var} ${t.easing.standard.var}, color ${t.duration.fast.var} ${t.easing.standard.var}`,
        '&:hover:not([data-selected]):not([data-disabled])': {
          backgroundColor: v.itemHoverBackground.var,
          color: v.itemColor.var,
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
        '&[data-selected]:hover': {
          backgroundColor: v.itemSelectedBackground.var,
          color: v.itemSelectedColor.var,
        },
        '&:active:not([data-disabled])': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&[data-selected]:active': {
          backgroundColor: v.itemSelectedBackground.var,
        },
        '&[data-disabled]': {
          color: v.itemColor.var,
          opacity: t.opacity.disabled.var,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        '[data-collapsed] &': {
          justifyContent: 'center',
          width: '2rem',
          minWidth: '2rem',
          padding: t.space[2].var,
        },
        '[data-collapsed] &:not(:has(svg, img))': {
          display: 'none',
        },
      },
      itemLabel: {
        flex: '1 1 auto',
        minWidth: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '[data-collapsed] &': {
          display: 'none',
        },
      },
      collapseButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: '2rem',
        height: '2rem',
        borderRadius: t.radius.md.var,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.itemColor.var,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
      },
    };
  },
  { layer: 'components' },
);
