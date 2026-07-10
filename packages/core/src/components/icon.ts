import { styles } from '../runtime';

/**
 * Styling-only icon shell: sizes the em-box and colors the glyph via
 * `currentColor`. No SVG markup lives in core — the React `<Icon>` renders
 * provider-resolved glyphs inside this class.
 *
 * ```tsx
 * <span className={icon({ size: 'md' })}>{svg}</span>
 * ```
 */
export const icon = styles.component(
  'icon',
  (c) => {
    const v = c.vars({
      size: { value: '16px', syntax: '<length>', inherits: false },
      color: { value: 'currentColor', syntax: '*', inherits: false },
    });
    return {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: v.size.var,
        height: v.size.var,
        color: v.color.var,
        '& svg': {
          width: '100%',
          height: '100%',
        },
      },
      variants: {
        size: {
          sm: { [v.size.name]: '14px' },
          md: { [v.size.name]: '16px' },
          lg: { [v.size.name]: '20px' },
          inherit: { [v.size.name]: '1em' },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
