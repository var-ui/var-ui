import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export type LayoutPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;

const paddingValue = (step: LayoutPadding) => t.space[step].var;

/**
 * Custom properties registered on {@link layout} root. Hyphenated `c.vars()` keys
 * ensure emitted names match the spec contract (`--var-ui-layout-padding-outer-x`, …).
 */
const LAYOUT_VAR = {
  paddingOuterX: '--var-ui-layout-padding-outer-x',
  paddingOuterY: '--var-ui-layout-padding-outer-y',
  paddingInnerX: '--var-ui-layout-padding-inner-x',
  paddingInnerY: '--var-ui-layout-padding-inner-y',
  contentWidth: '--var-ui-layout-content-width',
} as const;

/** `var(...)` references to {@link LAYOUT_VAR} for zone recipe style values. */
const layoutVar = {
  paddingOuterX: `var(${LAYOUT_VAR.paddingOuterX})`,
  paddingOuterY: `var(${LAYOUT_VAR.paddingOuterY})`,
  paddingInnerX: `var(${LAYOUT_VAR.paddingInnerX})`,
  paddingInnerY: `var(${LAYOUT_VAR.paddingInnerY})`,
  contentWidth: `var(${LAYOUT_VAR.contentWidth}, none)`,
} as const;

const LAYOUT_SLOTS = ['root', 'outer', 'inner', 'middle'] as const;
const LAYOUT_HEADER_SLOTS = ['header', 'headerInner'] as const;
const LAYOUT_FOOTER_SLOTS = ['footer', 'footerInner'] as const;

/**
 * Explicit variant-dimension shape — `padding` collides with a CSS property name,
 * so generic inference can pick the flat single-slot overload incorrectly.
 */
type LayoutVariantDefs = {
  height: { fill: object; auto: object };
  padding: {
    '0': object;
    '1': object;
    '2': object;
    '3': object;
    '4': object;
    '5': object;
    '6': object;
    '8': object;
  };
};

type LayoutHeaderVariantDefs = {
  chrome: { default: object };
};

type LayoutFooterVariantDefs = {
  chrome: { default: object };
};

/**
 * Multi-pane page shell: header/footer bands and a horizontal middle row for
 * start/content/end zones. Sets padding and content-width CSS vars consumed by
 * {@link layoutHeader}, {@link layoutFooter}, {@link layoutContent}, and
 * {@link layoutPanel}. Pair with the React `Layout` compound, which sets
 * `data-has-*` and divider attributes on the root.
 *
 * ```tsx
 * const l = layout({ height: 'fill', padding: '4' });
 * <div className={l.root} data-has-header data-has-start data-has-end>
 *   <div className={l.outer}><div className={l.inner}>
 *     <LayoutHeader>…</LayoutHeader>
 *     <div className={l.middle}>
 *       <LayoutPanel data-side="start">…</LayoutPanel>
 *       <LayoutContent>…</LayoutContent>
 *       <LayoutPanel data-side="end">…</LayoutPanel>
 *     </div>
 *     <LayoutFooter>…</LayoutFooter>
 *   </div></div>
 * </div>
 * ```
 */
