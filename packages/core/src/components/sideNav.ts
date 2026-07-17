import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

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
      sectionTitleColor: {
        value: `${t.color.text.secondary}`,
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        backgroundColor: v.background.var,
        borderInlineEnd: `1px solid ${v.border.var}`,
        '&[data-collapsed]': {
          alignItems: 'center',
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
      },
      sectionTitle: {
        padding: `${t.space[1]} ${t.space[2]}`,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.semibold,
        letterSpacing: '0.05em',
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
