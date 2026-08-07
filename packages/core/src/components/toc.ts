import { styles, typestyles } from '../runtime';
import { atReducedMotion } from '../theme-conditions';
import { duration } from '../tokens/defaults/duration';
import { easing } from '../tokens/defaults/easing';
import { transition } from '../tokens/defaults/transition';
import { designTokens as t } from '../tokens';

const belowXl = styles.breakpoint('xl', 'max');
const listIndent = t.space[3].var;
const nestedIndent = t.space[2].var;
const indicatorTransition = `transform ${duration.medium} ${easing.standard}, height ${duration.fast} ${easing.standard}, opacity ${duration.fast} ${easing.standard}`;

/**
 * In-page table of contents for long-form docs. Pair with the React `Toc`
 * compound or Astro `Toc` / `TocItem` bindings. Active items use
 * `data-selected` on links; nested `h3` rows use `data-nested` on items.
 * The active-row indicator is the list `::after` pseudo, positioned via
 * `positionTocIndicator`.
 */
export const toc = typestyles.styles.component(
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
        value: t.color.border.subtle.var,
        syntax: '<color>',
      },
      railWidth: {
        value: t.borderWidth.thick.var,
        syntax: '<length>',
      },
      railRadius: {
        value: t.borderWidth.thick.var,
        syntax: '<length>',
      },
      indicatorY: {
        value: '0px',
        syntax: '<length>',
      },
      indicatorHeight: {
        value: '0px',
        syntax: '<length>',
      },
      indicatorOpacity: {
        value: '0',
        syntax: '<number>',
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

    return {
      vars: v,
      slots: ['root', 'title', 'list', 'item', 'link'],
      root: {
        position: 'sticky',
        top: v.stickyTop.var,
        padding: `${t.space[6].var} ${t.space[5].var} ${t.space[8].var} ${t.space[4].var}`,
        maxHeight: `calc(100dvh - ${v.stickyTop.var} - ${v.stickyMaxHeightOffset.var})`,
        overflow: 'auto',
        [belowXl]: {
          display: 'none',
        },
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
        [v.indicatorY.name]: '0px',
        [v.indicatorHeight.name]: '0px',
        [v.indicatorOpacity.name]: '0',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          insetInlineStart: 0,
          width: v.railWidth.var,
          borderRadius: v.railRadius.var,
          backgroundColor: v.railColor.var,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          width: v.railWidth.var,
          height: v.indicatorHeight.var,
          borderRadius: v.railRadius.var,
          backgroundColor: v.linkSelectedIndicator.var,
          pointerEvents: 'none',
          opacity: v.indicatorOpacity.var,
          zIndex: 1,
          transform: `translateY(${v.indicatorY.var})`,
          transition: indicatorTransition,
          ...atReducedMotion({ transition: 'none' }),
        },
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
        transition: transition.colorShift,
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
    };
  },
  { layer: 'components' },
);