export const layout = typestyles.styles.component<typeof LAYOUT_SLOTS, LayoutVariantDefs>(
  'layout',
  (c) => {
    const v = c.vars({
      'padding-outer-x': { value: t.space[4].var, syntax: '<length>', inherits: false },
      'padding-outer-y': { value: t.space[4].var, syntax: '<length>', inherits: false },
      'padding-inner-x': { value: t.space[4].var, syntax: '<length>', inherits: false },
      'padding-inner-y': { value: t.space[4].var, syntax: '<length>', inherits: false },
      'content-width': { value: 'none', syntax: '<length> | none', inherits: false },
    });
    const paddingVariant = (step: LayoutPadding) => ({
      root: {
        [v['padding-outer-x'].name]: paddingValue(step),
        [v['padding-outer-y'].name]: paddingValue(step),
        [v['padding-inner-x'].name]: paddingValue(step),
        [v['padding-inner-y'].name]: paddingValue(step),
      },
    });
    return {
      slots: LAYOUT_SLOTS,
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          [v['padding-outer-x'].name]: t.space[4].var,
          [v['padding-outer-y'].name]: t.space[4].var,
          [v['padding-inner-x'].name]: t.space[4].var,
          [v['padding-inner-y'].name]: t.space[4].var,
        },
        outer: {
          marginInlineStart: 'calc(-1 * var(--container-padding-inline-start, 0px))',
          marginInlineEnd: 'calc(-1 * var(--container-padding-inline-end, 0px))',
          marginBlockStart: 'calc(-1 * var(--container-padding-block-start, 0px))',
          marginBlockEnd: 'calc(-1 * var(--container-padding-block-end, 0px))',
        },
        inner: {
          '--container-padding-inline-start': '0px',
          '--container-padding-inline-end': '0px',
          '--container-padding-block-start': '0px',
          '--container-padding-block-end': '0px',
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
        },
        middle: {
          display: 'flex',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
        },
      },
      variants: {
        height: {
          fill: { root: { flex: '1 1 auto', minHeight: 0 } },
          auto: { root: { flex: 'none' } },
        },
        padding: {
          '0': paddingVariant(0),
          '1': paddingVariant(1),
          '2': paddingVariant(2),
          '3': paddingVariant(3),
          '4': {},
          '5': paddingVariant(5),
          '6': paddingVariant(6),
          '8': paddingVariant(8),
        },
      },
      defaultVariants: { height: 'fill', padding: '4' },
    };
  },
  { layer: 'components' },
);

/**
 * Top chrome band for {@link layout}. Divider when the header slot has
 * `data-divider` or the layout root has `data-divider-header` (set by React
 * `Layout` in Task 3). Edge padding reads layout CSS vars from the shell root.
 */
export const layoutHeader = typestyles.styles.component<
  typeof LAYOUT_HEADER_SLOTS,
  LayoutHeaderVariantDefs
>(
  'layout-header',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>', inherits: false },
    });
    return {
      slots: LAYOUT_HEADER_SLOTS,
      base: {
        header: {
          flexShrink: 0,
          minWidth: 0,
          paddingInline: layoutVar.paddingOuterX,
          paddingBlockStart: layoutVar.paddingOuterY,
          paddingBlockEnd: layoutVar.paddingOuterY,
          '&[data-divider], [data-divider-header] &': {
            paddingBlockEnd: layoutVar.paddingInnerY,
            borderBlockEnd: `1px solid ${v.border.var}`,
          },
        },
        headerInner: {
          maxWidth: layoutVar.contentWidth,
          marginInline: 'auto',
          width: '100%',
          minWidth: 0,
        },
      },
      variants: {
        chrome: {
          default: {},
        },
      },
      defaultVariants: { chrome: 'default' },
    };
  },
  { layer: 'components' },
);

/**
 * Bottom chrome band for {@link layout}. Divider when the footer slot has
 * `data-divider` or the layout root has `data-divider-footer` (set by React
 * `Layout` in Task 3). Edge padding reads layout CSS vars from the shell root.
 */
export const layoutFooter = typestyles.styles.component<
  typeof LAYOUT_FOOTER_SLOTS,
  LayoutFooterVariantDefs
>(
  'layout-footer',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>', inherits: false },
    });
    return {
      slots: LAYOUT_FOOTER_SLOTS,
      base: {
        footer: {
          flexShrink: 0,
          minWidth: 0,
          paddingInline: layoutVar.paddingOuterX,
          paddingBlockEnd: layoutVar.paddingOuterY,
          paddingBlockStart: layoutVar.paddingOuterY,
          '&[data-divider], [data-divider-footer] &': {
            paddingBlockStart: layoutVar.paddingInnerY,
            borderBlockStart: `1px solid ${v.border.var}`,
          },
        },
        footerInner: {
          maxWidth: layoutVar.contentWidth,
          marginInline: 'auto',
          width: '100%',
          minWidth: 0,
        },
      },
      variants: {
        chrome: {
          default: {},
        },
      },
      defaultVariants: { chrome: 'default' },
    };
  },
  { layer: 'components' },
);

/**
 * Flex-1 main column for {@link layout}. Edge-aware padding uses `data-has-*`
 * attributes on the layout root; defaults to outer padding on exposed edges.
 */
