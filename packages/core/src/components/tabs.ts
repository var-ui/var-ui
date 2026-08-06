import { typestyles } from '../runtime';
import { atReducedMotion } from '../theme-conditions';
import { designTokens as t } from '../tokens';

/**
 * Tab panels for in-page content switching. Pair with the React `Tabs` compound
 * or Astro `Tabs` binding. Active tabs use `data-selected` and
 * `aria-selected="true"`; the sliding indicator is the list `::after` pseudo,
 * positioned via `positionTabsIndicator`.
 */
export const tabs = typestyles.styles.component(
  'tabs',
  (c) => {
    const v = c.vars({
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
      tabColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      tabSelectedColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      tabIndicatorColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      indicatorX: {
        value: '0px',
        syntax: '<length>',
      },
      indicatorWidth: {
        value: '0px',
        syntax: '<length>',
      },
      indicatorOpacity: {
        value: '0',
        syntax: '<number>',
      },
      panelBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      panelBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
    });

    // const indicatorTransition = `transform ${t.duration.medium.var} ${t.easing.standard.var}, width ${t.duration.fast.var} ${t.easing.standard.var}, opacity ${t.duration.fast.var} ${t.easing.standard.var}`;

    return {
      slots: ['root', 'list', 'tab', 'panel'],
      root: {
        display: 'grid',
        gap: t.space[3].var,
      },
      list: {
        position: 'relative',
        display: 'inline-flex',
        gap: t.space[1].var,
        [v.indicatorX.name]: '0px',
        [v.indicatorWidth.name]: '0px',
        [v.indicatorOpacity.name]: '0',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInlineStart: 0,
          insetInlineEnd: 0,
          bottom: 0,
          height: v.railWidth.var,
          borderRadius: v.railRadius.var,
          backgroundColor: v.railColor.var,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          insetInlineStart: 0,
          width: v.indicatorWidth.var,
          height: v.railWidth.var,
          borderRadius: v.railRadius.var,
          backgroundColor: v.tabIndicatorColor.var,
          pointerEvents: 'none',
          opacity: v.indicatorOpacity.var,
          zIndex: 1,
          transform: `translateX(${v.indicatorX.var})`,
          // transition: indicatorTransition,
          ...atReducedMotion({ transition: 'none' }),
        },
      },
      tab: {
        border: 'none',
        backgroundColor: 'transparent',
        padding: `${t.space[2].var} ${t.space[3].var}`,
        color: v.tabColor.var,
        cursor: 'pointer',
        fontSize: t.fontSize.md.var,
        '&[data-selected]': {
          color: v.tabSelectedColor.var,
          fontWeight: t.fontWeight.semibold.var,
        },
      },
      panel: {
        padding: t.space[3].var,
      },
    };
  },
  { layer: 'components' },
);
