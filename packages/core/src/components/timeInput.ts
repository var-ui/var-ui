import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import { dateFieldChrome } from './field';

/**
 * Segmented time-only field — hour/minute/AM-PM entered as individually
 * focusable segments. No popover, no calendar; the simplest of the
 * date/time cluster. Wraps RAC's `TimeField`.
 *
 * ```tsx
 * const ti = timeInput();
 * <AriaTimeField className={ti.root}>
 *   <Label className={ti.label}>Start time</Label>
 *   <Group className={ti.group}>
 *     <AriaDateInput>{(segment) => <DateSegment segment={segment} className={ti.segment} />}</AriaDateInput>
 *   </Group>
 * </AriaTimeField>
 * ```
 */
export const timeInput = styles.component(
  'timeInput',
  (c) => {
    const v = c.vars({
      labelColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      errorColor: { value: `${t.color.danger.default}`, syntax: '<color>', inherits: false },
      groupBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      groupBorder: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      segmentColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      segmentPlaceholderColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    const chrome = dateFieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
      groupBackground: v.groupBackground.var,
      groupBorder: v.groupBorder.var,
      groupFocusBorder: v.groupBorder.name,
      segmentColor: v.segmentColor.var,
      segmentPlaceholderColor: v.segmentPlaceholderColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error', 'group', 'segment'],
      root: { ...chrome.root, minWidth: '160px' },
      label: chrome.label,
      description: chrome.description,
      error: chrome.error,
      group: chrome.group,
      segment: chrome.segment,
    };
  },
  { layer: 'components' },
);
