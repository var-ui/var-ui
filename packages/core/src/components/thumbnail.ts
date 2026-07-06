import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type ThumbnailSlots = readonly ['root', 'image', 'dismiss'];
type ThumbnailVariants = {
  size: Record<'sm' | 'md' | 'lg', SlotStyles<ThumbnailSlots[number]>>;
};

/**
 * Square media preview with an optional floating remove control.
 *
 * ```tsx
 * const s = thumbnail({ size: 'md' });
 * <span className={s.root}><img className={s.image} … /></span>
 * ```
 */
// Overload pinning: slot names avoid CSS property collisions, so TypeScript
// resolves this against typestyles' flat-variant overload (see avatar.ts).
const thumbnailRecipe = styles.component(
  'thumbnail',
  (c) => {
    const v = c.vars({
      size: { value: '64px', syntax: '<length>', inherits: false },
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'image', 'dismiss'],
      base: {
        root: {
          position: 'relative',
          display: 'inline-block',
          width: v.size.var,
          height: v.size.var,
          borderRadius: t.radius.md,
          border: `1px solid ${v.border.var}`,
        },
        image: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit',
        },
        dismiss: {
          position: 'absolute',
          top: `calc(${t.space[2]} * -1)`,
          right: `calc(${t.space[2]} * -1)`,
          display: 'grid',
          placeItems: 'center',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: `1px solid ${v.border.var}`,
          backgroundColor: t.color.background.surface,
          cursor: 'pointer',
          padding: 0,
          '&:hover': { backgroundColor: t.color.background.subtle },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        size: {
          sm: { root: { [v.size.name]: '48px' } },
          md: { root: { [v.size.name]: '64px' } },
          lg: { root: { [v.size.name]: '96px' } },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

export const thumbnail = thumbnailRecipe as unknown as SlotComponentFunction<
  ThumbnailSlots,
  ThumbnailVariants
>;
