import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Flex stack — the workhorse layout primitive. Vertical by default; use
 * `direction: 'row'` (or the React `HStack`) for horizontal grouping.
 *
 * ```tsx
 * <div className={stack({ gap: 'lg' })}>…</div>
 * ```
 */
export const stack = styles.component(
  'stack',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[3], syntax: '<length>', inherits: false },
    });
    return {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: v.gap.var,
        minWidth: 0,
      },
      variants: {
        direction: {
          column: {},
          row: { flexDirection: 'row' },
        },
        gap: {
          none: { [v.gap.name]: '0px' },
          xs: { [v.gap.name]: t.space[1] },
          sm: { [v.gap.name]: t.space[2] },
          md: { [v.gap.name]: t.space[3] },
          lg: { [v.gap.name]: t.space[5] },
          xl: { [v.gap.name]: t.space[8] },
        },
        align: {
          start: { alignItems: 'flex-start' },
          center: { alignItems: 'center' },
          end: { alignItems: 'flex-end' },
          stretch: { alignItems: 'stretch' },
        },
        justify: {
          start: { justifyContent: 'flex-start' },
          center: { justifyContent: 'center' },
          end: { justifyContent: 'flex-end' },
          between: { justifyContent: 'space-between' },
        },
        wrap: {
          wrap: { flexWrap: 'wrap' },
          nowrap: {},
        },
      },
      defaultVariants: {
        direction: 'column',
        gap: 'md',
        align: 'stretch',
        justify: 'start',
        wrap: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