export const layoutContent = typestyles.styles.component(
  'layout-content',
  () => {
    return {
      slots: ['content'],
      base: {
        content: {
          flex: '1 1 auto',
          minWidth: 0,
          minHeight: 0,
          paddingInlineStart: layoutVar.paddingOuterX,
          paddingInlineEnd: layoutVar.paddingOuterX,
          paddingBlockStart: layoutVar.paddingOuterY,
          paddingBlockEnd: layoutVar.paddingOuterY,
          '[data-has-start] &': {
            paddingInlineStart: layoutVar.paddingInnerX,
          },
          '[data-has-end] &': {
            paddingInlineEnd: layoutVar.paddingInnerX,
          },
          '[data-has-header] &': {
            paddingBlockStart: layoutVar.paddingInnerY,
          },
          '[data-has-footer] &': {
            paddingBlockEnd: layoutVar.paddingInnerY,
          },
        },
      },
      variants: {
        isScrollable: {
          true: {
            content: { overflow: 'auto' },
          },
          false: {
            content: { overflow: 'visible' },
          },
        },
        padding: {
          inherit: {},
          '0': {
            content: { padding: 0 },
          },
        },
      },
      defaultVariants: { isScrollable: true, padding: 'inherit' },
    };
  },
  { layer: 'components' },
);

/**
 * Fixed-width side panel for {@link layout} start/end slots, plus overlay
 * slots for responsive drawer mode. Divider borders target the content-facing
 * edge via `data-side`; negative margins collapse inner padding when seamless.
 */
export const layoutPanel = typestyles.styles.component(
  'layout-panel',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>', inherits: false },
      overlayBackground: {
        value: t.color.overlay.backdrop.var,
        syntax: '<color>',
        inherits: false,
      },
      panelBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['panel', 'overlay', 'overlayBackdrop'],
      base: {
        panel: {
          flexShrink: 0,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          paddingInlineStart: layoutVar.paddingOuterX,
          paddingInlineEnd: layoutVar.paddingOuterX,
          paddingBlockStart: layoutVar.paddingOuterY,
          paddingBlockEnd: layoutVar.paddingOuterY,
          '[data-has-header] &': {
            paddingBlockStart: layoutVar.paddingInnerY,
          },
          '[data-has-footer] &': {
            paddingBlockEnd: layoutVar.paddingInnerY,
          },
          '&[data-side="start"]': {
            paddingInlineStart: layoutVar.paddingOuterX,
            paddingInlineEnd: layoutVar.paddingInnerX,
            '[data-has-start] &': {
              paddingInlineStart: layoutVar.paddingInnerX,
            },
          },
          '&[data-side="end"]': {
            paddingInlineStart: layoutVar.paddingInnerX,
            paddingInlineEnd: layoutVar.paddingOuterX,
            '[data-has-end] &': {
              paddingInlineEnd: layoutVar.paddingInnerX,
            },
          },
        },
        overlayBackdrop: {
          position: 'fixed',
          inset: 0,
          backgroundColor: v.overlayBackground.var,
        },
        overlay: {
          position: 'fixed',
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          backgroundColor: v.panelBackground.var,
          boxShadow: t.shadow.lg.var,
          '&[data-side="start"]': {
            insetInlineStart: 0,
            borderInlineEnd: `1px solid ${v.border.var}`,
          },
          '&[data-side="end"]': {
            insetInlineEnd: 0,
            borderInlineStart: `1px solid ${v.border.var}`,
          },
        },
      },
      variants: {
        isScrollable: {
          true: {
            panel: { overflow: 'auto' },
            overlay: { overflow: 'auto' },
          },
          false: {
            panel: { overflow: 'visible' },
            overlay: { overflow: 'visible' },
          },
        },
        hasDivider: {
          true: {
            panel: {
              '&[data-side="start"]': {
                borderInlineEnd: `1px solid ${v.border.var}`,
              },
              '&[data-side="end"]': {
                borderInlineStart: `1px solid ${v.border.var}`,
              },
            },
          },
          false: {
            panel: {
              '&[data-side="start"]': {
                marginInlineEnd: `calc(-1 * ${layoutVar.paddingInnerX})`,
              },
              '&[data-side="end"]': {
                marginInlineStart: `calc(-1 * ${layoutVar.paddingInnerX})`,
              },
            },
          },
        },
        padding: {
          inherit: {},
          '0': {
            panel: { padding: 0 },
          },
        },
      },
      defaultVariants: { isScrollable: true, hasDivider: false, padding: 'inherit' },
    };
  },
  { layer: 'components' },
);
