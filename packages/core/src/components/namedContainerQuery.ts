import { typestyles } from '../runtime';

/**
 * Example: one readable `container-name` from `typestyles.styles.containerRef` (here: `{scopeId}-product-shell`),
 * applied on the root and reused in `@container name (…) { … }` via `typestyles.styles.container(name, …)`.
 */
const productShell = typestyles.styles.containerRef('product-shell');

export const namedContainerQuery = {
  /** Pass to DevTools / documentation — the actual `container-name` value. */
  containerName: productShell,
  /** Establishes the named size container (`container-type: inline-size` + `container-name`). */
  root: typestyles.styles.class(
    'ds-named-cq-root',
    {
      containerType: 'inline-size',
      containerName: productShell,
      maxWidth: '40rem',
      margin: '0 auto',
      padding: '1rem',
      border: '1px solid color-mix(in srgb, currentColor 12%, transparent)',
      borderRadius: '12px',
    },
    { layer: 'components' },
  ),
  /** Descendant layout that responds to **this** shell, not the viewport. */
  body: typestyles.styles.class(
    'ds-named-cq-body',
    {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      ...typestyles.styles.atRuleBlock(
        typestyles.styles.container(productShell, { minWidth: 480 }),
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '20px',
        },
      ),
    },
    { layer: 'components' },
  ),
};
