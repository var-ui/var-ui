import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Hairline separator; vertical orientation stretches to the parent's cross
 * size inside a flex row.
 *
 * ```tsx
 * <hr className={divider()} />
 * ```
 */
export const divider = styles.component(
  'divider',
  (c) => {
    const v = c.vars({
      color: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      base: {
        border: 'none',
        margin: 0,
        backgroundColor: v.color.var,
        flexShrink: 0,
      },
      variants: {
        orientation: {
          horizontal: { width: '100%', height: '1px' },
          vertical: { width: '1px', height: 'auto', alignSelf: 'stretch' },
        },
      },
      defaultVariants: { orientation: 'horizontal' },
    };
  },
  { layer: 'components' },
);
