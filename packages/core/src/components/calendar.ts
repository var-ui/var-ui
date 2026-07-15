import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome } from './field';

export const calendar = styles.component(
  'calendar',
  (c) => {
    const v = c.vars({
      headingColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      navButtonColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      navButtonHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      headerCellColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      cellColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      cellHoverBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      cellSelectedBackground: {
        value: `${t.color.accent.default}`,
        syntax: '<color>',
        inherits: false,
      },
      cellSelectedColor: {
        value: `${t.color.text.onAccent}`,
        syntax: '<color>',
        inherits: false,
      },
      cellDisabledColor: {
        value: `${t.color.text.secondary}`,
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
      root: { display: 'grid', gap: t.space[2], width: 'fit-content' },
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
