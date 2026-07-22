import { styles } from '../runtime';
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
export const sideNav = styles.component(
  'side-nav',
  (c) => {
    const v = c.vars({
      background: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: true,
      },
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: true,
      },
      headingColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: true,
      },
      sectionTitleColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: true,
      },
      itemColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: true,
      },
      itemHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: true,
      },
      itemSelectedBackground: {
        value: `${t.color.accent.subtle}`,
        syntax: '<color>',
        inherits: true,
      },
      itemSelectedColor: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: true,
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
        [v.background.name]: t.color.background.surface,
        [v.border.name]: t.color.border.default,
        [v.headingColor.name]: t.color.text.primary,
        [v.sectionTitleColor.name]: t.color.text.secondary,
        [v.itemColor.name]: t.color.text.secondary,
        [v.itemHoverBackground.name]: t.color.background.subtle,
        [v.itemSelectedBackground.name]: t.color.accent.subtle,
        [v.itemSelectedColor.name]: t.color.accent.default,
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
        gap: t.space[2],
        padding: t.space[3],
        borderBottom: `1px solid ${v.border.var}`,
        backgroundColor: v.background.var,
        zIndex: 1,
        '[data-collapsed] &': {
          padding: t.space[2],
          borderBottom: 'none',
        },
      },
      topContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2],
      },
      scrollable: {
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[4],
        padding: t.space[3],
        '[data-collapsed] &': {
          gap: t.space[2],
          padding: t.space[2],
          overflow: 'hidden',
        },
      },
      footer: {
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[2],
        padding: t.space[3],
        borderTop: `1px solid ${v.border.var}`,
        backgroundColor: v.background.var,
        '[data-collapsed] &': {
          justifyContent: 'center',
          padding: t.space[2],
        },
      },
      footerIcons: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1],
      },
      heading: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2],
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        color: v.headingColor.var,
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
        '&:not(:first-child)': {
          marginTop: t.space[2],
        },
      },
      sectionTitle: {
        padding: `${t.space[1]} ${t.space[2]}`,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.semibold,
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
        gap: t.space[2],
        padding: `${t.space[2]} ${t.space[2]}`,
        borderRadius: t.radius.md,
        color: v.itemColor.var,
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: `background-color ${t.duration.fast} ${t.easing.standard}, color ${t.duration.fast} ${t.easing.standard}`,
        '&:hover:not([data-selected]):not([data-disabled])': {
          backgroundColor: v.itemHoverBackground.var,
          color: v.itemColor.var,
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
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        '[data-collapsed] &': {
          justifyContent: 'center',
          width: '2rem',
          minWidth: '2rem',
          padding: t.space[2],
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
        borderRadius: t.radius.md,
        border: 'none',
        backgroundColor: 'transparent',
        color: v.itemColor.var,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: v.itemHoverBackground.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '2px',
        },
      },
    };
  },
  { layer: 'components' },
);
