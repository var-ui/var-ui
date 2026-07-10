import type { SlotComponentFunction, SlotStyles } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

type AvatarSlots = readonly ['root', 'image', 'initials', 'status'];
type AvatarVariants = {
  size: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', SlotStyles<AvatarSlots[number]>>;
};

/**
 * Identity avatar: image with initials fallback and an optional status well
 * (bottom-right, sized for a `statusDot`).
 *
 * ```tsx
 * const a = avatar({ size: 'lg' });
 * <span className={a.root}><img className={a.image} … /></span>
 * ```
 */
// Overload pinning: none of this recipe's slot names collide with a known CSS
// property, so TypeScript resolves the config against typestyles' flat-variant
// overload and types the call as a class string. Runtime behavior is correct
// (typestyles branches on `slots` at runtime); assert the slot signature until
// typestyles' ComponentConfig forbids `slots` the way FlatComponentConfig does.
const avatarRecipe = styles.component(
  'avatar',
  (c) => {
    const v = c.vars({
      size: { value: '32px', syntax: '<length>', inherits: false },
      background: {
        value: `${t.color.accent.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      foreground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'image', 'initials', 'status'],
      base: {
        root: {
          position: 'relative',
          display: 'inline-flex',
          width: v.size.var,
          height: v.size.var,
          borderRadius: '50%',
          backgroundColor: v.background.var,
          color: v.foreground.var,
          flexShrink: 0,
          verticalAlign: 'middle',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          objectFit: 'cover',
        },
        initials: {
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          fontSize: `calc(${v.size.var} * 0.4)`,
          fontWeight: t.fontWeight.semibold,
          textTransform: 'uppercase',
          userSelect: 'none',
        },
        status: {
          position: 'absolute',
          right: '-1px',
          bottom: '-1px',
          display: 'inline-flex',
          borderRadius: '50%',
          border: `2px solid ${t.color.background.surface}`,
        },
      },
      variants: {
        size: {
          xs: { root: { [v.size.name]: '20px' } },
          sm: { root: { [v.size.name]: '24px' } },
          md: { root: { [v.size.name]: '32px' } },
          lg: { root: { [v.size.name]: '40px' } },
          xl: { root: { [v.size.name]: '56px' } },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

export const avatar = avatarRecipe as unknown as SlotComponentFunction<AvatarSlots, AvatarVariants>;

/**
 * Overlapping avatar row with a "+N" overflow chip.
 *
 * ```tsx
 * const g = avatarGroup();
 * <span className={g.root}>{avatars.map(a => <span className={g.item}>{a}</span>)}</span>
 * ```
 */
export const avatarGroup = styles.component(
  'avatar-group',
  (c) => {
    const v = c.vars({
      ringColor: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'item', 'overflow'],
      root: { display: 'inline-flex', alignItems: 'center' },
      item: {
        marginLeft: `calc(${t.space[2]} * -1)`,
        borderRadius: '50%',
        boxShadow: `0 0 0 2px ${v.ringColor.var}`,
        '&:first-child': { marginLeft: 0 },
      },
      overflow: {
        marginLeft: `calc(${t.space[2]} * -1)`,
        display: 'grid',
        placeItems: 'center',
        minWidth: '32px',
        height: '32px',
        padding: `0 ${t.space[1]}`,
        borderRadius: '50%',
        backgroundColor: t.color.background.subtle,
        boxShadow: `0 0 0 2px ${v.ringColor.var}`,
        fontSize: t.fontSize.xs,
        fontWeight: t.fontWeight.semibold,
        color: t.color.text.secondary,
      },
    };
  },
  { layer: 'components' },
);
