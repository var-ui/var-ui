import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Named heading recipe. Visual `size` is independent of the semantic level
 * the React wrapper renders — pick size for hierarchy, level for outline.
 *
 * ```tsx
 * <h3 className={heading({ size: 'lg' })}>Settings</h3>
 * ```
 */
export const heading = styles.component(
  'heading',
  (c) => {
    const v = c.vars({
      color: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
    });
    return {
      base: {
        margin: 0,
        color: v.color.var,
        fontWeight: t.fontWeight.semibold,
        lineHeight: t.lineHeight.tight,
        letterSpacing: '-0.01em',
      },
      variants: {
        size: {
          xs: { fontSize: t.fontSize.md },
          sm: { fontSize: t.fontSize.lg },
          md: { fontSize: t.fontSize.xl },
          lg: { fontSize: t.fontSize['2xl'] },
          xl: { fontSize: t.fontSize['3xl'] },
          display: {
            fontSize: t.fontSize['3xl'],
            fontFamily: t.fontFamily.display,
            letterSpacing: '-0.02em',
          },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

/**
 * Named body-text recipe (`Text` in React). Distinct from the `text` docs
 * utility in `styles.ts`.
 *
 * ```tsx
 * <p className={textBlock({ tone: 'secondary', size: 'sm' })}>hint</p>
 * ```
 */
export const textBlock = styles.component(
  'text-block',
  (c) => {
    const v = c.vars({
      color: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      secondaryColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      base: {
        margin: 0,
        color: v.color.var,
        lineHeight: t.lineHeight.normal,
      },
      variants: {
        size: {
          sm: { fontSize: t.fontSize.sm },
          md: { fontSize: t.fontSize.md },
          lg: { fontSize: t.fontSize.lg },
        },
        tone: {
          primary: {},
          secondary: { color: v.secondaryColor.var },
        },
        weight: {
          normal: { fontWeight: t.fontWeight.normal },
          medium: { fontWeight: t.fontWeight.medium },
          semibold: { fontWeight: t.fontWeight.semibold },
        },
      },
      defaultVariants: { size: 'md', tone: 'primary', weight: 'normal' },
    };
  },
  { layer: 'components' },
);
