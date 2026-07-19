import type { CSSProperties } from 'typestyles';
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Isolates the custom-property override in its own explicitly-typed object so it can be
 * spread alongside plain CSS properties without widening the enclosing literal's inferred
 * type (a raw computed key mixed into the same literal as named properties can make the
 * slot-with-variants config fail `VariantOptionStyle` assignability and fall through to the
 * flat single-slot overload).
 */
function backgroundVar(name: string, value: string): CSSProperties {
  return { [name]: value } as unknown as CSSProperties;
}

const APP_SHELL_SLOTS = [
  'root',
  'banner',
  'frame',
  'topNav',
  'sideNav',
  'main',
  'aside',
  'skipLink',
] as const;

/**
 * Explicit variant-dimension shape (values left as `{}` — only the keys matter for the
 * `styles.component` call signature). None of these slot names happen to collide with a
 * strictly-typed CSS property, so `styles.component`'s overload inference can't rule out the
 * flat single-slot config on its own and silently picks it over the slot-with-variants one —
 * passing `Slots`/`V` as explicit type arguments below pins the correct overload.
 */
type AppShellVariantDefs = {
  height: { fill: object; auto: object };
  variant: { wash: object; surface: object; section: object; elevated: object };
};

/**
 * Application chrome shell: optional banner, top nav, side nav, main, and
 * aside content in a CSS grid layout. Pair with the React `AppShell`
 * compound, which sets `data-mobile` on the root below the breakpoint and
 * `data-aside` when aside content is provided, and drives `contentPadding`
 * via the exposed custom property.
 *
 * ```tsx
 * const s = appShell({ height: 'fill', variant: 'surface' });
 * <div className={s.root} data-mobile={isMobile || undefined} data-aside={hasAside ? '' : undefined}>
 *   <a className={s.skipLink} href="#var-ui-app-shell-main">Skip to content</a>
 *   <div className={s.banner}>…</div>
 *   <div className={s.frame}>
 *     <header className={s.topNav}>…</header>
 *     <nav className={s.sideNav}>…</nav>
 *     <main className={s.main} id="var-ui-app-shell-main">…</main>
 *     <aside className={s.aside}>…</aside>
 *   </div>
 * </div>
 * ```
 */
export const appShell = styles.component<typeof APP_SHELL_SLOTS, AppShellVariantDefs>(
  'app-shell',
  (c) => {
    const v = c.vars({
      background: {
        value: `${t.color.background.app}`,
        syntax: '<color>',
        inherits: false,
      },
      border: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      contentPadding: {
        value: '0px',
        syntax: '<length>',
        inherits: false,
      },
      asideWidth: {
        value: '12.5rem',
        syntax: '<length>',
        inherits: false,
      },
    });
    return {
      slots: APP_SHELL_SLOTS,
      base: {
        root: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: v.background.var,
        },
        skipLink: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
          '&:focus-visible': {
            position: 'fixed',
            top: t.space[2],
            insetInlineStart: t.space[2],
            zIndex: 9999,
            width: 'auto',
            height: 'auto',
            margin: 0,
            padding: `${t.space[2]} ${t.space[3]}`,
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
            borderRadius: t.radius.md,
            backgroundColor: t.color.background.surface,
            color: t.color.text.primary,
            boxShadow: t.shadow.md,
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
            textDecoration: 'none',
            fontSize: t.fontSize.sm,
            fontWeight: t.fontWeight.medium,
          },
        },
        banner: {
          flexShrink: 0,
        },
        frame: {
          display: 'grid',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
          gridTemplateAreas: '"top top" "side main"',
          gridTemplateColumns: 'auto 1fr',
          gridTemplateRows: 'auto 1fr',
          '[data-aside] &': {
            gridTemplateAreas: '"top top top" "side main aside"',
            gridTemplateColumns: `auto 1fr ${v.asideWidth.var}`,
          },
          '[data-mobile] &': {
            gridTemplateAreas: '"top" "main"',
            gridTemplateColumns: '1fr',
          },
        },
        topNav: {
          gridArea: 'top',
          minWidth: 0,
        },
        sideNav: {
          gridArea: 'side',
          minHeight: 0,
          minWidth: 0,
          '[data-mobile] &': {
            display: 'none',
          },
        },
        main: {
          gridArea: 'main',
          minHeight: 0,
          minWidth: 0,
          overflow: 'auto',
          padding: v.contentPadding.var,
        },
        aside: {
          gridArea: 'aside',
          minHeight: 0,
          minWidth: 0,
          overflow: 'auto',
          position: 'sticky',
          top: 0,
          alignSelf: 'start',
          maxHeight: '100%',
          '[data-mobile] &': {
            display: 'none',
          },
        },
      },
      variants: {
        height: {
          fill: {
            root: {
              minHeight: '100dvh',
              height: '100%',
            },
          },
          auto: {
            root: {
              minHeight: 'auto',
              height: 'auto',
            },
          },
        },
        variant: {
          wash: {
            root: backgroundVar(v.background.name, t.color.background.app),
          },
          surface: {
            root: backgroundVar(v.background.name, t.color.background.surface),
          },
          section: {
            root: {
              ...backgroundVar(v.background.name, t.color.background.surface),
              border: `1px solid ${v.border.var}`,
              borderRadius: t.radius.lg,
              boxShadow: t.shadow.xs,
            },
          },
          elevated: {
            root: {
              ...backgroundVar(v.background.name, t.color.background.elevated),
              boxShadow: t.shadow.sm,
            },
          },
        },
      },
      defaultVariants: {
        height: 'fill',
        variant: 'wash',
      },
    };
  },
  { layer: 'components' },
);
