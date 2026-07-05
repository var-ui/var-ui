import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Bordered surface region with an optional title — the page-section building
 * block (named-export promotion of the `layout.section` utility).
 *
 * ```tsx
 * const s = section();
 * <section className={s.root}><h2 className={s.title}>Forms</h2>…</section>
 * ```
 */
export const section = styles.component(
  'section',
  (c) => {
    const v = c.vars({
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      background: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'title'],
      root: {
        display: 'grid',
        gap: t.space[3],
        padding: t.space[4],
        border: `1px solid ${v.border.var}`,
        borderRadius: t.radius.lg,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.xs,
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.xl,
        fontWeight: t.fontWeight.semibold,
      },
    };
  },
  { layer: 'components' },
);
