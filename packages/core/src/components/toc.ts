import { styles, typestyles } from '../runtime';
import { atReducedMotion } from '../theme-conditions';
import { designTokens as t } from '../tokens';

const belowXl = styles.breakpoint('xl', 'max');
const listIndent = t.space[3].var;
const nestedIndent = t.space[2].var;

type TocVariantDefs = {
  hideBelow: { none: object; xl: object };
};

/**
 * In-page table of contents for long-form docs. Pair with the React `Toc`
 * compound or Astro `Toc` / `TocItem` bindings. Active items use
 * `data-selected` on links; nested `h3` rows use `data-nested` on items.
 * A single sliding `indicator` element is positioned via `positionTocIndicator`.
 */
export const toc = typestyles.styles.component<
  readonly ['root', 'title', 'list', 'indicator', 'item', 'link'],
  TocVariantDefs
>(
  'toc',
  (c) => {
    const v = c.vars({
      stickyTop: {
        value: t.space[5].var,
        syntax: '<length>',
      },
      stickyMaxHeightOffset: {
        value: t.space[6].var,
        syntax: '<length>',
      },
      titleColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      railColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      railWidth: {
        value: '2px',
        syntax: '<length>',
      },
      railRadius: {
        value: '1px',
        syntax: '<length>',
      },
      railInset: {
        value: '-1px',
        syntax: '<length>',
      },
      linkColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      linkHoverColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      linkSelectedColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      linkSelectedIndicator: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
    });

    const indicatorTransition = `transform ${t.duration.medium.var} ${t.easing.standard.var}, height ${t.duration.fast.var} ${t.easing.standard.var}, opacity ${t.duration.fast.var} ${t.easing.standard.var}`;

    return {
      slots: ['root', 'title', 'list', 'indicator', 'item', 'link'] as const,
      base: {
        root: {
          [v.stickyTop.name]: t.space[5].var,
          [v.stickyMaxHeightOffset.name]: t.space[6].var,
          [v.titleColor.name]: t.color.text.secondary.var,
          [v.railColor.name]: t.color.background.subtle.var,
          [v.railWidth.name]: '2px',
          [v.railRadius.name]: '1px',
          [v.railInset.name]: '-1px',
          [v.linkColor.name]: t.color.text.secondary.var,
          [v.linkHoverColor.name]: t.color.text.primary.var,
          [v.linkSelectedColor.name]: t.color.text.primary.var,
          [v.linkSelectedIndicator.name]: t.color.text.primary.var,
          position: 'sticky',
          top: v.stickyTop.var,
          padding: `${t.space[6].var} ${t.space[5].var} ${t.space[8].var} ${t.space[4].var}`,
          maxHeight: `calc(100dvh - ${v.stickyTop.var} - ${v.stickyMaxHeightOffset.var})`,
          overflow: 'auto',
        },
        title: {
          margin: `0 0 ${t.space[4].var}`,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: v.titleColor.var,
        },
        list: {
          position: 'relative',
          margin: 0,
          padding: 0,
          paddingInlineStart: listIndent,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            insetInlineStart: v.railInset.var,
            width: v.railWidth.var,
            borderRadius: v.railRadius.var,
            backgroundColor: v.railColor.var,
            pointerEvents: 'none',
          },
        },
        indicator: {
          position: 'absolute',
          top: 0,
          insetInlineStart: v.railInset.var,
          width: v.railWidth.var,
          height: 0,
          borderRadius: v.railRadius.var,
          backgroundColor: v.linkSelectedIndicator.var,
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 1,
          transform: 'translateY(0)',
          transition: indicatorTransition,
          ...atReducedMotion({ transition: 'none' }),
        },
        item: {
          '&[data-nested]': {
            paddingInlineStart: nestedIndent,
          },
        },
        link: {
          display: 'block',
          paddingBlock: t.space[1].var,
          fontSize: t.fontSize.sm.var,
          lineHeight: t.lineHeight.normal.var,
          fontWeight: t.fontWeight.normal.var,
          color: v.linkColor.var,
          textDecoration: 'none',
          transition: `color ${t.duration.fast.var} ${t.easing.standard.var}`,
          '&:hover': {
            color: v.linkHoverColor.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
          '&[data-selected]': {
            color: v.linkSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
          },
        },
      },
      variants: {
        hideBelow: {
          none: {},
          xl: {
            root: {
              [belowXl]: {
                display: 'none',
              },
            },
          },
        },
      },
      defaultVariants: {
        hideBelow: 'none',
      },
    };
  },
  { layer: 'components' },
);
