import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Pagination chrome. Page-number and prev/next buttons reuse the existing
 * `button`/`IconButton` recipes — this recipe only covers the chrome those
 * don't already provide (ellipsis text, count/compact text, dot indicators,
 * page-size grouping).
 *
 * ```ts
 * const p = pagination({ size: 'sm' });
 * <nav className={p.root}>…</nav>
 * ```
 */
export const pagination = styles.component(
  'pagination',
  (c) => {
    const v = c.vars({
      textColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      dotColor: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: [
        'root',
        'controls',
        'ellipsis',
        'infoText',
        'dotsContainer',
        'dot',
        'dotActive',
        'pageSizeGroup',
      ],
      base: {
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[4],
          flexWrap: 'wrap',
        },
        controls: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1],
        },
        ellipsis: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2rem',
          height: '2rem',
          color: v.textColor.var,
          fontSize: t.fontSize.sm,
          userSelect: 'none',
        },
        infoText: {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.sm,
          color: v.textColor.var,
        },
        dotsContainer: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1],
        },
        dot: {
          width: t.space[2],
          height: t.space[2],
          borderWidth: 0,
          padding: 0,
          borderRadius: '50%',
          backgroundColor: v.dotColor.var,
          cursor: 'pointer',
          transition: `background-color ${t.duration.fast} ${t.easing.standard}`,
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.5,
          },
        },
        dotActive: {
          backgroundColor: t.color.accent.default,
        },
        pageSizeGroup: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2],
          fontSize: t.fontSize.sm,
          color: v.textColor.var,
        },
      },
      variants: {
        size: {
          sm: {
            ellipsis: { minWidth: '1.5rem', height: '1.5rem', fontSize: t.fontSize.xs },
            dot: { width: t.space[1], height: t.space[1] },
          },
          md: {},
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
