import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome } from './field';

export const calendar = typestyles.styles.component(
  'calendar',
  (c) => {
    const v = c.vars({
      headingColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      navButtonColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      navButtonHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      headerCellColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      cellColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      cellHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      cellSelectedBackground: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: false,
      },
      cellSelectedColor: {
        value: t.color.text.onAccent.var,
        syntax: '<color>',
        inherits: false,
      },
      cellDisabledColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    const grid = calendarGridChrome({
      headingColor: v.headingColor.var,
      navButtonColor: v.navButtonColor.var,
      navButtonHoverBackground: v.navButtonHoverBackground.var,
      headerCellColor: v.headerCellColor.var,
      cellColor: v.cellColor.var,
      cellHoverBackground: v.cellHoverBackground.var,
      cellSelectedBackground: v.cellSelectedBackground.var,
      cellSelectedColor: v.cellSelectedColor.var,
      cellDisabledColor: v.cellDisabledColor.var,
    });
    return {
      slots: ['root', 'header', 'heading', 'navButton', 'grid', 'headerCell', 'cell'],
      root: { display: 'grid', gap: t.space[2].var, width: 'fit-content' },
      header: grid.calendarHeader,
      heading: grid.calendarHeading,
      navButton: grid.calendarNavButton,
      grid: grid.calendarGrid,
      headerCell: grid.calendarHeaderCell,
      cell: grid.calendarCell,
    };
  },
  { layer: 'components' },
);
