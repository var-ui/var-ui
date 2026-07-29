import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export type LayoutPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;

const paddingValue = (step: LayoutPadding) => t.space[step].var;

/** Custom properties set on {@link layout} root — read by zone recipes. */
const layoutVar = {
  paddingOuterX: 'var(--var-ui-layout-padding-outer-x)',
  paddingOuterY: 'var(--var-ui-layout-padding-outer-y)',
  paddingInnerX: 'var(--var-ui-layout-padding-inner-x)',
  paddingInnerY: 'var(--var-ui-layout-padding-inner-y)',
  contentWidth: 'var(--var-ui-layout-content-width, none)',
} as const;

const LAYOUT_SLOTS = ['root', 'outer', 'inner', 'middle'] as const;

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

/**
 * Multi-pane page shell: header/footer bands and a horizontal middle row for
 * start/content/end zones. Sets padding and content-width CSS vars consumed by
 * {@link layoutHeader}, {@link layoutFooter}, {@link layoutContent}, and
 * {@link layoutPanel}. Pair with the React `Layout` compound, which sets
 * `data-has-*` and divider attributes on the root.
 *
 * ```tsx
 * const l = layout({ height: 'fill', padding: 4 });
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
      paddingOuterX: { value: t.space[4].var, syntax: '<length>', inherits: false },
      paddingOuterY: { value: t.space[4].var, syntax: '<length>', inherits: false },
      paddingInnerX: { value: t.space[4].var, syntax: '<length>', inherits: false },
      paddingInnerY: { value: t.space[4].var, syntax: '<length>', inherits: false },
      contentWidth: { value: 'none', syntax: '<length> | none', inherits: false },
    });
    const paddingVariant = (step: LayoutPadding) => ({
      root: {
        [v.paddingOuterX.name]: paddingValue(step),
        [v.paddingOuterY.name]: paddingValue(step),
        [v.paddingInnerX.name]: paddingValue(step),
        [v.paddingInnerY.name]: paddingValue(step),
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
          [v.paddingOuterX.name]: t.space[4].var,
          [v.paddingOuterY.name]: t.space[4].var,
          [v.paddingInnerX.name]: t.space[4].var,
          [v.paddingInnerY.name]: t.space[4].var,
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
 * Top chrome band for {@link layout}. Optional bottom divider via `data-divider`
 * on the header slot; edge padding reads layout CSS vars from the shell root.
 */
export const layoutHeader = typestyles.styles.component(
  'layout-header',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['header', 'headerInner'],
      base: {
        header: {
          flexShrink: 0,
          minWidth: 0,
          paddingInline: layoutVar.paddingOuterX,
          paddingBlockStart: layoutVar.paddingOuterY,
          paddingBlockEnd: layoutVar.paddingInnerY,
          '&[data-divider]': {
            paddingBlockEnd: layoutVar.paddingInnerY,
            borderBlockEnd: `1px solid ${v.border.var}`,
          },
          '&:not([data-divider])': {
            paddingBlockEnd: layoutVar.paddingOuterY,
          },
        },
        headerInner: {
          maxWidth: layoutVar.contentWidth,
          marginInline: 'auto',
          width: '100%',
          minWidth: 0,
        },
      },
    };
  },
  { layer: 'components' },
);

/**
 * Bottom chrome band for {@link layout}. Optional top divider via `data-divider`
 * on the footer slot; edge padding reads layout CSS vars from the shell root.
 */
export const layoutFooter = typestyles.styles.component(
  'layout-footer',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['footer', 'footerInner'],
      base: {
        footer: {
          flexShrink: 0,
          minWidth: 0,
          paddingInline: layoutVar.paddingOuterX,
          paddingBlockEnd: layoutVar.paddingOuterY,
          paddingBlockStart: layoutVar.paddingInnerY,
          '&[data-divider]': {
            paddingBlockStart: layoutVar.paddingInnerY,
            borderBlockStart: `1px solid ${v.border.var}`,
          },
          '&:not([data-divider])': {
            paddingBlockStart: layoutVar.paddingOuterY,
          },
        },
        footerInner: {
          maxWidth: layoutVar.contentWidth,
          marginInline: 'auto',
          width: '100%',
          minWidth: 0,
        },
      },
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
