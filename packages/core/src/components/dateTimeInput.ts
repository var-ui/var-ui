import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { calendarGridChrome, dateFieldChrome } from './field';

export const dateTimeInput = styles.component(
  'dateTimeInput',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      descriptionColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      errorColor: {
        value: `${t.color.danger.default}`,
        syntax: '<color>',
        inherits: false,
      },
      groupBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      groupBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      segmentColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      segmentPlaceholderColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      popoverBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      popoverBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
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

    const field = dateFieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
      groupBackground: v.groupBackground.var,
      groupBorder: v.groupBorder.var,
      groupFocusBorder: v.groupBorder.name,
      segmentColor: v.segmentColor.var,
      segmentPlaceholderColor: v.segmentPlaceholderColor.var,
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
      slots: [
        'root',
        'label',
        'description',
        'error',
        'group',
        'segment',
        'trigger',
        'popover',
        'calendarHeader',
        'calendarHeading',
        'calendarNavButton',
        'calendarGrid',
        'calendarHeaderCell',
        'calendarCell',
      ],
      root: {
        ...field.root,
        minWidth: '240px',
      },
      label: field.label,
      description: field.description,
      error: field.error,
      group: field.group,
      segment: field.segment,
      trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.sm,
        color: v.navButtonColor.var,
        cursor: 'pointer',
        '&[data-hovered]': {
          backgroundColor: v.navButtonHoverBackground.var,
        },
        '&[data-disabled]': {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
      },
      popover: {
        border: `1px solid ${v.popoverBorder.var}`,
        borderRadius: t.radius.md,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md,
        padding: t.space[3],
        width: '280px',
      },
      calendarHeader: grid.calendarHeader,
      calendarHeading: grid.calendarHeading,
      calendarNavButton: grid.calendarNavButton,
      calendarGrid: grid.calendarGrid,
      calendarHeaderCell: grid.calendarHeaderCell,
      calendarCell: grid.calendarCell,
    };
  },
  { layer: 'components' },
);
