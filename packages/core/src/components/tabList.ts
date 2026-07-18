import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

const TAB_LIST_SLOTS = ['root', 'tab', 'indicator', 'menu', 'menuTrigger'] as const;

/**
 * Explicit variant-dimension shape (values left as `{}` — only the keys matter for the
 * `styles.component` call signature); see `appShell.ts` for why this pins the
 * slot-with-variants overload.
 */
type TabListVariantDefs = {
  size: { sm: object; md: object; lg: object };
};

/**
 * Nav landmark tabs for switching between views/routes — no panels. Pair with
 * the panel `tabs` recipe for in-page content switching instead; this is a
 * deliberately separate family with its own tokens. `layout` / `hasDivider` /
 * `orientation` are driven by data attributes on the React `TabList`
 * compound; only density (`size`) is a true recipe variant.
 *
 * ```tsx
 * const s = tabList({ size: 'md' });
 * <nav className={s.root} data-orientation="horizontal" data-layout="hug" data-has-divider>
 *   <a className={s.tab} data-selected aria-current="page">
 *     Overview
 *     <span className={s.indicator} />
 *   </a>
 *   <div className={s.menu}>
 *     <button className={s.menuTrigger}>More</button>
 *   </div>
 * </nav>
 * ```
 */
export const tabList = styles.component<typeof TAB_LIST_SLOTS, TabListVariantDefs>(
  'tab-list',
  (c) => {
    const v = c.vars({
      tabColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      tabSelectedColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      tabHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      indicatorColor: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      dividerColor: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });

    return {
      slots: TAB_LIST_SLOTS,
      base: {
        root: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'stretch',
          gap: t.space[1],
          '&[data-orientation="vertical"]': {
            flexDirection: 'column',
          },
          '&[data-layout="fill"]': {
            display: 'flex',
            width: '100%',
          },
          '&[data-layout="fill"] > *': {
            flex: '1 1 auto',
          },
          '&[data-has-divider][data-orientation="horizontal"]': {
            borderBottom: `1px solid ${v.dividerColor.var}`,
          },
          '&[data-has-divider][data-orientation="vertical"]': {
            borderInlineEnd: `1px solid ${v.dividerColor.var}`,
          },
        },
        tab: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space[2],
          border: 'none',
          backgroundColor: 'transparent',
          color: v.tabColor.var,
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.medium,
          textDecoration: 'none',
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          padding: `${t.space[2]} ${t.space[3]}`,
          '&:hover': {
            backgroundColor: v.tabHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
          '&[data-selected]': {
            color: v.tabSelectedColor.var,
            fontWeight: t.fontWeight.semibold,
          },
          '&[data-disabled]': {
            color: v.tabColor.var,
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
        indicator: {
          position: 'absolute',
          insetInlineStart: t.space[2],
          insetInlineEnd: t.space[2],
          bottom: 0,
          height: '2px',
          borderRadius: t.radius.sm,
          backgroundColor: v.indicatorColor.var,
          opacity: 0,
          transition: `opacity ${t.duration.fast} ${t.easing.standard}`,
          '[data-selected] &': {
            opacity: 1,
          },
          '[data-orientation="vertical"] &': {
            insetInlineStart: 0,
            insetInlineEnd: 'auto',
            top: t.space[2],
            bottom: t.space[2],
            width: '2px',
            height: 'auto',
          },
        },
        menu: {
          display: 'inline-flex',
        },
        menuTrigger: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1],
          border: 'none',
          backgroundColor: 'transparent',
          color: v.tabColor.var,
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.medium,
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          padding: `${t.space[2]} ${t.space[3]}`,
          '&:hover': {
            backgroundColor: v.tabHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
          '&[data-selected]': {
            color: v.tabSelectedColor.var,
            fontWeight: t.fontWeight.semibold,
          },
        },
      },
      variants: {
        size: {
          sm: {
            tab: {
              minHeight: '2rem',
              fontSize: t.fontSize.sm,
              padding: `${t.space[1]} ${t.space[2]}`,
            },
            menuTrigger: {
              minHeight: '2rem',
              fontSize: t.fontSize.sm,
              padding: `${t.space[1]} ${t.space[2]}`,
            },
          },
          md: {
            tab: { minHeight: '2.5rem' },
            menuTrigger: { minHeight: '2.5rem' },
          },
          lg: {
            tab: {
              minHeight: '3rem',
              fontSize: t.fontSize.lg,
              padding: `${t.space[3]} ${t.space[4]}`,
            },
            menuTrigger: {
              minHeight: '3rem',
              fontSize: t.fontSize.lg,
              padding: `${t.space[3]} ${t.space[4]}`,
            },
          },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
